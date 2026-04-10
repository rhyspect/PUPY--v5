import { randomUUID } from 'crypto';
import config from '../config/index.js';
import { supabaseAdmin } from '../config/supabase.js';
import {
  appendAdminActivityLog,
  getAdminRuntimeConfig,
  listAdminActivityLogs,
  saveAdminRuntimeConfig,
  type AdminCareBooking,
  type AdminChatSession,
  type AdminMarketOrder,
  type AdminPetLoveRecord,
  type AdminRuntimeConfig,
  type AdminRuntimeRealm,
  type AdminWalkOrder,
} from './adminRuntimeStore.js';
import {
  countOperationTables,
  getOperationHighlights,
  listCareBookings,
  listChatSessions,
  listMarketOrders,
  listPetLoveRecords,
  listWalkOrders,
  paginateRows,
  saveCareBookingRecord,
  saveChatSessionRecord,
  saveMarketOrderRecord,
  savePetLoveRecordRecord,
  saveWalkOrderRecord,
} from './operationsStore.js';
import type { AdminOverview, ApiResponse, PaginatedResponse, SafeUser } from '../types/index.js';

const SAFE_USER_FIELDS = `
  id,
  username,
  email,
  age,
  gender,
  resident_city,
  frequent_cities,
  hobbies,
  mbti,
  signature,
  avatar_url,
  bio,
  is_verified,
  created_at,
  updated_at,
  last_login
`;

const SAFE_PET_FIELDS = `
  id,
  user_id,
  name,
  type,
  gender,
  personality,
  breed,
  age,
  weight,
  images,
  bio,
  is_digital_twin,
  digital_twin_data,
  health_status,
  vaccinated,
  pedigree_info,
  created_at,
  updated_at
`;

const MARKET_SELECT = `*,
  seller:users!market_products_seller_id_fkey(${SAFE_USER_FIELDS}),
  pet:pets!market_products_pet_id_fkey(${SAFE_PET_FIELDS})`;

const BREEDING_SELECT = `*,
  sender:users!breeding_requests_sender_id_fkey(id, username, email),
  receiver:users!breeding_requests_receiver_id_fkey(id, username, email),
  sender_pet:pets!breeding_requests_sender_pet_id_fkey(id, name, type, gender),
  receiver_pet:pets!breeding_requests_receiver_pet_id_fkey(id, name, type, gender)`;

const MATCH_SELECT = `*,
  user_a:users!matches_user_a_id_fkey(id, username, email),
  user_b:users!matches_user_b_id_fkey(id, username, email),
  pet_a:pets!matches_pet_a_id_fkey(id, name, type, gender),
  pet_b:pets!matches_pet_b_id_fkey(id, name, type, gender)`;

const DIARY_SELECT = `*,
  user:users!diaries_user_id_fkey(id, username, email),
  pet:pets!diaries_pet_id_fkey(id, name, type)`;

const MESSAGE_SELECT = `id, content, is_read, created_at, updated_at,
  sender:users!messages_sender_id_fkey(id, username, email),
  receiver:users!messages_receiver_id_fkey(id, username, email),
  chat:chat_rooms!messages_chat_id_fkey(id, last_message, last_message_time)`;

const NOTIFICATION_SELECT = `*, user:users!notifications_user_id_fkey(id, username, email)`;

const buildPagination = (total: number, page: number, limit: number) => ({
  total,
  page,
  limit,
  total_pages: Math.max(1, Math.ceil(total / limit)),
});

const sortByLatest = <T extends { updatedAt?: string; createdAt?: string }>(rows: T[]) =>
  [...rows].sort((a, b) => {
    const aTime = Date.parse(a.updatedAt || a.createdAt || 0 as unknown as string) || 0;
    const bTime = Date.parse(b.updatedAt || b.createdAt || 0 as unknown as string) || 0;
    return bTime - aTime;
  });

const paginateLocalRows = <T>(rows: T[], page: number, limit: number) => {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit;
  return {
    data: rows.slice(start, end),
    pagination: buildPagination(rows.length, safePage, safeLimit),
  };
};

const includesKeyword = (value: unknown, keyword: string) => String(value || '').toLowerCase().includes(keyword.toLowerCase());

const upsertRuntimeEntity = <T extends { id: string }>(items: T[], nextItem: T) => {
  const exists = items.some((item) => item.id === nextItem.id);
  return exists ? items.map((item) => (item.id === nextItem.id ? nextItem : item)) : [nextItem, ...items];
};

const countRows = async (table: string) => {
  const { count, error } = await supabaseAdmin.from(table).select('id', { count: 'exact', head: true });
  if (error) throw error;
  return count || 0;
};

const toArray = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const sanitizeUserUpdates = (updates: Record<string, unknown>) => {
  const next: Record<string, unknown> = {};
  const allowed = ['username', 'age', 'gender', 'resident_city', 'frequent_cities', 'hobbies', 'mbti', 'signature', 'avatar_url', 'photos', 'bio', 'is_verified'];
  for (const key of allowed) {
    if (!(key in updates)) continue;
    if (key === 'frequent_cities' || key === 'hobbies' || key === 'photos') {
      next[key] = toArray(updates[key]);
      continue;
    }
    next[key] = updates[key];
  }
  return next;
};

const sanitizePetUpdates = (updates: Record<string, unknown>) => {
  const next: Record<string, unknown> = {};
  const allowed = ['name', 'type', 'gender', 'personality', 'breed', 'age', 'weight', 'images', 'bio', 'is_digital_twin', 'digital_twin_data', 'health_status', 'vaccinated', 'pedigree_info'];
  for (const key of allowed) {
    if (!(key in updates)) continue;
    if (key === 'images') {
      next.images = toArray(updates.images);
      continue;
    }
    next[key] = updates[key];
  }
  return next;
};

const sanitizeMarketPayload = (payload: Record<string, unknown>, options: { partial?: boolean } = {}) => {
  const next: Record<string, unknown> = {};
  const assign = (key: string, value: unknown) => {
    if (options.partial && !(key in payload)) return;
    next[key] = value;
  };

  assign('seller_id', String(payload.seller_id || '').trim());
  assign('pet_id', payload.pet_id ? String(payload.pet_id).trim() : null);
  assign('title', String(payload.title || '').trim());
  assign('description', String(payload.description || '').trim() || null);
  assign('category', String(payload.category || '').trim() || null);
  assign('price', payload.price === '' || payload.price === null || payload.price === undefined ? null : Number(payload.price));
  assign('images', toArray(payload.images));
  assign('status', String(payload.status || 'active').trim());
  assign('type', String(payload.type || 'service').trim());
  assign('requirements', String(payload.requirements || '').trim() || null);

  return next;
};

const createActivity = (actorEmail: string, action: string, entityType: string, summary: string, entityId?: string | null) =>
  appendAdminActivityLog({ actorEmail, action, entityType, summary, entityId });

export class AdminService {
  static async getOverview(): Promise<ApiResponse<AdminOverview>> {
    try {
      const [
        users,
        pets,
        matches,
        messages,
        diaries,
        products,
        breedingRequests,
        notifications,
        operationCounts,
        operationHighlights,
        recentUsersRes,
        recentPetsRes,
        recentMessagesRes,
      ] = await Promise.all([
        countRows('users'),
        countRows('pets'),
        countRows('matches'),
        countRows('messages'),
        countRows('diaries'),
        countRows('market_products'),
        countRows('breeding_requests'),
        countRows('notifications'),
        countOperationTables(),
        getOperationHighlights(),
        supabaseAdmin
          .from('users')
          .select('id, username, email, resident_city, is_verified, created_at, last_login')
          .order('created_at', { ascending: false })
          .limit(6),
        supabaseAdmin
          .from('pets')
          .select('id, name, type, gender, created_at, owner:users!pets_user_id_fkey(id, username, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(6),
        supabaseAdmin
          .from('messages')
          .select('id, content, created_at, sender:users!messages_sender_id_fkey(id, username), receiver:users!messages_receiver_id_fkey(id, username)')
          .order('created_at', { ascending: false })
          .limit(6),
      ]);

      return {
        success: true,
        data: {
          stats: {
            users,
            pets,
            matches,
            messages,
            diaries,
            products,
            breedingRequests,
            notifications,
          },
          operations: {
            marketOrders: operationCounts.market_orders,
            walkOrders: operationCounts.walk_orders,
            careBookings: operationCounts.care_bookings,
            petLoveRecords: operationCounts.pet_love_records,
            chatSessions: operationCounts.chat_sessions,
            latestMarketOrders: operationHighlights.latestMarketOrders,
            latestWalkOrders: operationHighlights.latestWalkOrders,
            latestCareBookings: operationHighlights.latestCareBookings,
            latestPetLoveRecords: operationHighlights.latestPetLoveRecords,
            latestChatSessions: operationHighlights.latestChatSessions,
          },
          health: {
            environment: config.nodeEnv,
            apiBaseUrl: config.apiBaseUrl,
            supabaseConfigured: Boolean(config.supabase.url && config.supabase.anonKey),
            googleAiConfigured: Boolean(config.googleAi.apiKey),
            adminEmailCount: config.admin.allowedEmails.length,
            timestamp: new Date().toISOString(),
          },
          recentUsers: (recentUsersRes.data || []) as AdminOverview['recentUsers'],
          recentPets:
            recentPetsRes.data?.map((pet: any) => ({
              id: pet.id,
              name: pet.name,
              type: pet.type,
              gender: pet.gender,
              created_at: pet.created_at,
              owner: Array.isArray(pet.owner) ? pet.owner[0] : pet.owner,
            })) || [],
          recentMessages:
            recentMessagesRes.data?.map((message: any) => ({
              id: message.id,
              content: message.content,
              created_at: message.created_at,
              sender: Array.isArray(message.sender) ? message.sender[0] : message.sender,
              receiver: Array.isArray(message.receiver) ? message.receiver[0] : message.receiver,
            })) || [],
        },
        message: '后台总览加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '加载后台总览失败。',
        code: 500,
      };
    }
  }

  static async getFormOptions(): Promise<ApiResponse<{ users: Array<{ id: string; username: string; email: string }>; pets: Array<{ id: string; name: string; type: string | null; user_id: string; owner?: { id: string; username: string } }> }>> {
    try {
      const [usersRes, petsRes] = await Promise.all([
        supabaseAdmin.from('users').select('id, username, email').order('created_at', { ascending: false }).limit(300),
        supabaseAdmin.from('pets').select('id, name, type, user_id, owner:users!pets_user_id_fkey(id, username)').order('created_at', { ascending: false }).limit(500),
      ]);
      if (usersRes.error || petsRes.error) {
        throw usersRes.error || petsRes.error;
      }
      return {
        success: true,
        data: {
          users: usersRes.data || [],
          pets: (petsRes.data || []).map((pet: any) => ({ ...pet, owner: Array.isArray(pet.owner) ? pet.owner[0] : pet.owner })),
        },
        message: '表单选项加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '加载表单选项失败。',
        code: 500,
      };
    }
  }

  static async getUsers(page = 1, limit = 20, keyword = ''): Promise<PaginatedResponse<SafeUser>> {
    try {
      const offset = (page - 1) * limit;
      let listQuery = supabaseAdmin
        .from('users')
        .select(SAFE_USER_FIELDS)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      let countQuery = supabaseAdmin.from('users').select('id', { count: 'exact', head: true });

      if (keyword.trim()) {
        const expression = `username.ilike.%${keyword}%,email.ilike.%${keyword}%,resident_city.ilike.%${keyword}%`;
        listQuery = listQuery.or(expression);
        countQuery = countQuery.or(expression);
      }

      const [listRes, countRes] = await Promise.all([listQuery, countQuery]);
      if (listRes.error || countRes.error) {
        throw listRes.error || countRes.error;
      }
      return {
        success: true,
        data: (listRes.data || []) as SafeUser[],
        pagination: buildPagination(countRes.count || 0, page, limit),
        message: '用户列表加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        pagination: buildPagination(0, page, limit),
        error: error.message || '加载用户列表失败。',
      };
    }
  }

  static async updateUserVerification(userId: string, isVerified: boolean, actorEmail = 'system'): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabaseAdmin.from('users').update({ is_verified: isVerified }).eq('id', userId);
      if (error) throw error;
      createActivity(actorEmail, isVerified ? 'approve' : 'revoke', 'user', isVerified ? '审核通过用户资料。' : '取消了用户资料审核通过状态。', userId);
      return {
        success: true,
        data: null,
        message: isVerified ? '用户已通过审核。' : '用户已取消审核通过。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '更新审核状态失败。',
        code: 500,
      };
    }
  }

  static async updateUserProfile(userId: string, updates: Record<string, unknown>, actorEmail = 'system'): Promise<ApiResponse<SafeUser>> {
    try {
      const payload = sanitizeUserUpdates(updates);
      const applyUpdate = (nextPayload: Record<string, unknown>) =>
        supabaseAdmin.from('users').update(nextPayload).eq('id', userId).select(SAFE_USER_FIELDS).limit(1);

      let { data, error } = await applyUpdate(payload);
      if (error && 'photos' in payload && error.message.includes('photos')) {
        const { photos: _photos, ...compatiblePayload } = payload;
        const fallbackResult = await applyUpdate(compatiblePayload);
        data = fallbackResult.data;
        error = fallbackResult.error;
      }
      if (error || !data?.length) {
        throw error || new Error('未找到要更新的用户。');
      }
      createActivity(actorEmail, 'update', 'user', '更新了用户资料。', userId);
      return {
        success: true,
        data: data[0] as SafeUser,
        message: '用户资料已更新。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '更新用户资料失败。',
        code: 500,
      };
    }
  }

  static async getPets(page = 1, limit = 20, keyword = ''): Promise<PaginatedResponse<any>> {
    try {
      const offset = (page - 1) * limit;
      let listQuery = supabaseAdmin
        .from('pets')
        .select(`*, owner:users!pets_user_id_fkey(id, username, email, is_verified)`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      let countQuery = supabaseAdmin.from('pets').select('id', { count: 'exact', head: true });

      if (keyword.trim()) {
        const expression = `name.ilike.%${keyword}%,type.ilike.%${keyword}%,breed.ilike.%${keyword}%`;
        listQuery = listQuery.or(expression);
        countQuery = countQuery.or(expression);
      }

      const [listRes, countRes] = await Promise.all([listQuery, countQuery]);
      if (listRes.error || countRes.error) {
        throw listRes.error || countRes.error;
      }
      return {
        success: true,
        data: (listRes.data || []).map((pet: any) => ({ ...pet, owner: Array.isArray(pet.owner) ? pet.owner[0] : pet.owner })),
        pagination: buildPagination(countRes.count || 0, page, limit),
        message: '宠物列表加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        pagination: buildPagination(0, page, limit),
        error: error.message || '加载宠物列表失败。',
      };
    }
  }

  static async updatePetRecord(petId: string, updates: Record<string, unknown>, actorEmail = 'system'): Promise<ApiResponse<any>> {
    try {
      const payload = sanitizePetUpdates(updates);
      const { data, error } = await supabaseAdmin
        .from('pets')
        .update(payload)
        .eq('id', petId)
        .select(`*, owner:users!pets_user_id_fkey(id, username, email, is_verified)`)
        .limit(1);
      if (error || !data?.length) {
        throw error || new Error('未找到要更新的宠物。');
      }
      createActivity(actorEmail, 'update', 'pet', '更新了宠物资料。', petId);
      const pet = data[0] as any;
      return {
        success: true,
        data: { ...pet, owner: Array.isArray(pet.owner) ? pet.owner[0] : pet.owner },
        message: '宠物资料已更新。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '更新宠物资料失败。',
        code: 500,
      };
    }
  }

  static async getMarketProducts(page = 1, limit = 20, filters: { keyword?: string; category?: string; status?: string } = {}): Promise<PaginatedResponse<any>> {
    try {
      const offset = (page - 1) * limit;
      let listQuery = supabaseAdmin
        .from('market_products')
        .select(MARKET_SELECT)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      let countQuery = supabaseAdmin.from('market_products').select('id', { count: 'exact', head: true });

      if (filters.keyword?.trim()) {
        const expression = `title.ilike.%${filters.keyword}%,description.ilike.%${filters.keyword}%`;
        listQuery = listQuery.or(expression);
        countQuery = countQuery.or(expression);
      }
      if (filters.category?.trim()) {
        listQuery = listQuery.eq('category', filters.category);
        countQuery = countQuery.eq('category', filters.category);
      }
      if (filters.status?.trim()) {
        listQuery = listQuery.eq('status', filters.status);
        countQuery = countQuery.eq('status', filters.status);
      }

      const [listRes, countRes] = await Promise.all([listQuery, countQuery]);
      if (listRes.error || countRes.error) {
        throw listRes.error || countRes.error;
      }
      return {
        success: true,
        data: (listRes.data || []).map((item: any) => ({
          ...item,
          seller: Array.isArray(item.seller) ? item.seller[0] : item.seller,
          pet: Array.isArray(item.pet) ? item.pet[0] : item.pet,
        })),
        pagination: buildPagination(countRes.count || 0, page, limit),
        message: '市场数据加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        pagination: buildPagination(0, page, limit),
        error: error.message || '加载市场数据失败。',
      };
    }
  }

  static async createMarketProduct(payload: Record<string, unknown>, actorEmail = 'system'): Promise<ApiResponse<any>> {
    try {
      const next = sanitizeMarketPayload(payload) as {
        seller_id: string;
        pet_id: string | null;
        title: string;
        description: string | null;
        category: string | null;
        price: number | null;
        images: string[];
        status: string;
        type: string;
        requirements: string | null;
      };
      if (!next.seller_id || !next.title || !next.category || !next.type) {
        return { success: false, error: '请完整填写卖家、标题、分类和类型。', code: 400 };
      }
      const productId = randomUUID();
      const { error } = await supabaseAdmin.from('market_products').insert({ id: productId, ...next });
      if (error) throw error;
      createActivity(actorEmail, 'create', 'market_product', `创建了市场条目：${next.title}。`, productId);
      const detail = await this.getMarketProducts(1, 1, { keyword: next.title });
      return {
        success: true,
        data: detail.data?.find((item: any) => item.id === productId) || null,
        message: '市场条目已创建。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '创建市场条目失败。',
        code: 500,
      };
    }
  }

  static async updateMarketProduct(productId: string, updates: Record<string, unknown>, actorEmail = 'system'): Promise<ApiResponse<any>> {
    try {
      const payload = sanitizeMarketPayload(updates, { partial: true });
      const cleaned: Record<string, unknown> = {};
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== '') cleaned[key] = value;
      });
      const { data, error } = await supabaseAdmin.from('market_products').update(cleaned).eq('id', productId).select(MARKET_SELECT).limit(1);
      if (error || !data?.length) {
        throw error || new Error('未找到要更新的市场条目。');
      }
      createActivity(actorEmail, 'update', 'market_product', '更新了市场条目。', productId);
      const item = data[0] as any;
      return {
        success: true,
        data: { ...item, seller: Array.isArray(item.seller) ? item.seller[0] : item.seller, pet: Array.isArray(item.pet) ? item.pet[0] : item.pet },
        message: '市场条目已更新。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '更新市场条目失败。',
        code: 500,
      };
    }
  }

  static async deleteMarketProduct(productId: string, actorEmail = 'system'): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabaseAdmin.from('market_products').delete().eq('id', productId);
      if (error) throw error;
      createActivity(actorEmail, 'delete', 'market_product', '删除了市场条目。', productId);
      return {
        success: true,
        data: null,
        message: '市场条目已删除。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '删除市场条目失败。',
        code: 500,
      };
    }
  }

  static async getBreedingRequests(page = 1, limit = 20, status = ''): Promise<PaginatedResponse<any>> {
    try {
      const offset = (page - 1) * limit;
      let listQuery = supabaseAdmin.from('breeding_requests').select(BREEDING_SELECT).order('created_at', { ascending: false }).range(offset, offset + limit - 1);
      let countQuery = supabaseAdmin.from('breeding_requests').select('id', { count: 'exact', head: true });
      if (status.trim()) {
        listQuery = listQuery.eq('status', status);
        countQuery = countQuery.eq('status', status);
      }
      const [listRes, countRes] = await Promise.all([listQuery, countQuery]);
      if (listRes.error || countRes.error) {
        throw listRes.error || countRes.error;
      }
      const normalize = (value: any) => (Array.isArray(value) ? value[0] : value);
      return {
        success: true,
        data: (listRes.data || []).map((item: any) => ({
          ...item,
          sender: normalize(item.sender),
          receiver: normalize(item.receiver),
          sender_pet: normalize(item.sender_pet),
          receiver_pet: normalize(item.receiver_pet),
        })),
        pagination: buildPagination(countRes.count || 0, page, limit),
        message: '繁育请求加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        pagination: buildPagination(0, page, limit),
        error: error.message || '加载繁育请求失败。',
      };
    }
  }

  static async updateBreedingRequest(requestId: string, updates: { status?: string; notes?: string | null }, actorEmail = 'system'): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabaseAdmin.from('breeding_requests').update(updates).eq('id', requestId).select(BREEDING_SELECT).limit(1);
      if (error || !data?.length) {
        throw error || new Error('未找到要更新的繁育请求。');
      }
      createActivity(actorEmail, 'review', 'breeding_request', `更新繁育请求状态为 ${updates.status || '待处理'}。`, requestId);
      const item = data[0] as any;
      const normalize = (value: any) => (Array.isArray(value) ? value[0] : value);
      return {
        success: true,
        data: {
          ...item,
          sender: normalize(item.sender),
          receiver: normalize(item.receiver),
          sender_pet: normalize(item.sender_pet),
          receiver_pet: normalize(item.receiver_pet),
        },
        message: '繁育请求已更新。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '更新繁育请求失败。',
        code: 500,
      };
    }
  }

  static async getMatches(page = 1, limit = 20, status = ''): Promise<PaginatedResponse<any>> {
    try {
      const offset = (page - 1) * limit;
      let listQuery = supabaseAdmin.from('matches').select(MATCH_SELECT).order('created_at', { ascending: false }).range(offset, offset + limit - 1);
      let countQuery = supabaseAdmin.from('matches').select('id', { count: 'exact', head: true });
      if (status.trim()) {
        listQuery = listQuery.eq('status', status);
        countQuery = countQuery.eq('status', status);
      }
      const [listRes, countRes] = await Promise.all([listQuery, countQuery]);
      if (listRes.error || countRes.error) {
        throw listRes.error || countRes.error;
      }
      const normalize = (value: any) => (Array.isArray(value) ? value[0] : value);
      return {
        success: true,
        data: (listRes.data || []).map((item: any) => ({
          ...item,
          user_a: normalize(item.user_a),
          user_b: normalize(item.user_b),
          pet_a: normalize(item.pet_a),
          pet_b: normalize(item.pet_b),
        })),
        pagination: buildPagination(countRes.count || 0, page, limit),
        message: '宠物恋爱匹配记录加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        pagination: buildPagination(0, page, limit),
        error: error.message || '加载匹配记录失败。',
      };
    }
  }

  static async updateMatchStatus(matchId: string, status: string, actorEmail = 'system'): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabaseAdmin.from('matches').update({ status }).eq('id', matchId).select(MATCH_SELECT).limit(1);
      if (error || !data?.length) {
        throw error || new Error('未找到要更新的匹配记录。');
      }
      createActivity(actorEmail, 'review', 'match', `更新匹配状态为 ${status}。`, matchId);
      const item = data[0] as any;
      const normalize = (value: any) => (Array.isArray(value) ? value[0] : value);
      return {
        success: true,
        data: {
          ...item,
          user_a: normalize(item.user_a),
          user_b: normalize(item.user_b),
          pet_a: normalize(item.pet_a),
          pet_b: normalize(item.pet_b),
        },
        message: '匹配状态已更新。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '更新匹配状态失败。',
        code: 500,
      };
    }
  }

  static async getDiaries(page = 1, limit = 20, keyword = ''): Promise<PaginatedResponse<any>> {
    try {
      const offset = (page - 1) * limit;
      let listQuery = supabaseAdmin.from('diaries').select(DIARY_SELECT).order('created_at', { ascending: false }).range(offset, offset + limit - 1);
      let countQuery = supabaseAdmin.from('diaries').select('id', { count: 'exact', head: true });
      if (keyword.trim()) {
        const expression = `title.ilike.%${keyword}%,content.ilike.%${keyword}%`;
        listQuery = listQuery.or(expression);
        countQuery = countQuery.or(expression);
      }
      const [listRes, countRes] = await Promise.all([listQuery, countQuery]);
      if (listRes.error || countRes.error) {
        throw listRes.error || countRes.error;
      }
      const normalize = (value: any) => (Array.isArray(value) ? value[0] : value);
      return {
        success: true,
        data: (listRes.data || []).map((item: any) => ({ ...item, user: normalize(item.user), pet: normalize(item.pet) })),
        pagination: buildPagination(countRes.count || 0, page, limit),
        message: '日记审核列表加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        pagination: buildPagination(0, page, limit),
        error: error.message || '加载日记列表失败。',
      };
    }
  }

  static async reviewDiary(diaryId: string, updates: Record<string, unknown>, actorEmail = 'system'): Promise<ApiResponse<any>> {
    try {
      const payload: Record<string, unknown> = {};
      if ('is_public' in updates) payload.is_public = Boolean(updates.is_public);
      if ('mood' in updates) payload.mood = updates.mood;
      if ('tags' in updates) payload.tags = toArray(updates.tags);
      const { data, error } = await supabaseAdmin.from('diaries').update(payload).eq('id', diaryId).select(DIARY_SELECT).limit(1);
      if (error || !data?.length) {
        throw error || new Error('未找到要审核的日记。');
      }
      createActivity(actorEmail, 'review', 'diary', `更新日记公开状态为 ${payload.is_public ? '公开' : '隐藏'}。`, diaryId);
      const item = data[0] as any;
      const normalize = (value: any) => (Array.isArray(value) ? value[0] : value);
      return {
        success: true,
        data: { ...item, user: normalize(item.user), pet: normalize(item.pet) },
        message: '日记审核状态已更新。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '更新日记审核状态失败。',
        code: 500,
      };
    }
  }

  static async getMessages(page = 1, limit = 20, keyword = ''): Promise<PaginatedResponse<any>> {
    try {
      const offset = (page - 1) * limit;
      let listQuery = supabaseAdmin.from('messages').select(MESSAGE_SELECT).order('created_at', { ascending: false }).range(offset, offset + limit - 1);
      let countQuery = supabaseAdmin.from('messages').select('id', { count: 'exact', head: true });
      if (keyword.trim()) {
        const expression = `content.ilike.%${keyword}%`;
        listQuery = listQuery.or(expression);
        countQuery = countQuery.or(expression);
      }
      const [listRes, countRes] = await Promise.all([listQuery, countQuery]);
      if (listRes.error || countRes.error) {
        throw listRes.error || countRes.error;
      }
      const normalize = (value: any) => (Array.isArray(value) ? value[0] : value);
      return {
        success: true,
        data: (listRes.data || []).map((item: any) => ({
          ...item,
          sender: normalize(item.sender),
          receiver: normalize(item.receiver),
          chat: normalize(item.chat),
        })),
        pagination: buildPagination(countRes.count || 0, page, limit),
        message: '消息监控列表加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        pagination: buildPagination(0, page, limit),
        error: error.message || '加载消息列表失败。',
      };
    }
  }

  static async getNotifications(page = 1, limit = 20): Promise<PaginatedResponse<any>> {
    try {
      const offset = (page - 1) * limit;
      const [listRes, countRes] = await Promise.all([
        supabaseAdmin.from('notifications').select(NOTIFICATION_SELECT).order('created_at', { ascending: false }).range(offset, offset + limit - 1),
        supabaseAdmin.from('notifications').select('id', { count: 'exact', head: true }),
      ]);
      if (listRes.error || countRes.error) {
        throw listRes.error || countRes.error;
      }
      return {
        success: true,
        data: (listRes.data || []).map((item: any) => ({ ...item, user: Array.isArray(item.user) ? item.user[0] : item.user })),
        pagination: buildPagination(countRes.count || 0, page, limit),
        message: '通知列表加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        pagination: buildPagination(0, page, limit),
        error: error.message || '加载通知列表失败。',
      };
    }
  }

  static async createNotifications(payload: { message: string; type?: string; user_ids?: string[]; target?: 'single' | 'all' }, actorEmail = 'system'): Promise<ApiResponse<{ count: number }>> {
    try {
      const target = payload.target || 'single';
      const message = String(payload.message || '').trim();
      if (!message) {
        return { success: false, error: '通知内容不能为空。', code: 400 };
      }

      let userIds = toArray(payload.user_ids);
      if (target === 'all') {
        const usersRes = await supabaseAdmin.from('users').select('id');
        if (usersRes.error) {
          throw usersRes.error;
        }
        userIds = (usersRes.data || []).map((user: any) => user.id);
      }

      if (!userIds.length) {
        return { success: false, error: '请至少选择一个通知接收人。', code: 400 };
      }

      const rows = userIds.map((userId) => ({
        id: randomUUID(),
        user_id: userId,
        message,
        type: payload.type || 'system',
        is_read: false,
      }));

      const { error } = await supabaseAdmin.from('notifications').insert(rows);
      if (error) throw error;
      createActivity(actorEmail, 'create', 'notification', `发送了 ${rows.length} 条系统通知。`);
      return {
        success: true,
        data: { count: rows.length },
        message: `已发送 ${rows.length} 条系统通知。`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '发送系统通知失败。',
        code: 500,
      };
    }
  }

  static async updateNotification(notificationId: string, updates: Record<string, unknown>, actorEmail = 'system'): Promise<ApiResponse<any>> {
    try {
      const payload: Record<string, unknown> = {};
      if ('message' in updates) payload.message = String(updates.message || '').trim();
      if ('type' in updates) payload.type = updates.type;
      if ('is_read' in updates) payload.is_read = Boolean(updates.is_read);
      const { data, error } = await supabaseAdmin.from('notifications').update(payload).eq('id', notificationId).select(NOTIFICATION_SELECT).limit(1);
      if (error || !data?.length) {
        throw error || new Error('未找到要更新的通知。');
      }
      createActivity(actorEmail, 'update', 'notification', '更新了系统通知。', notificationId);
      const item = data[0] as any;
      return {
        success: true,
        data: { ...item, user: Array.isArray(item.user) ? item.user[0] : item.user },
        message: '通知已更新。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '更新通知失败。',
        code: 500,
      };
    }
  }

  static async getLoginActivity(page = 1, limit = 20, keyword = ''): Promise<ApiResponse<{ list: SafeUser[]; pagination: ReturnType<typeof buildPagination>; summary: { last24h: number; last7d: number; verified: number; total: number } }>> {
    try {
      const offset = (page - 1) * limit;
      let listQuery = supabaseAdmin
        .from('users')
        .select(SAFE_USER_FIELDS)
        .order('last_login', { ascending: false, nullsFirst: false })
        .range(offset, offset + limit - 1);
      let countQuery = supabaseAdmin.from('users').select('id', { count: 'exact', head: true });

      if (keyword.trim()) {
        const expression = `username.ilike.%${keyword}%,email.ilike.%${keyword}%`;
        listQuery = listQuery.or(expression);
        countQuery = countQuery.or(expression);
      }

      const now = Date.now();
      const since24h = new Date(now - 24 * 60 * 60 * 1000).toISOString();
      const since7d = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

      const [listRes, countRes, last24hRes, last7dRes, verifiedRes] = await Promise.all([
        listQuery,
        countQuery,
        supabaseAdmin.from('users').select('id', { count: 'exact', head: true }).gte('last_login', since24h),
        supabaseAdmin.from('users').select('id', { count: 'exact', head: true }).gte('last_login', since7d),
        supabaseAdmin.from('users').select('id', { count: 'exact', head: true }).eq('is_verified', true),
      ]);
      if (listRes.error || countRes.error || last24hRes.error || last7dRes.error || verifiedRes.error) {
        throw listRes.error || countRes.error || last24hRes.error || last7dRes.error || verifiedRes.error;
      }

      return {
        success: true,
        data: {
          list: (listRes.data || []) as SafeUser[],
          pagination: buildPagination(countRes.count || 0, page, limit),
          summary: {
            last24h: last24hRes.count || 0,
            last7d: last7dRes.count || 0,
            verified: verifiedRes.count || 0,
            total: countRes.count || 0,
          },
        },
        message: '登录追踪数据加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '加载登录追踪数据失败。',
        code: 500,
      };
    }
  }

  static async getMarketOrders(page = 1, limit = 20, keyword = '', status = ''): Promise<PaginatedResponse<AdminMarketOrder>> {
    try {
      const rows = await listMarketOrders({ keyword, status });
      const result = paginateRows(rows, page, limit);
      return {
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: '商城订单加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        pagination: buildPagination(0, page, limit),
        error: error.message || '加载商城订单失败。',
      };
    }
  }

  static async saveMarketOrder(payload: Partial<AdminMarketOrder>, actorEmail = 'system', orderId?: string): Promise<ApiResponse<AdminMarketOrder>> {
    try {
      const data = await saveMarketOrderRecord(payload, orderId || payload.id);
      createActivity(actorEmail, orderId || payload.id ? 'update' : 'create', 'market_order', `${orderId || payload.id ? '更新' : '创建'}了商城订单 ${data?.orderNo || ''}。`, data?.id);
      return {
        success: true,
        data: data as AdminMarketOrder,
        message: orderId || payload.id ? '商城订单已更新。' : '商城订单已创建。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '保存商城订单失败。',
        code: 500,
      };
    }
  }

  static async getWalkOrders(page = 1, limit = 20, keyword = '', status = ''): Promise<PaginatedResponse<AdminWalkOrder>> {
    try {
      const rows = await listWalkOrders({ keyword, status });
      const result = paginateRows(rows, page, limit);
      return {
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: '帮忙溜溜订单加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        pagination: buildPagination(0, page, limit),
        error: error.message || '加载帮忙溜溜订单失败。',
      };
    }
  }

  static async saveWalkOrder(payload: Partial<AdminWalkOrder>, actorEmail = 'system', orderId?: string): Promise<ApiResponse<AdminWalkOrder>> {
    try {
      const data = await saveWalkOrderRecord(payload, orderId || payload.id);
      createActivity(actorEmail, orderId || payload.id ? 'update' : 'create', 'walk_order', `${orderId || payload.id ? '更新' : '创建'}了帮忙溜溜订单 ${data?.orderNo || ''}。`, data?.id);
      return {
        success: true,
        data: data as AdminWalkOrder,
        message: orderId || payload.id ? '帮忙溜溜订单已更新。' : '帮忙溜溜订单已创建。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '保存帮忙溜溜订单失败。',
        code: 500,
      };
    }
  }

  static async getCareBookings(page = 1, limit = 20, keyword = '', status = ''): Promise<PaginatedResponse<AdminCareBooking>> {
    try {
      const rows = await listCareBookings({ keyword, status });
      const result = paginateRows(rows, page, limit);
      return {
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: '护理预约加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        pagination: buildPagination(0, page, limit),
        error: error.message || '加载护理预约失败。',
      };
    }
  }

  static async saveCareBooking(payload: Partial<AdminCareBooking>, actorEmail = 'system', bookingId?: string): Promise<ApiResponse<AdminCareBooking>> {
    try {
      const data = await saveCareBookingRecord(payload, bookingId || payload.id);
      createActivity(actorEmail, bookingId || payload.id ? 'update' : 'create', 'care_booking', `${bookingId || payload.id ? '更新' : '创建'}了护理预约 ${data?.bookingNo || ''}。`, data?.id);
      return {
        success: true,
        data: data as AdminCareBooking,
        message: bookingId || payload.id ? '护理预约已更新。' : '护理预约已创建。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '保存护理预约失败。',
        code: 500,
      };
    }
  }

  static async getPetLoveRecords(page = 1, limit = 20, keyword = '', status = ''): Promise<PaginatedResponse<AdminPetLoveRecord>> {
    try {
      const rows = await listPetLoveRecords({ keyword, status });
      const result = paginateRows(rows, page, limit);
      return {
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: '宠物恋爱记录加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        pagination: buildPagination(0, page, limit),
        error: error.message || '加载宠物恋爱记录失败。',
      };
    }
  }

  static async savePetLoveRecord(payload: Partial<AdminPetLoveRecord>, actorEmail = 'system', recordId?: string): Promise<ApiResponse<AdminPetLoveRecord>> {
    try {
      const data = await savePetLoveRecordRecord(payload, recordId || payload.id);
      createActivity(actorEmail, recordId || payload.id ? 'update' : 'create', 'pet_love_record', `${recordId || payload.id ? '更新' : '创建'}了宠物恋爱记录。`, data?.id);
      return {
        success: true,
        data: data as AdminPetLoveRecord,
        message: recordId || payload.id ? '宠物恋爱记录已更新。' : '宠物恋爱记录已创建。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '保存宠物恋爱记录失败。',
        code: 500,
      };
    }
  }

  static async getChatSessions(page = 1, limit = 20, type: 'owner' | 'pet' | '' = '', keyword = '', status = ''): Promise<PaginatedResponse<AdminChatSession>> {
    try {
      const rows = await listChatSessions({ type, keyword, status });
      const result = paginateRows(rows, page, limit);
      return {
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: '聊天会话加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        pagination: buildPagination(0, page, limit),
        error: error.message || '加载聊天会话失败。',
      };
    }
  }

  static async saveChatSession(payload: Partial<AdminChatSession>, actorEmail = 'system', sessionId?: string): Promise<ApiResponse<AdminChatSession>> {
    try {
      const data = await saveChatSessionRecord(payload, sessionId || payload.id);
      createActivity(actorEmail, sessionId || payload.id ? 'update' : 'create', 'chat_session', `${sessionId || payload.id ? '更新' : '创建'}了${data?.type === 'pet' ? '宠物' : '主人'}聊天会话 ${data?.sessionNo || ''}。`, data?.id);
      return {
        success: true,
        data: data as AdminChatSession,
        message: sessionId || payload.id ? '聊天会话已更新。' : '聊天会话已创建。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '保存聊天会话失败。',
        code: 500,
      };
    }
  }

  static async getRuntimeConfig(): Promise<ApiResponse<AdminRuntimeConfig>> {
    try {
      return {
        success: true,
        data: getAdminRuntimeConfig(),
        message: '运营配置加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '加载运营配置失败。',
        code: 500,
      };
    }
  }

  static async getPublicRuntimeConfig(): Promise<ApiResponse<{ realms: AdminRuntimeRealm[] }>> {
    try {
      const configData = getAdminRuntimeConfig();
      return {
        success: true,
        data: { realms: configData.realms.filter((realm) => realm.active) },
        message: '云游配置加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '加载云游配置失败。',
        code: 500,
      };
    }
  }

  static async updateRuntimeConfig(payload: { realms?: Partial<AdminRuntimeRealm>[] }, actorEmail = 'system'): Promise<ApiResponse<AdminRuntimeConfig>> {
    try {
      const current = getAdminRuntimeConfig();
      const nextRealms = Array.isArray(payload.realms)
        ? current.realms.map((realm) => {
            const incoming = payload.realms?.find((item) => item.id === realm.id);
            if (!incoming) return realm;
            return {
              ...realm,
              ...incoming,
              onlineCount: Number.isFinite(Number(incoming.onlineCount)) ? Math.max(0, Number(incoming.onlineCount)) : realm.onlineCount,
              loadingPhrases: toArray(incoming.loadingPhrases).length ? toArray(incoming.loadingPhrases) : realm.loadingPhrases,
              active: typeof incoming.active === 'boolean' ? incoming.active : realm.active,
            };
          })
        : current.realms;
      const nextConfig = saveAdminRuntimeConfig({ realms: nextRealms });
      createActivity(actorEmail, 'update', 'runtime_config', '更新了云游地图在线人数与加载文案配置。');
      return {
        success: true,
        data: nextConfig,
        message: '云游配置已更新。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '更新云游配置失败。',
        code: 500,
      };
    }
  }

  static async getActivityLogs(limit = 80): Promise<ApiResponse<any[]>> {
    try {
      return {
        success: true,
        data: listAdminActivityLogs(limit),
        message: '后台操作记录加载成功。',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '加载后台操作记录失败。',
        code: 500,
      };
    }
  }
}

export default AdminService;

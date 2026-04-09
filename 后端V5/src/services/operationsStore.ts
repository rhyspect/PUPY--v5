import { randomUUID } from 'crypto';
import { supabaseAdmin } from '../config/supabase.js';
import type {
  AdminCareBooking,
  AdminChatMessage,
  AdminChatSession,
  AdminMarketOrder,
  AdminMarketOrderItem,
  AdminPetLoveRecord,
  AdminWalkOrder,
} from './adminRuntimeStore.js';
import { getAdminRuntimeConfig, saveAdminRuntimeConfig } from './adminRuntimeStore.js';

const META_MARKER = '__PUPY_META__:';
const USER_SELECT = 'id, username, email, resident_city, avatar_url, signature, gender, age, mbti, is_verified';

type BasicUser = {
  id: string;
  username?: string | null;
  email?: string | null;
  resident_city?: string | null;
  avatar_url?: string | null;
  signature?: string | null;
  photos?: string[] | null;
  gender?: string | null;
  age?: number | null;
  mbti?: string | null;
  is_verified?: boolean | null;
};

type BasicPet = {
  id: string;
  user_id?: string | null;
  name?: string | null;
  images?: string[] | null;
  type?: string | null;
  gender?: string | null;
};

type MarketOrderRow = {
  id: string;
  order_no: string;
  user_id?: string | null;
  seller_id?: string | null;
  pet_id?: string | null;
  city?: string | null;
  source?: string | null;
  status?: string | null;
  payment_status?: string | null;
  fulfillment_status?: string | null;
  total?: number | string | null;
  quantity?: number | null;
  note?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type MarketOrderItemRow = {
  id: string;
  order_id: string;
  product_id?: string | null;
  title: string;
  image?: string | null;
  unit_price?: number | string | null;
  quantity?: number | null;
};

type WalkOrderRow = {
  id: string;
  order_no: string;
  user_id?: string | null;
  pet_id?: string | null;
  walker_name: string;
  city?: string | null;
  service_zone?: string | null;
  status?: string | null;
  review_status?: string | null;
  scheduled_at?: string | null;
  duration_minutes?: number | null;
  price?: number | string | null;
  note?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type CareBookingRow = {
  id: string;
  booking_no: string;
  user_id?: string | null;
  pet_id?: string | null;
  merchant_name: string;
  city?: string | null;
  service_name?: string | null;
  status?: string | null;
  review_status?: string | null;
  scheduled_at?: string | null;
  price?: number | string | null;
  note?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type PetLoveRecordRow = {
  id: string;
  owner_a_id?: string | null;
  owner_b_id?: string | null;
  pet_a_id?: string | null;
  pet_b_id?: string | null;
  city?: string | null;
  status?: string | null;
  review_status?: string | null;
  romance_stage?: string | null;
  compatibility_score?: number | string | null;
  note?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ChatSessionRow = {
  id: string;
  session_no: string;
  type?: string | null;
  title?: string | null;
  city?: string | null;
  status?: string | null;
  user_a_id?: string | null;
  user_b_id?: string | null;
  pet_a_id?: string | null;
  pet_b_id?: string | null;
  unread_count?: number | null;
  latest_snippet?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ChatMessageRow = {
  id: string;
  session_id: string;
  sender_label: string;
  sender_role?: string | null;
  content: string;
  moderation_status?: string | null;
  created_at?: string | null;
};

type EncodedMeta = Record<string, unknown>;

type MarketOrderFilters = {
  userId?: string | null;
  keyword?: string;
  status?: string;
};

type WalkOrderFilters = {
  userId?: string | null;
  keyword?: string;
  status?: string;
};

type CareBookingFilters = {
  userId?: string | null;
  keyword?: string;
  status?: string;
};

type PetLoveFilters = {
  userId?: string | null;
  petIds?: string[];
  keyword?: string;
  status?: string;
};

type ChatSessionFilters = {
  type?: 'owner' | 'pet' | '';
  keyword?: string;
  status?: string;
  userId?: string | null;
  petIds?: string[];
};

const normalizeText = (value: unknown) => String(value || '').trim().toLowerCase();
const uniqueStrings = (values: Array<unknown>) => Array.from(new Set(values.map((item) => String(item || '').trim()).filter(Boolean)));
const toNumber = (value: unknown, fallback = 0) => {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
};

function isMissingOperationsTableError(error: any) {
  return error?.code === 'PGRST205' || String(error?.message || '').includes('schema cache');
}

const sortByLatest = <T extends { updatedAt?: string; createdAt?: string }>(rows: T[]) =>
  [...rows].sort((a, b) => {
    const aTime = Date.parse(a.updatedAt || a.createdAt || '') || 0;
    const bTime = Date.parse(b.updatedAt || b.createdAt || '') || 0;
    return bTime - aTime;
  });

function encodeMetaText(text: string | null | undefined, meta: EncodedMeta) {
  const visible = decodeMetaText(text).text.trim();
  const normalizedMeta = Object.fromEntries(Object.entries(meta).filter(([, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && String(value).trim() !== '';
  }));

  if (!Object.keys(normalizedMeta).length) {
    return visible;
  }

  const encoded = Buffer.from(JSON.stringify(normalizedMeta), 'utf8').toString('base64');
  return `${META_MARKER}${encoded}\n${visible}`;
}

function decodeMetaText(value: string | null | undefined): { text: string; meta: EncodedMeta } {
  const raw = String(value || '');
  if (!raw.startsWith(META_MARKER)) {
    return { text: raw, meta: {} };
  }

  const separatorIndex = raw.indexOf('\n');
  const encoded = raw.slice(META_MARKER.length, separatorIndex === -1 ? raw.length : separatorIndex).trim();
  const text = separatorIndex === -1 ? '' : raw.slice(separatorIndex + 1);

  try {
    const meta = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8')) as EncodedMeta;
    return { text, meta: typeof meta === 'object' && meta ? meta : {} };
  } catch {
    return { text, meta: {} };
  }
}

function includesKeyword(value: unknown, keyword: string) {
  return String(value || '').toLowerCase().includes(keyword.toLowerCase());
}

function buildPagination(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    total_pages: Math.max(1, Math.ceil(total / limit)),
  };
}

function paginateRows<T>(rows: T[], page: number, limit: number) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const start = (safePage - 1) * safeLimit;
  return {
    data: rows.slice(start, start + safeLimit),
    pagination: buildPagination(rows.length, safePage, safeLimit),
  };
}

function indexById<T extends { id: string }>(rows: T[]) {
  return new Map(rows.map((row) => [row.id, row]));
}

async function loadUsers(userIds: Array<string | null | undefined>) {
  const ids = uniqueStrings(userIds);
  if (!ids.length) return new Map<string, BasicUser>();
  const { data, error } = await supabaseAdmin
    .from('users')
    .select(USER_SELECT)
    .in('id', ids);
  if (error) throw error;
  return indexById((data || []) as BasicUser[]);
}

async function loadPets(petIds: Array<string | null | undefined>) {
  const ids = uniqueStrings(petIds);
  if (!ids.length) return new Map<string, BasicPet>();
  const { data, error } = await supabaseAdmin
    .from('pets')
    .select('id, user_id, name, images, type, gender')
    .in('id', ids);
  if (error) throw error;
  return indexById((data || []) as BasicPet[]);
}

async function resolveUserByIdentity(options: { userId?: string | null; email?: string | null; username?: string | null }) {
  if (options.userId) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select(USER_SELECT)
      .eq('id', options.userId)
      .maybeSingle();
    if (error) throw error;
    return (data as BasicUser | null) || null;
  }

  if (options.email) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select(USER_SELECT)
      .eq('email', String(options.email).trim())
      .limit(1);
    if (error) throw error;
    return ((data || [])[0] as BasicUser | undefined) || null;
  }

  if (options.username) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select(USER_SELECT)
      .eq('username', String(options.username).trim())
      .limit(1);
    if (error) throw error;
    return ((data || [])[0] as BasicUser | undefined) || null;
  }

  return null;
}

async function resolvePetByIdentity(options: { petId?: string | null; petName?: string | null; userId?: string | null }) {
  if (options.petId) {
    const { data, error } = await supabaseAdmin
      .from('pets')
      .select('id, user_id, name, images, type, gender')
      .eq('id', options.petId)
      .maybeSingle();
    if (error) throw error;
    return (data as BasicPet | null) || null;
  }

  if (!options.petName) return null;

  let query = supabaseAdmin
    .from('pets')
    .select('id, user_id, name, images, type, gender')
    .eq('name', String(options.petName).trim())
    .limit(1);

  if (options.userId) {
    query = query.eq('user_id', options.userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return ((data || [])[0] as BasicPet | undefined) || null;
}

async function resolveViewerPets(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('pets')
    .select('id, name')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data || []) as Array<{ id: string; name: string }>;
}

async function loadMarketOrderItems(orderIds: string[]) {
  if (!orderIds.length) return new Map<string, AdminMarketOrderItem[]>();
  const { data, error } = await supabaseAdmin
    .from('market_order_items')
    .select('id, order_id, product_id, title, image, unit_price, quantity')
    .in('order_id', orderIds)
    .order('created_at', { ascending: true });
  if (error) throw error;

  const grouped = new Map<string, AdminMarketOrderItem[]>();
  for (const row of (data || []) as MarketOrderItemRow[]) {
    const list = grouped.get(row.order_id) || [];
    list.push({
      productId: String(row.product_id || ''),
      title: row.title,
      image: String(row.image || ''),
      unitPrice: toNumber(row.unit_price),
      quantity: Math.max(1, toNumber(row.quantity, 1)),
    });
    grouped.set(row.order_id, list);
  }
  return grouped;
}

function mapMarketOrderRow(
  row: MarketOrderRow,
  itemsByOrderId: Map<string, AdminMarketOrderItem[]>,
  userMap: Map<string, BasicUser>,
  sellerMap: Map<string, BasicUser>,
  petMap: Map<string, BasicPet>,
): AdminMarketOrder {
  const parsedNote = decodeMetaText(row.note);
  const noteMeta = parsedNote.meta;
  const user = row.user_id ? userMap.get(row.user_id) : null;
  const seller = row.seller_id ? sellerMap.get(row.seller_id) : null;
  const pet = row.pet_id ? petMap.get(row.pet_id) : null;

  return {
    id: row.id,
    orderNo: row.order_no,
    userName: String(user?.username || noteMeta.userName || '未命名用户'),
    userEmail: String(user?.email || noteMeta.userEmail || ''),
    petName: String(pet?.name || noteMeta.petName || '未命名宠物'),
    sellerName: String(seller?.username || noteMeta.sellerName || '爪住集市'),
    city: String(row.city || user?.resident_city || ''),
    status: String(row.status || '待处理'),
    paymentStatus: String(row.payment_status || '待付款'),
    fulfillmentStatus: String(row.fulfillment_status || '待发货'),
    total: toNumber(row.total),
    quantity: Math.max(1, toNumber(row.quantity, 1)),
    note: parsedNote.text,
    source: String(row.source || '主粮用品'),
    items: itemsByOrderId.get(row.id) || [],
    createdAt: String(row.created_at || ''),
    updatedAt: String(row.updated_at || ''),
  };
}

function mapWalkOrderRow(row: WalkOrderRow, userMap: Map<string, BasicUser>, petMap: Map<string, BasicPet>): AdminWalkOrder {
  const parsedNote = decodeMetaText(row.note);
  const noteMeta = parsedNote.meta;
  const user = row.user_id ? userMap.get(row.user_id) : null;
  const pet = row.pet_id ? petMap.get(row.pet_id) : null;

  return {
    id: row.id,
    orderNo: row.order_no,
    userName: String(user?.username || noteMeta.userName || '未命名用户'),
    userEmail: String(user?.email || noteMeta.userEmail || ''),
    petName: String(pet?.name || noteMeta.petName || '未命名宠物'),
    walkerName: row.walker_name,
    city: String(row.city || user?.resident_city || ''),
    serviceZone: String(row.service_zone || ''),
    status: String(row.status || '待确认'),
    reviewStatus: String(row.review_status || '待审核'),
    scheduledAt: String(row.scheduled_at || ''),
    durationMinutes: Math.max(30, toNumber(row.duration_minutes, 60)),
    price: toNumber(row.price),
    note: parsedNote.text,
    createdAt: String(row.created_at || ''),
    updatedAt: String(row.updated_at || ''),
  };
}

function mapCareBookingRow(row: CareBookingRow, userMap: Map<string, BasicUser>, petMap: Map<string, BasicPet>): AdminCareBooking {
  const parsedNote = decodeMetaText(row.note);
  const noteMeta = parsedNote.meta;
  const user = row.user_id ? userMap.get(row.user_id) : null;
  const pet = row.pet_id ? petMap.get(row.pet_id) : null;

  return {
    id: row.id,
    bookingNo: row.booking_no,
    userName: String(user?.username || noteMeta.userName || '未命名用户'),
    userEmail: String(user?.email || noteMeta.userEmail || ''),
    petName: String(pet?.name || noteMeta.petName || '未命名宠物'),
    merchantName: row.merchant_name,
    city: String(row.city || user?.resident_city || ''),
    serviceName: String(row.service_name || ''),
    status: String(row.status || '待确认'),
    reviewStatus: String(row.review_status || '待审核'),
    scheduledAt: String(row.scheduled_at || ''),
    price: toNumber(row.price),
    note: parsedNote.text,
    createdAt: String(row.created_at || ''),
    updatedAt: String(row.updated_at || ''),
  };
}

function mapPetLoveRow(
  row: PetLoveRecordRow,
  userMap: Map<string, BasicUser>,
  petMap: Map<string, BasicPet>,
): AdminPetLoveRecord {
  const parsedNote = decodeMetaText(row.note);
  const noteMeta = parsedNote.meta;
  const ownerA = row.owner_a_id ? userMap.get(row.owner_a_id) : null;
  const ownerB = row.owner_b_id ? userMap.get(row.owner_b_id) : null;
  const petA = row.pet_a_id ? petMap.get(row.pet_a_id) : null;
  const petB = row.pet_b_id ? petMap.get(row.pet_b_id) : null;

  return {
    id: row.id,
    petAName: String(petA?.name || noteMeta.petAName || '宠物 A'),
    petBName: String(petB?.name || noteMeta.petBName || '宠物 B'),
    ownerAName: String(ownerA?.username || noteMeta.ownerAName || '主人 A'),
    ownerBName: String(ownerB?.username || noteMeta.ownerBName || '主人 B'),
    city: String(row.city || ownerA?.resident_city || ownerB?.resident_city || ''),
    status: String(row.status || '待匹配'),
    reviewStatus: String(row.review_status || '待审核'),
    romanceStage: String(row.romance_stage || '资料互看中'),
    compatibilityScore: toNumber(row.compatibility_score, 0.75),
    note: parsedNote.text,
    createdAt: String(row.created_at || ''),
    updatedAt: String(row.updated_at || ''),
  };
}

function mapChatSessionRow(
  row: ChatSessionRow,
  messagesBySessionId: Map<string, AdminChatMessage[]>,
  userMap: Map<string, BasicUser>,
  petMap: Map<string, BasicPet>,
): AdminChatSession {
  const parsedSnippet = decodeMetaText(row.latest_snippet);
  const snippetMeta = parsedSnippet.meta;
  const userA = row.user_a_id ? userMap.get(row.user_a_id) : null;
  const userB = row.user_b_id ? userMap.get(row.user_b_id) : null;
  const petA = row.pet_a_id ? petMap.get(row.pet_a_id) : null;
  const petB = row.pet_b_id ? petMap.get(row.pet_b_id) : null;
  const participants = uniqueStrings(
    Array.isArray(snippetMeta.participants)
      ? (snippetMeta.participants as unknown[])
      : [userA?.username, userB?.username],
  );
  const relatedPets = uniqueStrings(
    Array.isArray(snippetMeta.relatedPets)
      ? (snippetMeta.relatedPets as unknown[])
      : [petA?.name, petB?.name],
  );
  const messages = messagesBySessionId.get(row.id) || [];
  const latestSnippet = parsedSnippet.text || messages[messages.length - 1]?.content || '';

  return {
    id: row.id,
    sessionNo: row.session_no,
    type: row.type === 'pet' ? 'pet' : 'owner',
    title: String(row.title || '未命名会话'),
    participants,
    relatedPets,
    city: String(row.city || userA?.resident_city || userB?.resident_city || ''),
    status: String(row.status || '待处理'),
    unreadCount: Math.max(0, toNumber(row.unread_count, 0)),
    latestSnippet,
    messages,
    createdAt: String(row.created_at || ''),
    updatedAt: String(row.updated_at || ''),
  };
}

async function loadChatMessages(sessionIds: string[]) {
  if (!sessionIds.length) return new Map<string, AdminChatMessage[]>();
  const { data, error } = await supabaseAdmin
    .from('chat_session_messages')
    .select('id, session_id, sender_label, sender_role, content, moderation_status, created_at')
    .in('session_id', sessionIds)
    .order('created_at', { ascending: true });
  if (error) throw error;

  const grouped = new Map<string, AdminChatMessage[]>();
  for (const row of (data || []) as ChatMessageRow[]) {
    const list = grouped.get(row.session_id) || [];
    list.push({
      id: row.id,
      senderName: row.sender_label,
      role: row.sender_role === 'pet' || row.sender_role === 'system' ? row.sender_role : 'owner',
      content: row.content,
      createdAt: String(row.created_at || ''),
      moderationStatus: String(row.moderation_status || '正常'),
    });
    grouped.set(row.session_id, list);
  }
  return grouped;
}

async function findMarketOrder(orderId?: string, orderNo?: string) {
  if (orderId) {
    const { data, error } = await supabaseAdmin.from('market_orders').select('*').eq('id', orderId).maybeSingle();
    if (error) throw error;
    return (data as MarketOrderRow | null) || null;
  }
  if (orderNo) {
    const { data, error } = await supabaseAdmin.from('market_orders').select('*').eq('order_no', orderNo).maybeSingle();
    if (error) throw error;
    return (data as MarketOrderRow | null) || null;
  }
  return null;
}

async function findWalkOrder(orderId?: string, orderNo?: string) {
  if (orderId) {
    const { data, error } = await supabaseAdmin.from('walk_orders').select('*').eq('id', orderId).maybeSingle();
    if (error) throw error;
    return (data as WalkOrderRow | null) || null;
  }
  if (orderNo) {
    const { data, error } = await supabaseAdmin.from('walk_orders').select('*').eq('order_no', orderNo).maybeSingle();
    if (error) throw error;
    return (data as WalkOrderRow | null) || null;
  }
  return null;
}

async function findCareBooking(bookingId?: string, bookingNo?: string) {
  if (bookingId) {
    const { data, error } = await supabaseAdmin.from('care_bookings').select('*').eq('id', bookingId).maybeSingle();
    if (error) throw error;
    return (data as CareBookingRow | null) || null;
  }
  if (bookingNo) {
    const { data, error } = await supabaseAdmin.from('care_bookings').select('*').eq('booking_no', bookingNo).maybeSingle();
    if (error) throw error;
    return (data as CareBookingRow | null) || null;
  }
  return null;
}

async function findChatSession(sessionId?: string, sessionNo?: string) {
  if (sessionId) {
    const { data, error } = await supabaseAdmin.from('chat_sessions').select('*').eq('id', sessionId).maybeSingle();
    if (error) throw error;
    return (data as ChatSessionRow | null) || null;
  }
  if (sessionNo) {
    const { data, error } = await supabaseAdmin.from('chat_sessions').select('*').eq('session_no', sessionNo).maybeSingle();
    if (error) throw error;
    return (data as ChatSessionRow | null) || null;
  }
  return null;
}

export async function listMarketOrders(filters: MarketOrderFilters = {}) {
  try {
    let query = supabaseAdmin
      .from('market_orders')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(500);

    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const rows = (data || []) as MarketOrderRow[];
    const [itemsByOrderId, userMap, sellerMap, petMap] = await Promise.all([
      loadMarketOrderItems(rows.map((row) => row.id)),
      loadUsers(rows.map((row) => row.user_id)),
      loadUsers(rows.map((row) => row.seller_id)),
      loadPets(rows.map((row) => row.pet_id)),
    ]);

    let hydrated = rows.map((row) => mapMarketOrderRow(row, itemsByOrderId, userMap, sellerMap, petMap));
    const keyword = String(filters.keyword || '').trim().toLowerCase();
    const status = String(filters.status || '').trim();

    if (keyword) {
      hydrated = hydrated.filter((order) =>
        [
          order.orderNo,
          order.userName,
          order.userEmail,
          order.petName,
          order.sellerName,
          order.city,
          order.note,
          order.source,
          ...order.items.map((item) => item.title),
        ].some((value) => includesKeyword(value, keyword)),
      );
    }

    if (status) {
      hydrated = hydrated.filter((order) =>
        order.status === status || order.paymentStatus === status || order.fulfillmentStatus === status,
      );
    }

    return sortByLatest(hydrated);
  } catch (error) {
    if (!isMissingOperationsTableError(error)) throw error;
    const runtime = getAdminRuntimeConfig();
    let rows = sortByLatest(runtime.marketOrders);
    const keyword = String(filters.keyword || '').trim().toLowerCase();
    const status = String(filters.status || '').trim();

    if (filters.userId) {
      const viewer = await resolveUserByIdentity({ userId: filters.userId });
      const viewerPets = await resolveViewerPets(filters.userId);
      const petNames = viewerPets.map((pet) => pet.name);
      rows = rows.filter((order) =>
        [order.userEmail, order.userName, order.petName].some((value) =>
          [viewer?.email, viewer?.username, ...petNames].map(normalizeText).includes(normalizeText(value)),
        ),
      );
    }

    if (keyword) {
      rows = rows.filter((order) =>
        [
          order.orderNo,
          order.userName,
          order.userEmail,
          order.petName,
          order.sellerName,
          order.city,
          order.note,
          order.source,
          ...order.items.map((item) => item.title),
        ].some((value) => includesKeyword(value, keyword)),
      );
    }

    if (status) {
      rows = rows.filter((order) =>
        order.status === status || order.paymentStatus === status || order.fulfillmentStatus === status,
      );
    }

    return rows;
  }
}

export async function listWalkOrders(filters: WalkOrderFilters = {}) {
  try {
    let query = supabaseAdmin
      .from('walk_orders')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(500);

    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const rows = (data || []) as WalkOrderRow[];
    const [userMap, petMap] = await Promise.all([
      loadUsers(rows.map((row) => row.user_id)),
      loadPets(rows.map((row) => row.pet_id)),
    ]);

    let hydrated = rows.map((row) => mapWalkOrderRow(row, userMap, petMap));
    const keyword = String(filters.keyword || '').trim().toLowerCase();
    const status = String(filters.status || '').trim();

    if (keyword) {
      hydrated = hydrated.filter((order) =>
        [
          order.orderNo,
          order.userName,
          order.userEmail,
          order.petName,
          order.walkerName,
          order.city,
          order.serviceZone,
          order.note,
        ].some((value) => includesKeyword(value, keyword)),
      );
    }

    if (status) {
      hydrated = hydrated.filter((order) => order.status === status || order.reviewStatus === status);
    }

    return sortByLatest(hydrated);
  } catch (error) {
    if (!isMissingOperationsTableError(error)) throw error;
    const runtime = getAdminRuntimeConfig();
    let rows = sortByLatest(runtime.walkOrders);
    const keyword = String(filters.keyword || '').trim().toLowerCase();
    const status = String(filters.status || '').trim();

    if (filters.userId) {
      const viewer = await resolveUserByIdentity({ userId: filters.userId });
      const viewerPets = await resolveViewerPets(filters.userId);
      const petNames = viewerPets.map((pet) => pet.name);
      rows = rows.filter((order) =>
        [order.userEmail, order.userName, order.petName].some((value) =>
          [viewer?.email, viewer?.username, ...petNames].map(normalizeText).includes(normalizeText(value)),
        ),
      );
    }

    if (keyword) {
      rows = rows.filter((order) =>
        [order.orderNo, order.userName, order.userEmail, order.petName, order.walkerName, order.city, order.serviceZone, order.note].some((value) =>
          includesKeyword(value, keyword),
        ),
      );
    }

    if (status) {
      rows = rows.filter((order) => order.status === status || order.reviewStatus === status);
    }

    return rows;
  }
}

export async function listCareBookings(filters: CareBookingFilters = {}) {
  try {
    let query = supabaseAdmin
      .from('care_bookings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(500);

    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const rows = (data || []) as CareBookingRow[];
    const [userMap, petMap] = await Promise.all([
      loadUsers(rows.map((row) => row.user_id)),
      loadPets(rows.map((row) => row.pet_id)),
    ]);

    let hydrated = rows.map((row) => mapCareBookingRow(row, userMap, petMap));
    const keyword = String(filters.keyword || '').trim().toLowerCase();
    const status = String(filters.status || '').trim();

    if (keyword) {
      hydrated = hydrated.filter((booking) =>
        [
          booking.bookingNo,
          booking.userName,
          booking.userEmail,
          booking.petName,
          booking.merchantName,
          booking.city,
          booking.serviceName,
          booking.note,
        ].some((value) => includesKeyword(value, keyword)),
      );
    }

    if (status) {
      hydrated = hydrated.filter((booking) => booking.status === status || booking.reviewStatus === status);
    }

    return sortByLatest(hydrated);
  } catch (error) {
    if (!isMissingOperationsTableError(error)) throw error;
    const runtime = getAdminRuntimeConfig();
    let rows = sortByLatest(runtime.careBookings);
    const keyword = String(filters.keyword || '').trim().toLowerCase();
    const status = String(filters.status || '').trim();

    if (filters.userId) {
      const viewer = await resolveUserByIdentity({ userId: filters.userId });
      const viewerPets = await resolveViewerPets(filters.userId);
      const petNames = viewerPets.map((pet) => pet.name);
      rows = rows.filter((booking) =>
        [booking.userEmail, booking.userName, booking.petName].some((value) =>
          [viewer?.email, viewer?.username, ...petNames].map(normalizeText).includes(normalizeText(value)),
        ),
      );
    }

    if (keyword) {
      rows = rows.filter((booking) =>
        [booking.bookingNo, booking.userName, booking.userEmail, booking.petName, booking.merchantName, booking.city, booking.serviceName, booking.note].some((value) =>
          includesKeyword(value, keyword),
        ),
      );
    }

    if (status) {
      rows = rows.filter((booking) => booking.status === status || booking.reviewStatus === status);
    }

    return rows;
  }
}

export async function listPetLoveRecords(filters: PetLoveFilters = {}) {
  try {
    const { data, error } = await supabaseAdmin
      .from('pet_love_records')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(500);
    if (error) throw error;

    const rows = (data || []) as PetLoveRecordRow[];
    const [userMap, petMap] = await Promise.all([
      loadUsers(rows.flatMap((row) => [row.owner_a_id, row.owner_b_id])),
      loadPets(rows.flatMap((row) => [row.pet_a_id, row.pet_b_id])),
    ]);

    let hydrated = rows.map((row) => mapPetLoveRow(row, userMap, petMap));
    const keyword = String(filters.keyword || '').trim().toLowerCase();
    const status = String(filters.status || '').trim();

    if (filters.userId) {
      hydrated = hydrated.filter((record) =>
        rows.some((row) =>
          row.id === record.id && (row.owner_a_id === filters.userId || row.owner_b_id === filters.userId),
        ),
      );
    }

    if (filters.petIds?.length) {
      const petIdSet = new Set(filters.petIds);
      hydrated = hydrated.filter((record) =>
        rows.some((row) =>
          row.id === record.id && (petIdSet.has(String(row.pet_a_id || '')) || petIdSet.has(String(row.pet_b_id || ''))),
        ),
      );
    }

    if (keyword) {
      hydrated = hydrated.filter((record) =>
        [
          record.petAName,
          record.petBName,
          record.ownerAName,
          record.ownerBName,
          record.city,
          record.note,
          record.romanceStage,
        ].some((value) => includesKeyword(value, keyword)),
      );
    }

    if (status) {
      hydrated = hydrated.filter((record) => record.status === status || record.reviewStatus === status);
    }

    return sortByLatest(hydrated);
  } catch (error) {
    if (!isMissingOperationsTableError(error)) throw error;
    const runtime = getAdminRuntimeConfig();
    let rows = sortByLatest(runtime.petLoveRecords);
    const keyword = String(filters.keyword || '').trim().toLowerCase();
    const status = String(filters.status || '').trim();

    if (keyword) {
      rows = rows.filter((record) =>
        [record.petAName, record.petBName, record.ownerAName, record.ownerBName, record.city, record.note, record.romanceStage].some((value) =>
          includesKeyword(value, keyword),
        ),
      );
    }

    if (status) {
      rows = rows.filter((record) => record.status === status || record.reviewStatus === status);
    }

    return rows;
  }
}

export async function listChatSessions(filters: ChatSessionFilters = {}) {
  try {
    let query = supabaseAdmin
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(500);

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    const { data, error } = await query;
    if (error) throw error;

    const rows = (data || []) as ChatSessionRow[];
    const [messagesBySessionId, userMap, petMap] = await Promise.all([
      loadChatMessages(rows.map((row) => row.id)),
      loadUsers(rows.flatMap((row) => [row.user_a_id, row.user_b_id])),
      loadPets(rows.flatMap((row) => [row.pet_a_id, row.pet_b_id])),
    ]);

    const petIdSet = new Set(uniqueStrings(filters.petIds || []));
    let hydrated = rows.map((row) => mapChatSessionRow(row, messagesBySessionId, userMap, petMap));
    const keyword = String(filters.keyword || '').trim().toLowerCase();
    const status = String(filters.status || '').trim();

    if (filters.userId) {
      hydrated = hydrated.filter((session) =>
        rows.some((row) =>
          row.id === session.id && (row.user_a_id === filters.userId || row.user_b_id === filters.userId),
        ),
      );
    }

    if (petIdSet.size > 0) {
      hydrated = hydrated.filter((session) =>
        rows.some((row) =>
          row.id === session.id && (petIdSet.has(String(row.pet_a_id || '')) || petIdSet.has(String(row.pet_b_id || ''))),
        ),
      );
    }

    if (keyword) {
      hydrated = hydrated.filter((session) =>
        [
          session.sessionNo,
          session.title,
          session.city,
          session.latestSnippet,
          session.status,
          ...session.participants,
          ...session.relatedPets,
          ...session.messages.map((message) => message.content),
        ].some((value) => includesKeyword(value, keyword)),
      );
    }

    if (status) {
      hydrated = hydrated.filter((session) => session.status === status);
    }

    return sortByLatest(hydrated);
  } catch (error) {
    if (!isMissingOperationsTableError(error)) throw error;
    const runtime = getAdminRuntimeConfig();
    let rows = sortByLatest(runtime.chatSessions);
    const keyword = String(filters.keyword || '').trim().toLowerCase();
    const status = String(filters.status || '').trim();
    const petIdSet = new Set(uniqueStrings(filters.petIds || []));

    if (filters.type) {
      rows = rows.filter((session) => session.type === filters.type);
    }

    if (filters.userId) {
      const viewer = await resolveUserByIdentity({ userId: filters.userId });
      rows = rows.filter((session) => session.participants.map(normalizeText).includes(normalizeText(viewer?.username)));
    }

    if (petIdSet.size > 0 && filters.userId) {
      const viewerPets = await resolveViewerPets(filters.userId);
      const petNames = viewerPets.map((pet) => pet.name);
      rows = rows.filter((session) => session.relatedPets.some((petName) => petNames.map(normalizeText).includes(normalizeText(petName))));
    }

    if (keyword) {
      rows = rows.filter((session) =>
        [session.sessionNo, session.title, session.city, session.latestSnippet, session.status, ...session.participants, ...session.relatedPets, ...session.messages.map((message) => message.content)].some((value) =>
          includesKeyword(value, keyword),
        ),
      );
    }

    if (status) {
      rows = rows.filter((session) => session.status === status);
    }

    return rows;
  }
}

export async function getChatSessionById(sessionId: string) {
  try {
    const row = await findChatSession(sessionId);
    if (!row) return null;
    const [messagesBySessionId, userMap, petMap] = await Promise.all([
      loadChatMessages([row.id]),
      loadUsers([row.user_a_id, row.user_b_id]),
      loadPets([row.pet_a_id, row.pet_b_id]),
    ]);
    return mapChatSessionRow(row, messagesBySessionId, userMap, petMap);
  } catch (error) {
    if (!isMissingOperationsTableError(error)) throw error;
    return getAdminRuntimeConfig().chatSessions.find((session) => session.id === sessionId) || null;
  }
}

export async function saveMarketOrderRecord(payload: Partial<AdminMarketOrder> & { userId?: string | null; petId?: string | null; sellerId?: string | null }, orderId?: string) {
  try {
    const existing = await findMarketOrder(orderId, payload.orderNo);
    const user = await resolveUserByIdentity({
      userId: payload.userId || existing?.user_id || null,
      email: payload.userEmail || decodeMetaText(existing?.note).meta.userEmail as string | undefined,
      username: payload.userName || decodeMetaText(existing?.note).meta.userName as string | undefined,
    });
    const pet = await resolvePetByIdentity({
      petId: payload.petId || existing?.pet_id || null,
      petName: payload.petName || decodeMetaText(existing?.note).meta.petName as string | undefined,
      userId: user?.id || existing?.user_id || null,
    });
    const seller = await resolveUserByIdentity({
      userId: payload.sellerId || existing?.seller_id || null,
      username: payload.sellerName || decodeMetaText(existing?.note).meta.sellerName as string | undefined,
    });

    const noteText = payload.note ?? decodeMetaText(existing?.note).text ?? '';
    const noteMeta = {
      userName: payload.userName || user?.username,
      userEmail: payload.userEmail || user?.email,
      petName: payload.petName || pet?.name,
      sellerName: payload.sellerName || seller?.username,
    };

    const nextRecord = {
      order_no: payload.orderNo || existing?.order_no || `PUPY-MO-${Date.now()}`,
      user_id: user?.id || null,
      seller_id: seller?.id || null,
      pet_id: pet?.id || null,
      city: payload.city || existing?.city || user?.resident_city || null,
      source: payload.source || existing?.source || '主粮用品',
      status: payload.status || existing?.status || '待处理',
      payment_status: payload.paymentStatus || existing?.payment_status || '待付款',
      fulfillment_status: payload.fulfillmentStatus || existing?.fulfillment_status || '待发货',
      total: toNumber(payload.total, toNumber(existing?.total)),
      quantity: Math.max(1, toNumber(payload.quantity, toNumber(existing?.quantity, 1))),
      note: encodeMetaText(noteText, noteMeta),
    };

    const mutation = existing
      ? supabaseAdmin.from('market_orders').update(nextRecord).eq('id', existing.id).select('*').single()
      : supabaseAdmin.from('market_orders').insert(nextRecord).select('*').single();
    const { data, error } = await mutation;
    if (error || !data) throw error || new Error('保存商城订单失败。');

    const savedId = (data as MarketOrderRow).id;
    if (Array.isArray(payload.items)) {
      const { error: deleteError } = await supabaseAdmin.from('market_order_items').delete().eq('order_id', savedId);
      if (deleteError) throw deleteError;
      if (payload.items.length) {
        const { error: insertError } = await supabaseAdmin.from('market_order_items').insert(
          payload.items.map((item) => ({
            order_id: savedId,
            product_id: item.productId || null,
            title: item.title,
            image: item.image || null,
            unit_price: toNumber(item.unitPrice),
            quantity: Math.max(1, toNumber(item.quantity, 1)),
          })),
        );
        if (insertError) throw insertError;
      }
    }

    const saved = await listMarketOrders();
    return saved.find((item) => item.id === savedId) || null;
  } catch (error) {
    if (!isMissingOperationsTableError(error)) throw error;
    const runtime = getAdminRuntimeConfig();
    const existing = runtime.marketOrders.find((item) => item.id === orderId || item.orderNo === payload.orderNo || item.id === payload.id);
    const nextOrder: AdminMarketOrder = {
      id: existing?.id || payload.id || randomUUID(),
      orderNo: payload.orderNo || existing?.orderNo || `PUPY-MO-${Date.now()}`,
      userName: payload.userName || existing?.userName || '未命名用户',
      userEmail: payload.userEmail || existing?.userEmail || '',
      petName: payload.petName || existing?.petName || '未命名宠物',
      sellerName: payload.sellerName || existing?.sellerName || '爪住集市',
      city: payload.city || existing?.city || '未填写城市',
      status: payload.status || existing?.status || '待处理',
      paymentStatus: payload.paymentStatus || existing?.paymentStatus || '待付款',
      fulfillmentStatus: payload.fulfillmentStatus || existing?.fulfillmentStatus || '待发货',
      total: toNumber(payload.total, existing?.total || 0),
      quantity: Math.max(1, toNumber(payload.quantity, existing?.quantity || 1)),
      note: payload.note ?? existing?.note ?? '',
      source: payload.source || existing?.source || '主粮用品',
      items: Array.isArray(payload.items) ? payload.items : existing?.items || [],
      createdAt: existing?.createdAt || payload.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const nextOrders = existing
      ? runtime.marketOrders.map((item) => (item.id === existing.id ? nextOrder : item))
      : [nextOrder, ...runtime.marketOrders];
    saveAdminRuntimeConfig({ marketOrders: nextOrders });
    return nextOrder;
  }
}

export async function saveWalkOrderRecord(payload: Partial<AdminWalkOrder> & { userId?: string | null; petId?: string | null }, orderId?: string) {
  try {
    const existing = await findWalkOrder(orderId, payload.orderNo);
    const user = await resolveUserByIdentity({
      userId: payload.userId || existing?.user_id || null,
      email: payload.userEmail || decodeMetaText(existing?.note).meta.userEmail as string | undefined,
      username: payload.userName || decodeMetaText(existing?.note).meta.userName as string | undefined,
    });
    const pet = await resolvePetByIdentity({
      petId: payload.petId || existing?.pet_id || null,
      petName: payload.petName || decodeMetaText(existing?.note).meta.petName as string | undefined,
      userId: user?.id || existing?.user_id || null,
    });

    const noteMeta = {
      userName: payload.userName || user?.username,
      userEmail: payload.userEmail || user?.email,
      petName: payload.petName || pet?.name,
    };

    const nextRecord = {
      order_no: payload.orderNo || existing?.order_no || `PUPY-WK-${Date.now()}`,
      user_id: user?.id || null,
      pet_id: pet?.id || null,
      walker_name: payload.walkerName || existing?.walker_name || '待分配遛遛师',
      city: payload.city || existing?.city || user?.resident_city || null,
      service_zone: payload.serviceZone || existing?.service_zone || null,
      status: payload.status || existing?.status || '待确认',
      review_status: payload.reviewStatus || existing?.review_status || '待审核',
      scheduled_at: payload.scheduledAt || existing?.scheduled_at || new Date().toISOString(),
      duration_minutes: Math.max(30, toNumber(payload.durationMinutes, toNumber(existing?.duration_minutes, 60))),
      price: toNumber(payload.price, toNumber(existing?.price)),
      note: encodeMetaText(payload.note ?? decodeMetaText(existing?.note).text ?? '', noteMeta),
    };

    const mutation = existing
      ? supabaseAdmin.from('walk_orders').update(nextRecord).eq('id', existing.id).select('*').single()
      : supabaseAdmin.from('walk_orders').insert(nextRecord).select('*').single();
    const { data, error } = await mutation;
    if (error || !data) throw error || new Error('保存帮忙溜溜订单失败。');

    const saved = await listWalkOrders();
    return saved.find((item) => item.id === (data as WalkOrderRow).id) || null;
  } catch (error) {
    if (!isMissingOperationsTableError(error)) throw error;
    const runtime = getAdminRuntimeConfig();
    const existing = runtime.walkOrders.find((item) => item.id === orderId || item.orderNo === payload.orderNo || item.id === payload.id);
    const nextOrder: AdminWalkOrder = {
      id: existing?.id || payload.id || randomUUID(),
      orderNo: payload.orderNo || existing?.orderNo || `PUPY-WK-${Date.now()}`,
      userName: payload.userName || existing?.userName || '未命名用户',
      userEmail: payload.userEmail || existing?.userEmail || '',
      petName: payload.petName || existing?.petName || '未命名宠物',
      walkerName: payload.walkerName || existing?.walkerName || '待分配遛遛师',
      city: payload.city || existing?.city || '未填写城市',
      serviceZone: payload.serviceZone || existing?.serviceZone || '待分配服务范围',
      status: payload.status || existing?.status || '待确认',
      reviewStatus: payload.reviewStatus || existing?.reviewStatus || '待审核',
      scheduledAt: payload.scheduledAt || existing?.scheduledAt || new Date().toISOString(),
      durationMinutes: Math.max(30, toNumber(payload.durationMinutes, existing?.durationMinutes || 60)),
      price: toNumber(payload.price, existing?.price || 0),
      note: payload.note ?? existing?.note ?? '',
      createdAt: existing?.createdAt || payload.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const nextOrders = existing
      ? runtime.walkOrders.map((item) => (item.id === existing.id ? nextOrder : item))
      : [nextOrder, ...runtime.walkOrders];
    saveAdminRuntimeConfig({ walkOrders: nextOrders });
    return nextOrder;
  }
}

export async function saveCareBookingRecord(payload: Partial<AdminCareBooking> & { userId?: string | null; petId?: string | null }, bookingId?: string) {
  try {
    const existing = await findCareBooking(bookingId, payload.bookingNo);
    const user = await resolveUserByIdentity({
      userId: payload.userId || existing?.user_id || null,
      email: payload.userEmail || decodeMetaText(existing?.note).meta.userEmail as string | undefined,
      username: payload.userName || decodeMetaText(existing?.note).meta.userName as string | undefined,
    });
    const pet = await resolvePetByIdentity({
      petId: payload.petId || existing?.pet_id || null,
      petName: payload.petName || decodeMetaText(existing?.note).meta.petName as string | undefined,
      userId: user?.id || existing?.user_id || null,
    });

    const noteMeta = {
      userName: payload.userName || user?.username,
      userEmail: payload.userEmail || user?.email,
      petName: payload.petName || pet?.name,
    };

    const nextRecord = {
      booking_no: payload.bookingNo || existing?.booking_no || `PUPY-CR-${Date.now()}`,
      user_id: user?.id || null,
      pet_id: pet?.id || null,
      merchant_name: payload.merchantName || existing?.merchant_name || '未命名商家',
      city: payload.city || existing?.city || user?.resident_city || null,
      service_name: payload.serviceName || existing?.service_name || '护理服务',
      status: payload.status || existing?.status || '待确认',
      review_status: payload.reviewStatus || existing?.review_status || '待审核',
      scheduled_at: payload.scheduledAt || existing?.scheduled_at || new Date().toISOString(),
      price: toNumber(payload.price, toNumber(existing?.price)),
      note: encodeMetaText(payload.note ?? decodeMetaText(existing?.note).text ?? '', noteMeta),
    };

    const mutation = existing
      ? supabaseAdmin.from('care_bookings').update(nextRecord).eq('id', existing.id).select('*').single()
      : supabaseAdmin.from('care_bookings').insert(nextRecord).select('*').single();
    const { data, error } = await mutation;
    if (error || !data) throw error || new Error('保存护理预约失败。');

    const saved = await listCareBookings();
    return saved.find((item) => item.id === (data as CareBookingRow).id) || null;
  } catch (error) {
    if (!isMissingOperationsTableError(error)) throw error;
    const runtime = getAdminRuntimeConfig();
    const existing = runtime.careBookings.find((item) => item.id === bookingId || item.bookingNo === payload.bookingNo || item.id === payload.id);
    const nextBooking: AdminCareBooking = {
      id: existing?.id || payload.id || randomUUID(),
      bookingNo: payload.bookingNo || existing?.bookingNo || `PUPY-CR-${Date.now()}`,
      userName: payload.userName || existing?.userName || '未命名用户',
      userEmail: payload.userEmail || existing?.userEmail || '',
      petName: payload.petName || existing?.petName || '未命名宠物',
      merchantName: payload.merchantName || existing?.merchantName || '未命名商家',
      city: payload.city || existing?.city || '未填写城市',
      serviceName: payload.serviceName || existing?.serviceName || '护理服务',
      status: payload.status || existing?.status || '待确认',
      reviewStatus: payload.reviewStatus || existing?.reviewStatus || '待审核',
      scheduledAt: payload.scheduledAt || existing?.scheduledAt || new Date().toISOString(),
      price: toNumber(payload.price, existing?.price || 0),
      note: payload.note ?? existing?.note ?? '',
      createdAt: existing?.createdAt || payload.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const nextBookings = existing
      ? runtime.careBookings.map((item) => (item.id === existing.id ? nextBooking : item))
      : [nextBooking, ...runtime.careBookings];
    saveAdminRuntimeConfig({ careBookings: nextBookings });
    return nextBooking;
  }
}

export async function savePetLoveRecordRecord(
  payload: Partial<AdminPetLoveRecord> & {
    ownerAId?: string | null;
    ownerBId?: string | null;
    petAId?: string | null;
    petBId?: string | null;
  },
  recordId?: string,
) {
  try {
    const { data: existingData, error: existingError } = recordId
      ? await supabaseAdmin.from('pet_love_records').select('*').eq('id', recordId).maybeSingle()
      : await supabaseAdmin
          .from('pet_love_records')
          .select('*')
          .limit(200);
    if (existingError) throw existingError;

    const existingRows = Array.isArray(existingData) ? (existingData as PetLoveRecordRow[]) : existingData ? [existingData as PetLoveRecordRow] : [];
    const firstExisting = existingRows[0] || null;
    const parsedExisting = decodeMetaText(firstExisting?.note);

    const ownerA = await resolveUserByIdentity({
      userId: payload.ownerAId || firstExisting?.owner_a_id || null,
      username: payload.ownerAName || parsedExisting.meta.ownerAName as string | undefined,
    });
    const ownerB = await resolveUserByIdentity({
      userId: payload.ownerBId || firstExisting?.owner_b_id || null,
      username: payload.ownerBName || parsedExisting.meta.ownerBName as string | undefined,
    });
    const petA = await resolvePetByIdentity({
      petId: payload.petAId || firstExisting?.pet_a_id || null,
      petName: payload.petAName || parsedExisting.meta.petAName as string | undefined,
      userId: ownerA?.id || firstExisting?.owner_a_id || null,
    });
    const petB = await resolvePetByIdentity({
      petId: payload.petBId || firstExisting?.pet_b_id || null,
      petName: payload.petBName || parsedExisting.meta.petBName as string | undefined,
      userId: ownerB?.id || firstExisting?.owner_b_id || null,
    });

    let existing: PetLoveRecordRow | null = firstExisting;
    if (!existing && ownerA?.id && ownerB?.id && petA?.id && petB?.id) {
      const { data, error } = await supabaseAdmin
        .from('pet_love_records')
        .select('*')
        .or(`and(owner_a_id.eq.${ownerA.id},owner_b_id.eq.${ownerB.id},pet_a_id.eq.${petA.id},pet_b_id.eq.${petB.id}),and(owner_a_id.eq.${ownerB.id},owner_b_id.eq.${ownerA.id},pet_a_id.eq.${petB.id},pet_b_id.eq.${petA.id})`)
        .limit(1);
      if (error) throw error;
      existing = ((data || [])[0] as PetLoveRecordRow | undefined) || null;
    }

    const noteMeta = {
      ownerAName: payload.ownerAName || ownerA?.username,
      ownerBName: payload.ownerBName || ownerB?.username,
      petAName: payload.petAName || petA?.name,
      petBName: payload.petBName || petB?.name,
    };

    const nextRecord = {
      owner_a_id: ownerA?.id || null,
      owner_b_id: ownerB?.id || null,
      pet_a_id: petA?.id || null,
      pet_b_id: petB?.id || null,
      city: payload.city || existing?.city || ownerA?.resident_city || ownerB?.resident_city || null,
      status: payload.status || existing?.status || '待匹配',
      review_status: payload.reviewStatus || existing?.review_status || '待审核',
      romance_stage: payload.romanceStage || existing?.romance_stage || '资料互看中',
      compatibility_score: toNumber(payload.compatibilityScore, toNumber(existing?.compatibility_score, 0.75)),
      note: encodeMetaText(payload.note ?? decodeMetaText(existing?.note).text ?? '', noteMeta),
    };

    const mutation = existing
      ? supabaseAdmin.from('pet_love_records').update(nextRecord).eq('id', existing.id).select('*').single()
      : supabaseAdmin.from('pet_love_records').insert(nextRecord).select('*').single();
    const { data, error } = await mutation;
    if (error || !data) throw error || new Error('保存宠物恋爱记录失败。');

    const saved = await listPetLoveRecords();
    return saved.find((item) => item.id === (data as PetLoveRecordRow).id) || null;
  } catch (error) {
    if (!isMissingOperationsTableError(error)) throw error;
    const runtime = getAdminRuntimeConfig();
    const existing = runtime.petLoveRecords.find((item) => item.id === recordId || item.id === payload.id);
    const nextRecord: AdminPetLoveRecord = {
      id: existing?.id || payload.id || randomUUID(),
      petAName: payload.petAName || existing?.petAName || '宠物 A',
      petBName: payload.petBName || existing?.petBName || '宠物 B',
      ownerAName: payload.ownerAName || existing?.ownerAName || '主人 A',
      ownerBName: payload.ownerBName || existing?.ownerBName || '主人 B',
      city: payload.city || existing?.city || '未填写城市',
      status: payload.status || existing?.status || '待匹配',
      reviewStatus: payload.reviewStatus || existing?.reviewStatus || '待审核',
      romanceStage: payload.romanceStage || existing?.romanceStage || '资料互看中',
      compatibilityScore: toNumber(payload.compatibilityScore, existing?.compatibilityScore || 0.75),
      note: payload.note ?? existing?.note ?? '',
      createdAt: existing?.createdAt || payload.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const nextRecords = existing
      ? runtime.petLoveRecords.map((item) => (item.id === existing.id ? nextRecord : item))
      : [nextRecord, ...runtime.petLoveRecords];
    saveAdminRuntimeConfig({ petLoveRecords: nextRecords });
    return nextRecord;
  }
}

export async function saveChatSessionRecord(
  payload: Partial<AdminChatSession> & {
    userAId?: string | null;
    userBId?: string | null;
    petAId?: string | null;
    petBId?: string | null;
  },
  sessionId?: string,
) {
  try {
    const existing = await findChatSession(sessionId, payload.sessionNo);
    const parsedExisting = decodeMetaText(existing?.latest_snippet);
    const participants = uniqueStrings(
      Array.isArray(payload.participants) && payload.participants.length
        ? payload.participants
        : Array.isArray(parsedExisting.meta.participants)
          ? (parsedExisting.meta.participants as unknown[])
          : [],
    );
    const relatedPets = uniqueStrings(
      Array.isArray(payload.relatedPets) && payload.relatedPets.length
        ? payload.relatedPets
        : Array.isArray(parsedExisting.meta.relatedPets)
          ? (parsedExisting.meta.relatedPets as unknown[])
          : [],
    );

    const userA = await resolveUserByIdentity({
      userId: payload.userAId || existing?.user_a_id || null,
      username: participants[0] || undefined,
    });
    const userB = await resolveUserByIdentity({
      userId: payload.userBId || existing?.user_b_id || null,
      username: participants[1] || undefined,
    });
    const petA = await resolvePetByIdentity({
      petId: payload.petAId || existing?.pet_a_id || null,
      petName: relatedPets[0] || undefined,
      userId: userA?.id || null,
    });
    const petB = await resolvePetByIdentity({
      petId: payload.petBId || existing?.pet_b_id || null,
      petName: relatedPets[1] || undefined,
      userId: userB?.id || null,
    });

    const visibleSnippet = payload.latestSnippet ?? parsedExisting.text ?? '';
    const nextRecord = {
      session_no: payload.sessionNo || existing?.session_no || `PUPY-${payload.type === 'pet' ? 'PC' : 'CH'}-${Date.now()}`,
      type: payload.type === 'pet' ? 'pet' : existing?.type === 'pet' ? 'pet' : 'owner',
      title: payload.title || existing?.title || '未命名会话',
      city: payload.city || existing?.city || userA?.resident_city || userB?.resident_city || null,
      status: payload.status || existing?.status || '待处理',
      user_a_id: userA?.id || null,
      user_b_id: userB?.id || null,
      pet_a_id: petA?.id || null,
      pet_b_id: petB?.id || null,
      unread_count: Math.max(0, toNumber(payload.unreadCount, toNumber(existing?.unread_count, 0))),
      latest_snippet: encodeMetaText(visibleSnippet, { participants, relatedPets }),
    };

    const mutation = existing
      ? supabaseAdmin.from('chat_sessions').update(nextRecord).eq('id', existing.id).select('*').single()
      : supabaseAdmin.from('chat_sessions').insert(nextRecord).select('*').single();
    const { data, error } = await mutation;
    if (error || !data) throw error || new Error('保存聊天会话失败。');

    const savedId = (data as ChatSessionRow).id;
    if (Array.isArray(payload.messages)) {
      const { error: deleteError } = await supabaseAdmin.from('chat_session_messages').delete().eq('session_id', savedId);
      if (deleteError) throw deleteError;
      if (payload.messages.length) {
        const { error: insertError } = await supabaseAdmin.from('chat_session_messages').insert(
          payload.messages.map((message) => ({
            session_id: savedId,
            sender_label: message.senderName,
            sender_role: message.role,
            content: message.content,
            moderation_status: message.moderationStatus || '正常',
            created_at: message.createdAt || new Date().toISOString(),
          })),
        );
        if (insertError) throw insertError;
      }
    }

    return getChatSessionById(savedId);
  } catch (error) {
    if (!isMissingOperationsTableError(error)) throw error;
    const runtime = getAdminRuntimeConfig();
    const existing = runtime.chatSessions.find((item) => item.id === sessionId || item.sessionNo === payload.sessionNo || item.id === payload.id);
    const nextSession: AdminChatSession = {
      id: existing?.id || payload.id || randomUUID(),
      sessionNo: payload.sessionNo || existing?.sessionNo || `PUPY-${payload.type === 'pet' ? 'PC' : 'CH'}-${Date.now()}`,
      type: payload.type === 'pet' ? 'pet' : existing?.type || 'owner',
      title: payload.title || existing?.title || '未命名会话',
      participants: Array.isArray(payload.participants) && payload.participants.length ? payload.participants : existing?.participants || [],
      relatedPets: Array.isArray(payload.relatedPets) && payload.relatedPets.length ? payload.relatedPets : existing?.relatedPets || [],
      city: payload.city || existing?.city || '未填写城市',
      status: payload.status || existing?.status || '待处理',
      unreadCount: Math.max(0, toNumber(payload.unreadCount, existing?.unreadCount || 0)),
      latestSnippet: payload.latestSnippet || existing?.latestSnippet || '',
      messages: Array.isArray(payload.messages) ? payload.messages : existing?.messages || [],
      createdAt: existing?.createdAt || payload.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const nextSessions = existing
      ? runtime.chatSessions.map((item) => (item.id === existing.id ? nextSession : item))
      : [nextSession, ...runtime.chatSessions];
    saveAdminRuntimeConfig({ chatSessions: nextSessions });
    return nextSession;
  }
}

export async function appendChatSessionMessage(
  sessionId: string,
  payload: { senderName: string; role?: 'owner' | 'pet' | 'system'; content: string; moderationStatus?: string },
) {
  try {
    const existing = await findChatSession(sessionId);
    if (!existing) {
      throw new Error('聊天会话不存在。');
    }

    const { error: messageError } = await supabaseAdmin.from('chat_session_messages').insert({
      session_id: sessionId,
      sender_label: payload.senderName,
      sender_role: payload.role || 'owner',
      content: payload.content,
      moderation_status: payload.moderationStatus || '正常',
    });
    if (messageError) throw messageError;

    const parsedSnippet = decodeMetaText(existing.latest_snippet);
    const { error: sessionError } = await supabaseAdmin
      .from('chat_sessions')
      .update({
        latest_snippet: encodeMetaText(payload.content, parsedSnippet.meta),
        unread_count: 0,
        status: existing.status || '热聊中',
      })
      .eq('id', sessionId);
    if (sessionError) throw sessionError;

    return getChatSessionById(sessionId);
  } catch (error) {
    if (!isMissingOperationsTableError(error)) throw error;
    const runtime = getAdminRuntimeConfig();
    const existing = runtime.chatSessions.find((item) => item.id === sessionId);
    if (!existing) throw new Error('聊天会话不存在。');
    const nextMessage: AdminChatMessage = {
      id: randomUUID(),
      senderName: payload.senderName,
      role: payload.role || 'owner',
      content: payload.content,
      createdAt: new Date().toISOString(),
      moderationStatus: payload.moderationStatus || '正常',
    };
    const nextSession: AdminChatSession = {
      ...existing,
      latestSnippet: payload.content,
      unreadCount: 0,
      messages: [...existing.messages, nextMessage],
      updatedAt: new Date().toISOString(),
    };
    saveAdminRuntimeConfig({ chatSessions: runtime.chatSessions.map((item) => (item.id === existing.id ? nextSession : item)) });
    return nextSession;
  }
}

export async function ensureOwnerChatSessionRecord(options: {
  viewerUserId: string;
  viewerUsername: string;
  viewerPetName: string;
  viewerPetId?: string | null;
  viewerCity?: string | null;
  counterpartName?: string | null;
  counterpartCity?: string | null;
  counterpartPetName?: string | null;
}) {
  const counterpartName = String(options.counterpartName || '').trim() || '新朋友';
  const sessions = await listChatSessions({ type: 'owner', userId: options.viewerUserId });
  const existing = sessions.find((session) =>
    session.participants.map(normalizeText).includes(normalizeText(options.viewerUsername)) &&
    session.participants.map(normalizeText).includes(normalizeText(counterpartName)),
  );

  if (existing) {
    return existing;
  }

  const counterpart = await resolveUserByIdentity({ username: counterpartName });
  const counterpartPet = await resolvePetByIdentity({
    petName: options.counterpartPetName || null,
    userId: counterpart?.id || null,
  });

  return saveChatSessionRecord({
    type: 'owner',
    title: `${options.viewerUsername} × ${counterpartName}`,
    participants: uniqueStrings([options.viewerUsername, counterpartName]),
    relatedPets: uniqueStrings([options.viewerPetName, options.counterpartPetName]),
    city: String(options.counterpartCity || options.viewerCity || '').trim(),
    status: '热聊中',
    unreadCount: 0,
    latestSnippet: '新的主人聊天已经接入。',
    userAId: options.viewerUserId,
    userBId: counterpart?.id || null,
    petAId: options.viewerPetId || null,
    petBId: counterpartPet?.id || null,
    messages: [],
  });
}

export async function syncPetLoveRecordFromBreeding(options: {
  senderId: string;
  receiverId: string;
  senderPetId: string;
  receiverPetId: string;
  notes?: string;
  breedingStatus?: string;
}) {
  const [sender, receiver, senderPet, receiverPet] = await Promise.all([
    resolveUserByIdentity({ userId: options.senderId }),
    resolveUserByIdentity({ userId: options.receiverId }),
    resolvePetByIdentity({ petId: options.senderPetId }),
    resolvePetByIdentity({ petId: options.receiverPetId }),
  ]);

  const statusMap: Record<string, { status: string; reviewStatus: string; romanceStage: string }> = {
    pending: { status: '待沟通', reviewStatus: '待审核', romanceStage: '已发起繁育申请' },
    accepted: { status: '已互选', reviewStatus: '已通过', romanceStage: '线下见面筹备' },
    rejected: { status: '已婉拒', reviewStatus: '已归档', romanceStage: '申请未通过' },
    completed: { status: '配对成功', reviewStatus: '已通过', romanceStage: '已完成繁育计划' },
  };

  const next = statusMap[options.breedingStatus || 'pending'] || statusMap.pending;
  return savePetLoveRecordRecord({
    ownerAId: sender?.id || null,
    ownerBId: receiver?.id || null,
    petAId: senderPet?.id || null,
    petBId: receiverPet?.id || null,
    ownerAName: sender?.username || '',
    ownerBName: receiver?.username || '',
    petAName: senderPet?.name || '',
    petBName: receiverPet?.name || '',
    city: sender?.resident_city || receiver?.resident_city || '',
    status: next.status,
    reviewStatus: next.reviewStatus,
    romanceStage: next.romanceStage,
    compatibilityScore: 0.88,
    note: String(options.notes || '').trim(),
  });
}

export async function countOperationTables() {
  try {
    const tables = ['market_orders', 'walk_orders', 'care_bookings', 'pet_love_records', 'chat_sessions'] as const;
    const result = await Promise.all(
      tables.map(async (table) => {
        const { count, error } = await supabaseAdmin.from(table).select('id', { count: 'exact', head: true });
        if (error) throw error;
        return [table, count || 0] as const;
      }),
    );
    return Object.fromEntries(result) as Record<(typeof tables)[number], number>;
  } catch (error) {
    if (!isMissingOperationsTableError(error)) throw error;
    const runtime = getAdminRuntimeConfig();
    return {
      market_orders: runtime.marketOrders.length,
      walk_orders: runtime.walkOrders.length,
      care_bookings: runtime.careBookings.length,
      pet_love_records: runtime.petLoveRecords.length,
      chat_sessions: runtime.chatSessions.length,
    };
  }
}

export async function getOperationHighlights() {
  const [marketOrders, walkOrders, careBookings, petLoveRecords, chatSessions] = await Promise.all([
    listMarketOrders(),
    listWalkOrders(),
    listCareBookings(),
    listPetLoveRecords(),
    listChatSessions(),
  ]);

  return {
    stats: {
      marketOrders: marketOrders.length,
      walkOrders: walkOrders.length,
      careBookings: careBookings.length,
      petLoveRecords: petLoveRecords.length,
      chatSessions: chatSessions.length,
    },
    latestMarketOrders: marketOrders.slice(0, 4),
    latestWalkOrders: walkOrders.slice(0, 4),
    latestCareBookings: careBookings.slice(0, 4),
    latestPetLoveRecords: petLoveRecords.slice(0, 4),
    latestChatSessions: chatSessions.slice(0, 4),
  };
}

export async function getDiarySummary(userId: string) {
  const [countRes, likesRes, commentsRes, recentRes] = await Promise.all([
    supabaseAdmin.from('diaries').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabaseAdmin.from('diaries').select('likes_count').eq('user_id', userId).limit(200),
    supabaseAdmin.from('diaries').select('comments_count').eq('user_id', userId).limit(200),
    supabaseAdmin.from('diaries').select('id, title, created_at, is_public, mood').eq('user_id', userId).order('created_at', { ascending: false }).limit(1),
  ]);

  if (countRes.error || likesRes.error || commentsRes.error || recentRes.error) {
    throw countRes.error || likesRes.error || commentsRes.error || recentRes.error;
  }

  const totalLikes = (likesRes.data || []).reduce((sum, row: any) => sum + toNumber(row.likes_count), 0);
  const totalComments = (commentsRes.data || []).reduce((sum, row: any) => sum + toNumber(row.comments_count), 0);

  return {
    total: countRes.count || 0,
    totalLikes,
    totalComments,
    latest: ((recentRes.data || [])[0] as { id: string; title?: string; created_at?: string; is_public?: boolean; mood?: string } | undefined) || null,
  };
}

export async function resolveViewerPetContext(userId: string) {
  const pets = await resolveViewerPets(userId);
  return {
    petIds: pets.map((pet) => pet.id),
    petNames: pets.map((pet) => pet.name),
    primaryPetId: pets[0]?.id || null,
    primaryPetName: pets[0]?.name || 'Pupy',
  };
}

export { buildPagination, paginateRows };

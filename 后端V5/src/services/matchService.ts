import { supabase } from '../config/supabase.js';
import { Match, ApiResponse, PaginatedResponse } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export class MatchService {
  // 计算兼容性分数
  static calculateCompatibilityScore(
    petA: any,
    petB: any,
    ownerA: any,
    ownerB: any,
  ): number {
    let score = 0;

    // 宠物类型相同 +30
    if (petA.type === petB.type) score += 30;

    // 性格互补 +25
    if (
      (petA.personality === 'E系浓宠' && petB.personality === 'I系淡宠') ||
      (petA.personality === 'I系淡宠' && petB.personality === 'E系浓宠')
    ) {
      score += 25;
    } else if (petA.personality === petB.personality) {
      score += 15;
    }

    // 地理位置相近 +20
    if (ownerA.resident_city === ownerB.resident_city) {
      score += 20;
    } else if (
      ownerA.frequent_cities?.includes(ownerB.resident_city) ||
      ownerB.frequent_cities?.includes(ownerA.resident_city)
    ) {
      score += 10;
    }

    // MBTI 兼容性 +15
    const compatibleMbtis: { [key: string]: string[] } = {
      ENFP: ['INTJ', 'INFJ'],
      ENTP: ['INTJ', 'INTP'],
      ENFJ: ['INFP', 'ISFP'],
      ENTJ: ['INTP', 'ISFP'],
      INFP: ['ENFJ', 'ENTJ'],
      INFJ: ['ENFP', 'ENTP'],
      INTP: ['ENTP', 'ENTJ'],
      ISTJ: ['ESFJ', 'ISFJ'],
      ISFJ: ['ISTJ', 'ESFJ'],
      ESFJ: ['ISTJ', 'ISFJ'],
      ESFP: ['ISFP', 'ISTP'],
      ISFP: ['ESFP', 'ENFJ'],
      ISTP: ['ESFP', 'ESTP'],
      ESTP: ['ISTP', 'ESFP'],
    };

    if (
      compatibleMbtis[ownerA.mbti]?.includes(ownerB.mbti) ||
      compatibleMbtis[ownerB.mbti]?.includes(ownerA.mbti)
    ) {
      score += 15;
    } else if (ownerA.mbti === ownerB.mbti) {
      score += 5;
    }

    // 兴趣爱好相交 +10
    const commonHobbies = ownerA.hobbies?.filter((h: string) =>
      ownerB.hobbies?.includes(h),
    ).length || 0;
    if (commonHobbies > 0) {
      score += Math.min(10, commonHobbies * 3);
    }

    return Math.min(100, score);
  }

  static async createMatch(
    userAId: string,
    userBId: string,
    petAId: string,
    petBId: string,
  ): Promise<ApiResponse<Match>> {
    try {
      // 检查是否已存在匹配
      const { data: existingMatch } = await supabase
        .from('matches')
        .select('*')
        .or(
          `and(user_a_id.eq.${userAId},user_b_id.eq.${userBId}),and(user_a_id.eq.${userBId},user_b_id.eq.${userAId})`,
        )
        .limit(1);

      if (existingMatch && existingMatch.length > 0) {
        return {
          success: false,
          error: '已经存在匹配记录',
          code: 400,
        };
      }

      // 获取宠物和用户信息以计算兼容性
      const [petA, petB, userA, userB] = await Promise.all([
        supabase.from('pets').select('*').eq('id', petAId).limit(1),
        supabase.from('pets').select('*').eq('id', petBId).limit(1),
        supabase.from('users').select('*').eq('id', userAId).limit(1),
        supabase.from('users').select('*').eq('id', userBId).limit(1),
      ]);

      if (
        !petA.data?.length ||
        !petB.data?.length ||
        !userA.data?.length ||
        !userB.data?.length
      ) {
        return {
          success: false,
          error: '宠物或用户不存在',
          code: 404,
        };
      }

      const compatibilityScore = this.calculateCompatibilityScore(
        petA.data[0],
        petB.data[0],
        userA.data[0],
        userB.data[0],
      );

      const matchId = uuidv4();
      const { error } = await supabase
        .from('matches')
        .insert({
          id: matchId,
          user_a_id: userAId,
          user_b_id: userBId,
          pet_a_id: petAId,
          pet_b_id: petBId,
          compatibility_score: compatibilityScore,
          status: 'pending',
        });

      if (error) throw error;

      const match = await this.getMatchById(matchId);
      return {
        success: true,
        data: match as Match,
        message: '匹配创建成功',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '创建匹配失败',
        code: 500,
      };
    }
  }

  static async getMatchById(matchId: string): Promise<Match | null> {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .limit(1);

      if (error || !data || data.length === 0) {
        return null;
      }

      return data[0];
    } catch {
      return null;
    }
  }

  static async updateMatchStatus(
    matchId: string,
    status: 'matched' | 'rejected',
  ): Promise<ApiResponse<Match>> {
    try {
      const { data, error } = await supabase
        .from('matches')
        .update({ status })
        .eq('id', matchId)
        .select('*')
        .limit(1);

      if (error || !data || data.length === 0) {
        throw error || new Error('更新失败');
      }

      return {
        success: true,
        data: data[0],
        message: '更新成功',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '更新失败',
        code: 500,
      };
    }
  }

  static async getMatchesForUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Match & { pet_a: any; pet_b: any; user_a: any; user_b: any }>> {
    try {
      const offset = (page - 1) * limit;

      const [matchesRes, countRes] = await Promise.all([
        supabase
          .from('matches')
          .select(
            `*,
            pet_a:pets!matches_pet_a_id_fkey(*),
            pet_b:pets!matches_pet_b_id_fkey(*),
            user_a:users!matches_user_a_id_fkey(*),
            user_b:users!matches_user_b_id_fkey(*)`,
          )
          .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1),
        supabase
          .from('matches')
          .select('id', { count: 'exact', head: true })
          .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`),
      ]);

      const total = countRes.count || 0;

      return {
        success: true,
        data: matchesRes.data || [],
        pagination: {
          total,
          page,
          limit,
          total_pages: Math.ceil(total / limit),
        },
        message: '获取成功',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        pagination: { total: 0, page: 1, limit, total_pages: 0 },
        error: error.message || '获取失败',
      };
    }
  }
}

export default MatchService;

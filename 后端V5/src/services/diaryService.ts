import { supabase } from '../config/supabase.js';
import { Diary, Comment, Like, ApiResponse, PaginatedResponse } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export class DiaryService {
  static async createDiary(
    userId: string,
    petId: string,
    data: {
      title: string;
      content: string;
      images?: string[];
      mood?: string;
      tags?: string[];
      is_public?: boolean;
    },
  ): Promise<ApiResponse<Diary>> {
    try {
      const diaryId = uuidv4();
      const { error } = await supabase
        .from('diaries')
        .insert({
          id: diaryId,
          user_id: userId,
          pet_id: petId,
          ...data,
        });

      if (error) throw error;

      const diary = await this.getDiaryById(diaryId);
      return {
        success: true,
        data: diary as Diary,
        message: '日记创建成功',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '创建失败',
        code: 500,
      };
    }
  }

  static async getDiaryById(diaryId: string): Promise<Diary | null> {
    try {
      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .eq('id', diaryId)
        .limit(1);

      if (error || !data || data.length === 0) {
        return null;
      }

      return data[0];
    } catch {
      return null;
    }
  }

  static async getUserDiaries(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Diary & { pet: any; like_count: number; comment_count: number }>> {
    try {
      const offset = (page - 1) * limit;

      const [diariesRes, countRes] = await Promise.all([
        supabase
          .from('diaries')
          .select('*, pet:pets(*)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1),
        supabase
          .from('diaries')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
      ]);

      const total = countRes.count || 0;

      return {
        success: true,
        data: diariesRes.data || [],
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

  static async getPublicDiaries(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Diary & { user: any; pet: any }>> {
    try {
      const offset = (page - 1) * limit;

      const [diariesRes, countRes] = await Promise.all([
        supabase
          .from('diaries')
          .select('*, user:users(*), pet:pets(*)')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1),
        supabase
          .from('diaries')
          .select('id', { count: 'exact', head: true })
          .eq('is_public', true),
      ]);

      const total = countRes.count || 0;

      return {
        success: true,
        data: diariesRes.data || [],
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

  static async updateDiary(diaryId: string, updates: Partial<Diary>): Promise<ApiResponse<Diary>> {
    try {
      const { data, error } = await supabase
        .from('diaries')
        .update(updates)
        .eq('id', diaryId)
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

  static async deleteDiary(diaryId: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('diaries')
        .delete()
        .eq('id', diaryId);

      if (error) throw error;

      return {
        success: true,
        data: null,
        message: '删除成功',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '删除失败',
        code: 500,
      };
    }
  }

  // 添加赞
  static async likeDiary(diaryId: string, userId: string): Promise<ApiResponse<null>> {
    try {
      // 检查是否已赞
      const { data: existing } = await supabase
        .from('likes')
        .select('id')
        .eq('diary_id', diaryId)
        .eq('user_id', userId)
        .limit(1);

      if (existing && existing.length > 0) {
        return {
          success: false,
          error: '已经赞过了',
          code: 400,
        };
      }

      await supabase
        .from('likes')
        .insert({ id: uuidv4(), diary_id: diaryId, user_id: userId });

      // 增加日记的赞数
      await supabase
        .from('diaries')
        .update({ likes_count: supabase.from('likes').select('id', { count: 'exact' }) })
        .eq('id', diaryId);

      return {
        success: true,
        data: null,
        message: '赞成功',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '操作失败',
        code: 500,
      };
    }
  }

  // 取消赞
  static async unlikeDiary(diaryId: string, userId: string): Promise<ApiResponse<null>> {
    try {
      await supabase
        .from('likes')
        .delete()
        .eq('diary_id', diaryId)
        .eq('user_id', userId);

      return {
        success: true,
        data: null,
        message: '取消赞成功',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '操作失败',
        code: 500,
      };
    }
  }

  // 添加评论
  static async addComment(
    diaryId: string,
    userId: string,
    content: string,
  ): Promise<ApiResponse<Comment>> {
    try {
      const commentId = uuidv4();
      await supabase
        .from('comments')
        .insert({
          id: commentId,
          diary_id: diaryId,
          user_id: userId,
          content,
        });

      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('id', commentId)
        .limit(1);

      return {
        success: true,
        data: data?.[0] as Comment,
        message: '评论添加成功',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '添加失败',
        code: 500,
      };
    }
  }

  // 获取评论列表
  static async getComments(
    diaryId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Comment & { user: any }>> {
    try {
      const offset = (page - 1) * limit;

      const [commentsRes, countRes] = await Promise.all([
        supabase
          .from('comments')
          .select('*, user:users(*)')
          .eq('diary_id', diaryId)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1),
        supabase
          .from('comments')
          .select('id', { count: 'exact', head: true })
          .eq('diary_id', diaryId),
      ]);

      const total = countRes.count || 0;

      return {
        success: true,
        data: commentsRes.data || [],
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

export default DiaryService;

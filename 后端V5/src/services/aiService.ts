import { supabase } from '../config/supabase.js';
import { PrayerRecord, Notification, ApiResponse } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export class AiService {
  // 创建祈祷记录
  static async createPrayerRecord(
    userId: string,
    petId: string,
    prayerText: string,
    aiResponse: string,
    sentiment: string = 'neutral',
  ): Promise<ApiResponse<PrayerRecord>> {
    try {
      const recordId = uuidv4();
      const { error } = await supabase
        .from('prayer_records')
        .insert({
          id: recordId,
          user_id: userId,
          pet_id: petId,
          prayer_text: prayerText,
          ai_response: aiResponse,
          sentiment,
        });

      if (error) throw error;

      const { data } = await supabase
        .from('prayer_records')
        .select('*')
        .eq('id', recordId)
        .limit(1);

      return {
        success: true,
        data: data?.[0] as PrayerRecord,
        message: '祈祷记录已保存',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '保存失败',
        code: 500,
      };
    }
  }

  // 获取用户的祈祷记录
  static async getUserPrayerRecords(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<ApiResponse<(PrayerRecord & { pet: any })[]>> {
    try {
      const offset = (page - 1) * limit;

      const { data, error } = await supabase
        .from('prayer_records')
        .select('*, pet:pets(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        success: true,
        data: data || [],
        message: '获取成功',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '获取失败',
        code: 500,
      };
    }
  }

  // 创建通知
  static async createNotification(
    userId: string,
    message: string,
    type: 'match' | 'message' | 'breeding' | 'like' | 'system',
    relatedUserId?: string,
  ): Promise<ApiResponse<Notification>> {
    try {
      const notificationId = uuidv4();
      const { error } = await supabase
        .from('notifications')
        .insert({
          id: notificationId,
          user_id: userId,
          message,
          type,
          related_user_id: relatedUserId,
          is_read: false,
        });

      if (error) throw error;

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', notificationId)
        .limit(1);

      return {
        success: true,
        data: data?.[0] as Notification,
        message: '通知已创建',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '创建失败',
        code: 500,
      };
    }
  }

  // 获取未读通知
  static async getUnreadNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
        message: '获取成功',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '获取失败',
        code: 500,
      };
    }
  }

  // 标记通知为已读
  static async markNotificationAsRead(notificationId: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      return {
        success: true,
        data: null,
        message: '已标记为读',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '操作失败',
        code: 500,
      };
    }
  }

  // 模拟AI调用 - 实现AI祈祷功能 (Google AI, OpenAI等)
  static async generateAIResponse(
    petName: string,
    userMessage: string,
    petPersonality: string,
  ): Promise<ApiResponse<{ response: string; sentiment: string }>> {
    try {
      // 这里可以集成真实的AI API，比如Google AI, OpenAI, etc.
      // 目前返回模拟响应
      const mockResponses = [
        `${petName}: 汪汪~ 我听到了你的祈祷，你的爱是我最大的幸福。无论发生什么，让我们携手同行。`,
        `${petName}: 喵喵~ 你的关心温暖了我的心。相信自己，就像你相信我一样。`,
        `让我轻声告诉你：${userMessage}中的善意已经被世界听到了。${petName}也感受到了你的爱。`,
      ];

      const randomIndex = Math.floor(Math.random() * mockResponses.length);

      return {
        success: true,
        data: {
          response: mockResponses[randomIndex],
          sentiment: 'positive',
        },
        message: 'AI响应已生成',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '生成失败',
        code: 500,
      };
    }
  }
}

export default AiService;

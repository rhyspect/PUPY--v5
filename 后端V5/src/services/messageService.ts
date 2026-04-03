import { supabase } from '../config/supabase.js';
import { ChatRoom, Message, ApiResponse, PaginatedResponse } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export class MessageService {
  // 获取或创建聊天室
  static async getOrCreateChatRoom(
    userAId: string,
    userBId: string,
  ): Promise<ApiResponse<ChatRoom>> {
    try {
      // 检查是否存在聊天室
      const { data: existing } = await supabase
        .from('chat_rooms')
        .select('*')
        .or(
          `and(user_a_id.eq.${userAId},user_b_id.eq.${userBId}),and(user_a_id.eq.${userBId},user_b_id.eq.${userAId})`,
        )
        .limit(1);

      if (existing && existing.length > 0) {
        return {
          success: true,
          data: existing[0],
          message: '获取聊天室成功',
        };
      }

      // 创建新聊天室
      const chatRoomId = uuidv4();
      const { error } = await supabase
        .from('chat_rooms')
        .insert({
          id: chatRoomId,
          user_a_id: userAId,
          user_b_id: userBId,
        });

      if (error) throw error;

      const chatRoom = await this.getChatRoomById(chatRoomId);
      return {
        success: true,
        data: chatRoom as ChatRoom,
        message: '聊天室创建成功',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '操作失败',
        code: 500,
      };
    }
  }

  static async getChatRoomById(chatRoomId: string): Promise<ChatRoom | null> {
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('id', chatRoomId)
        .limit(1);

      if (error || !data || data.length === 0) {
        return null;
      }

      return data[0];
    } catch {
      return null;
    }
  }

  // 发送消息
  static async sendMessage(
    chatRoomId: string,
    senderId: string,
    receiverId: string,
    content: string,
  ): Promise<ApiResponse<Message>> {
    try {
      const messageId = uuidv4();
      const { error } = await supabase
        .from('messages')
        .insert({
          id: messageId,
          chat_id: chatRoomId,
          sender_id: senderId,
          receiver_id: receiverId,
          content,
        });

      if (error) throw error;

      // 更新聊天室的最后消息
      await supabase
        .from('chat_rooms')
        .update({
          last_message: content,
          last_message_time: new Date().toISOString(),
        })
        .eq('id', chatRoomId);

      const message = await this.getMessageById(messageId);
      return {
        success: true,
        data: message as Message,
        message: '消息发送成功',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '发送失败',
        code: 500,
      };
    }
  }

  static async getMessageById(messageId: string): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('id', messageId)
        .limit(1);

      if (error || !data || data.length === 0) {
        return null;
      }

      return data[0];
    } catch {
      return null;
    }
  }

  // 获取聊天记录
  static async getChatMessages(
    chatRoomId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<PaginatedResponse<Message>> {
    try {
      const offset = (page - 1) * limit;

      const [messagesRes, countRes] = await Promise.all([
        supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatRoomId)
          .order('created_at', { ascending: true })
          .range(offset, offset + limit - 1),
        supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('chat_id', chatRoomId),
      ]);

      const total = countRes.count || 0;

      return {
        success: true,
        data: messagesRes.data || [],
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

  // 标记消息为已读
  static async markMessageAsRead(messageId: string): Promise<ApiResponse<Message>> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .select('*')
        .limit(1);

      if (error || !data || data.length === 0) {
        throw error || new Error('标记失败');
      }

      return {
        success: true,
        data: data[0],
        message: '标记成功',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '标记失败',
        code: 500,
      };
    }
  }

  // 获取用户的聊天室列表
  static async getUserChatRooms(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<
    PaginatedResponse<
      ChatRoom & { other_user: any; unread_count: number; last_message: string | null }
    >
  > {
    try {
      const offset = (page - 1) * limit;

      const [chatRoomsRes, countRes] = await Promise.all([
        supabase
          .from('chat_rooms')
          .select(
            `*,
            user_a:users!chat_rooms_user_a_id_fkey(id, username, avatar_url),
            user_b:users!chat_rooms_user_b_id_fkey(id, username, avatar_url)`,
          )
          .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
          .order('updated_at', { ascending: false })
          .range(offset, offset + limit - 1),
        supabase
          .from('chat_rooms')
          .select('id', { count: 'exact', head: true })
          .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`),
      ]);

      const enrichedChatRooms = await Promise.all(
        (chatRoomsRes.data || []).map(async (room: any) => {
          const otherUser = room.user_a_id === userId ? room.user_b : room.user_a;

          // 获取未读消息数
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .eq('chat_id', room.id)
            .eq('receiver_id', userId)
            .eq('is_read', false);

          return {
            ...room,
            other_user: otherUser,
            unread_count: unreadCount || 0,
          };
        }),
      );

      const total = countRes.count || 0;

      return {
        success: true,
        data: enrichedChatRooms,
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

export default MessageService;

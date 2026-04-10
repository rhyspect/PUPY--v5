import { supabase } from '../config/supabase.js';
import { BreedingRequest, ApiResponse, PaginatedResponse } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';
import { syncPetLoveRecordFromBreeding } from './operationsStore.js';

export class BreedingService {
  static async createBreedingRequest(
    senderId: string,
    senderPetId: string,
    receiverId: string,
    receiverPetId: string,
    notes: string = '',
  ): Promise<ApiResponse<BreedingRequest>> {
    try {
      const requestId = uuidv4();
      const { error } = await supabase
        .from('breeding_requests')
        .insert({
          id: requestId,
          sender_id: senderId,
          sender_pet_id: senderPetId,
          receiver_id: receiverId,
          receiver_pet_id: receiverPetId,
          notes,
          status: 'pending',
        });

      if (error) throw error;

      await syncPetLoveRecordFromBreeding({
        senderId,
        receiverId,
        senderPetId,
        receiverPetId,
        notes,
        breedingStatus: 'pending',
      });

      const request = await this.getBreedingRequestById(requestId);
      return {
        success: true,
        data: request as BreedingRequest,
        message: '配种请求创建成功',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '创建失败',
        code: 500,
      };
    }
  }

  static async getBreedingRequestById(requestId: string): Promise<BreedingRequest | null> {
    try {
      const { data, error } = await supabase
        .from('breeding_requests')
        .select('*')
        .eq('id', requestId)
        .limit(1);

      if (error || !data || data.length === 0) {
        return null;
      }

      return data[0];
    } catch {
      return null;
    }
  }

  static async getBreedingRequestsForUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<
    PaginatedResponse<
      BreedingRequest & {
        sender: any;
        sender_pet: any;
        receiver: any;
        receiver_pet: any;
      }
    >
  > {
    try {
      const offset = (page - 1) * limit;

      const [requestsRes, countRes] = await Promise.all([
        supabase
          .from('breeding_requests')
          .select(
            `*,
            sender:users!breeding_requests_sender_id_fkey(*),
            sender_pet:pets!breeding_requests_sender_pet_id_fkey(*),
            receiver:users!breeding_requests_receiver_id_fkey(*),
            receiver_pet:pets!breeding_requests_receiver_pet_id_fkey(*)`,
          )
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1),
        supabase
          .from('breeding_requests')
          .select('id', { count: 'exact', head: true })
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`),
      ]);

      const total = countRes.count || 0;

      return {
        success: true,
        data: requestsRes.data || [],
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

  static async updateBreedingRequestStatus(
    requestId: string,
    status: 'accepted' | 'rejected' | 'completed',
  ): Promise<ApiResponse<BreedingRequest>> {
    try {
      const { data, error } = await supabase
        .from('breeding_requests')
        .update({ status })
        .eq('id', requestId)
        .select('*')
        .limit(1);

      if (error || !data || data.length === 0) {
        throw error || new Error('更新失败');
      }

      await syncPetLoveRecordFromBreeding({
        senderId: data[0].sender_id,
        receiverId: data[0].receiver_id,
        senderPetId: data[0].sender_pet_id,
        receiverPetId: data[0].receiver_pet_id,
        notes: data[0].notes || '',
        breedingStatus: status,
      });

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
}

export default BreedingService;

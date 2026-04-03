import { supabase } from '../config/supabase.js';
import { Pet, CreatePetRequest, ApiResponse } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export class PetService {
  static async createPet(userId: string, data: CreatePetRequest): Promise<ApiResponse<Pet>> {
    try {
      const petId = uuidv4();
      const { error } = await supabase
        .from('pets')
        .insert({
          id: petId,
          user_id: userId,
          ...data,
          is_digital_twin: false,
        });

      if (error) {
        throw error;
      }

      const pet = await this.getPetById(petId);
      return {
        success: true,
        data: pet as Pet,
        message: '宠物创建成功',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '创建失败',
        code: 500,
      };
    }
  }

  static async getPetById(petId: string): Promise<Pet | null> {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', petId)
        .limit(1);

      if (error || !data || data.length === 0) {
        return null;
      }

      return data[0];
    } catch {
      return null;
    }
  }

  static async getPetsByUserId(userId: string): Promise<ApiResponse<Pet[]>> {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

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

  static async updatePet(petId: string, updates: Partial<Pet>): Promise<ApiResponse<Pet>> {
    try {
      const { data, error } = await supabase
        .from('pets')
        .update(updates)
        .eq('id', petId)
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

  static async deletePet(petId: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId);

      if (error) {
        throw error;
      }

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

  // 创建数字分身
  static async createDigitalTwin(
    petId: string,
    modelUrl: string,
    aiPersonality: string,
  ): Promise<ApiResponse<Pet>> {
    try {
      const digitalTwinData = {
        model_url: modelUrl,
        generated_at: new Date().toISOString(),
        ai_personality: aiPersonality,
      };

      const { data, error } = await supabase
        .from('pets')
        .update({
          is_digital_twin: true,
          digital_twin_data: digitalTwinData,
        })
        .eq('id', petId)
        .select('*')
        .limit(1);

      if (error || !data || data.length === 0) {
        throw error || new Error('创建数字分身失败');
      }

      return {
        success: true,
        data: data[0],
        message: '数字分身创建成功',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '创建失败',
        code: 500,
      };
    }
  }

  // 获取可用配种宠物列表
  static async getBreedingPets(
    petType: string,
    gender: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<ApiResponse<Pet[]>> {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*, users!pets_user_id_fkey(id, username, avatar_url)')
        .eq('type', petType)
        .eq('gender', gender === '公' ? '母' : '公')
        .eq('health_status', 'healthy')
        .eq('vaccinated', true)
        .range(offset, offset + limit - 1);

      if (error) {
        throw error;
      }

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
}

export default PetService;

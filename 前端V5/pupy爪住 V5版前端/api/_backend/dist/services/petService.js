import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/supabase.js';
function normalizeOppositeGenderOptions(gender) {
    const normalized = (gender || '').trim().toLowerCase();
    if (normalized === 'male' || normalized === '公')
        return ['female', '母'];
    if (normalized === 'female' || normalized === '母')
        return ['male', '公'];
    return gender ? [gender] : [];
}
export class PetService {
    static async createPet(userId, data) {
        try {
            const petId = uuidv4();
            const { error } = await supabase.from('pets').insert({
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
                data: pet,
                message: 'Pet created successfully.',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to create pet.',
                code: 500,
            };
        }
    }
    static async getPetById(petId) {
        try {
            const { data, error } = await supabase.from('pets').select('*').eq('id', petId).limit(1);
            if (error || !data || data.length === 0) {
                return null;
            }
            return data[0];
        }
        catch {
            return null;
        }
    }
    static async getPetsByUserId(userId) {
        try {
            const { data, error } = await supabase.from('pets').select('*').eq('user_id', userId);
            if (error) {
                throw error;
            }
            return {
                success: true,
                data: (data || []),
                message: 'Pets loaded.',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to load pets.',
                code: 500,
            };
        }
    }
    static async updatePet(userId, petId, updates) {
        try {
            const { data, error } = await supabase
                .from('pets')
                .update(updates)
                .eq('id', petId)
                .eq('user_id', userId)
                .select('*')
                .limit(1);
            if (error || !data || data.length === 0) {
                throw error || new Error('Pet not found or no permission.');
            }
            return {
                success: true,
                data: data[0],
                message: 'Pet updated.',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to update pet.',
                code: 500,
            };
        }
    }
    static async deletePet(userId, petId) {
        try {
            const { error } = await supabase.from('pets').delete().eq('id', petId).eq('user_id', userId);
            if (error) {
                throw error;
            }
            return {
                success: true,
                data: null,
                message: 'Pet deleted.',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to delete pet.',
                code: 500,
            };
        }
    }
    static async createDigitalTwin(userId, petId, modelUrl, aiPersonality) {
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
                .eq('user_id', userId)
                .select('*')
                .limit(1);
            if (error || !data || data.length === 0) {
                throw error || new Error('Pet not found or no permission.');
            }
            return {
                success: true,
                data: data[0],
                message: 'Digital twin created.',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to create digital twin.',
                code: 500,
            };
        }
    }
    static async getBreedingPets(petType, gender, limit = 20, offset = 0) {
        try {
            const targetGenderOptions = normalizeOppositeGenderOptions(gender);
            const query = supabase
                .from('pets')
                .select('*, owner:users!pets_user_id_fkey(id, username, avatar_url)')
                .eq('type', petType)
                .eq('health_status', 'healthy')
                .eq('vaccinated', true)
                .range(offset, offset + limit - 1);
            if (targetGenderOptions.length > 0) {
                query.in('gender', targetGenderOptions);
            }
            else {
                query.eq('gender', gender);
            }
            const { data, error } = await query;
            if (error) {
                throw error;
            }
            return {
                success: true,
                data: (data || []),
                message: 'Breeding pets loaded.',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to load breeding pets.',
                code: 500,
            };
        }
    }
    static async getDiscoveryFeed(userId, petType, petGender, limit = 20) {
        try {
            const { data: existingMatches } = await supabase
                .from('matches')
                .select('user_a_id, user_b_id')
                .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`);
            const excludedUserIds = new Set([userId]);
            for (const match of existingMatches || []) {
                const otherUserId = match.user_a_id === userId ? match.user_b_id : match.user_a_id;
                if (otherUserId) {
                    excludedUserIds.add(otherUserId);
                }
            }
            const genderOptions = normalizeOppositeGenderOptions(petGender);
            const excludedList = Array.from(excludedUserIds);
            const variants = [
                { petType, genderOptions },
                { petType: undefined, genderOptions },
                { petType, genderOptions: [] },
                { petType: undefined, genderOptions: [] },
            ];
            const seenKeys = new Set();
            let discoveryRows = [];
            for (const variant of variants) {
                const variantKey = JSON.stringify(variant);
                if (seenKeys.has(variantKey)) {
                    continue;
                }
                seenKeys.add(variantKey);
                const query = supabase
                    .from('pets')
                    .select(`*,
            owner:users!pets_user_id_fkey(
              id,
              username,
              age,
              gender,
              resident_city,
              frequent_cities,
              hobbies,
              mbti,
              signature,
              avatar_url,
              bio,
              is_verified
            )`)
                    .order('created_at', { ascending: false })
                    .limit(limit);
                if (excludedList.length > 0) {
                    query.not('user_id', 'in', `(${excludedList.join(',')})`);
                }
                if (variant.petType) {
                    query.eq('type', variant.petType);
                }
                if (variant.genderOptions.length > 0) {
                    query.in('gender', variant.genderOptions);
                }
                const { data, error } = await query;
                if (error) {
                    throw error;
                }
                discoveryRows = data || [];
                if (discoveryRows.length > 0) {
                    break;
                }
            }
            return {
                success: true,
                data: discoveryRows,
                message: 'Discovery feed loaded.',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to load discovery feed.',
                code: 500,
            };
        }
    }
}
export default PetService;
//# sourceMappingURL=petService.js.map
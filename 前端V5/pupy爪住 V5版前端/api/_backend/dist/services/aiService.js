import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/supabase.js';
export class AiService {
    static async createPrayerRecord(userId, petId, prayerText, aiResponse, sentiment = 'neutral') {
        try {
            const recordId = uuidv4();
            const { error } = await supabase.from('prayer_records').insert({
                id: recordId,
                user_id: userId,
                pet_id: petId,
                prayer_text: prayerText,
                ai_response: aiResponse,
                sentiment,
            });
            if (error)
                throw error;
            const { data } = await supabase.from('prayer_records').select('*').eq('id', recordId).limit(1);
            return {
                success: true,
                data: data?.[0],
                message: 'Prayer record saved.',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to save prayer record.',
                code: 500,
            };
        }
    }
    static async getUserPrayerRecords(userId, page = 1, limit = 20) {
        try {
            const offset = (page - 1) * limit;
            const { data, error } = await supabase
                .from('prayer_records')
                .select('*, pet:pets(*)')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);
            if (error)
                throw error;
            return {
                success: true,
                data: data || [],
                message: 'Prayer records loaded.',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to load prayer records.',
                code: 500,
            };
        }
    }
    static async createNotification(userId, message, type, relatedUserId) {
        try {
            const notificationId = uuidv4();
            const { error } = await supabase.from('notifications').insert({
                id: notificationId,
                user_id: userId,
                message,
                type,
                related_user_id: relatedUserId,
                is_read: false,
            });
            if (error)
                throw error;
            const { data } = await supabase.from('notifications').select('*').eq('id', notificationId).limit(1);
            return {
                success: true,
                data: data?.[0],
                message: 'Notification created.',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to create notification.',
                code: 500,
            };
        }
    }
    static async getUnreadNotifications(userId) {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .eq('is_read', false)
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            return {
                success: true,
                data: (data || []),
                message: 'Notifications loaded.',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to load notifications.',
                code: 500,
            };
        }
    }
    static async markNotificationAsRead(userId, notificationId) {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notificationId)
                .eq('user_id', userId);
            if (error)
                throw error;
            return {
                success: true,
                data: null,
                message: 'Notification marked as read.',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to update notification.',
                code: 500,
            };
        }
    }
    static async generateAIResponse(petName, userMessage, petPersonality) {
        try {
            const responses = [
                `${petName} hears you clearly. Your care is felt, and your message can rest here safely.`,
                `${petName} answers softly: keep moving, keep showing up, and keep loving with patience.`,
                `${petName} sends back a calm response shaped by ${petPersonality}: stay gentle, stay steady, and trust the bond you already built.`,
                `Your message "${userMessage}" has been transformed into a quiet reply from ${petName}.`,
            ];
            const randomIndex = Math.floor(Math.random() * responses.length);
            return {
                success: true,
                data: {
                    response: responses[randomIndex],
                    sentiment: 'positive',
                },
                message: 'AI response generated.',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to generate AI response.',
                code: 500,
            };
        }
    }
}
export default AiService;
//# sourceMappingURL=aiService.js.map
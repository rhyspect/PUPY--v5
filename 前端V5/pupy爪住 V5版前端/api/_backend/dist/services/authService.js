import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/index.js';
import { supabase, supabaseAdmin } from '../config/supabase.js';
export class AuthService {
    static toSafeUser(user) {
        const { password_hash: _passwordHash, ...safeUser } = user;
        return safeUser;
    }
    static async register(data) {
        try {
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .or(`email.eq.${data.email},username.eq.${data.username}`)
                .limit(1);
            if (existingUser && existingUser.length > 0) {
                return {
                    success: false,
                    error: '???????????',
                    code: 400,
                };
            }
            const salt = await bcryptjs.genSalt(10);
            const passwordHash = await bcryptjs.hash(data.password, salt);
            const userId = uuidv4();
            const { error } = await supabaseAdmin.from('users').insert({
                id: userId,
                username: data.username,
                email: data.email,
                password_hash: passwordHash,
                age: data.age,
                gender: data.gender,
                resident_city: data.resident_city,
                is_verified: false,
            });
            if (error) {
                throw error;
            }
            await supabaseAdmin.from('user_stats').insert({
                user_id: userId,
                level: 1,
                experience_points: 0,
                achievements: [],
            });
            const token = this.generateToken({
                user_id: userId,
                email: data.email,
                username: data.username,
            });
            const user = await this.getUserById(userId);
            if (!user) {
                throw new Error('??????????????');
            }
            return {
                success: true,
                data: { user: this.toSafeUser(user), token },
                message: '?????',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || '?????',
                code: 500,
            };
        }
    }
    static async login(data) {
        try {
            const { data: userData, error } = await supabase.from('users').select('*').eq('email', data.email).limit(1);
            if (error || !userData || userData.length === 0) {
                return {
                    success: false,
                    error: '??????',
                    code: 401,
                };
            }
            const user = userData[0];
            const passwordMatch = await bcryptjs.compare(data.password, user.password_hash);
            if (!passwordMatch) {
                return {
                    success: false,
                    error: '?????',
                    code: 401,
                };
            }
            await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('id', user.id);
            const token = this.generateToken({
                user_id: user.id,
                email: user.email,
                username: user.username,
            });
            return {
                success: true,
                data: { user: this.toSafeUser(user), token },
                message: '?????',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || '?????',
                code: 500,
            };
        }
    }
    static generateToken(payload) {
        return jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn,
        });
    }
    static verifyToken(token) {
        try {
            return jwt.verify(token, config.jwt.secret);
        }
        catch {
            return null;
        }
    }
    static async getUserById(userId) {
        try {
            const { data, error } = await supabase.from('users').select('*').eq('id', userId).limit(1);
            if (error || !data || data.length === 0) {
                return null;
            }
            return data[0];
        }
        catch {
            return null;
        }
    }
    static async updateUser(userId, updates) {
        try {
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', userId)
                .select('*')
                .limit(1);
            if (error || !data || data.length === 0) {
                throw error || new Error('?????');
            }
            return {
                success: true,
                data: this.toSafeUser(data[0]),
                message: 'Update succeeded.',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || '?????',
                code: 500,
            };
        }
    }
}
export default AuthService;
//# sourceMappingURL=authService.js.map
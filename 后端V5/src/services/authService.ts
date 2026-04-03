import { supabase, supabaseAdmin } from '../config/supabase.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { User, RegisterRequest, LoginRequest, UpdateUserRequest, JWTPayload, ApiResponse } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  static async register(data: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      // 检查用户是否已存在
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .or(`email.eq.${data.email},username.eq.${data.username}`)
        .limit(1);

      if (existingUser && existingUser.length > 0) {
        return {
          success: false,
          error: '用户已存在或邮箱已被使用',
          code: 400,
        };
      }

      // 加密密码
      const salt = await bcryptjs.genSalt(10);
      const passwordHash = await bcryptjs.hash(data.password, salt);

      // 创建用户
      const userId = uuidv4();
      const { error } = await supabaseAdmin
        .from('users')
        .insert({
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

      // 创建用户统计记录
      await supabaseAdmin
        .from('user_stats')
        .insert({
          user_id: userId,
          level: 1,
          experience_points: 0,
          achievements: [],
        });

      // 生成 JWT
      const token = this.generateToken({ user_id: userId, email: data.email, username: data.username });

      // 获取用户数据
      const user = await this.getUserById(userId);

      return {
        success: true,
        data: { user: user as User, token },
        message: '注册成功',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '注册失败',
        code: 500,
      };
    }
  }

  static async login(data: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      // 查找用户
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', data.email)
        .limit(1);

      if (error || !userData || userData.length === 0) {
        return {
          success: false,
          error: '用户不存在',
          code: 401,
        };
      }

      const user = userData[0];

      // 验证密码
      const passwordMatch = await bcryptjs.compare(data.password, user.password_hash);
      if (!passwordMatch) {
        return {
          success: false,
          error: '密码不正确',
          code: 401,
        };
      }

      // 更新最后登录时间
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      // 生成 JWT
      const token = this.generateToken({
        user_id: user.id,
        email: user.email,
        username: user.username,
      });

      return {
        success: true,
        data: { user, token },
        message: '登录成功',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '登录失败',
        code: 500,
      };
    }
  }

  static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
      return decoded;
    } catch {
      return null;
    }
  }

  static async getUserById(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .limit(1);

      if (error || !data || data.length === 0) {
        return null;
      }

      return data[0];
    } catch {
      return null;
    }
  }

  static async updateUser(userId: string, updates: UpdateUserRequest): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
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
}

export default AuthService;

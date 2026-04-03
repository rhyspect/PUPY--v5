import { createClient } from '@supabase/supabase-js';
import config from '../config/index.js';

if (!config.supabase.url || !config.supabase.anonKey) {
  throw new Error('Supabase配置缺失 (SUPABASE_URL 和 SUPABASE_ANON_KEY)');
}

export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      persistSession: false,
    },
  }
);

// 用于管理操作的服务角色客户端
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey || config.supabase.anonKey,
  {
    auth: {
      persistSession: false,
    },
  }
);

export default supabase;

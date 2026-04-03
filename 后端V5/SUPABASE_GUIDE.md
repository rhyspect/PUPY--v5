# PUPY 后端 - Supabase 部署和集成指南

本指南描述如何使用 Supabase 作为后端数据库。

## 🔧 Supabase 设置步骤

### 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 登录/注册账户
3. 点击 "New Project"
4. 填写项目名称，选择区域，设置数据库密码
5. 点击 "Create new project" 等待初始化

### 2. 获取 API 密钥

1. 进入项目设置 (Settings)
2. 点击 "API" 标签
3. 复制以下内容到 `.env`:
   - Project URL → `SUPABASE_URL`
   - anon public key → `SUPABASE_ANON_KEY`
   - service_role secret → `SUPABASE_SERVICE_ROLE_KEY`

### 3. 执行数据库模式

1. 进入 "SQL Editor"
2. 点击 "New Query"
3. 复制 `src/database/schema.sql` 的全部内容
4. 粘贴到 SQL 编辑器
5. 点击 "Run" 执行

## 📊 数据库表结构

所有表已通过 schema.sql 自动创建，包括:

- **users**: 用户账户
- **pets**: 宠物信息
- **matches**: 宠物匹配
- **chat_rooms**: 聊天室
- **messages**: 消息
- **diaries**: 日记
- **comments**: 评论
- **likes**: 赞
- **market_products**: 市集商品
- **breeding_requests**: 配种请求
- **notifications**: 通知
- **prayer_records**: 祈祷记录
- **user_stats**: 用户统计

## 🔐 Row Level Security (RLS)

根据需要在 Supabase 中启用 RLS:

```sql
-- 启用 RLS 示例
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 创建策略示例 (允许用户访问自己的数据)
CREATE POLICY "Users can view their own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);
```

## 🌐 CORS 配置

后端已配置 CORS，允许来自配置的前端 URL 的请求。

在 `.env` 中配置:
```env
FRONTEND_URL=http://localhost:3000
```

## 🔗 连接测试

启动后端后，访问:
```
http://localhost:3001/health
```

应返回:
```json
{
  "success": true,
  "message": "PUPY后端服务正常运行",
  "timestamp": "...",
  "environment": "development"
}
```

## 💡 常用 Supabase 操作

### 查看数据
1. 进入 "Table Editor"
2. 选择要查看的表
3. 查看/修改/删除数据

### 管理用户
1. 进入 "Authentication"
2. 查看和管理用户账户

### 监控
1. 进入 "Logs"
2. 查看实时日志和错误

## 🚨 常见问题

### Q: 连接失败 "Invalid API Key"
A: 检查 `.env` 中的 SUPABASE_URL 和密钥是否正确

### Q: 表不存在
A: 确保已在 SQL 编辑器中完整执行 schema.sql

### Q: CORS 错误
A: 检查 FRONTEND_URL 环境变量是否设置正确

### Q: 认证失败
A: 确保 JWT_SECRET 在开发和生产中保持一致

## 📱 前端集成

前端通过以下方式访问后端 API:

```typescript
const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';

// 示例: 获取宠物列表
const response = await fetch(`${API_URL}/api/pets`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 🔄 数据同步

后端 API 会自动同步到 Supabase:

1. 用户注册 → 创建 users 记录
2. 创建宠物 → 创建 pets 记录
3. 消息发送 → 创建 messages 记录
4. 等等...

## 📈 监控和扩展

### 性能监控
- 使用 Supabase 的 "Logs" 查看性能指标
- 定期检查数据库使用量

### 扩展数据库
1. 添加新表时更新 schema.sql
2. 重新执行 SQL
3. 更新后端类型定义

## 🔒 安全建议

1. **环境变量**: 永远不要在代码中暴露密钥
2. **RLS**: 为生产启用 Row Level Security
3. **备份**: 定期备份数据库
4. **认证**: 使用强密码和 JWT
5. **CORS**: 只允许受信任的域名

---

需要更多帮助? 查看 [Supabase 文档](https://supabase.com/docs)

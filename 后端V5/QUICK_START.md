# 🚀 后端快速开始指南

## ⚡ 5 分钟启动后端服务

### 1️⃣ 克隆和安装

```bash
# 进入后端目录
cd 后端V5

# 安装依赖
npm install
```

### 2️⃣ 配置环境变量

复制 `.env.example` 到 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 填入 Supabase 密钥：

```env
# Supabase 配置
SUPABASE_URL=your_project_url_here
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT 配置
JWT_SECRET=your_secret_key_here

# 服务器配置
PORT=3001
NODE_ENV=development

# 可选: Google AI
GOOGLE_AI_API_KEY=your_api_key_here
```

### 3️⃣ 初始化数据库

在 Supabase SQL 编辑器中执行 `src/database/schema.sql` 的全部内容。

### 4️⃣ 启动服务器

```bash
npm run dev
```

预期输出：
```
✅ Server is running on http://localhost:3001
```

## ✅ 验证服务是否正常

```bash
curl http://localhost:3001/health
# 返回: {"status":"ok"}
```

## 📋 可用的 npm 命令

```bash
npm run dev        # 启动开发服务器 (类型检查 + 热重载)
npm run build      # 生产编译
npm run lint       # 代码风格检查
npm run start      # 运行生产构建
```

## 🔌 快速 API 测试

```bash
# 注册新用户
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123!"
  }'

# 登录
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'

# 获取当前用户
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📚 完整文档

- **API 参考**: `README.md`
- **数据库指南**: `SUPABASE_GUIDE.md`
- **集成指南**: `FRONTEND_INTEGRATION.md`

完整后端已准备就绪！🎉

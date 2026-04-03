# PUPY (爪住) 后端项目

## 📱 项目简介

PUPY (爪住) 是一个宠物社交平台，连接宠物主人和他们的宠物，提供配种、日记、消息、市集等功能。

**后端技术栈:**
- Node.js + Express.js + TypeScript
- Supabase (PostgreSQL) 数据库
- JWT 认证
- RESTful API

## 🚀 快速开始

### 前置要求
- Node.js 18+ 
- npm 或 yarn
- Supabase 账户

### 安装依赖
```bash
cd 后端V5
npm install
# 或
yarn install
```

### 配置环境变量
复制 `.env.example` 创建 `.env` 文件:
```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 Supabase 配置:
```env
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_secret_key
```

### 初始化数据库
1. 登录 Supabase 控制面板
2. 进入 SQL 编辑器
3. 复制 `src/database/schema.sql` 中的 SQL 代码
4. 执行 SQL 脚本

### 启动开发服务器
```bash
npm run dev
```

服务器将在 `http://localhost:3001` 启动

## 📂 项目结构

```
后端V5/
├── src/
│   ├── config/              # 配置文件
│   │   ├── index.ts        # 主配置
│   │   └── supabase.ts     # Supabase客户端
│   ├── middleware/          # 中间件
│   │   ├── authMiddleware.ts  # JWT认证
│   │   └── errorHandler.ts    # 错误处理
│   ├── routes/              # API路由
│   │   ├── auth.ts         # 认证路由
│   │   ├── pets.ts         # 宠物路由
│   │   ├── matches.ts      # 匹配路由
│   │   ├── messages.ts     # 消息路由
│   │   ├── diaries.ts      # 日记路由
│   │   ├── market.ts       # 市集路由
│   │   ├── breeding.ts     # 配种路由
│   │   └── ai.ts           # AI路由
│   ├── services/            # 业务逻辑
│   │   ├── authService.ts
│   │   ├── petService.ts
│   │   ├── matchService.ts
│   │   ├── messageService.ts
│   │   ├── diaryService.ts
│   │   ├── marketService.ts
│   │   ├── breedingService.ts
│   │   └── aiService.ts
│   ├── types/               # TypeScript类型
│   │   └── index.ts
│   ├── utils/               # 工具函数
│   │   ├── validators.ts    # 验证器
│   │   └── pagination.ts    # 分页
│   ├── database/            # 数据库
│   │   └── schema.sql       # 数据库模式
│   └── index.ts             # 应用入口
├── .env.example             # 环境变量示例
├── package.json             # 依赖配置
├── tsconfig.json            # TypeScript配置
└── README.md                # 本文件
```

## 🔌 API 端点

### 认证 (Authentication)
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息

### 宠物 (Pets)
- `POST /api/pets` - 创建宠物
- `GET /api/pets` - 获取我的宠物
- `GET /api/pets/:petId` - 获取单个宠物
- `PUT /api/pets/:petId` - 更新宠物
- `DELETE /api/pets/:petId` - 删除宠物
- `POST /api/pets/:petId/digital-twin` - 创建数字分身

### 匹配 (Matches)
- `POST /api/matches` - 创建匹配
- `GET /api/matches` - 获取我的匹配
- `PATCH /api/matches/:matchId/status` - 更新匹配状态

### 消息 (Messages)
- `POST /api/messages/rooms` - 创建聊天室
- `GET /api/messages/rooms` - 获取聊天室列表
- `POST /api/messages/rooms/:chatRoomId/messages` - 发送消息
- `GET /api/messages/rooms/:chatRoomId/messages` - 获取聊天记录

### 日记 (Diaries)
- `POST /api/diaries` - 创建日记
- `GET /api/diaries` - 获取我的日记
- `GET /api/diaries/public/feed` - 获取公开日记
- `GET /api/diaries/:diaryId` - 获取单个日记
- `PUT /api/diaries/:diaryId` - 更新日记
- `DELETE /api/diaries/:diaryId` - 删除日记
- `POST /api/diaries/:diaryId/like` - 赞日记
- `DELETE /api/diaries/:diaryId/like` - 取消赞
- `POST /api/diaries/:diaryId/comments` - 添加评论
- `GET /api/diaries/:diaryId/comments` - 获取评论

### 市集 (Market)
- `POST /api/market` - 发布商品
- `GET /api/market/category/:category` - 按分类获取商品
- `GET /api/market/search` - 搜索商品
- `GET /api/market/seller/:sellerId` - 获取卖家商品
- `PUT /api/market/:productId` - 更新商品
- `DELETE /api/market/:productId` - 删除商品

### 配种 (Breeding)
- `POST /api/breeding` - 创建配种请求
- `GET /api/breeding` - 获取配种请求
- `PATCH /api/breeding/:requestId/status` - 更新配种状态

### AI (Artificial Intelligence)
- `POST /api/ai/prayer` - 创建祈祷记录
- `GET /api/ai/prayer` - 获取祈祷记录
- `GET /api/ai/notifications` - 获取通知
- `PATCH /api/ai/notifications/:notificationId` - 标记通知为已读

## 🔐 认证流程

1. **注册**: 用户通过 `/api/auth/register` 创建账户
2. **登录**: 用户通过 `/api/auth/login` 获取 JWT token
3. **使用**: 在请求头中添加: `Authorization: Bearer <token>`

## 💾 数据库架构

数据库包含以下主要表:

| 表名 | 说明 |
|------|------|
| `users` | 用户信息 |
| `pets` | 宠物信息 |
| `matches` | 宠物匹配记录 |
| `chat_rooms` | 聊天室 |
| `messages` | 消息 |
| `diaries` | 日记 |
| `comments` | 评论 |
| `likes` | 点赞 |
| `market_products` | 市集商品 |
| `breeding_requests` | 配种请求 |
| `notifications` | 通知 |
| `prayer_records` | 祈祷记录 |
| `user_stats` | 用户统计 |

## 🛠️ 开发命令

```bash
# 启动开发服务器 (hot reload)
npm run dev

# 构建项目
npm run build

# 运行生产环境
npm start

# 类型检查
npm run lint
```

## 🌱 示例请求

### 注册用户
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "petlover",
    "email": "user@example.com",
    "password": "password123",
    "age": 25,
    "gender": "女",
    "resident_city": "上海"
  }'
```

### 创建宠物
```bash
curl -X POST http://localhost:3001/api/pets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "小汪",
    "type": "金毛",
    "gender": "公",
    "personality": "E系浓宠",
    "breed": "金毛寻回犬",
    "age": 2,
    "weight": 25.5,
    "images": ["https://..."],
    "bio": "我是一只活泼的金毛！"
  }'
```

## 📊 API 响应格式

所有 API 返回统一的 JSON 格式:

```json
{
  "success": true,
  "data": {...},
  "message": "操作成功",
  "code": 200
}
```

错误响应:
```json
{
  "success": false,
  "error": "错误信息",
  "code": 400
}
```

分页响应:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "total_pages": 5
  },
  "message": "获取成功"
}
```

## 🔗 前后端集成

前端应该访问 `http://localhost:3001/api/*` (开发环境) 或生产 URL。

### 环境变量配置 (前端)
```env
VITE_API_URL=http://localhost:3001
```

### API 调用示例 (TypeScript)
```typescript
const API_URL = import.meta.env.VITE_API_URL;

// 登录
const response = await fetch(`${API_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { data: { token } } = await response.json();
localStorage.setItem('token', token);

// 带认证的请求
const petsResponse = await fetch(`${API_URL}/api/pets`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🚀 部署

### Vercel 部署
1. 推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### Docker 部署
```bash
docker build -t pupy-backend .
docker run -p 3001:3001 --env-file .env pupy-backend
```

### VPS 部署
参考 `后端V5/deployment-guide.md`

## 📝 许可证

MIT License

## 👥 支持

有问题或建议？请提交 Issue 或 Pull Request。

## 🎉 致谢

感谢所有贡献者和 Supabase 提供的优秀服务！

---

**版本**: 1.0.0  
**最后更新**: 2026年4月3日

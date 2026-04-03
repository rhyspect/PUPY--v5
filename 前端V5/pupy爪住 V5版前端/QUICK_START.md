# 🚀 PUPY 爪住 V5 - 快速开始指南

欢迎使用 PUPY 爪住！这是一个完整的宠物社交平台全栈应用。本指南将帮助您在 5 分钟内启动完整的开发环境。

## ⚡ 前置要求

- **Node.js**: v18 或更高版本
- **npm** 或 **yarn**
- **Git**: 版本控制
- **Supabase 账户**: 数据库服务（免费注册）

## 📋 第一步：环境配置（1 分钟）

### 1.1 获取 Supabase 密钥

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目（保存密码）
3. 点击 **Settings → API** 获取：
   - `SUPABASE_URL`: 项目 URL
   - `SUPABASE_ANON_KEY`: 公开密钥
   - `SUPABASE_SERVICE_ROLE_KEY`: 角色密钥（后端用）

### 1.2 配置前端环境

在前端项目根目录创建 `.env.local`：

```bash
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=<你的SUPABASE_URL>
VITE_SUPABASE_ANON_KEY=<你的SUPABASE_ANON_KEY>
```

### 1.3 配置后端环境

在后端项目根目录创建 `.env`：

```bash
# Supabase
SUPABASE_URL=<你的SUPABASE_URL>
SUPABASE_ANON_KEY=<你的SUPABASE_ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<你的SUPABASE_SERVICE_ROLE_KEY>

# JWT 认证
JWT_SECRET=your_super_secret_key_change_this_in_production

# 服务器
PORT=3001
NODE_ENV=development

# Google AI (可选)
GOOGLE_AI_API_KEY=your_google_ai_key
```

## 🗄️ 第二步：初始化数据库（2 分钟）

### 2.1 创建数据库表

1. 在 Supabase 控制面板进入 **SQL Editor**
2. 复制 `后端V5/src/database/schema.sql` 的全部内容
3. 粘贴到 SQL Editor 并执行（Create）
4. 等待完成（所有 13 张表应该被创建）

### 2.2 启用行级安全 (Row Level Security - RLS)

在数据库中执行以下命令：

```sql
-- 为所有表启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE breeding_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
```

## 🔧 第三步：启动后端服务器（1 分钟）

```bash
# 1. 进入后端目录
cd 后端V5

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 输出应该显示:
# ✅ Server is running on http://localhost:3001
```

验证后端运行状态：
```bash
# 在另一个终端测试
curl http://localhost:3001/health
# 应该返回: {"status":"ok"}
```

## 🎨 第四步：启动前端应用（1 分钟）

```bash
# 1. 进入前端目录
cd 前端V5/pupy爪住\ V5版前端

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 输出应该显示:
# ➜  Local:   http://localhost:5173/
```

在浏览器打开 `http://localhost:5173/` 即可看到应用！

## ✅ 验证集成（1 分钟）

### 测试用户注册

1. 在 Web 应用中进行用户注册
2. 检查 Supabase → Tables → `users` 表中是否有新用户记录
3. 注册成功 ✅

### 测试数据流

- **创建宠物**: 应该看到在 `pets` 表中创建新记录
- **查看匹配**: 应该计算相容性分数
- **发送消息**: 应该创建聊天室和消息记录
- **发布日记**: 应该保存到 `diaries` 表

## 📁 项目结构

```
PUPY-爪住/
├── 前端V5/
│   └── pupy爪住 V5版前端/
│       ├── src/
│       │   ├── components/        # React 组件
│       │   ├── services/
│       │   │   └── api.ts         # 后端 API 调用
│       │   ├── App.tsx            # 主应用
│       │   └── main.tsx           # 入口
│       ├── package.json
│       └── vite.config.ts
│
└── 后端V5/
    ├── src/
    │   ├── config/               # 配置管理
    │   ├── middleware/           # Express 中间件
    │   ├── routes/               # API 路由 (8 个模块)
    │   ├── services/             # 业务逻辑 (8 个服务)
    │   ├── types/                # TypeScript 类型定义
    │   ├── utils/                # 工具函数
    │   ├── database/             # 数据库架构
    │   └── index.ts              # 主应用入口
    ├── package.json
    ├── .env                      # 环境变量
    └── tsconfig.json
```

## 🔌 API 端点速查表

### 认证 (`/api/auth`)
- `POST /register` - 用户注册
- `POST /login` - 用户登录
- `GET /me` - 获取当前用户信息

### 宠物 (`/api/pets`)
- `GET` - 获取所有宠物
- `POST` - 创建新宠物
- `GET /:id` - 获取宠物详情
- `PUT /:id` - 更新宠物
- `DELETE /:id` - 删除宠物

### 匹配 (`/api/matches`)
- `GET` - 获取所有匹配
- `POST` - 创建新匹配
- `PUT /:id/status` - 更新匹配状态

### 消息 (`/api/messages`)
- `GET /rooms` - 获取聊天室列表
- `POST /rooms` - 创建/获取聊天室
- `POST` - 发送消息
- `GET /rooms/:roomId/messages` - 获取消息历史

### 日记 (`/api/diaries`)
- `GET` - 获取日记列表
- `POST` - 创建日记
- `PUT /:id` - 更新日记
- `DELETE /:id` - 删除日记
- `POST /:id/likes` - 点赞日记
- `POST /:id/comments` - 添加评论

### 市集 (`/api/market`)
- `GET` - 获取所有产品
- `GET /categories` - 获取类别列表
- `GET /search` - 搜索产品
- `POST` - 发布产品

### 繁殖 (`/api/breeding`)
- `GET` - 获取繁殖请求
- `POST` - 创建繁殖请求
- `PUT /:id/status` - 更新状态

### AI 祈祷 (`/api/ai`)
- `POST /prayers` - 创建祈祷记录
- `GET /notifications` - 获取通知

## 🐛 常见问题与解决

### 问题 1：无法连接到后端
```
错误: XMLHttpRequest Error: Cannot connect to http://localhost:3001
解决: 确保后端已启动 (npm run dev in 后端V5)
```

### 问题 2：Supabase 连接错误
```
错误: Unable to connect to Supabase
解决方案:
1. 检查 .env 中的 SUPABASE_URL 和密钥是否正确
2. 确认 Supabase 项目处于活跃状态
3. 在控制面板检查 API 配额
```

### 问题 3：数据库表不存在
```
错误: Relation "users" does not exist
解决方案:
1. 复制 schema.sql 的全部内容
2. 在 Supabase SQL Editor 中执行
3. 检查所有 13 张表是否创建成功
```

### 问题 4：认证失败
```
错误: Invalid JWT token
解决方案:
1. 检查 .env 中的 JWT_SECRET 是否一致
2. 清除浏览器 localStorage
3. 重新登录
```

## 📚 完整文档索引

| 文档 | 位置 | 用途 |
|------|------|------|
| **README** | `后端V5/README.md` | API 完整参考 |
| **Supabase 指南** | `后端V5/SUPABASE_GUIDE.md` | 数据库设置指南 |
| **前端集成** | `后端V5/FRONTEND_INTEGRATION.md` | 集成模式和示例 |
| **GitHub 部署** | `GITHUB_DEPLOYMENT_GUIDE.md` | GitHub 上传和 CI/CD |
| **项目概览** | `PROJECT_README.md` | 完整项目信息 |
| **交付报告** | `PROJECT_COMPLETION_REPORT.md` | 功能清单和指标 |

## 🚀 后续步骤

### 第一天：本地开发
✅ 完成此 Quick Start
✅ 测试注册/登录流程
✅ 创建测试数据
✅ 检查数据库中的记录

### 第二天：功能探索
✅ 测试匹配算法
✅ 完成消息流程
✅ 发布宠物日记
✅ 浏览市集功能

### 第三天：部署准备
✅ 按照 `GITHUB_DEPLOYMENT_GUIDE.md` 推送到 GitHub
✅ 配置环境变量用于部署
✅ 选择部署目标（Vercel/Railway/Render）

### 第四天：生产部署
✅ 部署后端（Railway/Render/Vercel）
✅ 部署前端到 Vercel
✅ 配置自定义域名
✅ 设置 CI/CD 管道

## 💡 开发技巧

### 使用 TypeScript 获得最佳开发体验
```typescript
// 在前端代码中获得完整的类型提示
import { api } from './services/api';

const user = await api.login(email, password);
// user 的所有属性都有类型推断 ✨
```

### 监控网络请求
打开浏览器开发者工具 → Network 标签，查看所有 API 调用

### 调试数据库
Supabase 控制面板 → Tables 标签，直接查看/编辑数据库中的记录

## 📞 获取帮助

- 📖 查看完整文档：`PROJECT_README.md`
- 🔍 搜索常见问题：`PROJECT_COMPLETION_REPORT.md`
- 🛠️ 技术细节：对应的 API/集成指南

## 🎉 恭喜！

您的完整 PUPY 爪住应用现在已经准备就绪！开始构建、测试和部署。

**下一个命令：**
```bash
# 启动完整开发环境
npm run dev  # 后端（3001 端口）
npm run dev  # 前端（5173 端口）
```

祝您开发愉快！🐾

# 🐾 PUPY (爪住) - 宠物社交平台完整项目

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/react-19.0-61dafb)](https://react.dev/)

## 📱 项目介绍

**PUPY (爪住)** 是一个现代化的宠物社交平台，让宠物主人能够：
- 👥 展示和分享他们的宠物
- 💑 为宠物找到理想的配对和朋友
- 💬 与其他宠物主人进行实时交流
- 🎨 分享宠物的日常趣事和成就
- 🏪 使用宠物市集进行交易和配种
- 🦸 创建宠物的3D数字分身
- 🙏 使用AI功能与宠物互动

## 🏗️ 项目架构

```
PUPY-爪住/
├── 前端V5/
│   └── pupy爪住 V5版前端/
│       ├── src/
│       │   ├── components/    # React 组件
│       │   ├── services/      # API 服务
│       │   ├── App.tsx
│       │   └── types.ts
│       ├── package.json
│       └── README.md
├── 后端V5/
│   ├── src/
│   │   ├── routes/           # API 路由
│   │   ├── services/         # 业务逻辑
│   │   ├── middleware/       # 中间件
│   │   ├── config/           # 配置
│   │   ├── database/         # 数据库架构
│   │   └── index.ts
│   ├── package.json
│   ├── README.md
│   └── SUPABASE_GUIDE.md
└── README.md (本文件)
```

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn
- Supabase 账户
- Git

### 1️⃣ 克隆项目

```bash
git clone https://github.com/yourusername/PUPY.git
cd PUPY
```

### 2️⃣ 配置后端

```bash
cd 后端V5
npm install
cp .env.example .env
# 编辑 .env，填入 Supabase 配置
npm run dev # 启动在 http://localhost:3001
```

**Supabase 配置步骤：**
1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 在 SQL Editor 中执行 `src/database/schema.sql`
4. 获取 API 密钥并填入 `.env`

### 3️⃣ 配置前端

```bash
cd 前端V5/pupy爪住\ V5版前端
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:3001
npm run dev # 启动在 http://localhost:3000
```

### 4️⃣ 访问应用

打开浏览器访问 `http://localhost:3000`

## 📚 功能列表

### ✅ 已实现功能

| 功能 | 前端 | 后端 | 状态 |
|------|------|------|------|
| 用户注册/登录 | ✅ | ✅ | 完成 |
| 宠物档案管理 | ✅ | ✅ | 完成 |
| 宠物匹配系统 | ✅ | ✅ | 完成 |
| 实时聊天消息 | ✅ | ✅ | 完成 |
| 宠物日记 | ✅ | ✅ | 完成 |
| 评论和点赞 | ✅ | ✅ | 完成 |
| 市集功能 | ✅ | ✅ | 完成 |
| 配种管理 | ✅ | ✅ | 完成 |
| AI 祈祷功能 | ✅ | ✅ | 完成 |
| 数字分身 (3D) | ✅ | ✅ | 框架 |
| 通知系统 | ✅ | ✅ | 完成 |

### 📋 待完成功能

- [ ] WebSocket 实时更新
- [ ] 图片上传到云存储 (CDN)
- [ ] 支付系统集成
- [ ] 推送通知
- [ ] 视频通话
- [ ] 高级推荐算法

## 🛠️ 技术栈

### 前端
- **框架**: React 19 + TypeScript
- **构建**: Vite
- **样式**: Tailwind CSS
- **动画**: Framer Motion (Motion)
- **图标**: Lucide React
- **HTTP**: Fetch API

### 后端
- **运行时**: Node.js
- **框架**: Express.js
- **语言**: TypeScript
- **数据库**: Supabase (PostgreSQL)
- **认证**: JWT + Bcrypt
- **验证**: Validator.js

### 数据库
- **主数据库**: PostgreSQL (通过 Supabase)
- **ORM**: Supabase SDK
- **缓存**: 可选 Redis

## 📡 API 文档

详见 `后端V5/README.md`

主要端点：
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `POST /api/pets` - 创建宠物
- `POST /api/matches` - 创建匹配
- `POST /api/messages/rooms` - 创建聊天室
- `POST /api/diaries` - 创建日记
- 等等...

## 🔐 安全性

- ✅ JWT 认证
- ✅ 密码加密 (Bcrypt)
- ✅ CORS 配置
- ✅ 输入验证
- ✅ SQL 注入防护 (Supabase RLS)
- ⏳ HTTPS (生产环境)

### 生产部署建议

1. **启用 RLS** (Row Level Security)
2. **使用环境变量** 保护密钥
3. **启用 HTTPS**
4. **配置 rate limiting**
5. **设置日志和监控**

## 📦 项目统计

```
前端代码:
- React 组件: 15+
- 类型定义: 完整
- 代码量: ~2,000 行 TypeScript/TSX

后端代码:
- Express 路由: 8 个
- 业务服务: 8 个
- 数据库表: 13 张
- API 端点: 40+
- 代码量: ~3,500 行 TypeScript

总代码量: ~5,500 行
```

## 🧪 测试

### 前端测试
```bash
cd 前端V5/pupy爪住\ V5版前端
npm run lint
```

### 后端测试
```bash
cd 后端V5
npm run lint
```

## 📝 API 示例

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
    "images": ["https://example.com/dog.jpg"],
    "bio": "我是一只活泼的金毛！"
  }'
```

### 发送消息

```bash
curl -X POST http://localhost:3001/api/messages/rooms/ROOM_ID/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receiver_id": "USER_ID",
    "content": "你好！"
  }'
```

## 🚀 部署

### Vercel 部署 (前端)

```bash
cd 前端V5/pupy爪住\ V5版前端
npm run build
# 连接到 Vercel 进行部署
```

### 云服务器部署 (后端)

详见 `后端V5/README.md` 部署章节

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📖 文档

- [后端 README](后端V5/README.md)
- [前端集成指南](前端V5/pupy爪住%20V5版前端/BACKEND_INTEGRATION.md)
- [Supabase 设置指南](后端V5/SUPABASE_GUIDE.md)
- [数据库架构](后端V5/src/database/schema.sql)

## 🐛 报告问题

发现 bug？请提交 [Issue](https://github.com/yourusername/PUPY/issues)

## 💬 讨论

有想法或问题？加入我们的 [讨论区](https://github.com/yourusername/PUPY/discussions)

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢以下技术和平台支持：
- [React 团队](https://react.dev)
- [Supabase](https://supabase.com)
- [Vercel](https://vercel.com)
- [Tailwind CSS](https://tailwindcss.com)
- 所有贡献者

## 📞 联系方式

- 📧 Email: [your-email@example.com]
- 👥 GitHub: [@yourusername]

## 🎯 未来规划

- 🎨 支持更多宠物类型
- 🌍 多语言支持
- 📱 Native 移动应用
- 🎮 游戏化功能
- 🔔 推送通知
- 💳 支付系统
- 🏆 排行榜и成就系统

---

**版本**: 1.0.0  
**最后更新**: 2026年4月3日  
**维护状态**: ✅ 积极维护中

---

## 📊 项目数据

```
├── 仓库大小: ~50 MB
├── 提交数: 1+
├── 贡献者: 1+
├── 开源协议: MIT
└── 更新频率: 定期更新
```

## 🎉 开始使用

现在就开始！按照 [快速开始](#-快速开始) 部分配置你的开发环境。

有任何问题? 查看我们的 [文档](README.md) 或 [提交 Issue](https://github.com/yourusername/PUPY/issues)。

**祝你使用愉快！🎊**

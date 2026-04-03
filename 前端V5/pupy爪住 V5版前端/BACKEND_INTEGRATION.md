# PUPY 前后端集成指南

本文档说明如何集成前后端代码。

## 🔗 前后端连接

### 1. 后端启动

在 `后端V5` 目录:

```bash
npm install
cp .env.example .env
# 编辑 .env，填入 Supabase 配置
npm run dev
```

后端将在 `http://localhost:3001` 启动

### 2. 前端配置

在 `前端V5/pupy爪住 V5版前端` 目录:

```bash
npm install
cp .env.example .env
```

编辑 `.env`:
```env
VITE_API_URL=http://localhost:3001
```

### 3. 前端启动

```bash
npm run dev
```

前端将在 `http://localhost:3000` 启动

## 📝 主要集成点

### 登录流程

```typescript
import apiService from '@/services/api';

// 登录
const result = await apiService.login(email, password);

if (result.success) {
  // Token 已自动保存
  const user = result.data?.user;
  // 导航到首页
}
```

### 创建宠物

```typescript
const result = await apiService.createPet({
  name: '小汪',
  type: '金毛',
  gender: '公',
  personality: 'E系浓宠',
  breed: '金毛寻回犬',
  age: 2,
  weight: 25.5,
  images: ['url1', 'url2'],
  bio: '我是一只活泼的金毛！',
});
```

### 发送消息

```typescript
// 获取或创建聊天室
const chatRoom = await apiService.getOrCreateChatRoom(userId);

// 发送消息
await apiService.sendMessage(
  chatRoom.data.id,
  receiverId,
  '你好！'
);
```

### 创建日记

```typescript
await apiService.createDiary(
  petId,
  '美好的一天',
  '今天我们一起去公园玩耍...',
  ['image1.jpg', 'image2.jpg'],
  '开心',
  ['公园', '运动'],
  true // is_public
);
```

## 🗄️ 数据持久化

所有数据都存储在 Supabase PostgreSQL 数据库中:

- 用户账户信息
- 宠物档案
- 聊天记录
- 日记内容
- 市集商品
- 配种请求
- 等等

## 🔐 认证管理

API Service 自动管理 JWT 代币:

```typescript
// Token 自动保存到 localStorage
apiService.setToken(token);

// 后续请求自动添加 Authorization header
const result = await apiService.getPets(); // 包含 token

// 退出登录
apiService.logout(); // 清除 token
```

## 🚀 完整工作流程

1. **注册/登录** → 获取 token
2. **创建宠物** → 上传宠物信息
3. **浏览其他宠物** → 使用匹配算法
4. **发送消息** → 建立聊天
5. **分享日记** → 社区互动
6. **使用市集** → 交易和配种

## 📊 API 错误处理

```typescript
try {
  const result = await apiService.createPet(data);
  if (result.success) {
    // 操作成功
  }
} catch (error) {
  console.error('操作失败:', error.message);
  // 显示错误提示
}
```

## 🌐 跨域配置

后端已配置 CORS，允许:
- 来源: `http://localhost:3000`
- 方法: GET, POST, PUT, DELETE, PATCH
- 请求头: Content-Type, Authorization

## 📱 移动优化

前端已使用 Vite + Tailwind CSS 优化移动体验:
- 响应式设计
- 动画优化
- 图片懒加载
- 性能优化

## 🔄 数据同步

前后端通过 RESTful API 同步数据:

```
前端 (React)
    ↓ HTTP 请求
后端 (Express)
    ↓ 业务逻辑处理
Supabase (PostgreSQL)
    ↓ 数据存储
```

## 📈 下一步

- [ ] 集成 WebSocket 实现实时消息
- [ ] 添加图片上传到 CDN
- [ ] 集成支付系统
- [ ] 实现推送通知
- [ ] 性能测试和优化
- [ ] 部署到生产环境

---

**最后更新**: 2026年4月3日

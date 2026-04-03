vite_base: http://localhost:3001

# PUPY (爪住) 前后端集成API服务

## 功能概览

本集成文件提供了前后端通信的核心服务。

### 已集成功能

✅ 用户认证 (注册/登录)
✅ 宠物管理 (创建/编辑/删除/数字分身)
✅ 宠物匹配算法 (兼容性计算)
✅ 实时消息系统
✅ 宠物日记 (带评论和赞功能)
✅ 市集功能 (浏览/搜索/发布)
✅ 配种管理
✅ AI祈祷功能
✅ 通知系统

## 前端集成方式

### 1. 创建 API 服务文件

在前端项目中创建 `src/services/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken() {
    return this.token || localStorage.getItem('auth_token');
  }

  private getHeaders() {
    const headers: any = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(
    endpoint: string,
    method: string = 'GET',
    body?: any
  ) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || '请求失败');
    }
    return data;
  }

  // 认证接口
  async register(username: string, email: string, password: string, age: number, gender: string, city: string) {
    return this.request('/api/auth/register', 'POST', {
      username, email, password, age, gender, resident_city: city
    });
  }

  async login(email: string, password: string) {
    return this.request('/api/auth/login', 'POST', { email, password });
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  // 宠物接口
  async createPet(data: any) {
    return this.request('/api/pets', 'POST', data);
  }

  async getPets() {
    return this.request('/api/pets');
  }

  async getPetById(petId: string) {
    return this.request(`/api/pets/${petId}`);
  }

  async updatePet(petId: string, data: any) {
    return this.request(`/api/pets/${petId}`, 'PUT', data);
  }

  async deletePet(petId: string) {
    return this.request(`/api/pets/${petId}`, 'DELETE');
  }

  // 匹配接口
  async createMatch(userBId: string, petAId: string, petBId: string) {
    return this.request('/api/matches', 'POST', {
      user_b_id: userBId,
      pet_a_id: petAId,
      pet_b_id: petBId,
    });
  }

  async getMatches(page: number = 1) {
    return this.request(`/api/matches?page=${page}&limit=20`);
  }

  // 消息接口
  async getChatRooms(page: number = 1) {
    return this.request(`/api/messages/rooms?page=${page}`);
  }

  async getOrCreateChatRoom(userBId: string) {
    return this.request('/api/messages/rooms', 'POST', { user_b_id: userBId });
  }

  async sendMessage(chatRoomId: string, receiverId: string, content: string) {
    return this.request(`/api/messages/rooms/${chatRoomId}/messages`, 'POST', {
      receiver_id: receiverId,
      content,
    });
  }

  async getChatMessages(chatRoomId: string, page: number = 1) {
    return this.request(`/api/messages/rooms/${chatRoomId}/messages?page=${page}`);
  }

  // 日记接口
  async createDiary(data: any) {
    return this.request('/api/diaries', 'POST', data);
  }

  async getUserDiaries(page: number = 1) {
    return this.request(`/api/diaries?page=${page}`);
  }

  async getPublicDiaries(page: number = 1) {
    return this.request(`/api/diaries/public/feed?page=${page}`);
  }

  async likeDiary(diaryId: string) {
    return this.request(`/api/diaries/${diaryId}/like`, 'POST');
  }

  async addComment(diaryId: string, content: string) {
    return this.request(`/api/diaries/${diaryId}/comments`, 'POST', { content });
  }

  // 市集接口
  async getMarketProducts(category: string, page: number = 1) {
    return this.request(`/api/market/category/${category}?page=${page}`);
  }

  async searchMarket(keyword: string, page: number = 1) {
    return this.request(`/api/market/search?keyword=${keyword}&page=${page}`);
  }

  // 配种接口
  async createBreedingRequest(data: any) {
    return this.request('/api/breeding', 'POST', data);
  }

  async getBreedingRequests(page: number = 1) {
    return this.request(`/api/breeding?page=${page}`);
  }

  // AI祈祷接口
  async createPrayer(petId: string, text: string) {
    return this.request('/api/ai/prayer', 'POST', {
      pet_id: petId,
      prayer_text: text,
    });
  }
}

export const apiService = new ApiService();
```

### 2. 环境变量配置

在 `.env` 添加:
```env
VITE_API_URL=http://localhost:3001
```

### 3. 在组件中使用

```typescript
import { apiService } from './services/api';

// 登录
const result = await apiService.login(email, password);
apiService.setToken(result.data.token);

// 创建宠物
const pet = await apiService.createPet({
  name: '小汪',
  type: '金毛',
  gender: '公',
  // ...
});

// 发送消息
await apiService.sendMessage(chatRoomId, receiverId, 'Hello!');
```

## 数据流示

```
┌─────────────┐
│  前端 React │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────────────────┐
│  后端 Express.js API    │
│  - 验证和处理请求       │
│  - 业务逻辑             │
└──────┬──────────────────┘
       │ Supabase SDK
       ▼
┌─────────────────────────┐
│  Supabase (PostgreSQL)  │
│  - 数据存储和检索       │
│  - 认证管理             │
└─────────────────────────┘
```

## 错误处理

所有 API 调用应该使用 try-catch:

```typescript
try {
  const result = await apiService.createPet(petData);
  console.log('宠物创建成功', result.data);
} catch (error) {
  console.error('创建失败:', error.message);
  // 显示错误提示给用户
}
```

## 性能优化建议

1. **缓存**: 使用 React Query 或 SWR 缓存 API 响应
2. **分页**: 实现虚拟滚动处理大列表
3. **图片优化**: 使用 WebP 和响应式图片
4. **代码分割**: 按路由进行代码分割
5. **预加载**: 预加载常用数据

## 下一步

1. ✅ 后端 API 已完成
2. ⏳ 集成 API 服务到前端
3. ⏳ 处理认证流程
4. ⏳ 实现实时功能 (WebSocket可选)
5. ⏳ 测试和部署

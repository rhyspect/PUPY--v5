// API 服务配置文件
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: number;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

class ApiService {
  private baseUrl = API_BASE_URL;
  private token: string | null = null;

  constructor() {
    // 从 localStorage 恢复 token
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('pupy_token') : null;
    if (savedToken) {
      this.token = savedToken;
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pupy_token', token);
    }
  }

  getToken() {
    return this.token || (typeof window !== 'undefined' ? localStorage.getItem('pupy_token') : null);
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pupy_token');
    }
  }

  private getHeaders() {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `请求失败: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error(`API Error (${endpoint}):`, error.message);
      throw error;
    }
  }

  // ==================== 认证接口 ====================
  async register(
    username: string,
    email: string,
    password: string,
    age: number,
    gender: '男' | '女' | '其他',
    resident_city: string
  ) {
    const result = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        email,
        password,
        age,
        gender,
        resident_city,
      }),
    });

    if (result.data?.token) {
      this.setToken(result.data.token);
    }

    return result;
  }

  async login(email: string, password: string) {
    const result = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.data?.token) {
      this.setToken(result.data.token);
    }

    return result;
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  async logout() {
    this.clearToken();
  }

  // ==================== 宠物接口 ====================
  async createPet(petData: any) {
    return this.request('/api/pets', {
      method: 'POST',
      body: JSON.stringify(petData),
    });
  }

  async getPets() {
    return this.request('/api/pets');
  }

  async getPetById(petId: string) {
    return this.request(`/api/pets/${petId}`);
  }

  async updatePet(petId: string, updates: any) {
    return this.request(`/api/pets/${petId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deletePet(petId: string) {
    return this.request(`/api/pets/${petId}`, {
      method: 'DELETE',
    });
  }

  async createDigitalTwin(petId: string, modelUrl: string, aiPersonality: string) {
    return this.request(`/api/pets/${petId}/digital-twin`, {
      method: 'POST',
      body: JSON.stringify({ modelUrl, aiPersonality }),
    });
  }

  // ==================== 匹配接口 ====================
  async createMatch(userBId: string, petAId: string, petBId: string) {
    return this.request('/api/matches', {
      method: 'POST',
      body: JSON.stringify({
        user_b_id: userBId,
        pet_a_id: petAId,
        pet_b_id: petBId,
      }),
    });
  }

  async getMatches(page = 1, limit = 20) {
    return this.request(`/api/matches?page=${page}&limit=${limit}`);
  }

  async updateMatchStatus(matchId: string, status: 'matched' | 'rejected') {
    return this.request(`/api/matches/${matchId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // ==================== 消息接口 ====================
  async getChatRooms(page = 1, limit = 20) {
    return this.request(`/api/messages/rooms?page=${page}&limit=${limit}`);
  }

  async getOrCreateChatRoom(userBId: string) {
    return this.request('/api/messages/rooms', {
      method: 'POST',
      body: JSON.stringify({ user_b_id: userBId }),
    });
  }

  async sendMessage(chatRoomId: string, receiverId: string, content: string) {
    return this.request(`/api/messages/rooms/${chatRoomId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        receiver_id: receiverId,
        content,
      }),
    });
  }

  async getChatMessages(chatRoomId: string, page = 1, limit = 50) {
    return this.request(`/api/messages/rooms/${chatRoomId}/messages?page=${page}&limit=${limit}`);
  }

  // ==================== 日记接口 ====================
  async createDiary(
    petId: string,
    title: string,
    content: string,
    images?: string[],
    mood?: string,
    tags?: string[],
    isPublic = false
  ) {
    return this.request('/api/diaries', {
      method: 'POST',
      body: JSON.stringify({
        pet_id: petId,
        title,
        content,
        images,
        mood,
        tags,
        is_public: isPublic,
      }),
    });
  }

  async getUserDiaries(page = 1, limit = 20) {
    return this.request(`/api/diaries?page=${page}&limit=${limit}`);
  }

  async getPublicDiaries(page = 1, limit = 20) {
    return this.request(`/api/diaries/public/feed?page=${page}&limit=${limit}`);
  }

  async getDiaryById(diaryId: string) {
    return this.request(`/api/diaries/${diaryId}`);
  }

  async updateDiary(diaryId: string, updates: any) {
    return this.request(`/api/diaries/${diaryId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteDiary(diaryId: string) {
    return this.request(`/api/diaries/${diaryId}`, {
      method: 'DELETE',
    });
  }

  async likeDiary(diaryId: string) {
    return this.request(`/api/diaries/${diaryId}/like`, {
      method: 'POST',
    });
  }

  async unlikeDiary(diaryId: string) {
    return this.request(`/api/diaries/${diaryId}/like`, {
      method: 'DELETE',
    });
  }

  async addComment(diaryId: string, content: string) {
    return this.request(`/api/diaries/${diaryId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async getComments(diaryId: string, page = 1, limit = 20) {
    return this.request(`/api/diaries/${diaryId}/comments?page=${page}&limit=${limit}`);
  }

  // ==================== 市集接口 ====================
  async createMarketProduct(productData: any) {
    return this.request('/api/market', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async getMarketByCategory(category: string, page = 1, limit = 20) {
    return this.request(`/api/market/category/${category}?page=${page}&limit=${limit}`);
  }

  async searchMarket(keyword: string, page = 1, limit = 20) {
    return this.request(`/api/market/search?keyword=${keyword}&page=${page}&limit=${limit}`);
  }

  async getSellerProducts(sellerId: string) {
    return this.request(`/api/market/seller/${sellerId}`);
  }

  async updateMarketProduct(productId: string, updates: any) {
    return this.request(`/api/market/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteMarketProduct(productId: string) {
    return this.request(`/api/market/${productId}`, {
      method: 'DELETE',
    });
  }

  async getBreedingMarket(page = 1, limit = 20) {
    return this.request(`/api/market/breeding/market?page=${page}&limit=${limit}`);
  }

  // ==================== 配种接口 ====================
  async createBreedingRequest(
    receiverId: string,
    senderPetId: string,
    receiverPetId: string,
    notes = ''
  ) {
    return this.request('/api/breeding', {
      method: 'POST',
      body: JSON.stringify({
        receiver_id: receiverId,
        sender_pet_id: senderPetId,
        receiver_pet_id: receiverPetId,
        notes,
      }),
    });
  }

  async getBreedingRequests(page = 1, limit = 20) {
    return this.request(`/api/breeding?page=${page}&limit=${limit}`);
  }

  async updateBreedingStatus(requestId: string, status: 'accepted' | 'rejected' | 'completed') {
    return this.request(`/api/breeding/${requestId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // ==================== AI 祈祷接口 ====================
  async createPrayer(petId: string, prayerText: string) {
    return this.request('/api/ai/prayer', {
      method: 'POST',
      body: JSON.stringify({
        pet_id: petId,
        prayer_text: prayerText,
      }),
    });
  }

  async getPrayerRecords(page = 1, limit = 20) {
    return this.request(`/api/ai/prayer?page=${page}&limit=${limit}`);
  }

  async getNotifications() {
    return this.request('/api/ai/notifications');
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/api/ai/notifications/${notificationId}`, {
      method: 'PATCH',
    });
  }

  // ==================== 健康检查 ====================
  async healthCheck() {
    return this.request('/health');
  }

  async getApiVersion() {
    return this.request('/api/version');
  }
}

export const apiService = new ApiService();
export default apiService;

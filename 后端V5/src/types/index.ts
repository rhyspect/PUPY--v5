// 用户类型 User Types
export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  age: number;
  gender: '男' | '女' | '其他';
  resident_city: string;
  frequent_cities: string[];
  hobbies: string[];
  mbti: string;
  signature: string;
  avatar_url: string;
  bio: string;
  is_verified: boolean;
  verification_token?: string;
  created_at: string;
  updated_at: string;
  last_login: string;
}

// 宠物类型 Pet Types
export interface Pet {
  id: string;
  user_id: string;
  name: string;
  type: string;
  gender: '公' | '母';
  personality: 'E系浓宠' | 'I系淡宠';
  breed: string;
  age: number;
  weight: number;
  images: string[];
  bio: string;
  is_digital_twin: boolean;
  digital_twin_data?: DigitalTwinData;
  health_status: 'healthy' | 'sick' | 'injured';
  vaccinated: boolean;
  pedigree_info: string;
  created_at: string;
  updated_at: string;
}

// 数字分身数据 Digital Twin Data
export interface DigitalTwinData {
  model_url: string;
  generated_at: string;
  ai_personality: string;
  voice_sample?: string;
}

// 匹配类型 Match Types
export interface Match {
  id: string;
  user_a_id: string;
  user_b_id: string;
  pet_a_id: string;
  pet_b_id: string;
  compatibility_score: number;
  status: 'pending' | 'matched' | 'rejected';
  created_at: string;
  updated_at: string;
}

// 消息类型 Message Types
export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

// 聊天室类型 Chat Room Types
export interface ChatRoom {
  id: string;
  user_a_id: string;
  user_b_id: string;
  last_message?: string;
  last_message_time?: string;
  created_at: string;
  updated_at: string;
}

// 日记类型 Diary Types
export interface Diary {
  id: string;
  user_id: string;
  pet_id: string;
  title: string;
  content: string;
  images: string[];
  mood: string;
  tags: string[];
  is_public: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

// 市集商品类型 Market Product Types
export interface MarketProduct {
  id: string;
  seller_id: string;
  pet_id: string;
  title: string;
  description: string;
  category: string;
  price?: number;
  images: string[];
  status: 'active' | 'sold' | 'inactive';
  type: 'breeding' | 'service' | 'care_product' | 'toy' | 'food';
  requirements?: string;
  created_at: string;
  updated_at: string;
}

// 配种类型 Breeding Types
export interface BreedingRequest {
  id: string;
  sender_id: string;
  sender_pet_id: string;
  receiver_id: string;
  receiver_pet_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  notes: string;
  created_at: string;
  updated_at: string;
}

// 通知类型 Notification Types
export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: 'match' | 'message' | 'breeding' | 'like' | 'system';
  related_user_id?: string;
  is_read: boolean;
  created_at: string;
}

// 祈祷类型 Prayer Types
export interface PrayerRecord {
  id: string;
  user_id: string;
  pet_id: string;
  prayer_text: string;
  ai_response: string;
  sentiment: string;
  created_at: string;
}

// 用户统计类型 User Stats Types
export interface UserStats {
  id: string;
  user_id: string;
  level: number;
  experience_points: number;
  achievements: string[];
  total_matches: number;
  total_likes: number;
  diary_count: number;
  updated_at: string;
}

// 评论类型 Comment Types
export interface Comment {
  id: string;
  diary_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// 点赞类型 Like Types
export interface Like {
  id: string;
  diary_id: string;
  user_id: string;
  created_at: string;
}

// API 响应类型 API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  message?: string;
}

// JWT Payload 类型
export interface JWTPayload {
  user_id: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}

// 请求参数类型 Request Parameter Types
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  age: number;
  gender: '男' | '女' | '其他';
  resident_city: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreatePetRequest {
  name: string;
  type: string;
  gender: '公' | '母';
  personality: 'E系浓宠' | 'I系淡宠';
  breed: string;
  age: number;
  weight: number;
  images: string[];
  bio: string;
}

export interface UpdateUserRequest {
  username?: string;
  age?: number;
  gender?: '男' | '女' | '其他';
  resident_city?: string;
  frequent_cities?: string[];
  hobbies?: string[];
  mbti?: string;
  signature?: string;
  avatar_url?: string;
  bio?: string;
}

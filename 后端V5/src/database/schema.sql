// Supabase SQL Schema 数据库模式
// 在 Supabase 控制面板中执行此 SQL

const schema = `
-- 允许匿名用户访问的列

-- 启用 UUID 数据库扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户表 - Users Table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  age INTEGER,
  gender VARCHAR(10),
  resident_city VARCHAR(255),
  frequent_cities TEXT[],
  hobbies TEXT[],
  mbti VARCHAR(10),
  signature TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- 宠物表 - Pets Table
CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255),
  gender VARCHAR(10),
  personality VARCHAR(255),
  breed VARCHAR(255),
  age INTEGER,
  weight DECIMAL(5,2),
  images TEXT[],
  bio TEXT,
  is_digital_twin BOOLEAN DEFAULT FALSE,
  digital_twin_data JSONB,
  health_status VARCHAR(50) DEFAULT 'healthy',
  vaccinated BOOLEAN DEFAULT FALSE,
  pedigree_info TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 匹配表 - Matches Table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_a_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pet_a_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  pet_b_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  compatibility_score DECIMAL(3,2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 聊天室表 - Chat Rooms Table
CREATE TABLE public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_a_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_a_id, user_b_id)
);

-- 消息表 - Messages Table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 日记表 - Diaries Table
CREATE TABLE public.diaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  images TEXT[],
  mood VARCHAR(50),
  tags TEXT[],
  is_public BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 评论表 - Comments Table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diary_id UUID NOT NULL REFERENCES public.diaries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 点赞表 - Likes Table
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diary_id UUID NOT NULL REFERENCES public.diaries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(diary_id, user_id)
);

-- 市集商品表 - Market Products Table
CREATE TABLE public.market_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(255),
  price DECIMAL(10,2),
  images TEXT[],
  status VARCHAR(50) DEFAULT 'active',
  type VARCHAR(50),
  requirements TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 配种请求表 - Breeding Requests Table
CREATE TABLE public.breeding_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sender_pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 通知表 - Notifications Table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type VARCHAR(50),
  related_user_id UUID REFERENCES public.users(id),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 祈祷记录表 - Prayer Records Table
CREATE TABLE public.prayer_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  prayer_text TEXT NOT NULL,
  ai_response TEXT,
  sentiment VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户统计表 - User Stats Table
CREATE TABLE public.user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  achievements TEXT[] DEFAULT '{}',
  total_matches INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  diary_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引提高性能 - Create Indexes for Performance
CREATE INDEX idx_pets_user_id ON public.pets(user_id);
CREATE INDEX idx_matches_user_a_id ON public.matches(user_a_id);
CREATE INDEX idx_matches_user_b_id ON public.matches(user_b_id);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_chat_rooms_user_a_id ON public.chat_rooms(user_a_id);
CREATE INDEX idx_chat_rooms_user_b_id ON public.chat_rooms(user_b_id);
CREATE INDEX idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_diaries_user_id ON public.diaries(user_id);
CREATE INDEX idx_diaries_pet_id ON public.diaries(pet_id);
CREATE INDEX idx_diaries_is_public ON public.diaries(is_public);
CREATE INDEX idx_comments_diary_id ON public.comments(diary_id);
CREATE INDEX idx_likes_diary_id ON public.likes(diary_id);
CREATE INDEX idx_market_products_seller_id ON public.market_products(seller_id);
CREATE INDEX idx_market_products_status ON public.market_products(status);
CREATE INDEX idx_breeding_requests_sender_id ON public.breeding_requests(sender_id);
CREATE INDEX idx_breeding_requests_receiver_id ON public.breeding_requests(receiver_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_prayer_records_user_id ON public.prayer_records(user_id);

-- RLS 策略 - Row Level Security Policies (可选，根据需要启用)
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- 更新触发器 - Update Timestamp Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON public.pets
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON public.chat_rooms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diaries_updated_at BEFORE UPDATE ON public.diaries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_breeding_requests_updated_at BEFORE UPDATE ON public.breeding_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_market_products_updated_at BEFORE UPDATE ON public.market_products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

export default schema;

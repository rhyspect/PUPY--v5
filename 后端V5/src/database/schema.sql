CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  age INTEGER,
  gender VARCHAR(32),
  resident_city VARCHAR(255),
  frequent_cities TEXT[] DEFAULT '{}',
  hobbies TEXT[] DEFAULT '{}',
  mbti VARCHAR(16),
  signature TEXT,
  avatar_url TEXT,
  photos TEXT[] DEFAULT '{}',
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255),
  gender VARCHAR(32),
  personality VARCHAR(255),
  breed VARCHAR(255),
  age INTEGER,
  weight DECIMAL(5,2),
  images TEXT[] DEFAULT '{}',
  bio TEXT,
  is_digital_twin BOOLEAN DEFAULT FALSE,
  digital_twin_data JSONB,
  health_status VARCHAR(50) DEFAULT 'healthy',
  vaccinated BOOLEAN DEFAULT FALSE,
  pedigree_info TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.matches (
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

CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_a_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_a_id, user_b_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.diaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  mood VARCHAR(50),
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diary_id UUID NOT NULL REFERENCES public.diaries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diary_id UUID NOT NULL REFERENCES public.diaries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(diary_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.market_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(255),
  price DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'active',
  type VARCHAR(50),
  requirements TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.breeding_requests (
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

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type VARCHAR(50),
  related_user_id UUID REFERENCES public.users(id),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.prayer_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  prayer_text TEXT NOT NULL,
  ai_response TEXT,
  sentiment VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.user_stats (
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

CREATE TABLE IF NOT EXISTS public.market_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_no VARCHAR(64) UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  city VARCHAR(255),
  source VARCHAR(100) DEFAULT 'market',
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  fulfillment_status VARCHAR(50) DEFAULT 'pending',
  total DECIMAL(10,2) DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.market_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.market_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.market_products(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  image TEXT,
  unit_price DECIMAL(10,2) DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.walk_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_no VARCHAR(64) UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  walker_name VARCHAR(255) NOT NULL,
  city VARCHAR(255),
  service_zone VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  review_status VARCHAR(50) DEFAULT 'pending',
  scheduled_at TIMESTAMP,
  duration_minutes INTEGER DEFAULT 60,
  price DECIMAL(10,2) DEFAULT 0,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.care_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_no VARCHAR(64) UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  merchant_name VARCHAR(255) NOT NULL,
  city VARCHAR(255),
  service_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  review_status VARCHAR(50) DEFAULT 'pending',
  scheduled_at TIMESTAMP,
  price DECIMAL(10,2) DEFAULT 0,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.pet_love_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_a_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  owner_b_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  pet_a_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  pet_b_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  city VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  review_status VARCHAR(50) DEFAULT 'pending',
  romance_stage VARCHAR(100) DEFAULT 'profile_view',
  compatibility_score DECIMAL(4,2) DEFAULT 0,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_no VARCHAR(64) UNIQUE NOT NULL,
  type VARCHAR(20) DEFAULT 'owner',
  title VARCHAR(255),
  city VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  user_a_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_b_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  pet_a_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  pet_b_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  unread_count INTEGER DEFAULT 0,
  latest_snippet TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.chat_session_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  sender_label VARCHAR(255) NOT NULL,
  sender_role VARCHAR(20) DEFAULT 'owner',
  content TEXT NOT NULL,
  moderation_status VARCHAR(50) DEFAULT 'normal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pets_user_id ON public.pets(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_user_a_id ON public.matches(user_a_id);
CREATE INDEX IF NOT EXISTS idx_matches_user_b_id ON public.matches(user_b_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_user_a_id ON public.chat_rooms(user_a_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_user_b_id ON public.chat_rooms(user_b_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_diaries_user_id ON public.diaries(user_id);
CREATE INDEX IF NOT EXISTS idx_market_products_seller_id ON public.market_products(seller_id);
CREATE INDEX IF NOT EXISTS idx_breeding_requests_sender_id ON public.breeding_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_breeding_requests_receiver_id ON public.breeding_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_market_orders_user_id ON public.market_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_market_orders_seller_id ON public.market_orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_market_order_items_order_id ON public.market_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_walk_orders_user_id ON public.walk_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_care_bookings_user_id ON public.care_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_pet_love_records_owner_a_id ON public.pet_love_records(owner_a_id);
CREATE INDEX IF NOT EXISTS idx_pet_love_records_owner_b_id ON public.pet_love_records(owner_b_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_a_id ON public.chat_sessions(user_a_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_b_id ON public.chat_sessions(user_b_id);
CREATE INDEX IF NOT EXISTS idx_chat_session_messages_session_id ON public.chat_session_messages(session_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pets_updated_at ON public.pets;
CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON public.pets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_matches_updated_at ON public.matches;
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chat_rooms_updated_at ON public.chat_rooms;
CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON public.chat_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_diaries_updated_at ON public.diaries;
CREATE TRIGGER update_diaries_updated_at BEFORE UPDATE ON public.diaries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_breeding_requests_updated_at ON public.breeding_requests;
CREATE TRIGGER update_breeding_requests_updated_at BEFORE UPDATE ON public.breeding_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_market_products_updated_at ON public.market_products;
CREATE TRIGGER update_market_products_updated_at BEFORE UPDATE ON public.market_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_market_orders_updated_at ON public.market_orders;
CREATE TRIGGER update_market_orders_updated_at BEFORE UPDATE ON public.market_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_walk_orders_updated_at ON public.walk_orders;
CREATE TRIGGER update_walk_orders_updated_at BEFORE UPDATE ON public.walk_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_care_bookings_updated_at ON public.care_bookings;
CREATE TRIGGER update_care_bookings_updated_at BEFORE UPDATE ON public.care_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pet_love_records_updated_at ON public.pet_love_records;
CREATE TRIGGER update_pet_love_records_updated_at BEFORE UPDATE ON public.pet_love_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON public.chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

GRANT USAGE ON SCHEMA public TO service_role;

GRANT ALL PRIVILEGES ON TABLE
  public.market_orders,
  public.market_order_items,
  public.walk_orders,
  public.care_bookings,
  public.pet_love_records,
  public.chat_sessions,
  public.chat_session_messages
TO service_role;

NOTIFY pgrst, 'reload schema';

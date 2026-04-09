CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

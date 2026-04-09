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

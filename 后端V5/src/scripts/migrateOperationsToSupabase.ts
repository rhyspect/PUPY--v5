import { createClient } from '@supabase/supabase-js';
import { countOperationTables, saveCareBookingRecord, saveChatSessionRecord, saveMarketOrderRecord, savePetLoveRecordRecord, saveWalkOrderRecord } from '../services/operationsStore.js';
import { getAdminRuntimeConfig } from '../services/adminRuntimeStore.js';
import config from '../config/index.js';

async function main() {
  const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey || config.supabase.anonKey, {
    auth: { persistSession: false },
  });
  const probeTables = ['market_orders', 'walk_orders', 'care_bookings', 'pet_love_records', 'chat_sessions', 'chat_session_messages'];
  for (const table of probeTables) {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      throw new Error(`远端 Supabase 还未就绪：${table} 不可访问。${error.message}`);
    }
  }

  const runtime = getAdminRuntimeConfig();
  const before = await countOperationTables();

  for (const order of runtime.marketOrders) {
    await saveMarketOrderRecord({
      ...order,
      items: order.items,
    });
  }

  for (const order of runtime.walkOrders) {
    await saveWalkOrderRecord(order);
  }

  for (const booking of runtime.careBookings) {
    await saveCareBookingRecord(booking);
  }

  for (const record of runtime.petLoveRecords) {
    await savePetLoveRecordRecord(record);
  }

  for (const session of runtime.chatSessions) {
    await saveChatSessionRecord({
      ...session,
      messages: session.messages,
    });
  }

  const after = await countOperationTables();

  console.log(JSON.stringify({
    success: true,
    before,
    after,
    migrated: {
      marketOrders: runtime.marketOrders.length,
      walkOrders: runtime.walkOrders.length,
      careBookings: runtime.careBookings.length,
      petLoveRecords: runtime.petLoveRecords.length,
      chatSessions: runtime.chatSessions.length,
    },
  }, null, 2));
}

main().catch((error) => {
  console.error('Migrate operations to Supabase failed:', error);
  process.exit(1);
});

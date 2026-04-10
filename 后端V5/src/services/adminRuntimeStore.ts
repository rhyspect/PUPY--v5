import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export interface AdminRuntimeRealm {
  id: string;
  name: string;
  description: string;
  onlineCount: number;
  loadingPhrases: string[];
  active: boolean;
}

export interface AdminActivityLog {
  id: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  createdAt: string;
}

export interface AdminMarketOrderItem {
  productId: string;
  title: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

export interface AdminMarketOrder {
  id: string;
  orderNo: string;
  userName: string;
  userEmail: string;
  petName: string;
  sellerName: string;
  city: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  total: number;
  quantity: number;
  note?: string;
  source: string;
  items: AdminMarketOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminWalkOrder {
  id: string;
  orderNo: string;
  userName: string;
  userEmail: string;
  petName: string;
  walkerName: string;
  city: string;
  serviceZone: string;
  status: string;
  reviewStatus: string;
  scheduledAt: string;
  durationMinutes: number;
  price: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCareBooking {
  id: string;
  bookingNo: string;
  userName: string;
  userEmail: string;
  petName: string;
  merchantName: string;
  city: string;
  serviceName: string;
  status: string;
  reviewStatus: string;
  scheduledAt: string;
  price: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPetLoveRecord {
  id: string;
  petAName: string;
  petBName: string;
  ownerAName: string;
  ownerBName: string;
  city: string;
  status: string;
  reviewStatus: string;
  romanceStage: string;
  compatibilityScore: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminChatMessage {
  id: string;
  senderName: string;
  role: 'owner' | 'pet' | 'system';
  content: string;
  createdAt: string;
  moderationStatus: string;
}

export interface AdminChatSession {
  id: string;
  sessionNo: string;
  type: 'owner' | 'pet';
  title: string;
  participants: string[];
  relatedPets: string[];
  city: string;
  status: string;
  unreadCount: number;
  latestSnippet: string;
  messages: AdminChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminRuntimeConfig {
  realms: AdminRuntimeRealm[];
  activityLogs: AdminActivityLog[];
  marketOrders: AdminMarketOrder[];
  walkOrders: AdminWalkOrder[];
  careBookings: AdminCareBooking[];
  petLoveRecords: AdminPetLoveRecord[];
  chatSessions: AdminChatSession[];
  updatedAt: string;
}

const DEFAULT_LOADING_PHRASES = [
  '正在帮[狗狗名字]穿上云端漫步靴...',
  '[狗狗名字]正兴奋地跑向云端森林...',
  '正在同步[狗狗名字]的社交嗅觉...',
  '嗅到了！附近有 12 只熟悉的小伙伴...',
];

const now = Date.now();
const isoHoursAgo = (hoursAgo: number) => new Date(now - hoursAgo * 60 * 60 * 1000).toISOString();

const MARKET_ORDER_SAMPLES: AdminMarketOrder[] = [
  {
    id: 'market-order-001',
    orderNo: 'PUPY-MO-240901',
    userName: '苏栗',
    userEmail: 'suli@pupy.app',
    petName: '奶油',
    sellerName: '爪住精选旗舰店',
    city: '上海',
    status: '待发货',
    paymentStatus: '已付款',
    fulfillmentStatus: '待拣货',
    total: 428,
    quantity: 3,
    note: '高蛋白主粮 + 关节营养包 + 飞盘补货。',
    source: '主粮用品',
    items: [
      { productId: 'food-001', title: '高适口冻干主粮', image: '', unitPrice: 199, quantity: 1 },
      { productId: 'care-001', title: '关节养护营养包', image: '', unitPrice: 129, quantity: 1 },
      { productId: 'toy-001', title: '飞盘训练套组', image: '', unitPrice: 50, quantity: 2 },
    ],
    createdAt: isoHoursAgo(4),
    updatedAt: isoHoursAgo(2),
  },
  {
    id: 'market-order-002',
    orderNo: 'PUPY-MO-240902',
    userName: '沈雾',
    userEmail: 'shenwu@pupy.app',
    petName: '糯米',
    sellerName: '小爪营养仓',
    city: '上海',
    status: '配送中',
    paymentStatus: '已付款',
    fulfillmentStatus: '运输中',
    total: 316,
    quantity: 2,
    note: '晚间配送，前台可代收。',
    source: '主粮用品',
    items: [
      { productId: 'food-002', title: '低敏羊肉主粮', image: '', unitPrice: 158, quantity: 2 },
    ],
    createdAt: isoHoursAgo(8),
    updatedAt: isoHoursAgo(1),
  },
  {
    id: 'market-order-003',
    orderNo: 'PUPY-MO-240903',
    userName: '乔晚',
    userEmail: 'qiaowan@pupy.app',
    petName: '七喜',
    sellerName: '云端手作补给站',
    city: '杭州',
    status: '已完成',
    paymentStatus: '已付款',
    fulfillmentStatus: '已签收',
    total: 268,
    quantity: 4,
    note: '回购款式，适合拍照出片。',
    source: '主粮用品',
    items: [
      { productId: 'toy-002', title: '毛绒牵引绳配件', image: '', unitPrice: 88, quantity: 2 },
      { productId: 'care-002', title: '香波旅行装', image: '', unitPrice: 46, quantity: 2 },
    ],
    createdAt: isoHoursAgo(14),
    updatedAt: isoHoursAgo(6),
  },
  {
    id: 'market-order-004',
    orderNo: 'PUPY-MO-240904',
    userName: '林檬',
    userEmail: 'linmeng@pupy.app',
    petName: '琥珀',
    sellerName: '爪住集市 · 苏州门店',
    city: '苏州',
    status: '待客服确认',
    paymentStatus: '待付款',
    fulfillmentStatus: '未出库',
    total: 188,
    quantity: 2,
    note: '用户希望改成周末自提。',
    source: '主粮用品',
    items: [
      { productId: 'food-003', title: '鲜肉主粮试吃礼盒', image: '', unitPrice: 128, quantity: 1 },
      { productId: 'toy-003', title: '耐咬发声球', image: '', unitPrice: 60, quantity: 1 },
    ],
    createdAt: isoHoursAgo(18),
    updatedAt: isoHoursAgo(10),
  },
  {
    id: 'market-order-005',
    orderNo: 'PUPY-MO-240905',
    userName: '唐梨',
    userEmail: 'tangli@pupy.app',
    petName: '可颂',
    sellerName: '营养护理实验室',
    city: '南京',
    status: '售后处理中',
    paymentStatus: '已退款中',
    fulfillmentStatus: '退货中',
    total: 256,
    quantity: 2,
    note: '用户反馈尺码偏小，申请换货。',
    source: '主粮用品',
    items: [
      { productId: 'care-003', title: '护毛精华喷雾', image: '', unitPrice: 128, quantity: 2 },
    ],
    createdAt: isoHoursAgo(26),
    updatedAt: isoHoursAgo(3),
  },
  {
    id: 'market-order-006',
    orderNo: 'PUPY-MO-240906',
    userName: '许听',
    userEmail: 'xuting@pupy.app',
    petName: '暖暖',
    sellerName: '城市漫游装备铺',
    city: '上海',
    status: '已完成',
    paymentStatus: '已付款',
    fulfillmentStatus: '已签收',
    total: 539,
    quantity: 5,
    note: '作为云游地图活动礼包发放。',
    source: '主粮用品',
    items: [
      { productId: 'toy-004', title: '夜光胸背套装', image: '', unitPrice: 159, quantity: 1 },
      { productId: 'food-004', title: '冻干零食组合', image: '', unitPrice: 95, quantity: 4 },
    ],
    createdAt: isoHoursAgo(34),
    updatedAt: isoHoursAgo(12),
  },
  {
    id: 'market-order-007',
    orderNo: 'PUPY-MO-240907',
    userName: '顾晴',
    userEmail: 'guqing@pupy.app',
    petName: '栗子',
    sellerName: '社交训练补给仓',
    city: '杭州',
    status: '待发货',
    paymentStatus: '已付款',
    fulfillmentStatus: '待拣货',
    total: 299,
    quantity: 3,
    note: '备注活动价优先发。',
    source: '主粮用品',
    items: [
      { productId: 'toy-005', title: '飞盘进阶组合', image: '', unitPrice: 99, quantity: 3 },
    ],
    createdAt: isoHoursAgo(42),
    updatedAt: isoHoursAgo(18),
  },
  {
    id: 'market-order-008',
    orderNo: 'PUPY-MO-240908',
    userName: '孟枝',
    userEmail: 'mengzhi@pupy.app',
    petName: '布丁',
    sellerName: '海边补给铺',
    city: '宁波',
    status: '已完成',
    paymentStatus: '已付款',
    fulfillmentStatus: '已签收',
    total: 172,
    quantity: 2,
    note: '沙滩出游用具已完成回购。',
    source: '主粮用品',
    items: [
      { productId: 'care-004', title: '足部清洁泡沫', image: '', unitPrice: 86, quantity: 2 },
    ],
    createdAt: isoHoursAgo(56),
    updatedAt: isoHoursAgo(20),
  },
];

const WALK_ORDER_SAMPLES: AdminWalkOrder[] = [
  {
    id: 'walk-order-001',
    orderNo: 'PUPY-WK-240901',
    userName: '苏栗',
    userEmail: 'suli@pupy.app',
    petName: '奶油',
    walkerName: '徐川 · 认证遛犬师',
    city: '上海',
    serviceZone: '徐汇滨江',
    status: '待确认',
    reviewStatus: '待审核',
    scheduledAt: isoHoursAgo(-12),
    durationMinutes: 60,
    price: 168,
    note: '希望带上飞盘并拍几张互动照。',
    createdAt: isoHoursAgo(3),
    updatedAt: isoHoursAgo(2),
  },
  {
    id: 'walk-order-002',
    orderNo: 'PUPY-WK-240902',
    userName: '沈雾',
    userEmail: 'shenwu@pupy.app',
    petName: '糯米',
    walkerName: 'PUPY 城市陪伴官 Luna',
    city: '上海',
    serviceZone: '静安雕塑公园',
    status: '已接单',
    reviewStatus: '已通过',
    scheduledAt: isoHoursAgo(-6),
    durationMinutes: 45,
    price: 138,
    note: '偏安静路线，避免过多人流。',
    createdAt: isoHoursAgo(6),
    updatedAt: isoHoursAgo(1),
  },
  {
    id: 'walk-order-003',
    orderNo: 'PUPY-WK-240903',
    userName: '乔晚',
    userEmail: 'qiaowan@pupy.app',
    petName: '七喜',
    walkerName: '摄影遛遛搭子 阿辰',
    city: '杭州',
    serviceZone: '西湖绿道',
    status: '已完成',
    reviewStatus: '已通过',
    scheduledAt: isoHoursAgo(8),
    durationMinutes: 90,
    price: 218,
    note: '已补回 20 张精选照片。',
    createdAt: isoHoursAgo(20),
    updatedAt: isoHoursAgo(4),
  },
  {
    id: 'walk-order-004',
    orderNo: 'PUPY-WK-240904',
    userName: '林檬',
    userEmail: 'linmeng@pupy.app',
    petName: '琥珀',
    walkerName: '苏州草地局主理人',
    city: '苏州',
    serviceZone: '独墅湖公园',
    status: '已取消',
    reviewStatus: '已拒绝',
    scheduledAt: isoHoursAgo(-20),
    durationMinutes: 60,
    price: 158,
    note: '因天气原因取消，用户待重新下单。',
    createdAt: isoHoursAgo(16),
    updatedAt: isoHoursAgo(5),
  },
  {
    id: 'walk-order-005',
    orderNo: 'PUPY-WK-240905',
    userName: '唐梨',
    userEmail: 'tangli@pupy.app',
    petName: '可颂',
    walkerName: '营养运动陪伴师 Mia',
    city: '南京',
    serviceZone: '玄武湖环线',
    status: '待服务',
    reviewStatus: '已通过',
    scheduledAt: isoHoursAgo(-28),
    durationMinutes: 75,
    price: 198,
    note: '需同步记录运动心率与饮水频次。',
    createdAt: isoHoursAgo(24),
    updatedAt: isoHoursAgo(7),
  },
  {
    id: 'walk-order-006',
    orderNo: 'PUPY-WK-240906',
    userName: '顾晴',
    userEmail: 'guqing@pupy.app',
    petName: '栗子',
    walkerName: '飞盘陪练小组',
    city: '杭州',
    serviceZone: '滨江飞盘草坪',
    status: '已接单',
    reviewStatus: '已通过',
    scheduledAt: isoHoursAgo(-36),
    durationMinutes: 60,
    price: 188,
    note: '高活跃用户，优先安排社交训练型遛遛。',
    createdAt: isoHoursAgo(30),
    updatedAt: isoHoursAgo(9),
  },
];

const CARE_BOOKING_SAMPLES: AdminCareBooking[] = [
  {
    id: 'care-booking-001',
    bookingNo: 'PUPY-CR-240901',
    userName: '苏栗',
    userEmail: 'suli@pupy.app',
    petName: '奶油',
    merchantName: '爪住护理中心 · 徐汇店',
    city: '上海',
    serviceName: '洗护 + 精修 + 香氛护理',
    status: '待到店',
    reviewStatus: '已通过',
    scheduledAt: isoHoursAgo(-10),
    price: 299,
    note: '周末上午档，需温和香氛。',
    createdAt: isoHoursAgo(5),
    updatedAt: isoHoursAgo(1),
  },
  {
    id: 'care-booking-002',
    bookingNo: 'PUPY-CR-240902',
    userName: '沈雾',
    userEmail: 'shenwu@pupy.app',
    petName: '糯米',
    merchantName: '安静系护理室',
    city: '上海',
    serviceName: '低刺激精洗护理',
    status: '已确认',
    reviewStatus: '已通过',
    scheduledAt: isoHoursAgo(-18),
    price: 236,
    note: '门店已安排低噪护理位。',
    createdAt: isoHoursAgo(10),
    updatedAt: isoHoursAgo(2),
  },
  {
    id: 'care-booking-003',
    bookingNo: 'PUPY-CR-240903',
    userName: '乔晚',
    userEmail: 'qiaowan@pupy.app',
    petName: '七喜',
    merchantName: '城市美容实验室',
    city: '杭州',
    serviceName: '拍照造型护理',
    status: '已完成',
    reviewStatus: '已通过',
    scheduledAt: isoHoursAgo(12),
    price: 328,
    note: '用户已追加下次造型预约。',
    createdAt: isoHoursAgo(22),
    updatedAt: isoHoursAgo(6),
  },
  {
    id: 'care-booking-004',
    bookingNo: 'PUPY-CR-240904',
    userName: '林檬',
    userEmail: 'linmeng@pupy.app',
    petName: '琥珀',
    merchantName: '草地局合作门店',
    city: '苏州',
    serviceName: '运动后舒缓护理',
    status: '待审核',
    reviewStatus: '待审核',
    scheduledAt: isoHoursAgo(-30),
    price: 188,
    note: '新增合作商家，等待运营复核资质。',
    createdAt: isoHoursAgo(28),
    updatedAt: isoHoursAgo(12),
  },
  {
    id: 'care-booking-005',
    bookingNo: 'PUPY-CR-240905',
    userName: '唐梨',
    userEmail: 'tangli@pupy.app',
    petName: '可颂',
    merchantName: '营养护理研究所',
    city: '南京',
    serviceName: '皮毛修复疗程',
    status: '待到店',
    reviewStatus: '已通过',
    scheduledAt: isoHoursAgo(-42),
    price: 468,
    note: '需同步上传护理前后对比图。',
    createdAt: isoHoursAgo(32),
    updatedAt: isoHoursAgo(8),
  },
  {
    id: 'care-booking-006',
    bookingNo: 'PUPY-CR-240906',
    userName: '许听',
    userEmail: 'xuting@pupy.app',
    petName: '暖暖',
    merchantName: '城市漫步美容站',
    city: '上海',
    serviceName: '旅行清洁护理',
    status: '已完成',
    reviewStatus: '已通过',
    scheduledAt: isoHoursAgo(20),
    price: 208,
    note: '已带动 3 位用户跟单预约。',
    createdAt: isoHoursAgo(36),
    updatedAt: isoHoursAgo(9),
  },
];

const PET_LOVE_SAMPLES: AdminPetLoveRecord[] = [
  {
    id: 'pet-love-001',
    petAName: '奶油',
    petBName: '云朵',
    ownerAName: '苏栗',
    ownerBName: '白溪',
    city: '上海',
    status: '高热匹配',
    reviewStatus: '已通过',
    romanceStage: '已互相关注',
    compatibilityScore: 0.96,
    note: '用户双方都连续三天打开了聊天会话。',
    createdAt: isoHoursAgo(5),
    updatedAt: isoHoursAgo(1),
  },
  {
    id: 'pet-love-002',
    petAName: '糯米',
    petBName: '可颂',
    ownerAName: '沈雾',
    ownerBName: '唐梨',
    city: '上海',
    status: '待进一步观察',
    reviewStatus: '待审核',
    romanceStage: '资料互看中',
    compatibilityScore: 0.82,
    note: '建议先安排线下遛遛局再推进。',
    createdAt: isoHoursAgo(12),
    updatedAt: isoHoursAgo(4),
  },
  {
    id: 'pet-love-003',
    petAName: '七喜',
    petBName: '栗子',
    ownerAName: '乔晚',
    ownerBName: '顾晴',
    city: '杭州',
    status: '已进入聊天',
    reviewStatus: '已通过',
    romanceStage: '约线下局',
    compatibilityScore: 0.88,
    note: '两位主人都属于高内容活跃用户。',
    createdAt: isoHoursAgo(18),
    updatedAt: isoHoursAgo(6),
  },
  {
    id: 'pet-love-004',
    petAName: '暖暖',
    petBName: '泡芙',
    ownerAName: '许听',
    ownerBName: '叶澄',
    city: '上海',
    status: '平台推荐位',
    reviewStatus: '已通过',
    romanceStage: '双向右滑',
    compatibilityScore: 0.91,
    note: '推荐给重度测试用户展示热闹氛围。',
    createdAt: isoHoursAgo(24),
    updatedAt: isoHoursAgo(7),
  },
  {
    id: 'pet-love-005',
    petAName: '布丁',
    petBName: '蜜豆',
    ownerAName: '孟枝',
    ownerBName: '周翎',
    city: '成都',
    status: '内容热度高',
    reviewStatus: '已通过',
    romanceStage: '日记互评中',
    compatibilityScore: 0.86,
    note: '双方最近互动频次显著上升。',
    createdAt: isoHoursAgo(30),
    updatedAt: isoHoursAgo(10),
  },
  {
    id: 'pet-love-006',
    petAName: '琥珀',
    petBName: '拿铁',
    ownerAName: '林檬',
    ownerBName: '袁澈',
    city: '上海',
    status: '运营关注中',
    reviewStatus: '待复核',
    romanceStage: '约第一次见面',
    compatibilityScore: 0.79,
    note: '需要补充健康记录后再放量展示。',
    createdAt: isoHoursAgo(40),
    updatedAt: isoHoursAgo(14),
  },
];

const CHAT_SESSION_SAMPLES: AdminChatSession[] = [
  {
    id: 'owner-chat-001',
    sessionNo: 'PUPY-CH-240901',
    type: 'owner',
    title: '苏栗 × 白溪 · 主人聊天',
    participants: ['苏栗', '白溪'],
    relatedPets: ['奶油', '云朵'],
    city: '上海',
    status: '活跃',
    unreadCount: 2,
    latestSnippet: '这周末可以先一起去滨江遛一圈。',
    messages: [
      { id: 'owner-chat-001-msg-1', senderName: '苏栗', role: 'owner', content: '我看云朵最近的日记真的很治愈。', createdAt: isoHoursAgo(7), moderationStatus: '正常' },
      { id: 'owner-chat-001-msg-2', senderName: '白溪', role: 'owner', content: '奶油也太会接飞盘了，周末要不要一起遛？', createdAt: isoHoursAgo(6), moderationStatus: '正常' },
      { id: 'owner-chat-001-msg-3', senderName: '苏栗', role: 'owner', content: '可以，我把时间空出来。', createdAt: isoHoursAgo(2), moderationStatus: '正常' },
    ],
    createdAt: isoHoursAgo(12),
    updatedAt: isoHoursAgo(2),
  },
  {
    id: 'owner-chat-002',
    sessionNo: 'PUPY-CH-240902',
    type: 'owner',
    title: '乔晚 × 顾晴 · 主人聊天',
    participants: ['乔晚', '顾晴'],
    relatedPets: ['七喜', '栗子'],
    city: '杭州',
    status: '高频互动',
    unreadCount: 0,
    latestSnippet: '活动海报我今晚做好发给你。',
    messages: [
      { id: 'owner-chat-002-msg-1', senderName: '顾晴', role: 'owner', content: '线下局的人数已经快满了。', createdAt: isoHoursAgo(11), moderationStatus: '正常' },
      { id: 'owner-chat-002-msg-2', senderName: '乔晚', role: 'owner', content: '我来做一版海报，七喜当封面。', createdAt: isoHoursAgo(5), moderationStatus: '正常' },
    ],
    createdAt: isoHoursAgo(18),
    updatedAt: isoHoursAgo(5),
  },
  {
    id: 'pet-chat-001',
    sessionNo: 'PUPY-PC-240901',
    type: 'pet',
    title: '奶油 × 云朵 · 宠物私语',
    participants: ['奶油', '云朵'],
    relatedPets: ['奶油', '云朵'],
    city: '上海',
    status: '热聊中',
    unreadCount: 1,
    latestSnippet: '下次见面我要带上我最喜欢的球。',
    messages: [
      { id: 'pet-chat-001-msg-1', senderName: '奶油', role: 'pet', content: '汪，我听说你家窗边很适合晒太阳。', createdAt: isoHoursAgo(9), moderationStatus: '正常' },
      { id: 'pet-chat-001-msg-2', senderName: '云朵', role: 'pet', content: '喵，那你来时记得带上会发声的小球。', createdAt: isoHoursAgo(4), moderationStatus: '正常' },
    ],
    createdAt: isoHoursAgo(16),
    updatedAt: isoHoursAgo(4),
  },
  {
    id: 'pet-chat-002',
    sessionNo: 'PUPY-PC-240902',
    type: 'pet',
    title: '暖暖 × 泡芙 · 宠物私语',
    participants: ['暖暖', '泡芙'],
    relatedPets: ['暖暖', '泡芙'],
    city: '上海',
    status: '已建立默契',
    unreadCount: 0,
    latestSnippet: '云端森林里见，我带上散步靴。',
    messages: [
      { id: 'pet-chat-002-msg-1', senderName: '暖暖', role: 'pet', content: '我已经学会怎么从雾雨深林跑去半岛午后了。', createdAt: isoHoursAgo(13), moderationStatus: '正常' },
      { id: 'pet-chat-002-msg-2', senderName: '泡芙', role: 'pet', content: '那我在入口等你，一起冲。', createdAt: isoHoursAgo(8), moderationStatus: '正常' },
    ],
    createdAt: isoHoursAgo(20),
    updatedAt: isoHoursAgo(8),
  },
  {
    id: 'owner-chat-003',
    sessionNo: 'PUPY-CH-240903',
    type: 'owner',
    title: '唐梨 × 叶澄 · 主人聊天',
    participants: ['唐梨', '叶澄'],
    relatedPets: ['可颂', '泡芙'],
    city: '上海',
    status: '待回复',
    unreadCount: 3,
    latestSnippet: '我把体检记录发你，你方便看下吗？',
    messages: [
      { id: 'owner-chat-003-msg-1', senderName: '唐梨', role: 'owner', content: '我把最近的体检记录整理好了。', createdAt: isoHoursAgo(10), moderationStatus: '正常' },
      { id: 'owner-chat-003-msg-2', senderName: '叶澄', role: 'owner', content: '收到，我今晚会认真看。', createdAt: isoHoursAgo(9), moderationStatus: '正常' },
      { id: 'owner-chat-003-msg-3', senderName: '唐梨', role: 'owner', content: '也想顺便聊聊主粮换粮计划。', createdAt: isoHoursAgo(1), moderationStatus: '正常' },
    ],
    createdAt: isoHoursAgo(22),
    updatedAt: isoHoursAgo(1),
  },
  {
    id: 'pet-chat-003',
    sessionNo: 'PUPY-PC-240903',
    type: 'pet',
    title: '栗子 × 七喜 · 宠物私语',
    participants: ['栗子', '七喜'],
    relatedPets: ['栗子', '七喜'],
    city: '杭州',
    status: '待审核展示',
    unreadCount: 0,
    latestSnippet: '我今天又拍了超多照片。',
    messages: [
      { id: 'pet-chat-003-msg-1', senderName: '栗子', role: 'pet', content: '我今天跑得可快了。', createdAt: isoHoursAgo(15), moderationStatus: '正常' },
      { id: 'pet-chat-003-msg-2', senderName: '七喜', role: 'pet', content: '那下次要记得站好让我拍照。', createdAt: isoHoursAgo(7), moderationStatus: '正常' },
    ],
    createdAt: isoHoursAgo(26),
    updatedAt: isoHoursAgo(7),
  },
];

const DEFAULT_CONFIG: AdminRuntimeConfig = {
  realms: [
    {
      id: 'misty-forest',
      name: '雾雨深林',
      description: '轻雾、溪流和低饱和的安静氛围，适合慢节奏深度连接。',
      onlineCount: 120,
      loadingPhrases: DEFAULT_LOADING_PHRASES,
      active: true,
    },
    {
      id: 'afternoon-peninsula',
      name: '半岛午后',
      description: '阳光、海风和慵懒陪伴感，适合同城散步与轻社交。',
      onlineCount: 85,
      loadingPhrases: DEFAULT_LOADING_PHRASES,
      active: true,
    },
    {
      id: 'neon-city',
      name: '霓虹幻境',
      description: '高互动、高表达的都市空间，适合快速破冰和活动邀约。',
      onlineCount: 340,
      loadingPhrases: DEFAULT_LOADING_PHRASES,
      active: true,
    },
  ],
  activityLogs: [],
  marketOrders: MARKET_ORDER_SAMPLES,
  walkOrders: WALK_ORDER_SAMPLES,
  careBookings: CARE_BOOKING_SAMPLES,
  petLoveRecords: PET_LOVE_SAMPLES,
  chatSessions: CHAT_SESSION_SAMPLES,
  updatedAt: new Date().toISOString(),
};

const resolveStorePath = () => path.resolve(process.cwd(), 'data/admin-runtime.json');

const ensureStoreFile = () => {
  const filePath = resolveStorePath();
  const directory = path.dirname(filePath);
  mkdirSync(directory, { recursive: true });
  if (!existsSync(filePath)) {
    writeFileSync(filePath, `${JSON.stringify(DEFAULT_CONFIG, null, 2)}\n`, 'utf8');
  }
  return filePath;
};

const sanitizeString = (value: unknown, fallback = '') => String(value ?? fallback).trim() || fallback;
const sanitizeNumber = (value: unknown, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};
const sanitizeBoolean = (value: unknown, fallback = true) => (typeof value === 'boolean' ? value : fallback);

const normalizeRealm = (realm: Partial<AdminRuntimeRealm>, fallback: AdminRuntimeRealm): AdminRuntimeRealm => ({
  id: sanitizeString(realm.id, fallback.id),
  name: sanitizeString(realm.name, fallback.name),
  description: sanitizeString(realm.description, fallback.description),
  onlineCount: Math.max(0, sanitizeNumber(realm.onlineCount, fallback.onlineCount)),
  loadingPhrases:
    Array.isArray(realm.loadingPhrases) && realm.loadingPhrases.filter(Boolean).length
      ? realm.loadingPhrases.map((phrase) => String(phrase).trim()).filter(Boolean)
      : fallback.loadingPhrases,
  active: sanitizeBoolean(realm.active, fallback.active),
});

const normalizeActivityLog = (log: Partial<AdminActivityLog>): AdminActivityLog => ({
  id: sanitizeString(log.id, randomUUID()),
  actorEmail: sanitizeString(log.actorEmail, 'system'),
  action: sanitizeString(log.action, 'update'),
  entityType: sanitizeString(log.entityType, 'runtime'),
  entityId: log.entityId ? String(log.entityId) : null,
  summary: sanitizeString(log.summary, '已记录后台操作。'),
  createdAt: sanitizeString(log.createdAt, new Date().toISOString()),
});

const normalizeMarketOrderItem = (item: Partial<AdminMarketOrderItem>): AdminMarketOrderItem => ({
  productId: sanitizeString(item.productId, `product-${randomUUID()}`),
  title: sanitizeString(item.title, '未命名商品'),
  image: sanitizeString(item.image, ''),
  unitPrice: Math.max(0, sanitizeNumber(item.unitPrice, 0)),
  quantity: Math.max(1, sanitizeNumber(item.quantity, 1)),
});

const normalizeMarketOrder = (order: Partial<AdminMarketOrder>, fallback?: AdminMarketOrder): AdminMarketOrder => ({
  id: sanitizeString(order.id, fallback?.id || `market-order-${randomUUID()}`),
  orderNo: sanitizeString(order.orderNo, fallback?.orderNo || 'PUPY-MO-CUSTOM'),
  userName: sanitizeString(order.userName, fallback?.userName || '未命名用户'),
  userEmail: sanitizeString(order.userEmail, fallback?.userEmail || ''),
  petName: sanitizeString(order.petName, fallback?.petName || '未命名宠物'),
  sellerName: sanitizeString(order.sellerName, fallback?.sellerName || '未命名商家'),
  city: sanitizeString(order.city, fallback?.city || '未填写城市'),
  status: sanitizeString(order.status, fallback?.status || '待处理'),
  paymentStatus: sanitizeString(order.paymentStatus, fallback?.paymentStatus || '待付款'),
  fulfillmentStatus: sanitizeString(order.fulfillmentStatus, fallback?.fulfillmentStatus || '待发货'),
  total: Math.max(0, sanitizeNumber(order.total, fallback?.total || 0)),
  quantity: Math.max(1, sanitizeNumber(order.quantity, fallback?.quantity || 1)),
  note: sanitizeString(order.note, fallback?.note || ''),
  source: sanitizeString(order.source, fallback?.source || '主粮用品'),
  items: Array.isArray(order.items) && order.items.length ? order.items.map((item) => normalizeMarketOrderItem(item)) : fallback?.items || [],
  createdAt: sanitizeString(order.createdAt, fallback?.createdAt || new Date().toISOString()),
  updatedAt: sanitizeString(order.updatedAt, new Date().toISOString()),
});

const normalizeWalkOrder = (order: Partial<AdminWalkOrder>, fallback?: AdminWalkOrder): AdminWalkOrder => ({
  id: sanitizeString(order.id, fallback?.id || `walk-order-${randomUUID()}`),
  orderNo: sanitizeString(order.orderNo, fallback?.orderNo || 'PUPY-WK-CUSTOM'),
  userName: sanitizeString(order.userName, fallback?.userName || '未命名用户'),
  userEmail: sanitizeString(order.userEmail, fallback?.userEmail || ''),
  petName: sanitizeString(order.petName, fallback?.petName || '未命名宠物'),
  walkerName: sanitizeString(order.walkerName, fallback?.walkerName || '待分配遛遛师'),
  city: sanitizeString(order.city, fallback?.city || '未填写城市'),
  serviceZone: sanitizeString(order.serviceZone, fallback?.serviceZone || '待分配服务范围'),
  status: sanitizeString(order.status, fallback?.status || '待确认'),
  reviewStatus: sanitizeString(order.reviewStatus, fallback?.reviewStatus || '待审核'),
  scheduledAt: sanitizeString(order.scheduledAt, fallback?.scheduledAt || new Date().toISOString()),
  durationMinutes: Math.max(15, sanitizeNumber(order.durationMinutes, fallback?.durationMinutes || 60)),
  price: Math.max(0, sanitizeNumber(order.price, fallback?.price || 0)),
  note: sanitizeString(order.note, fallback?.note || ''),
  createdAt: sanitizeString(order.createdAt, fallback?.createdAt || new Date().toISOString()),
  updatedAt: sanitizeString(order.updatedAt, new Date().toISOString()),
});

const normalizeCareBooking = (booking: Partial<AdminCareBooking>, fallback?: AdminCareBooking): AdminCareBooking => ({
  id: sanitizeString(booking.id, fallback?.id || `care-booking-${randomUUID()}`),
  bookingNo: sanitizeString(booking.bookingNo, fallback?.bookingNo || 'PUPY-CR-CUSTOM'),
  userName: sanitizeString(booking.userName, fallback?.userName || '未命名用户'),
  userEmail: sanitizeString(booking.userEmail, fallback?.userEmail || ''),
  petName: sanitizeString(booking.petName, fallback?.petName || '未命名宠物'),
  merchantName: sanitizeString(booking.merchantName, fallback?.merchantName || '未命名商家'),
  city: sanitizeString(booking.city, fallback?.city || '未填写城市'),
  serviceName: sanitizeString(booking.serviceName, fallback?.serviceName || '护理服务'),
  status: sanitizeString(booking.status, fallback?.status || '待确认'),
  reviewStatus: sanitizeString(booking.reviewStatus, fallback?.reviewStatus || '待审核'),
  scheduledAt: sanitizeString(booking.scheduledAt, fallback?.scheduledAt || new Date().toISOString()),
  price: Math.max(0, sanitizeNumber(booking.price, fallback?.price || 0)),
  note: sanitizeString(booking.note, fallback?.note || ''),
  createdAt: sanitizeString(booking.createdAt, fallback?.createdAt || new Date().toISOString()),
  updatedAt: sanitizeString(booking.updatedAt, new Date().toISOString()),
});

const normalizePetLoveRecord = (record: Partial<AdminPetLoveRecord>, fallback?: AdminPetLoveRecord): AdminPetLoveRecord => ({
  id: sanitizeString(record.id, fallback?.id || `pet-love-${randomUUID()}`),
  petAName: sanitizeString(record.petAName, fallback?.petAName || '宠物 A'),
  petBName: sanitizeString(record.petBName, fallback?.petBName || '宠物 B'),
  ownerAName: sanitizeString(record.ownerAName, fallback?.ownerAName || '主人 A'),
  ownerBName: sanitizeString(record.ownerBName, fallback?.ownerBName || '主人 B'),
  city: sanitizeString(record.city, fallback?.city || '未填写城市'),
  status: sanitizeString(record.status, fallback?.status || '待匹配'),
  reviewStatus: sanitizeString(record.reviewStatus, fallback?.reviewStatus || '待审核'),
  romanceStage: sanitizeString(record.romanceStage, fallback?.romanceStage || '资料互看中'),
  compatibilityScore: Math.max(0, Math.min(1, sanitizeNumber(record.compatibilityScore, fallback?.compatibilityScore || 0.75))),
  note: sanitizeString(record.note, fallback?.note || ''),
  createdAt: sanitizeString(record.createdAt, fallback?.createdAt || new Date().toISOString()),
  updatedAt: sanitizeString(record.updatedAt, new Date().toISOString()),
});

const normalizeChatMessage = (message: Partial<AdminChatMessage>): AdminChatMessage => ({
  id: sanitizeString(message.id, `chat-message-${randomUUID()}`),
  senderName: sanitizeString(message.senderName, '未知发送方'),
  role: message.role === 'pet' || message.role === 'system' ? message.role : 'owner',
  content: sanitizeString(message.content, '空消息'),
  createdAt: sanitizeString(message.createdAt, new Date().toISOString()),
  moderationStatus: sanitizeString(message.moderationStatus, '正常'),
});

const inferChatSessionType = (session: Partial<AdminChatSession>, fallback?: AdminChatSession): 'owner' | 'pet' => {
  const sessionNo = sanitizeString(session.sessionNo, fallback?.sessionNo || '');
  if (sessionNo.startsWith('PUPY-PC')) return 'pet';
  if (sessionNo.startsWith('PUPY-CH')) return 'owner';
  if (session.type === 'pet' || session.type === 'owner') return session.type;
  if (fallback?.type === 'pet' || fallback?.type === 'owner') return fallback.type;
  return 'owner';
};

const normalizeChatSession = (session: Partial<AdminChatSession>, fallback?: AdminChatSession): AdminChatSession => ({
  id: sanitizeString(session.id, fallback?.id || `chat-session-${randomUUID()}`),
  sessionNo: sanitizeString(session.sessionNo, fallback?.sessionNo || 'PUPY-CH-CUSTOM'),
  type: inferChatSessionType(session, fallback),
  title: sanitizeString(session.title, fallback?.title || '未命名会话'),
  participants: Array.isArray(session.participants) && session.participants.length ? session.participants.map((item) => String(item).trim()).filter(Boolean) : fallback?.participants || [],
  relatedPets: Array.isArray(session.relatedPets) && session.relatedPets.length ? session.relatedPets.map((item) => String(item).trim()).filter(Boolean) : fallback?.relatedPets || [],
  city: sanitizeString(session.city, fallback?.city || '未填写城市'),
  status: sanitizeString(session.status, fallback?.status || '待处理'),
  unreadCount: Math.max(0, sanitizeNumber(session.unreadCount, fallback?.unreadCount || 0)),
  latestSnippet: sanitizeString(session.latestSnippet, fallback?.latestSnippet || ''),
  messages: Array.isArray(session.messages) && session.messages.length ? session.messages.map((item) => normalizeChatMessage(item)) : fallback?.messages || [],
  createdAt: sanitizeString(session.createdAt, fallback?.createdAt || new Date().toISOString()),
  updatedAt: sanitizeString(session.updatedAt, new Date().toISOString()),
});

const normalizeCollection = <T>(values: unknown, fallback: T[], normalizer: (value: Partial<T>, seed?: T) => T) => {
  if (!Array.isArray(values) || !values.length) return fallback;
  return values.map((value, index) => normalizer((value || {}) as Partial<T>, fallback[index]));
};

const normalizeConfig = (input: Partial<AdminRuntimeConfig> | null | undefined): AdminRuntimeConfig => {
  const realmMap = new Map((input?.realms || []).map((realm) => [realm.id, realm]));
  const realms = DEFAULT_CONFIG.realms.map((fallback) => normalizeRealm((realmMap.get(fallback.id) as Partial<AdminRuntimeRealm>) || {}, fallback));
  const extraRealms = (input?.realms || [])
    .filter((realm) => realm.id && !DEFAULT_CONFIG.realms.find((fallback) => fallback.id === realm.id))
    .map((realm) =>
      normalizeRealm(realm, {
        id: realm.id as string,
        name: realm.name || '未命名领域',
        description: realm.description || '待补充描述。',
        onlineCount: Number(realm.onlineCount) || 0,
        loadingPhrases: DEFAULT_LOADING_PHRASES,
        active: realm.active ?? true,
      }),
    );

  return {
    realms: [...realms, ...extraRealms],
    activityLogs: Array.isArray(input?.activityLogs) ? input.activityLogs.map((item) => normalizeActivityLog(item)).slice(0, 200) : [],
    marketOrders: normalizeCollection<AdminMarketOrder>(input?.marketOrders, DEFAULT_CONFIG.marketOrders, normalizeMarketOrder),
    walkOrders: normalizeCollection<AdminWalkOrder>(input?.walkOrders, DEFAULT_CONFIG.walkOrders, normalizeWalkOrder),
    careBookings: normalizeCollection<AdminCareBooking>(input?.careBookings, DEFAULT_CONFIG.careBookings, normalizeCareBooking),
    petLoveRecords: normalizeCollection<AdminPetLoveRecord>(input?.petLoveRecords, DEFAULT_CONFIG.petLoveRecords, normalizePetLoveRecord),
    chatSessions: normalizeCollection<AdminChatSession>(input?.chatSessions, DEFAULT_CONFIG.chatSessions, normalizeChatSession),
    updatedAt: sanitizeString(input?.updatedAt, DEFAULT_CONFIG.updatedAt),
  };
};

export const getAdminRuntimeConfig = (): AdminRuntimeConfig => {
  const filePath = ensureStoreFile();
  try {
    const raw = readFileSync(filePath, 'utf8');
    return normalizeConfig(JSON.parse(raw) as Partial<AdminRuntimeConfig>);
  } catch {
    return normalizeConfig(DEFAULT_CONFIG);
  }
};

export const saveAdminRuntimeConfig = (nextConfig: Partial<AdminRuntimeConfig>) => {
  const filePath = ensureStoreFile();
  const current = getAdminRuntimeConfig();
  const merged = normalizeConfig({
    ...current,
    ...nextConfig,
    realms: nextConfig.realms || current.realms,
    activityLogs: nextConfig.activityLogs || current.activityLogs,
    marketOrders: nextConfig.marketOrders || current.marketOrders,
    walkOrders: nextConfig.walkOrders || current.walkOrders,
    careBookings: nextConfig.careBookings || current.careBookings,
    petLoveRecords: nextConfig.petLoveRecords || current.petLoveRecords,
    chatSessions: nextConfig.chatSessions || current.chatSessions,
    updatedAt: new Date().toISOString(),
  });
  writeFileSync(filePath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
  return merged;
};

export const appendAdminActivityLog = (input: Omit<AdminActivityLog, 'id' | 'createdAt'>) => {
  const current = getAdminRuntimeConfig();
  const nextLog: AdminActivityLog = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  const nextLogs = [nextLog, ...current.activityLogs].slice(0, 200);
  saveAdminRuntimeConfig({ activityLogs: nextLogs });
  return nextLog;
};

export const listAdminActivityLogs = (limit = 60) => {
  const current = getAdminRuntimeConfig();
  return current.activityLogs.slice(0, Math.max(1, limit));
};

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '../config/supabase.js';

const MAIN_EMAIL = 'rhyssvv@gmail.com';
const DEFAULT_PASSWORD = '123456';
const now = Date.now();

const dogImages = [
  'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=1200',
];

const catImages = [
  'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=1200',
];

const ownerAvatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
];

type DemoSeed = {
  username: string;
  email: string;
  age: number;
  gender: string;
  resident_city: string;
  frequent_cities: string[];
  hobbies: string[];
  mbti: string;
  signature: string;
  bio: string;
  avatar_url: string;
  is_verified: boolean;
  pet: {
    name: string;
    type: string;
    breed: string;
    gender: string;
    personality: string;
    age: number;
    weight: number;
    images: string[];
    bio: string;
    vaccinated: boolean;
    health_status: string;
    pedigree_info: string;
  };
};

type BreedProfile = {
  type: string;
  breed: string;
  personality: string;
  health_status: string;
  pedigree_info: string;
  weightRange: [number, number];
};

const curatedSeeds: DemoSeed[] = [
  {
    username: '苏栗', email: 'suli@pupy.app', age: 28, gender: 'female', resident_city: '上海', frequent_cities: ['上海', '杭州', '苏州'], hobbies: ['飞盘', '露营', '咖啡', '宠物社交'], mbti: 'ENFP', signature: '每周都会带奶油去滨江跑步。', bio: '重度活跃用户，日记、匹配、聊天和集市都高频使用。', avatar_url: ownerAvatars[0], is_verified: true,
    pet: { name: '奶油', type: 'Golden Retriever', breed: 'Golden Retriever', gender: 'female', personality: '热情亲人', age: 3, weight: 28.4, images: [dogImages[0], dogImages[3], dogImages[4]], bio: '飞盘一级选手，见人就摇尾巴。', vaccinated: true, health_status: 'healthy', pedigree_info: 'CKU 登记血统' },
  },
  {
    username: '沈雾', email: 'shenwu@pupy.app', age: 30, gender: 'female', resident_city: '上海', frequent_cities: ['上海', '宁波'], hobbies: ['骑行', '摄影', '狗狗训练'], mbti: 'INFJ', signature: '糯米是我们家的社交部长。', bio: '活跃在匹配、训练交流和日记分享板块。', avatar_url: ownerAvatars[1], is_verified: true,
    pet: { name: '糯米', type: 'Golden Retriever', breed: 'Golden Retriever', gender: 'female', personality: '安静温柔', age: 4, weight: 27.1, images: [dogImages[1], dogImages[5], dogImages[0]], bio: '在草地上跑一圈就会过来求摸头。', vaccinated: true, health_status: 'healthy', pedigree_info: '家庭繁育记录完整' },
  },
  {
    username: '乔晚', email: 'qiaowan@pupy.app', age: 27, gender: 'female', resident_city: '杭州', frequent_cities: ['杭州', '上海'], hobbies: ['徒步', '烘焙', '宠物穿搭'], mbti: 'ISFP', signature: '七喜超会拍照，也超会撒娇。', bio: '常在集市挂宠物手作，也会写高频日记。', avatar_url: ownerAvatars[2], is_verified: true,
    pet: { name: '七喜', type: 'Golden Retriever', breed: 'Golden Retriever', gender: 'female', personality: '镜头感强', age: 2, weight: 25.6, images: [dogImages[2], dogImages[0], dogImages[4]], bio: '看到相机就会自己找角度。', vaccinated: true, health_status: 'healthy', pedigree_info: '芯片备案已完成' },
  },
  {
    username: '林檬', email: 'linmeng@pupy.app', age: 31, gender: 'female', resident_city: '苏州', frequent_cities: ['苏州', '上海', '无锡'], hobbies: ['园艺', '露营', '宠物社群'], mbti: 'ESFJ', signature: '琥珀最爱在草地上和朋友打滚。', bio: '经常组织线下遛狗局，也活跃在繁育咨询区。', avatar_url: ownerAvatars[3], is_verified: true,
    pet: { name: '琥珀', type: 'Golden Retriever', breed: 'Golden Retriever', gender: 'female', personality: '社交达人', age: 5, weight: 29.3, images: [dogImages[3], dogImages[1], dogImages[2]], bio: '见到同类会先转圈再趴下示好。', vaccinated: true, health_status: 'healthy', pedigree_info: '年度体检齐全' },
  },
  {
    username: '唐梨', email: 'tangli@pupy.app', age: 26, gender: 'female', resident_city: '南京', frequent_cities: ['南京', '上海'], hobbies: ['游泳', '书店', '宠物食品研究'], mbti: 'INTJ', signature: '可颂很稳，熟了之后会超级黏人。', bio: '活跃在宠物营养和高端用品集市。', avatar_url: ownerAvatars[4], is_verified: true,
    pet: { name: '可颂', type: 'Golden Retriever', breed: 'Golden Retriever', gender: 'female', personality: '慢热靠谱', age: 3, weight: 26.8, images: [dogImages[4], dogImages[0], dogImages[5]], bio: '对球类玩具极度专一。', vaccinated: true, health_status: 'healthy', pedigree_info: '国际血统证书在档' },
  },
  {
    username: '许听', email: 'xuting@pupy.app', age: 29, gender: 'female', resident_city: '上海', frequent_cities: ['上海', '嘉兴'], hobbies: ['瑜伽', '咖啡探店', '宠物旅行'], mbti: 'ENFJ', signature: '暖暖每次出门都像在度假。', bio: '常发城市walk攻略，是高频内容创作者。', avatar_url: ownerAvatars[5], is_verified: true,
    pet: { name: '暖暖', type: 'Golden Retriever', breed: 'Golden Retriever', gender: 'female', personality: '情绪稳定', age: 4, weight: 30.1, images: [dogImages[5], dogImages[2], dogImages[1]], bio: '雨天也坚持要完成社交任务。', vaccinated: true, health_status: 'healthy', pedigree_info: '繁育评估优秀' },
  },
  {
    username: '顾晴', email: 'guqing@pupy.app', age: 33, gender: 'female', resident_city: '杭州', frequent_cities: ['杭州', '上海', '绍兴'], hobbies: ['跑步', '飞盘', '社群运营'], mbti: 'ENTP', signature: '栗子是群里的快乐发射器。', bio: '频繁发起群聊与线下活动，是资深老用户。', avatar_url: ownerAvatars[0], is_verified: true,
    pet: { name: '栗子', type: 'Golden Retriever', breed: 'Golden Retriever', gender: 'female', personality: '外向机灵', age: 2, weight: 24.9, images: [dogImages[0], dogImages[4], dogImages[3]], bio: '一听到零食袋声音就会冲过来。', vaccinated: true, health_status: 'healthy', pedigree_info: '疫苗与驱虫完整' },
  },
  {
    username: '孟枝', email: 'mengzhi@pupy.app', age: 27, gender: 'female', resident_city: '宁波', frequent_cities: ['宁波', '上海'], hobbies: ['海边散步', '美食', '宠物摄影'], mbti: 'INFP', signature: '布丁会在海风里自己找镜头。', bio: '以日记和公开动态维持高活跃。', avatar_url: ownerAvatars[1], is_verified: true,
    pet: { name: '布丁', type: 'Golden Retriever', breed: 'Golden Retriever', gender: 'female', personality: '甜妹型', age: 3, weight: 27.7, images: [dogImages[1], dogImages[3], dogImages[5]], bio: '看到沙滩就会进入撒欢模式。', vaccinated: true, health_status: 'healthy', pedigree_info: '犬展社群资料完备' },
  },
  {
    username: '袁澈', email: 'yuanche@pupy.app', age: 30, gender: 'male', resident_city: '北京', frequent_cities: ['北京', '上海'], hobbies: ['训练课程', '摄影', '宠物运动'], mbti: 'ESTP', signature: '拿铁训练配合度高，线下局也很稳。', bio: '重度使用消息和训练类服务下单。', avatar_url: ownerAvatars[4], is_verified: true,
    pet: { name: '拿铁', type: 'Labrador Retriever', breed: 'Labrador Retriever', gender: 'female', personality: '专注服从', age: 3, weight: 26.5, images: [dogImages[2], dogImages[5], dogImages[0]], bio: '最擅长捡回和召回。', vaccinated: true, health_status: 'healthy', pedigree_info: '训练认证记录齐全' },
  },
  {
    username: '周翎', email: 'zhouling@pupy.app', age: 29, gender: 'female', resident_city: '成都', frequent_cities: ['成都', '重庆', '上海'], hobbies: ['火锅', '露营', '宠物社群'], mbti: 'ESFP', signature: '蜜豆是川渝局里的社交王牌。', bio: '常用集市和繁育版块，互动频繁。', avatar_url: ownerAvatars[2], is_verified: true,
    pet: { name: '蜜豆', type: 'Welsh Corgi', breed: 'Welsh Corgi', gender: 'female', personality: '活力十足', age: 2, weight: 11.4, images: [dogImages[3], dogImages[4], dogImages[1]], bio: '腿短但跑得飞快。', vaccinated: true, health_status: 'healthy', pedigree_info: '犬舍合同可核验' },
  },
  {
    username: '白溪', email: 'baixi@pupy.app', age: 25, gender: 'female', resident_city: '上海', frequent_cities: ['上海', '杭州'], hobbies: ['撸猫', '插画', '居家布置'], mbti: 'ISFJ', signature: '云朵擅长让全屋都安静下来。', bio: '高频记录日记，养成内容很完整。', avatar_url: ownerAvatars[3], is_verified: true,
    pet: { name: '云朵', type: 'Ragdoll Cat', breed: 'Ragdoll Cat', gender: 'female', personality: '软糯亲人', age: 2, weight: 5.2, images: [catImages[0], catImages[1], catImages[2]], bio: '会主动把头贴过来求摸。', vaccinated: true, health_status: 'healthy', pedigree_info: '猫舍档案完整' },
  },
  {
    username: '叶澄', email: 'yecheng@pupy.app', age: 32, gender: 'male', resident_city: '广州', frequent_cities: ['广州', '深圳', '上海'], hobbies: ['冲浪', '跑步', '宠物营养'], mbti: 'ENTJ', signature: '泡芙会认真参加每一场训练。', bio: '高频下单服务，也会参与匹配和聊天。', avatar_url: ownerAvatars[5], is_verified: true,
    pet: { name: '泡芙', type: 'Labrador Retriever', breed: 'Labrador Retriever', gender: 'female', personality: '阳光外放', age: 4, weight: 27.9, images: [dogImages[5], dogImages[1], dogImages[2]], bio: '体能特别好，长距离散步不累。', vaccinated: true, health_status: 'healthy', pedigree_info: '营养档案长期维护' },
  },
];

const autoUserNames = [
  '安禾', '程夏', '陆见', '闻秋', '简宁', '宋也', '鹿遥', '迟岚', '向知', '陈汀', '许朝', '何栀',
  '江序', '杜蘅', '顾遥', '季衡', '温棠', '祁远', '周穗', '林朝', '章朔', '姜晚', '盛予', '郁青',
  '谢今', '罗初', '邵岚', '陶一',
];

const autoPetNames = [
  '团子', '阿福', '豆包', '斑斑', '年糕', '芝麻', '橙子', '星尘', '麦芽', '乌龙', '桃桃', '花卷',
  '果冻', '奶盖', '小满', '朵朵', '可可', '雪球', '阿酥', '榛果', '叮当', '椰椰', '柚子', '春卷',
  '松露', '南瓜', '雾灯', '星河',
];

const cityProfiles = [
  { base: '上海', frequent: ['上海', '杭州', '苏州'] },
  { base: '北京', frequent: ['北京', '天津', '上海'] },
  { base: '杭州', frequent: ['杭州', '上海', '宁波'] },
  { base: '深圳', frequent: ['深圳', '广州', '东莞'] },
  { base: '成都', frequent: ['成都', '重庆', '西安'] },
  { base: '南京', frequent: ['南京', '上海', '苏州'] },
  { base: '广州', frequent: ['广州', '深圳', '珠海'] },
  { base: '苏州', frequent: ['苏州', '上海', '无锡'] },
  { base: '宁波', frequent: ['宁波', '上海', '杭州'] },
  { base: '武汉', frequent: ['武汉', '长沙', '上海'] },
];

const hobbyPools = [
  ['飞盘', '露营', '宠物摄影'],
  ['咖啡探店', '城市 walk', '宠物穿搭'],
  ['训练课程', '营养研究', '遛狗社群'],
  ['露营', '长板', '宠物社交'],
  ['插画', '撸猫', '居家布置'],
  ['徒步', '烘焙', '宠物旅行'],
  ['慢跑', '摄影', '犬只训练'],
  ['美食', '海边散步', '宠物日记'],
];

const signatureTemplates = [
  '几乎每天都会打开 PUPY 看看附近有没有新朋友。',
  '我们家日程表里，固定有一项叫“宠物社交”。',
  '正在认真经营宠物日记和配对档案。',
  '如果有同城线下局，我们通常都会报名。',
  '一边记录成长，一边认识更多同频家长。',
];

const bioTemplates = [
  '重度依赖日记、发现、聊天和集市，属于典型高活跃用户。',
  '对训练、营养、护理和社交匹配都很认真，资料维护完整。',
  '长期参与线下遛宠局，也会在集市和聊天区持续互动。',
  '会主动更新档案、发布日记和参与聊天，社区参与度很高。',
  '常在云游地图和发现页活跃，属于带动社区氛围的用户类型。',
];

const dogProfiles: BreedProfile[] = [
  { type: 'Golden Retriever', breed: 'Golden Retriever', personality: '温柔外向', health_status: 'healthy', pedigree_info: '基础体检和疫苗记录完整', weightRange: [25, 31] },
  { type: 'Labrador Retriever', breed: 'Labrador Retriever', personality: '稳重黏人', health_status: 'healthy', pedigree_info: '训练课程进度稳定', weightRange: [24, 30] },
  { type: 'Welsh Corgi', breed: 'Welsh Corgi', personality: '活力充沛', health_status: 'healthy', pedigree_info: '犬舍合同与芯片资料可核验', weightRange: [10, 14] },
  { type: 'Border Collie', breed: 'Border Collie', personality: '聪明敏捷', health_status: 'healthy', pedigree_info: '运动表现与训练档案齐全', weightRange: [16, 22] },
  { type: 'Samoyed', breed: 'Samoyed', personality: '爱笑亲人', health_status: 'healthy', pedigree_info: '毛发护理档案长期维护', weightRange: [18, 26] },
  { type: 'Shiba Inu', breed: 'Shiba Inu', personality: '独立可爱', health_status: 'healthy', pedigree_info: '社交评估记录持续更新', weightRange: [8, 12] },
];

const catProfiles: BreedProfile[] = [
  { type: 'Ragdoll Cat', breed: 'Ragdoll Cat', personality: '软糯亲人', health_status: 'healthy', pedigree_info: '猫舍档案与免疫记录完整', weightRange: [4, 7] },
  { type: 'British Shorthair', breed: 'British Shorthair', personality: '安静稳定', health_status: 'healthy', pedigree_info: '定期体检记录清晰', weightRange: [4, 7] },
  { type: 'Maine Coon', breed: 'Maine Coon', personality: '温和社牛', health_status: 'healthy', pedigree_info: '成长曲线与营养方案长期记录', weightRange: [5, 8] },
];

const mbtis = ['ENFP', 'INFJ', 'ISFP', 'ESFJ', 'INTJ', 'ENFJ', 'ENTP', 'INFP', 'ESTP', 'ESFP', 'ISFJ', 'ENTJ'];

function isoHoursAgo(hoursAgo: number) {
  return new Date(now - hoursAgo * 60 * 60 * 1000).toISOString();
}

function pick<T>(values: T[], index: number) {
  return values[index % values.length];
}

function rangeValue([min, max]: [number, number], index: number) {
  const step = ((index * 7) % 10) / 10;
  return Number((min + (max - min) * step).toFixed(1));
}

function createAutoSeeds(): DemoSeed[] {
  return autoUserNames.map((username, index) => {
    const cityProfile = pick(cityProfiles, index);
    const hobbies = pick(hobbyPools, index);
    const ownerGender = index % 5 === 0 ? 'male' : 'female';
    const petProfile = index % 6 === 0 ? pick(catProfiles, index) : pick(dogProfiles, index);
    const petGender = index % 4 === 0 ? 'male' : 'female';
    const petImages = petProfile.type.includes('Cat')
      ? [pick(catImages, index), pick(catImages, index + 1), pick(catImages, index + 2)]
      : [pick(dogImages, index), pick(dogImages, index + 2), pick(dogImages, index + 4)];

    return {
      username,
      email: `demo${String(index + 1).padStart(2, '0')}@pupy.app`,
      age: 24 + (index % 10),
      gender: ownerGender,
      resident_city: cityProfile.base,
      frequent_cities: cityProfile.frequent,
      hobbies,
      mbti: pick(mbtis, index),
      signature: pick(signatureTemplates, index),
      bio: pick(bioTemplates, index),
      avatar_url: pick(ownerAvatars, index),
      is_verified: index % 4 !== 0,
      pet: {
        name: autoPetNames[index],
        type: petProfile.type,
        breed: petProfile.breed,
        gender: petGender,
        personality: petProfile.personality,
        age: 1 + (index % 6),
        weight: rangeValue(petProfile.weightRange, index),
        images: petImages,
        bio: `${autoPetNames[index]} 在 ${cityProfile.base} 的宠物社交圈里非常活跃，经常参与线下局和云游地图。`,
        vaccinated: true,
        health_status: petProfile.health_status,
        pedigree_info: petProfile.pedigree_info,
      },
    };
  });
}

const demoSeeds = [...curatedSeeds, ...createAutoSeeds()];

async function main() {
  const { data: currentUsers, error: currentUserError } = await supabaseAdmin.from('users').select('id, username, email').eq('email', MAIN_EMAIL).limit(1);
  if (currentUserError || !currentUsers?.length) throw currentUserError || new Error('未找到主账号，请先完成默认账号初始化。');
  const currentUser = currentUsers[0];

  const { data: currentPets, error: currentPetError } = await supabaseAdmin.from('pets').select('id, name, type, gender').eq('user_id', currentUser.id).limit(1);
  if (currentPetError || !currentPets?.length) throw currentPetError || new Error('主账号下没有宠物档案，无法生成匹配数据。');
  const currentPet = currentPets[0];

  const demoEmails = demoSeeds.map((item) => item.email);
  const { data: existingDemoUsers, error: existingDemoUsersError } = await supabaseAdmin.from('users').select('id, email').in('email', demoEmails);
  if (existingDemoUsersError) throw existingDemoUsersError;
  const existingDemoIds = (existingDemoUsers || []).map((item) => item.id);
  if (existingDemoIds.length > 0) {
    await supabaseAdmin.from('notifications').delete().in('user_id', existingDemoIds);
    await supabaseAdmin.from('notifications').delete().in('related_user_id', existingDemoIds);
    await supabaseAdmin.from('users').delete().in('id', existingDemoIds);
  }

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const demoUsers = demoSeeds.map((seed, index) => ({
    id: uuidv4(),
    username: seed.username,
    email: seed.email,
    password_hash: passwordHash,
    age: seed.age,
    gender: seed.gender,
    resident_city: seed.resident_city,
    frequent_cities: seed.frequent_cities,
    hobbies: seed.hobbies,
    mbti: seed.mbti,
    signature: seed.signature,
    avatar_url: seed.avatar_url,
    bio: seed.bio,
    is_verified: seed.is_verified,
    created_at: isoHoursAgo(780 - index * 6),
    updated_at: isoHoursAgo(36 - (index % 18)),
    last_login: isoHoursAgo((index % 18) + 1),
  }));

  const insertUsers = await supabaseAdmin.from('users').insert(demoUsers);
  if (insertUsers.error) throw insertUsers.error;

  const petRows = demoSeeds.map((seed, index) => ({
    id: uuidv4(),
    user_id: demoUsers[index].id,
    name: seed.pet.name,
    type: seed.pet.type,
    breed: seed.pet.breed,
    gender: seed.pet.gender,
    personality: seed.pet.personality,
    age: seed.pet.age,
    weight: seed.pet.weight,
    images: seed.pet.images,
    bio: seed.pet.bio,
    vaccinated: seed.pet.vaccinated,
    health_status: seed.pet.health_status,
    pedigree_info: seed.pet.pedigree_info,
    created_at: isoHoursAgo(740 - index * 5),
    updated_at: isoHoursAgo(20 - (index % 12)),
  }));

  const insertPets = await supabaseAdmin.from('pets').insert(petRows);
  if (insertPets.error) throw insertPets.error;

  const diaryThemes = [
    { title: '的城市散步记录', mood: '开心', tags: ['城市散步', '线下社交', '热门打卡'] },
    { title: '的社交局小结', mood: '满足', tags: ['社交复盘', '发现新朋友', '社区高活跃'] },
    { title: '的护理与营养回访', mood: '安心', tags: ['护理记录', '营养管理', '成长更新'] },
  ];
  const diaryRows: any[] = [];
  demoUsers.forEach((user, index) => {
    const seed = demoSeeds[index];
    const pet = petRows[index];
    diaryThemes.forEach((theme, diaryIndex) => {
      diaryRows.push({
        id: uuidv4(),
        user_id: user.id,
        pet_id: pet.id,
        title: `${seed.pet.name}${theme.title}`,
        content:
          `${seed.pet.name} 今天在 ${seed.resident_city} 完成了一次高互动活动，主人同步更新了路线、照片、配对热度和线下见面反馈。` +
          ` 这条日记也被同步到了发现页与个人空间，用来展示 ${seed.pet.name} 最近的社交状态、护理表现和日常情绪。`,
        images: [seed.pet.images[diaryIndex % seed.pet.images.length], seed.pet.images[(diaryIndex + 1) % seed.pet.images.length]],
        mood: theme.mood,
        tags: theme.tags,
        is_public: diaryIndex !== 2 || index % 3 !== 0,
        likes_count: 0,
        comments_count: 0,
        created_at: isoHoursAgo(220 - index * 2 - diaryIndex),
        updated_at: isoHoursAgo(220 - index * 2 - diaryIndex),
      });
    });
  });

  const insertDiaries = await supabaseAdmin.from('diaries').insert(diaryRows);
  if (insertDiaries.error) throw insertDiaries.error;

  const productTypes = ['breeding', 'service', 'care_product', 'food', 'toy'];
  const productCategories = ['宠物恋爱配对', '帮忙溜溜', '护理养护', '主粮用品', '互动玩具'];
  const productRows: any[] = [];
  demoUsers.forEach((user, index) => {
    const pet = petRows[index];
    const primaryType = pick(productTypes, index);
    const primaryCategory = pick(productCategories, index);
    productRows.push({
      id: uuidv4(),
      seller_id: user.id,
      pet_id: pet.id,
      title: `${pet.name} 同款 ${primaryCategory} 热门发布`,
      description: `${pet.name} 的主人是平台高活跃用户，这条发布会持续更新回复和发货状态，适合前台展示热闹的交易与服务氛围。`,
      category: primaryCategory,
      price: 88 + index * 9,
      images: [pet.images[0], pet.images[1]],
      status: index % 7 === 0 ? 'reviewing' : 'active',
      type: primaryType,
      requirements: '支持先站内沟通，再约见面、下单或发货。',
      created_at: isoHoursAgo(260 - index * 2),
      updated_at: isoHoursAgo(40 - (index % 14)),
    });

    if (index < 18) {
      productRows.push({
        id: uuidv4(),
        seller_id: user.id,
        pet_id: pet.id,
        title: `${pet.name} 常用 ${pick(['护理套餐', '主粮补给', '陪跑服务', '拍照造型', '遛遛体验'], index)} 上新`,
        description: `补充一条更偏运营感的商品/服务发布，用于增强集市列表密度与筛选丰富度。`,
        category: pick(productCategories, index + 2),
        price: 129 + index * 7,
        images: [pet.images[1], pet.images[2]],
        status: 'active',
        type: pick(productTypes, index + 1),
        requirements: '优先服务高活跃档案用户，支持订单备注。',
        created_at: isoHoursAgo(180 - index),
        updated_at: isoHoursAgo(18 - (index % 8)),
      });
    }
  });

  const insertProducts = await supabaseAdmin.from('market_products').insert(productRows);
  if (insertProducts.error) throw insertProducts.error;

  const currentUserTargetIndexes = Array.from({ length: Math.min(14, demoUsers.length) }, (_, index) => index);
  const matchedRows = currentUserTargetIndexes.slice(0, 10).map((index, offset) => ({
    id: uuidv4(),
    user_a_id: currentUser.id,
    user_b_id: demoUsers[index].id,
    pet_a_id: currentPet.id,
    pet_b_id: petRows[index].id,
    compatibility_score: Number((0.76 + offset * 0.018).toFixed(2)),
    status: 'matched',
    created_at: isoHoursAgo(160 - offset * 5),
    updated_at: isoHoursAgo(36 - offset),
  }));

  const currentPendingRows = currentUserTargetIndexes.slice(10).map((index, offset) => ({
    id: uuidv4(),
    user_a_id: currentUser.id,
    user_b_id: demoUsers[index].id,
    pet_a_id: currentPet.id,
    pet_b_id: petRows[index].id,
    compatibility_score: Number((0.71 + offset * 0.02).toFixed(2)),
    status: 'pending',
    created_at: isoHoursAgo(110 - offset * 4),
    updated_at: isoHoursAgo(28 - offset),
  }));

  const communityMatchRows = Array.from({ length: 18 }, (_, index) => {
    const a = index;
    const b = (index + 7) % demoUsers.length;
    return {
      id: uuidv4(),
      user_a_id: demoUsers[a].id,
      user_b_id: demoUsers[b].id,
      pet_a_id: petRows[a].id,
      pet_b_id: petRows[b].id,
      compatibility_score: Number((0.68 + (index % 8) * 0.03).toFixed(2)),
      status: index % 3 === 0 ? 'matched' : 'pending',
      created_at: isoHoursAgo(140 - index * 3),
      updated_at: isoHoursAgo(44 - (index % 10)),
    };
  });

  const insertMatches = await supabaseAdmin.from('matches').insert([...matchedRows, ...currentPendingRows, ...communityMatchRows]);
  if (insertMatches.error) throw insertMatches.error;

  const breedingRows = Array.from({ length: 12 }, (_, index) => ({
    id: uuidv4(),
    sender_id: demoUsers[index].id,
    sender_pet_id: petRows[index].id,
    receiver_id: demoUsers[(index + 5) % demoUsers.length].id,
    receiver_pet_id: petRows[(index + 5) % petRows.length].id,
    status: pick(['pending', 'accepted', 'completed'], index),
    notes: pick([
      '想先在站内确认健康记录，再约线下见面。',
      '双方已经互换最近体检与社交反馈。',
      '希望先一起参加一场同城遛遛局观察互动。',
    ], index),
    created_at: isoHoursAgo(120 - index * 4),
    updated_at: isoHoursAgo(26 - (index % 6)),
  }));

  const insertBreeding = await supabaseAdmin.from('breeding_requests').insert(breedingRows);
  if (insertBreeding.error) throw insertBreeding.error;

  const roomRows: any[] = [];
  const messageRows: any[] = [];

  const buildConversation = (roomId: string, userA: any, userB: any, texts: string[], baseHour: number) => {
    roomRows.push({
      id: roomId,
      user_a_id: userA.id,
      user_b_id: userB.id,
      last_message: texts[texts.length - 1],
      last_message_time: isoHoursAgo(baseHour - 1),
      created_at: isoHoursAgo(baseHour + 6),
      updated_at: isoHoursAgo(baseHour - 1),
    });
    texts.forEach((content, messageIndex) => {
      const fromA = messageIndex % 2 === 0;
      messageRows.push({
        id: uuidv4(),
        chat_id: roomId,
        sender_id: fromA ? userA.id : userB.id,
        receiver_id: fromA ? userB.id : userA.id,
        content,
        is_read: messageIndex !== texts.length - 1,
        created_at: isoHoursAgo(baseHour + (texts.length - messageIndex)),
        updated_at: isoHoursAgo(baseHour + (texts.length - messageIndex)),
      });
    });
  };

  currentUserTargetIndexes.slice(0, 10).forEach((demoIndex, index) => {
    const demoUser = demoUsers[demoIndex];
    const roomId = uuidv4();
    const petName = petRows[demoIndex].name;
    const texts = [
      `你好呀，我刚看完 ${petName} 的档案，感觉你们的日常节奏和我们挺合拍。`,
      `最近平台上同城活动很多，我们可以先一起参加一场遛遛局。`,
      `我也把护理和作息记录补全了，方便你判断适不适合继续聊。`,
      `没问题，我这周三晚上和周末下午都能安排。`,
    ];
    buildConversation(roomId, currentUser, demoUser, texts, 48 - index * 2);
  });

  Array.from({ length: 12 }, (_, index) => index).forEach((index) => {
    const userA = demoUsers[index];
    const userB = demoUsers[(index + 9) % demoUsers.length];
    const petA = petRows[index];
    const petB = petRows[(index + 9) % petRows.length];
    const roomId = uuidv4();
    const texts = [
      `${petA.name} 最近在线上很活跃，我看你们城市也离得不远。`,
      `${petB.name} 这周也在参加社交地图活动，可以先从线上聊起。`,
      '如果合适，我们可以同步一下线下活动和护理安排。',
      '可以，我把可约时间和注意事项都发给你。',
    ];
    buildConversation(roomId, userA, userB, texts, 84 - index * 3);
  });

  const insertRooms = await supabaseAdmin.from('chat_rooms').insert(roomRows);
  if (insertRooms.error) throw insertRooms.error;
  const insertMessages = await supabaseAdmin.from('messages').insert(messageRows);
  if (insertMessages.error) throw insertMessages.error;

  const notificationRows: any[] = [];
  currentUserTargetIndexes.slice(0, 12).forEach((demoIndex, index) => {
    notificationRows.push({
      id: uuidv4(),
      user_id: currentUser.id,
      message: `${demoSeeds[demoIndex].username} 刚更新了 ${petRows[demoIndex].name} 的档案，系统已为你保留本轮高热推荐。`,
      type: pick(['match', 'message', 'system'], index),
      related_user_id: demoUsers[demoIndex].id,
      is_read: index % 4 === 0,
      created_at: isoHoursAgo(18 - index),
    });
  });

  demoUsers.forEach((user, index) => {
    notificationRows.push({
      id: uuidv4(),
      user_id: user.id,
      message: pick([
        '你的日记进入了同城热门推荐。',
        '新的聊天回复已送达，建议尽快查看。',
        '你的护理预约资料已进入运营复核。',
        '你的宠物匹配热度正在持续上升。',
      ], index),
      type: pick(['message', 'system', 'match', 'booking'], index),
      related_user_id: index < 8 ? currentUser.id : null,
      is_read: index % 3 === 0,
      created_at: isoHoursAgo(20 + index),
    });

    if (index < 20) {
      notificationRows.push({
        id: uuidv4(),
        user_id: user.id,
        message: pick([
          '你发布的商品正在被更多用户收藏。',
          '你收到了一条新的繁育咨询。',
          '你常去的云游地图在线人数上涨了。',
        ], index),
        type: pick(['market', 'breeding', 'system'], index + 1),
        related_user_id: null,
        is_read: false,
        created_at: isoHoursAgo(8 + index),
      });
    }
  });

  const insertNotifications = await supabaseAdmin.from('notifications').insert(notificationRows);
  if (insertNotifications.error) throw insertNotifications.error;

  const prayerRows = demoUsers.slice(0, 18).map((user, index) => ({
    id: uuidv4(),
    user_id: user.id,
    pet_id: petRows[index].id,
    prayer_text: `希望 ${petRows[index].name} 下周的社交、护理和日常状态都稳定，也能遇到更多合拍的小伙伴。`,
    ai_response: `${petRows[index].name} 最近的互动频次和状态都不错，建议继续维持固定运动、规律喂养和正向陪伴。`,
    sentiment: 'positive',
    created_at: isoHoursAgo(30 + index),
  }));

  const insertPrayers = await supabaseAdmin.from('prayer_records').insert(prayerRows);
  if (insertPrayers.error) throw insertPrayers.error;

  const publicDiaries = diaryRows.filter((row) => row.is_public);
  const likeRows: any[] = [];
  const commentRows: any[] = [];
  const diaryStats = new Map<string, { likes: number; comments: number }>();
  publicDiaries.slice(0, 72).forEach((diary, index) => {
    const eligibleUsers = demoUsers.filter((user) => user.id !== diary.user_id);
    const likerA = eligibleUsers[index % eligibleUsers.length];
    const likerB = eligibleUsers[(index + 5) % eligibleUsers.length];
    const likerC = eligibleUsers[(index + 11) % eligibleUsers.length];
    likeRows.push({ id: uuidv4(), diary_id: diary.id, user_id: likerA.id, created_at: isoHoursAgo(14 + index) });
    likeRows.push({ id: uuidv4(), diary_id: diary.id, user_id: likerB.id, created_at: isoHoursAgo(13 + index) });
    likeRows.push({ id: uuidv4(), diary_id: diary.id, user_id: likerC.id, created_at: isoHoursAgo(12 + index) });
    commentRows.push({
      id: uuidv4(),
      diary_id: diary.id,
      user_id: likerB.id,
      content: pick(['这条路线太适合周末社交了。', '状态看起来非常稳定，档案也维护得很完整。', '这组照片很有氛围，难怪互动这么高。'], index),
      created_at: isoHoursAgo(11 + index),
      updated_at: isoHoursAgo(11 + index),
    });
    commentRows.push({
      id: uuidv4(),
      diary_id: diary.id,
      user_id: likerC.id,
      content: pick(['下次如果有同城局可以叫上我们。', '这条日记让我想立刻去更新自家档案。', '护理后的状态也太好了，想抄作业。'], index + 1),
      created_at: isoHoursAgo(10 + index),
      updated_at: isoHoursAgo(10 + index),
    });
    diaryStats.set(diary.id, { likes: 3, comments: 2 });
  });

  const insertLikes = await supabaseAdmin.from('likes').insert(likeRows);
  if (insertLikes.error) throw insertLikes.error;
  const insertComments = await supabaseAdmin.from('comments').insert(commentRows);
  if (insertComments.error) throw insertComments.error;

  for (const [diaryId, stats] of diaryStats.entries()) {
    const updateDiary = await supabaseAdmin.from('diaries').update({ likes_count: stats.likes, comments_count: stats.comments }).eq('id', diaryId);
    if (updateDiary.error) throw updateDiary.error;
  }

  const statRows = demoUsers.map((user, index) => ({
    id: uuidv4(),
    user_id: user.id,
    level: 8 + (index % 7),
    experience_points: 2200 + index * 180,
    achievements: ['高活跃用户', '社交档案完整', '社区互动达人'],
    total_matches: 4 + (index % 6),
    total_likes: 30 + index * 4,
    diary_count: 3,
    updated_at: isoHoursAgo(index + 1),
  }));
  statRows.push({
    id: uuidv4(),
    user_id: currentUser.id,
    level: 15,
    experience_points: 5680,
    achievements: ['主理人账号', '高频互动', '后台可用'],
    total_matches: matchedRows.length + currentPendingRows.length,
    total_likes: 66,
    diary_count: 1,
    updated_at: isoHoursAgo(1),
  });

  const upsertStats = await supabaseAdmin.from('user_stats').upsert(statRows, { onConflict: 'user_id' });
  if (upsertStats.error) throw upsertStats.error;

  console.log(
    JSON.stringify(
      {
        success: true,
        seededUsers: demoUsers.length,
        seededPets: petRows.length,
        seededDiaries: diaryRows.length,
        seededProducts: productRows.length,
        seededMatches: matchedRows.length + currentPendingRows.length + communityMatchRows.length,
        seededBreedingRequests: breedingRows.length,
        seededChatRooms: roomRows.length,
        seededMessages: messageRows.length,
        seededNotifications: notificationRows.length,
        seededPrayers: prayerRows.length,
        seededLikes: likeRows.length,
        seededComments: commentRows.length,
        currentUser: {
          email: currentUser.email,
          pet: currentPet.name,
          type: currentPet.type,
          gender: currentPet.gender,
        },
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

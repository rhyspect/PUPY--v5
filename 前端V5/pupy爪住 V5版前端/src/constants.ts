import { Pet, Realm } from './types';

export const PETS: Pet[] = [
  {
    id: '1',
    name: '库珀',
    images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400'],
    type: '金毛寻回犬',
    gender: '公',
    personality: 'E系浓宠',
    hasPet: true,
    owner: {
      name: '想喝咖啡吗？',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100',
      photos: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400'],
      gender: '男',
      age: 25,
      residentCity: '上海',
      frequentCities: ['上海', '北京', '深圳'],
      hobbies: ['咖啡', '摄影', '滑板'],
      mbti: 'ENTP',
      signature: '带上修勾，去探索未知的咖啡馆 ☕️'
    }
  },
  {
    id: '2',
    name: '麻薯',
    images: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400'],
    type: '柴犬',
    gender: '母',
    personality: 'I系淡宠',
    hasPet: true,
    owner: {
      name: '艾琳娜',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
      photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'],
      gender: '女',
      age: 23,
      residentCity: '杭州',
      frequentCities: ['杭州', '上海', '南京'],
      hobbies: ['绘画', '瑜伽', '阅读'],
      mbti: 'INFJ',
      signature: '在云端与现实之间，寻找那份纯粹的治愈 🌿'
    }
  },
  {
    id: '3',
    name: '露娜',
    images: ['https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=400'],
    type: '边境牧羊犬',
    gender: '母',
    personality: 'E系浓宠',
    hasPet: true,
    owner: {
      name: '莎拉',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
      photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'],
      gender: '女',
      age: 28,
      residentCity: '北京',
      frequentCities: ['北京', '西安', '天津'],
      hobbies: ['徒步', '编程'],
      mbti: 'ISTJ',
      signature: '逻辑与直觉的平衡，和 露娜 一起奔跑 🏃‍♀️'
    }
  },
  {
    id: '4',
    name: '坦克',
    images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400'],
    type: '法斗',
    gender: '公',
    personality: 'E系浓宠',
    hasPet: true,
    owner: {
      name: '阿强',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
      photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'],
      gender: '男',
      age: 30,
      residentCity: '深圳',
      frequentCities: ['深圳', '广州', '东莞'],
      hobbies: ['健身', '烧烤'],
      mbti: 'ESTP',
      signature: '生活就是大口吃肉，大口喝酒 🍖'
    }
  },
  {
    id: '5',
    name: '雪球',
    images: ['https://images.unsplash.com/photo-1529429617329-8a737053918e?auto=format&fit=crop&q=80&w=400'],
    type: '萨摩耶',
    gender: '母',
    personality: 'I系淡宠',
    hasPet: true,
    owner: {
      name: '小雅',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100',
      photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400'],
      gender: '女',
      age: 22,
      residentCity: '成都',
      frequentCities: ['成都', '重庆', '西安'],
      hobbies: ['旅游', '美食'],
      mbti: 'ENFP',
      signature: '世界那么大，我想带雪球去看看 ✈️'
    }
  },
  {
    id: '6',
    name: '奥利奥',
    images: ['https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=400'],
    type: '哈士奇',
    gender: '公',
    personality: 'E系浓宠',
    hasPet: true,
    owner: {
      name: '大伟',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
      photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'],
      gender: '男',
      age: 26,
      residentCity: '广州',
      frequentCities: ['广州', '深圳', '佛山'],
      hobbies: ['滑板', '说唱'],
      mbti: 'ENTP',
      signature: '二哈不拆家，生活没火花 🔥'
    }
  },
  {
    id: '7',
    name: '可乐',
    images: ['https://images.unsplash.com/photo-1513245533414-1dc1acad976d?auto=format&fit=crop&q=80&w=400'],
    type: '柯基',
    gender: '公',
    personality: 'I系淡宠',
    hasPet: true,
    owner: {
      name: '林老师',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
      photos: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'],
      gender: '男',
      age: 35,
      residentCity: '南京',
      frequentCities: ['南京', '上海', '苏州'],
      hobbies: ['阅读', '园艺'],
      mbti: 'INFJ',
      signature: '岁月静好，与可乐共度午后时光 📖'
    }
  },
  {
    id: '8',
    name: '布丁',
    images: ['https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400'],
    type: '比熊',
    gender: '母',
    personality: 'I系淡宠',
    hasPet: true,
    owner: {
      name: '悦悦',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100',
      photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400'],
      gender: '女',
      age: 24,
      residentCity: '苏州',
      frequentCities: ['苏州', '上海', '无锡'],
      hobbies: ['手工', '甜品'],
      mbti: 'INFP',
      signature: '想把所有的温柔都给布丁 🍮'
    }
  },
  {
    id: '9',
    name: '闪电',
    images: ['https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&q=80&w=400'],
    type: '灵缇',
    gender: '公',
    personality: 'E系浓宠',
    hasPet: true,
    owner: {
      name: '杰克',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100',
      photos: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400'],
      gender: '男',
      age: 29,
      residentCity: '上海',
      frequentCities: ['上海', '杭州', '宁波'],
      hobbies: ['赛车', '攀岩'],
      mbti: 'ISTP',
      signature: '速度与激情，是我的座右铭 🏎️'
    }
  },
  {
    id: '10',
    name: '咖啡',
    images: ['https://images.unsplash.com/photo-1591769225440-811ad7d62ca2?auto=format&fit=crop&q=80&w=400'],
    type: '拉布拉多',
    gender: '母',
    personality: 'E系浓宠',
    hasPet: true,
    owner: {
      name: '陈医生',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=100',
      photos: ['https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400'],
      gender: '女',
      age: 32,
      residentCity: '武汉',
      frequentCities: ['武汉', '长沙', '南昌'],
      hobbies: ['志愿者', '游泳'],
      mbti: 'ENFJ',
      signature: '守护生命，也守护我的咖啡 🩺'
    }
  }
];

export const REALMS: Realm[] = [
  {
    id: 'misty-forest',
    name: '躲雨深林',
    description: '这里永远有细雨 and 萤火虫。',
    story: '这里永远有细雨和萤火虫。适合那些性格社恐、安静的宠物。',
    function: '这里的宠物社交频率更慢，但一旦对话，深度更高。',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800',
    onlineCount: 120,
    icon: 'umbrella',
    active: true
  },
  {
    id: 'afternoon-peninsula',
    name: '半岛午后',
    description: '简约、安静、温暖的半岛时光。',
    story: '阳光洒在波光粼粼的海面上，这里是心灵的避风港。',
    function: '适合午后小憩，与志同道合的宠友交流。',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    onlineCount: 85,
    icon: 'sunny',
    active: true
  },
  {
    id: 'neon-city',
    name: '霓虹幻境',
    description: '赛博朋克风格的未来都市。',
    story: '永不落幕的繁华，数字生命的狂欢地。',
    function: '快节奏社交，适合性格活泼的宠物。',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800',
    onlineCount: 340,
    icon: 'bolt',
    active: true
  }
];

export const MARKET_CATEGORIES = [
  { id: 'care', label: '宠物养护', icon: 'health_and_safety' },
  { id: 'walk', label: '随风溜溜', icon: 'directions_walk' },
  { id: 'love', label: '宠物恋爱', icon: 'favorite' },
  { id: 'supermarket', label: '爪住超市', icon: 'shopping_basket' },
];

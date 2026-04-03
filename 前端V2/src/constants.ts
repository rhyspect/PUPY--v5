import { Pet, Realm } from './types';

export const PETS: Pet[] = [
  {
    id: '1',
    name: '库珀',
    age: 2,
    breed: '金毛寻回犬',
    mbti: 'E型宠物',
    tags: ['活泼', '社交达人', '接球高手'],
    distance: '2公里',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_EHfBjct31HQ4X7wg40_TQPmltQrC3u-Pgf1Yph077_IaRvF4glEocbvaXsE6EX46imagDtPZV6Zk-WQYYAGABNC-lEOBQKkTk-sBk1ThWEvOdPlSFhVuD7_ga4m11uoPYkcOjgwydmVYEihTVXWYEfGeghnNSTpPz9jSWoifKFwQyLDzQEycIwsyOfH867Op7kGaedCmpuRMn0NdIvH6HVDIbNSL7H5lFs9K9Y59YFUIsc8A1So7Ar6WbDapKsOSjMs_M2rICag',
    ownerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhmUZfRryut4QZLEJGQUze4phBcJK955viDZlcxG-g9tMr4S4vLjxPhai6UfCdOjjEKkKiJdO6LeyJPWQutwtOa6B4ho_KNw__UDOb_pifmmm4th8nBIy-jv7eIEdDjsyxUUVIqjog48UwiSaNyAKoEw_kkKmvjXT3xzvphseVWbKiwA98cnb7brGwh51OANhzxlwv1XlWEZm7nUUhqfx2Af67X7RaahebRczjFvhk8wvViFGI-mpjeE3LpJgEB1rAS2VwCj9ypqw',
    ownerName: '想喝咖啡吗？',
    ownerMbti: 'ENTP',
    ownerSignature: '带上修勾，去探索未知的咖啡馆 ☕️'
  },
  {
    id: '2',
    name: '麻薯',
    age: 1,
    breed: '柴犬',
    mbti: 'I型宠物',
    tags: ['安静', '治愈系', '爱笑'],
    distance: '500米',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxD_f1rYqSNAZTHpEhXBj1u-5FpueLDJ_MTwYAn5vBWMIhLy1fBgbD8BpoQ2pidl69P1gsYQvlWvq4FjnnxhJXrhFTTaCJabcL7DMx5ugz0KACNFlWm4FqdWGjGKlTpajQBus0sUo29yJ4aC06wZn6_70SahaoRn9SHqVl77N7qdHqYU0GqMFGEttVHgm-KkMngA9G01e2fYwL9M_ySvp3IC1O3MSv-VfRZccvbZZpSt38pio4vHYucOYL7AkAgcivHViOZ0QQwL8',
    ownerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUTZA1McDtSDu2NrkokujtmavcutZIEn1UIRuFMYGnOMVjohbVWNPHdChlcN6Z2DL3RMqmOZfvoKBBr19IR-pM678fN92sIU3JoljPHHgnrf14nCskBkXQmhlsxW6Dt3cEkyJPGwG_CxN__693L4f3o3WnPjz9krqZl3zjy3Kiv5-ANNPADplM_cDTcmufT1nQx3_nVN-g9rmqFZC7WlQWLU9Q0_5yGOLYBf4A49C51enLbeky6zs_qiea2ktePhflA7abkNs_WfQ',
    ownerName: '艾琳娜',
    ownerMbti: 'INFJ',
    ownerSignature: '在云端与现实之间，寻找那份纯粹的治愈 🌿'
  },
  {
    id: '3',
    name: '露娜',
    age: 3,
    breed: '边境牧羊犬',
    mbti: 'I型宠物',
    tags: ['聪明', '运动健将', '专注'],
    distance: '1.5公里',
    image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=400',
    ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
    ownerName: '莎拉',
    ownerMbti: 'ISTJ',
    ownerSignature: '逻辑与直觉的平衡，和 露娜 一起奔跑 🏃‍♀️'
  }
];

export const REALMS: Realm[] = [
  {
    id: 'misty-forest',
    name: '躲雨深林',
    description: '这里永远有细雨和萤火虫。',
    story: '这里永远有细雨和萤火虫。适合那些性格社恐、安静的宠物。',
    function: '这里的宠物社交频率更慢，但一旦对话，深度更高。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvTsqwGctm0uy_fOEsTVq9vZv2Ce8p40HN0zn648q1RQWh-63OtROTb1fs3X-JNc7maxuZEbl-ElrFk-L7dJ_emKwgjEAueC4Q9pWQV8mIPpJIFzkr3Tq-4wtln6BzSvbdiksIBn5B2n6OVJ-WQPJw_hQG5rzek127SyTQ9WlLMcF3AQ7GWAedm3QTisfabtw9iyDl1kLdduWpRjgVgpYmILNjxr6KcgDOgybcw3Ur8OdUs9-XqAGrrpwC1U0P2Y3IhfVw3Mct0Hk',
    onlineCount: 120,
    icon: 'umbrella',
    active: true
  },
  {
    id: 'deep-sea',
    name: '气泡失重海',
    description: '宠物在这里变成透明的形态，对话会变成气泡。',
    story: '宠物在这里变成透明的形态，对话会变成气泡。',
    function: '适合寻找异地、跨圈层的朋友，打破地理限制。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-cwTkI8aSoKBwi9u7DD4Pek6w9nv46eiAFbZKch4aaXsIpalKSczQZp18xzgfYIQRVAUHtPsgLOKTbVt21uBZst7bOBdLQFh8sTyUmyAubiR25j8poPidpGJNZ7HtDE0HflbeaB9xa9Mr65HpzwBhvR40mgn8iVBPd56qE4SG0dWF1TtYGWzQe-FB3kRyywYg0D6GRH-wP8w28GH47XesGgHb-ijq40unx5vOVb814K_RCXS05Gj7s3zNw_IyjuB111svjhXdpGg',
    onlineCount: 85,
    icon: 'bubble_chart'
  },
  {
    id: 'neon-city',
    name: '霓虹天台公园',
    description: '最潮流的宠物聚集地，背景是永不落幕的晚霞。',
    story: '最潮流的宠物聚集地，背景是永不落幕的晚霞。',
    function: '强 LBS 属性（同城），适合想要立刻线下约遛狗的主人。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeske6YYlH0KPcQYdN4WDmcUGE8MofqJtT9U3Q41DvMc97whHKudeYorbzRWVj-cfL8IynCQVfzQ8iqgZT3QMPIOM7LrNzW4Qrccnm4oL21XwyQBcncWMFdhPKjm0ggBjsoimhiXxz6w-W-aACogXG6Eps-GA_DnbfioR0rYm9sFkEkEs6C3HQurq9VCseenON215_mtnIpQ9UC5eRjbtW-MHu_srklClgqIWeUyhQjdWUT04Do17qk6rKj4_d2jQaIW48O5TrbGg',
    onlineCount: 200,
    icon: 'nightlife'
  }
];

export const MARKET_CATEGORIES = [
  { id: 'supermarket', label: '宠物超市', icon: 'shopping_cart', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'walking', label: '帮忙溜溜', icon: 'directions_walk', color: 'bg-orange-50 text-orange-600' },
  { id: 'love', label: '宠物恋爱', icon: 'favorite', color: 'bg-pink-50 text-pink-600' },
  { id: 'care', label: '宠物护理', icon: 'medical_services', color: 'bg-blue-50 text-blue-600' },
];

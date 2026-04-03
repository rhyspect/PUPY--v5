import { useState } from 'react';
import { MARKET_CATEGORIES } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import ProductDetail from './ProductDetail';

interface MarketProps {
  onChat: (ownerName: string) => void;
}

export default function Market({ onChat }: MarketProps) {
  const [activeCategory, setActiveCategory] = useState('care');
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<boolean>(false);

  const loveList = [
    {
      id: '1',
      name: '雪球',
      breed: '萨摩耶',
      age: '2岁',
      gender: '母',
      cost: 'AA配种',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400',
      tags: ['血统纯正', '性格温顺'],
      owner: '雪球麻麻',
      description: '雪球是一个非常温柔的萨摩耶，平时很安静，不乱叫。希望给它找一个同样性格好的小伙伴。',
      personality: '温顺、粘人、爱笑',
      location: '上海·静安',
      vaccine: '三针齐、定期驱虫',
      pedigree: 'CKU双血统',
      lookingFor: '希望找一位体型匀称、性格稳重的萨摩耶帅哥，最好也是双血统。'
    },
    {
      id: '2',
      name: '坦克',
      breed: '法斗',
      age: '3岁',
      gender: '公',
      cost: '公方全出',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400',
      tags: ['冠军后代', '体格健壮'],
      owner: '坦克爸爸',
      description: '坦克是家里的开心果，体格非常健壮，肌肉线条完美。希望延续它的优良基因。',
      personality: '活泼、勇敢、聪明',
      location: '上海·徐汇',
      vaccine: '疫苗齐全、身体健康',
      pedigree: '冠军犬后代',
      lookingFor: '寻找一位同样是法斗的漂亮MM，希望对方也比较健康活泼。'
    },
    {
      id: '3',
      name: '贝拉',
      breed: '金毛',
      age: '1.5岁',
      gender: '母',
      cost: '母方全出',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
      tags: ['聪明伶俐', '毛发亮泽'],
      owner: '贝拉姐姐',
      description: '贝拉非常聪明，已经学会了很多指令。毛发金灿灿的，非常漂亮。',
      personality: '聪明、听话、爱玩球',
      location: '上海·黄浦',
      vaccine: '已打三针、定期体检',
      pedigree: '单血统',
      lookingFor: '希望找一位性格开朗的金毛帅哥，大家可以先一起去公园玩耍。'
    }
  ];

  const walkOrders = [
    { id: '1', title: '急需遛狗！金毛库珀', location: '上海市静安区', time: '今天 18:00', price: '¥50/小时', pet: '金毛', avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=100' },
    { id: '2', title: '寻找温柔的遛狗员', location: '上海市徐汇区', time: '明天 08:30', price: '¥45/小时', pet: '柴犬', avatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=100' },
    { id: '3', title: '萨摩耶雪球求带走', location: '上海市浦东新区', time: '周六 全天', price: '¥120/天', pet: '萨摩耶', avatar: 'https://images.unsplash.com/photo-1529429617329-8a737053918e?auto=format&fit=crop&q=80&w=100' },
  ];

  const careServices = [
    { 
      id: '1', 
      name: '瑞鹏宠物医院 (静安店)', 
      type: '全科医疗', 
      rating: '4.9', 
      distance: '1.2km', 
      image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=400',
      address: '上海市静安区南京西路1234号',
      phone: '021-62345678',
      link: 'https://www.ruipengpet.com'
    },
    { 
      id: '2', 
      name: '萌宠造型沙龙', 
      type: '洗护美容', 
      rating: '4.8', 
      distance: '0.8km', 
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400',
      address: '上海市静安区胶州路567号',
      phone: '021-52348888',
      link: 'https://www.petgrooming.com'
    },
    { 
      id: '3', 
      name: '安安宠医', 
      type: '24h急诊', 
      rating: '4.7', 
      distance: '2.5km', 
      image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=400',
      address: '上海市徐汇区虹桥路888号',
      phone: '021-33445566',
      link: 'https://www.ananpet.com'
    },
  ];

  if (selectedProduct) {
    return <ProductDetail onBack={() => setSelectedProduct(false)} />;
  }

  const renderContent = () => {
    switch (activeCategory) {
      case 'love':
        return (
          <div className="grid grid-cols-2 gap-4">
            {loveList.map((pet) => (
              <motion.div 
                key={pet.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 group"
              >
                <div className="relative aspect-square">
                  <img src={pet.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={pet.name} referrerPolicy="no-referrer" />
                  <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[9px] font-black text-primary shadow-sm">
                    {pet.cost}
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-slate-900 text-base truncate">{pet.name}</h4>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${pet.gender === '母' ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-500'}`}>
                      {pet.gender}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold">{pet.breed} • {pet.age}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {pet.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[8px] font-bold rounded uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => setSelectedPet(pet)}
                    className="w-full mt-3 py-2.5 bg-primary/5 hover:bg-primary hover:text-white text-primary text-[10px] font-black rounded-xl transition-all active:scale-95"
                  >
                    申请匹配
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        );
      case 'walk':
        return (
          <div className="space-y-4">
            <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mb-6 active:scale-95 transition-transform">
              <span className="material-symbols-outlined">add_circle</span>
              发布遛狗需求
            </button>
            {walkOrders.map((order) => (
              <motion.div 
                key={order.id}
                whileHover={{ x: 5 }}
                className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4"
              >
                <img src={order.avatar} className="w-14 h-14 rounded-2xl object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{order.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                      {order.location}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">schedule</span>
                      {order.time}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary font-black text-sm">{order.price}</p>
                  <button className="mt-2 px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg">接单</button>
                </div>
              </motion.div>
            ))}
          </div>
        );
      case 'care':
        return (
          <div className="grid grid-cols-1 gap-4">
            {careServices.map((service) => (
              <motion.div 
                key={service.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col"
              >
                <div className="flex">
                  <div className="w-32 h-32">
                    <img src={service.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 text-sm">{service.name}</h4>
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold text-[10px]">
                          <span className="material-symbols-outlined text-[12px]">star</span>
                          {service.rating}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">{service.type} • {service.distance}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">location_on</span>
                          {service.address}
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">call</span>
                          {service.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4 flex gap-2">
                  <button className="flex-1 py-2 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-xl">查看详情</button>
                  <button className="flex-1 py-2 bg-primary text-white text-[10px] font-bold rounded-xl">立即预约</button>
                </div>
              </motion.div>
            ))}
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedProduct(true)}
                className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 space-y-4 cursor-pointer"
              >
                <div className="aspect-square rounded-3xl overflow-hidden bg-slate-50">
                  <img 
                    src={`https://picsum.photos/seed/market${i}/400/400`} 
                    className="w-full h-full object-cover" 
                    alt="商品" 
                  />
                </div>
                <div className="space-y-1 px-1">
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">云感毛绒甜甜圈宠物床</h4>
                  <p className="text-primary font-black text-lg">¥299</p>
                </div>
              </motion.div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="px-6 space-y-8 pb-10">
      <section className="text-center space-y-2">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary italic">宠物养护</h1>
        <p className="text-slate-500 font-medium tracking-tight">为您和您的宝贝提供最专业的线下服务</p>
      </section>

      {/* Categories */}
      <div className="grid grid-cols-4 gap-4">
        {MARKET_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              activeCategory === cat.id 
                ? 'bg-primary text-white shadow-xl scale-110' 
                : 'bg-white text-slate-400 border border-slate-100'
            }`}>
              <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
            </div>
            <span className={`text-[10px] font-black tracking-tight ${
              activeCategory === cat.id ? 'text-primary' : 'text-slate-400'
            }`}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">search</span>
        <input 
          type="text" 
          placeholder="搜索心仪的宝贝或用品..."
          className="w-full pl-12 pr-6 py-4 bg-white border-none rounded-[2rem] shadow-sm focus:ring-2 focus:ring-primary/20 font-medium text-sm"
        />
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
            {activeCategory === 'love' ? '寻找毛茸茸的灵魂伴侣' : 
             activeCategory === 'walk' ? '邻里互助遛狗' :
             activeCategory === 'care' ? '专业宠物服务' : '热门好物'}
          </h3>
          <button className="text-xs font-bold text-primary">查看全部</button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {renderContent()}
        </div>
      </div>

      <AnimatePresence>
        {selectedPet && (
          <motion.div 
            key="match-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedPet(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedPet(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="overflow-y-auto no-scrollbar">
                <div className="relative h-64">
                  <img src={selectedPet.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-8">
                    <h3 className="text-3xl font-black text-slate-900 italic tracking-tight">{selectedPet.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-full">{selectedPet.breed}</span>
                      <span className={`px-3 py-1 text-white text-[10px] font-black rounded-full ${selectedPet.gender === '公' ? 'bg-blue-500' : 'bg-pink-500'}`}>{selectedPet.gender}</span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full">{selectedPet.age}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 pt-0 space-y-6">
                    <div className="bg-slate-50 p-6 rounded-[2rem] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPet.owner}`} className="w-full h-full object-cover rounded-2xl" alt="" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">发布主人</p>
                      <p className="text-sm font-black text-slate-900">{selectedPet.owner}</p>
                    </div>
                    <button 
                      onClick={() => onChat(selectedPet.owner)}
                      className="ml-auto w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-lg">chat</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">详细介绍</h4>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed italic">"{selectedPet.description}"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-4 rounded-3xl space-y-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">性格特征</p>
                      <p className="text-xs font-bold text-slate-700">{selectedPet.personality}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-3xl space-y-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">所在地区</p>
                      <p className="text-xs font-bold text-slate-700">{selectedPet.location}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-3xl space-y-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">疫苗状况</p>
                      <p className="text-xs font-bold text-slate-700">{selectedPet.vaccine}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-3xl space-y-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">血统证明</p>
                      <p className="text-xs font-bold text-slate-700">{selectedPet.pedigree}</p>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-[2rem] space-y-3 border border-primary/10">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-lg">favorite</span>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">心仪对象</p>
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{selectedPet.lookingFor}</p>
                  </div>

                  <div className="bg-slate-900 p-6 rounded-[2rem] space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-400 text-lg">payments</span>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">配种费用支付意向</p>
                    </div>
                    <p className="text-sm font-black text-white italic">{selectedPet.cost}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 pt-4 bg-white border-t border-slate-50">
                <button 
                  onClick={() => setSelectedPet(null)}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-black shadow-2xl shadow-primary/30 active:scale-95 transition-all text-lg italic"
                >
                  发送匹配申请
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

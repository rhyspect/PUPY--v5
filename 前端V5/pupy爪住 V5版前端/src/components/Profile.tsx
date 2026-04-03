import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pet } from '../types';

interface ProfileProps {
  userPet: any;
  isDigitalTwinCreated: boolean;
  onStartCreation: () => void;
  onTwinCreated: () => void;
}

export default function Profile({ userPet, isDigitalTwinCreated, onStartCreation, onTwinCreated }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<'reality' | 'virtual' | 'member'>('reality');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [resonanceLevel, setResonanceLevel] = useState(12);
  const [cart, setCart] = useState([
    { id: 1, name: '有机天然狗粮 5kg', price: 299, quantity: 1, image: 'https://picsum.photos/seed/food1/200/200' },
    { id: 2, name: '智能宠物饮水机', price: 158, quantity: 1, image: 'https://picsum.photos/seed/water1/200/200' },
  ]);
  const [orders, setOrders] = useState([
    { id: 'ORD001', date: '2024-03-20', total: 457, status: '已发货', items: ['有机天然狗粮', '智能饮水机'] },
    { id: 'ORD002', date: '2024-03-15', total: 88, status: '已完成', items: ['宠物专用洗发水'] },
  ]);
  const [virtualChat, setVirtualChat] = useState([
    { id: 1, text: '主人，今天也要开开心心的哦！汪汪！', sent: false },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  if (!userPet || !userPet.owner) return null;

  const owner = userPet.owner;
  const hobbies = owner.hobbies || [];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMsg = { id: Date.now(), text: inputMessage, sent: true };
    setVirtualChat([...virtualChat, newMsg]);
    setInputMessage('');
    
    // Simulate pet response
    setTimeout(() => {
      const petResponse = { 
        id: Date.now() + 1, 
        text: '汪汪！(我听懂啦，我也很想你！)', 
        sent: false 
      };
      setVirtualChat(prev => [...prev, petResponse]);
      setResonanceLevel(prev => prev + 1);
    }, 1000);
  };

  const CITIES = ['北京', '上海', '广州', '深圳', '杭州', '成都', '南京', '武汉', '重庆', '西安', '苏州', '天津', '长沙', '郑州', '东莞', '青岛', '沈阳', '宁波', '昆明', '无锡'];

  const handleEdit = () => {
    setEditData({ ...owner });
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const datingData = [
    { label: '匹配成功', value: '12', icon: 'favorite', color: 'text-pink-500' },
    { label: '打招呼', value: '48', icon: 'chat_bubble', color: 'text-blue-500' },
    { label: '线下约见', value: '3', icon: 'location_on', color: 'text-emerald-500' },
    { label: '共同好友', value: '25', icon: 'group', color: 'text-amber-500' },
  ];

  const recentMoments = [
    { id: 1, type: 'image', url: 'https://picsum.photos/seed/moment1/400/400', date: '2小时前', text: '今天在公园遇到了好朋友库珀！' },
    { id: 2, type: 'image', url: 'https://picsum.photos/seed/moment2/400/400', date: '昨天', text: '新买的磨牙棒真香 🦴' },
    { id: 3, type: 'image', url: 'https://picsum.photos/seed/moment3/400/400', date: '3天前', text: '阳光明媚的午后 ☀️' },
  ];

  return (
    <div className="px-6 space-y-8 pb-10">
      <section className="text-center space-y-2">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary italic">个人空间</h1>
        <p className="text-slate-500 font-medium tracking-tight">欢迎回来，{owner.name}</p>
      </section>

      {/* Reality/Virtual/Member Switch */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1 rounded-[2rem] flex relative w-full h-14 max-w-sm">
          <motion.div 
            className="absolute top-1 bottom-1 bg-white rounded-[1.8rem] shadow-md z-0"
            initial={false}
            animate={{ 
              left: activeTab === 'reality' ? '4px' : activeTab === 'virtual' ? '33.33%' : '66.66%',
              width: 'calc(33.33% - 4px)'
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <button 
            onClick={() => setActiveTab('reality')}
            className={`flex-1 relative z-10 flex items-center justify-center gap-1 text-[10px] font-black transition-colors ${activeTab === 'reality' ? 'text-primary' : 'text-slate-400'}`}
          >
            <span className="material-symbols-outlined text-base">visibility</span>
            现实
          </button>
          <button 
            onClick={() => setActiveTab('virtual')}
            className={`flex-1 relative z-10 flex items-center justify-center gap-1 text-[10px] font-black transition-colors ${activeTab === 'virtual' ? 'text-primary' : 'text-slate-400'}`}
          >
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            分身
          </button>
          <button 
            onClick={() => setActiveTab('member')}
            className={`flex-1 relative z-10 flex items-center justify-center gap-1 text-[10px] font-black transition-colors ${activeTab === 'member' ? 'text-primary' : 'text-slate-400'}`}
          >
            <span className="material-symbols-outlined text-base">card_membership</span>
            会员
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'reality' ? (
          <motion.div 
            key="reality"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            className="space-y-8"
          >
            {/* Owner Card */}
            <div className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100 p-8 space-y-6 relative">
              <button 
                onClick={handleEdit}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-xl">edit</span>
              </button>
              <div className="flex items-center gap-6">
                <div 
                  onClick={() => setShowUploadModal(true)}
                  className="w-24 h-24 rounded-[2.5rem] overflow-hidden shadow-xl ring-4 ring-primary/5 cursor-pointer hover:scale-105 transition-transform"
                >
                  <img src={owner.avatar} className="w-full h-full object-cover" alt="主人" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-headline text-2xl font-black text-slate-900 truncate tracking-tight">{owner.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-primary font-bold italic text-sm">{owner.gender} • {owner.age}岁</span>
                    <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-md font-black">{owner.mbti}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] rounded-full font-black tracking-widest">常驻: {owner.residentCity}</span>
                    {owner.frequentCities?.map(city => (
                      <span key={city} className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] rounded-full font-black tracking-widest">常去: {city}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-50">
                <p className="text-sm font-medium text-slate-500 italic leading-relaxed">"{owner.signature || '很高兴认识大家和大家的毛孩子 ✨'}"</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">兴趣爱好</h4>
                <div className="flex flex-wrap gap-2">
                  {hobbies.slice(0, 8).map(hobby => (
                    <span key={hobby} className="px-4 py-2 bg-emerald-50 text-emerald-600 text-xs font-black rounded-2xl tracking-wide border border-emerald-100">
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Dating Data Section */}
            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">最近交友数据</h4>
              <div className="grid grid-cols-2 gap-4">
                {datingData.map((data, i) => (
                  <div key={i} className="bg-slate-50 p-6 rounded-[2.5rem] flex items-center gap-4 group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                    <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm ${data.color}`}>
                      <span className="material-symbols-outlined">{data.icon}</span>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-900 leading-none">{data.value}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{data.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pet Card */}
            <div className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100 p-8 space-y-6">
              <div className="flex items-center gap-6">
                <div 
                  onClick={() => setShowUploadModal(true)}
                  className="w-24 h-24 rounded-[2.5rem] overflow-hidden shadow-xl ring-4 ring-primary/5 cursor-pointer hover:scale-105 transition-transform"
                >
                  <img src={userPet.images?.[0]} className="w-full h-full object-cover" alt="宠物" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-headline text-2xl font-black text-slate-900 truncate tracking-tight">{userPet.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-primary font-bold italic text-sm">{userPet.gender} • {userPet.type}</span>
                    <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-md font-black">{userPet.personality}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-3xl group"
                >
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">add_a_photo</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">上传照片</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-3xl group">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">edit_note</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">编辑档案</span>
                </button>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <p className="text-xl font-black text-slate-900">128</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">获赞</p>
                </div>
                <div className="text-center border-x border-slate-100">
                  <p className="text-xl font-black text-slate-900">42</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">关注</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-slate-900">56</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">粉丝</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-3 pt-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">最近动态</h4>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex-shrink-0 w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden group relative">
                      <img src={`https://picsum.photos/seed/activity${i}/300/300`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-sm">favorite</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Moments Section */}
            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">我的瞬间</h4>
                <button className="text-primary text-[10px] font-black uppercase tracking-widest">全部</button>
              </div>
              <div className="space-y-4">
                {recentMoments.map(moment => (
                  <div key={moment.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0">
                      <img src={moment.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-bold text-slate-900 line-clamp-2">{moment.text}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{moment.date}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                          <span className="material-symbols-outlined text-xs">favorite</span>
                          12
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                          <span className="material-symbols-outlined text-xs">chat_bubble</span>
                          4
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'virtual' ? (
          <motion.div 
            key="virtual"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            className="space-y-8"
          >
            {!isDigitalTwinCreated ? (
              /* Virtual Pet Status - Not Created */
              <div className="bg-slate-900 rounded-[3rem] p-10 text-center space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.15),transparent)]" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
                
                <div className="relative z-10 space-y-8">
                  <div 
                    onClick={() => setShowUploadModal(true)}
                    className="w-28 h-28 bg-emerald-500/20 rounded-[3rem] flex items-center justify-center mx-auto ring-1 ring-emerald-500/30 shadow-2xl shadow-emerald-500/10 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <span className="material-symbols-outlined text-6xl text-emerald-400 animate-pulse">auto_awesome</span>
                  </div>
                  
                  <div 
                    onClick={() => setShowUploadModal(true)}
                    className="space-y-3 cursor-pointer group"
                  >
                    <h3 className="text-3xl font-black text-white italic tracking-tight group-hover:text-emerald-400 transition-colors">数字分身</h3>
                    <p className="text-slate-400 text-sm font-medium px-4 leading-relaxed">
                      让宠物的灵魂在数字世界永恒共鸣，开启跨越次元的社交新纪元
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={onStartCreation}
                      className="w-full py-6 bg-emerald-500 text-white font-black rounded-[2rem] shadow-2xl shadow-emerald-500/30 active:scale-95 transition-all text-xl italic"
                    >
                      进入生成页
                    </button>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      AI 驱动 • 灵魂共鸣 • 跨次元社交
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Digital Twin Page - Created */
              <div className="space-y-6">
                {/* Pet Avatar & Resonance */}
                <div className="bg-slate-900 rounded-[3rem] p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent)]" />
                  <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-[3.5rem] overflow-hidden ring-4 ring-emerald-500/30 shadow-2xl">
                        <img src={userPet.images?.[0]} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined text-white text-xl">auto_awesome</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-black text-white italic">{userPet.name} 的数字分身</h3>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="material-symbols-outlined text-emerald-400 text-sm">trending_up</span>
                        <span className="text-emerald-400 font-black text-xs uppercase tracking-widest">共鸣等级 LV.{resonanceLevel}</span>
                      </div>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        className="h-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(resonanceLevel % 10) * 10}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Chat Interface */}
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[400px]">
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">灵魂对话</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">在线共鸣中</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                    {virtualChat.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-bold ${msg.sent ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-100 text-slate-900 rounded-tl-none'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                    <input 
                      type="text" 
                      value={inputMessage}
                      onChange={e => setInputMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="和分身聊聊天..."
                      className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20"
                    >
                      <span className="material-symbols-outlined text-sm">send</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Virtual Features */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 space-y-6">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">分身特权</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                    <span className="material-symbols-outlined">language</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">跨语言翻译</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                    <span className="material-symbols-outlined">psychology</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">性格模拟</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="member"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            className="space-y-8"
          >
            {/* Member Info */}
            <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black italic">黑金会员</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">PUPY VIP MEMBER</p>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <span className="material-symbols-outlined text-primary">workspace_premium</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">可用积分</p>
                    <p className="text-2xl font-black text-primary">2,480</p>
                  </div>
                  <button className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-colors">
                    积分商城
                  </button>
                </div>
              </div>
            </div>

            {/* Shopping Cart */}
            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">购物车 ({cart.length})</h4>
                {cart.length > 0 && (
                  <button 
                    onClick={() => setShowCheckout(true)}
                    className="text-primary text-[10px] font-black uppercase tracking-widest"
                  >
                    去结算
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {cart.length === 0 ? (
                  <div className="py-10 text-center space-y-2">
                    <span className="material-symbols-outlined text-slate-200 text-4xl">shopping_cart</span>
                    <p className="text-xs font-bold text-slate-400">购物车空空如也</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-black text-slate-900 truncate">{item.name}</h5>
                        <p className="text-primary font-black text-sm mt-1">¥{item.price}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1">
                        <button 
                          onClick={() => setCart(cart.map(i => i.id === item.id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))}
                          className="w-6 h-6 flex items-center justify-center text-slate-400"
                        >
                          <span className="material-symbols-outlined text-xs">remove</span>
                        </button>
                        <span className="text-xs font-black text-slate-900 w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))}
                          className="w-6 h-6 flex items-center justify-center text-slate-400"
                        >
                          <span className="material-symbols-outlined text-xs">add</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Product Orders */}
            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">我的订单</h4>
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-slate-50 p-6 rounded-[2.5rem] space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">订单编号: {order.id}</p>
                        <p className="text-[8px] font-bold text-slate-400 mt-0.5">{order.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        order.status === '已完成' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-xs font-bold text-slate-700">• {item}</p>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">实付金额</p>
                      <p className="text-lg font-black text-slate-900">¥{order.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckout(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-[3rem] p-8 space-y-6 shadow-2xl"
            >
              <h3 className="text-2xl font-black text-slate-900 italic text-center">确认结账</h3>
              <div className="space-y-4">
                <div className="bg-slate-50 p-6 rounded-[2rem] space-y-3">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>商品总计</span>
                    <span>¥{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>运费</span>
                    <span>¥0.00</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-sm font-black text-slate-900">应付总额</span>
                    <span className="text-2xl font-black text-primary">¥{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">支付方式</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 bg-slate-50 rounded-2xl border-2 border-primary flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                      <span className="text-[10px] font-black text-slate-900">微信支付</span>
                    </button>
                    <button className="p-4 bg-slate-50 rounded-2xl border-2 border-transparent flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400">payments</span>
                      <span className="text-[10px] font-black text-slate-900">支付宝</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  const newOrder = {
                    id: `ORD${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                    date: new Date().toISOString().split('T')[0],
                    total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
                    status: '待发货',
                    items: cart.map(i => i.name)
                  };
                  setOrders([newOrder, ...orders]);
                  setCart([]);
                  setShowCheckout(false);
                }}
                className="w-full py-5 bg-primary text-white rounded-3xl font-black shadow-2xl shadow-primary/30 active:scale-95 transition-all text-xl italic"
              >
                立即支付
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Photo Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-[3rem] p-8 space-y-6 shadow-2xl"
            >
              <h3 className="text-2xl font-black text-slate-900 italic text-center">上传宠物照片</h3>
              <div 
                onClick={() => {
                  onTwinCreated();
                  setActiveTab('virtual');
                  setShowUploadModal(false);
                }}
                className="w-full aspect-square border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-slate-50 transition-all"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">点击或拖拽上传</p>
              </div>
              <button 
                onClick={() => {
                  onTwinCreated();
                  setActiveTab('virtual');
                  setShowUploadModal(false);
                }}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20"
              >
                确认上传
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-[3rem] p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[80vh] no-scrollbar"
            >
              <h3 className="text-2xl font-black text-slate-900 italic">编辑个人信息</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">昵称</label>
                  <input 
                    type="text" 
                    value={editData.name}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">个性签名</label>
                  <textarea 
                    value={editData.signature}
                    onChange={e => setEditData({ ...editData, signature: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm h-24 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">岁数</label>
                    <input 
                      type="number" 
                      value={editData.age}
                      onChange={e => setEditData({ ...editData, age: parseInt(e.target.value) })}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">MBTI</label>
                    <input 
                      type="text" 
                      value={editData.mbti}
                      onChange={e => setEditData({ ...editData, mbti: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">常驻城市</label>
                  <div className="relative">
                    <select 
                      value={editData.residentCity}
                      onChange={e => setEditData({ ...editData, residentCity: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm appearance-none"
                    >
                      {CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">常去城市</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editData.frequentCities?.map((city: string) => (
                      <span key={city} className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg flex items-center gap-1">
                        {city}
                        <button onClick={() => setEditData({ ...editData, frequentCities: editData.frequentCities.filter((c: string) => c !== city) })}>
                          <span className="material-symbols-outlined text-[12px]">close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <select 
                      onChange={e => {
                        const city = e.target.value;
                        if (city && !editData.frequentCities?.includes(city)) {
                          setEditData({ ...editData, frequentCities: [...(editData.frequentCities || []), city] });
                        }
                      }}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm appearance-none"
                      value=""
                    >
                      <option value="" disabled>添加城市...</option>
                      {CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">add</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 font-black rounded-2xl"
                >
                  取消
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20"
                >
                  保存
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

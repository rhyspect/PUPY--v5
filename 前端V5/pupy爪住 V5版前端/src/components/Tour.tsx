import { useState } from 'react';
import { REALMS, PETS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

export default function Tour({ onSelectRealm }: { onSelectRealm: () => void }) {
  const [view, setView] = useState<'map' | 'realms' | 'courtyards'>('map');
  const [showModal, setShowModal] = useState<'create' | 'join' | null>(null);
  const [modalData, setModalData] = useState({ name: '', id: '', password: '' });
  const [courtyards, setCourtyards] = useState([
    { id: '1024', name: '金毛大本营', members: 156, image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400', description: '全网最暖的金毛聚会点' },
    { id: '2048', name: '柴犬表情包库', members: 89, image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400', description: '分享自家柴柴的奇葩瞬间' },
    { id: '3072', name: '上海遛狗小分队', members: 234, image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=400', description: '周末徐汇滨江见！' },
  ]);

  const handleJoin = () => {
    if (!modalData.id || !modalData.password) return;
    setShowModal(null);
    setModalData({ name: '', id: '', password: '' });
    // In a real app, we'd verify the ID and password
  };

  const handleCreate = () => {
    if (!modalData.name || !modalData.password) return;
    const newId = Math.floor(1000 + Math.random() * 9000).toString();
    setCourtyards([...courtyards, {
      id: newId,
      name: modalData.name,
      members: 1,
      image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=400',
      description: '新创建的小院儿，欢迎加入！'
    }]);
    setShowModal(null);
    setModalData({ name: '', id: '', password: '' });
  };

  return (
    <div className="px-6 space-y-8 pb-10">
      <section className="text-center space-y-2">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary italic">随风溜溜</h1>
        <p className="text-slate-500 font-medium tracking-tight">发布遛狗订单，或者随风而行帮邻居遛遛毛孩子</p>
      </section>

      {/* View Switcher */}
      <div className="flex justify-center p-1 bg-slate-100 rounded-[2rem] max-w-[320px] mx-auto">
        <button 
          onClick={() => setView('map')}
          className={`flex-1 py-3 rounded-[1.8rem] text-[10px] font-black transition-all ${view === 'map' ? 'bg-white text-primary shadow-lg' : 'text-slate-400'}`}
        >
          云端地图
        </button>
        <button 
          onClick={() => setView('realms')}
          className={`flex-1 py-3 rounded-[1.8rem] text-[10px] font-black transition-all ${view === 'realms' ? 'bg-white text-primary shadow-lg' : 'text-slate-400'}`}
        >
          探索领域
        </button>
        <button 
          onClick={() => setView('courtyards')}
          className={`flex-1 py-3 rounded-[1.8rem] text-[10px] font-black transition-all ${view === 'courtyards' ? 'bg-white text-primary shadow-lg' : 'text-slate-400'}`}
        >
          小院儿
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'map' && (
          <motion.div 
            key="map"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative aspect-square rounded-[3rem] bg-emerald-50 border-4 border-white shadow-2xl overflow-hidden"
          >
            {/* Mock Map Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-200 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-emerald-300 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[20px] border-emerald-100 rounded-full" />
            </div>

            {/* Pet Avatars on Map */}
            {PETS.map((pet, i) => (
              <motion.div 
                key={pet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  x: [0, 10, -10, 0][i % 4],
                  y: [0, -10, 10, 0][i % 4]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
                className="absolute"
                style={{ 
                  top: `${20 + i * 25}%`, 
                  left: `${20 + (i % 2) * 40}%` 
                }}
              >
                <div className="relative group cursor-pointer" onClick={onSelectRealm}>
                    <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-xl ring-4 ring-emerald-500/20 group-hover:scale-110 transition-transform">
                      <img src={pet.images?.[0]} alt={pet.name} className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                    </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg border border-slate-100 whitespace-nowrap">
                    <span className="text-[10px] font-black text-slate-900">{pet.name}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                </div>
              </motion.div>
            ))}

            {/* User Location */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-primary rounded-full border-4 border-white shadow-2xl animate-bounce" />
              <div className="w-16 h-16 bg-primary/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
            </div>

            <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white/50 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">near_me</span>
                  <span className="text-xs font-black text-slate-900 tracking-tight">发现 12 位新朋友在附近</span>
                </div>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest">刷新地图</button>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'realms' && (
          <motion.div 
            key="realms"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 gap-6"
          >
            {REALMS.map((realm) => (
              <motion.div
                key={realm.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSelectRealm}
                className="group relative h-64 rounded-[3rem] overflow-hidden shadow-2xl cursor-pointer border-4 border-white"
              >
                <img 
                  src={realm.image} 
                  alt={realm.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-white text-[10px] font-black tracking-widest">{realm.onlineCount} 在线</span>
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <span className="material-symbols-outlined text-white text-xl">{realm.icon}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white font-headline tracking-tight">{realm.name}</h3>
                  </div>
                  <p className="text-white/70 text-xs font-medium leading-relaxed line-clamp-2 pr-10">
                    {realm.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {view === 'courtyards' && (
          <motion.div 
            key="courtyards"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex gap-3">
              <button 
                onClick={() => setShowModal('create')}
                className="flex-1 py-6 bg-primary/10 border-2 border-dashed border-primary/30 rounded-[2.5rem] flex items-center justify-center gap-3 text-primary font-black hover:bg-primary/20 transition-all"
              >
                <span className="material-symbols-outlined">add_circle</span>
                <span>创建小院儿</span>
              </button>
              <button 
                onClick={() => setShowModal('join')}
                className="flex-1 py-6 bg-slate-100 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex items-center justify-center gap-3 text-slate-500 font-black hover:bg-slate-200 transition-all"
              >
                <span className="material-symbols-outlined">group_add</span>
                <span>加入小院儿</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {courtyards.map((court) => (
                <div key={court.id} className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-4">
                  <img src={court.image} alt={court.name} className="w-20 h-20 rounded-3xl object-cover shadow-md" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{court.name}</h3>
                    <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{court.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">{court.members} 成员</span>
                      <span className="text-[9px] font-bold text-slate-300">ID: {court.id}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowModal('join')}
                    className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-full hover:bg-primary transition-colors"
                  >
                    加入
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Courtyard Modals */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[3rem] p-8 shadow-2xl space-y-6"
            >
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-slate-900">
                  {showModal === 'create' ? '创建我的小院儿' : '加入已有小院儿'}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {showModal === 'create' ? '设置您的专属社交空间' : '输入号码和密码进入空间'}
                </p>
              </div>

              <div className="space-y-4">
                {showModal === 'create' ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-4">小院儿名称</label>
                    <input 
                      type="text" 
                      value={modalData.name}
                      onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                      placeholder="例如：金毛大本营"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-4">小院儿名称</label>
                    <input 
                      type="text" 
                      value={modalData.id}
                      onChange={(e) => setModalData({ ...modalData, id: e.target.value })}
                      placeholder="例如：金毛大本营"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-4">进入密码</label>
                  <input 
                    type="password" 
                    value={modalData.password}
                    onChange={(e) => setModalData({ ...modalData, password: e.target.value })}
                    placeholder="请输入密码"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowModal(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl active:scale-95 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={showModal === 'create' ? handleCreate : handleJoin}
                  className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  确认{showModal === 'create' ? '创建' : '加入'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

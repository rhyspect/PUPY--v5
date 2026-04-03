import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Owner } from '../types';

export default function Chat({ owner, onBack }: { owner: Owner | null, onBack: () => void }) {
  const [chatMode, setChatMode] = useState<'owner' | 'pet'>('owner');
  const [message, setMessage] = useState('');
  const [showOwnerProfile, setShowOwnerProfile] = useState(false);

  const defaultOwner: Owner = {
    name: '想喝咖啡吗？',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100',
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'
    ],
    gender: '男',
    age: 25,
    residentCity: '上海',
    frequentCities: ['上海', '北京', '深圳'],
    hobbies: ['咖啡', '摄影', '滑板', '徒步', '露营', '黑胶唱片'],
    mbti: 'ENTP',
    signature: '带上修勾，去探索未知的咖啡馆 ☕️'
  };

  const targetOwner = owner || defaultOwner;

  const [ownerMessages, setOwnerMessages] = useState([
    { id: 1, text: '嘿！库珀看起来超级友好！', sent: false },
    { id: 2, text: '是的，他非常喜欢交新朋友。你们什么时候有空一起去公园？', sent: true },
    { id: 3, text: '这周末怎么样？躲雨深林领域现在很漂亮。', sent: false },
  ]);

  const [petMessages, setPetMessages] = useState([
    { id: 1, text: '汪汪！(你好啊！新朋友！)', sent: false },
    { id: 2, text: '嗷呜~ (我也很高兴见到你，闻起来真香)', sent: true },
    { id: 3, text: 'x82#kL9* (待翻译: 这里的草地闻起来真棒，想打滚)', sent: false, untranslated: true },
    { id: 4, text: '7f&mP2$ (待翻译: 我们去追那个红色的球吧！)', sent: true, untranslated: true },
    { id: 5, text: 'k9#vR4@ (待翻译: 你的尾巴摇得真好看)', sent: false, untranslated: true },
    { id: 6, text: 'z1*qW9! (待翻译: 嘿嘿，你也是！)', sent: true, untranslated: true },
    { id: 7, text: 'm3^pX2& (待翻译: 待会儿主人要带我去吃好吃的了)', sent: false, untranslated: true },
    { id: 8, text: 'r5%vB8# (待翻译: 真羡慕！我只有磨牙棒)', sent: true, untranslated: true },
    { id: 9, text: 't9@nK1* (待翻译: 下次见，我的朋友！)', sent: false, untranslated: true },
    { id: 10, text: 'Ω≈ç√∫˜µ (待翻译: 嘿，你听得懂我在说什么吗？)', sent: true, untranslated: true },
    { id: 11, text: '∆øπœ∑®† (待翻译: 好像 Neuralink 还没完全同步...)', sent: false, untranslated: true },
    { id: 12, text: '¥≈ß∂ƒ© (待翻译: 没关系，闻味道就够了！)', sent: true, untranslated: true },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMessage = { id: Date.now(), text: message, sent: true };
    if (chatMode === 'owner') {
      setOwnerMessages([...ownerMessages, newMessage]);
    } else {
      setPetMessages([...petMessages, newMessage]);
    }
    setMessage('');
  };

  const currentMessages = chatMode === 'owner' ? ownerMessages : petMessages;

  return (
    <div className="fixed inset-0 z-[100] bg-surface flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="p-6 flex flex-col gap-4 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </button>
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setShowOwnerProfile(true)}>
            <div className="relative">
              <img 
                src={targetOwner.avatar} 
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shadow-sm group-hover:scale-105 transition-transform" 
                alt="头像" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div className="min-w-0">
              <h3 className="font-headline font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{targetOwner.name}</h3>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">在线 • 距离 2公里</p>
            </div>
          </div>
        </div>

        {/* Chat Mode Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button 
            onClick={() => setChatMode('owner')}
            className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 ${chatMode === 'owner' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
          >
            <span className="material-symbols-outlined text-sm">person</span>
            主人对话
          </button>
          <button 
            onClick={() => setChatMode('pet')}
            className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 ${chatMode === 'pet' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
          >
            <span className="material-symbols-outlined text-sm">pets</span>
            宠物心声
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        <div className="text-center">
          <span className="px-4 py-1 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-widest">今天 14:30</span>
        </div>
        
        {currentMessages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-3xl shadow-sm ${
              msg.sent 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-white text-on-surface rounded-tl-none border border-slate-100'
            } ${(msg as any).untranslated ? 'opacity-80 italic' : ''}`}>
              <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
              {(msg as any).untranslated && (
                <div className="mt-2 flex items-center gap-1 text-[8px] font-black uppercase tracking-tighter opacity-70">
                  <span className="material-symbols-outlined text-[10px]">translate</span>
                  Neuralink 待翻译...
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <footer className="p-6 bg-white border-t border-slate-100">
        <div className="flex items-center gap-3 bg-slate-50 rounded-full px-6 py-2 shadow-inner border border-slate-100">
          <button className="text-slate-400 hover:text-primary">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={chatMode === 'owner' ? "输入消息..." : "汪汪汪！(输入宠物心声)"} 
            className="flex-1 bg-transparent border-none py-3 text-sm font-medium focus:ring-0"
          />
          <button 
            onClick={handleSend}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              message.trim() ? 'bg-primary text-white scale-110 shadow-lg' : 'text-slate-300'
            }`}
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </footer>

      {/* Owner Profile Modal */}
      <AnimatePresence>
        {showOwnerProfile && (
          <div className="fixed inset-0 z-[200] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOwnerProfile(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white rounded-t-[3rem] overflow-hidden shadow-2xl"
              style={{ maxHeight: '90vh' }}
            >
              <div className="overflow-y-auto h-full no-scrollbar pb-10">
                {/* Photo Gallery */}
                <div className="relative h-[45vh]">
                  <div className="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar">
                    {targetOwner.photos.map((photo, i) => (
                      <img key={i} src={photo} className="w-full h-full object-cover snap-center flex-shrink-0" alt="" referrerPolicy="no-referrer" />
                    ))}
                  </div>
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
                    <button onClick={() => setShowOwnerProfile(false)} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="px-3 py-1 bg-black/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                      1 / {targetOwner.photos.length}
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">{targetOwner.name}</h2>
                      <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-md font-black">{targetOwner.mbti}</span>
                    </div>
                    <p className="text-slate-400 font-medium text-sm">{targetOwner.signature}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-3xl space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">基本信息</p>
                      <p className="font-bold text-slate-900">{targetOwner.gender} • {targetOwner.age}岁</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-3xl space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">常驻城市</p>
                      <p className="font-bold text-slate-900">{targetOwner.residentCity}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">常去城市</h4>
                    <div className="flex flex-wrap gap-2">
                      {targetOwner.frequentCities.map(city => (
                        <span key={city} className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-black rounded-2xl tracking-wide border border-slate-100">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">兴趣爱好</h4>
                    <div className="flex flex-wrap gap-2">
                      {targetOwner.hobbies.map(hobby => (
                        <span key={hobby} className="px-4 py-2 bg-emerald-50 text-emerald-600 text-xs font-black rounded-2xl tracking-wide border border-emerald-100">
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button className="flex-1 py-5 bg-slate-100 text-slate-900 font-black rounded-3xl active:scale-95 transition-all">
                      关注
                    </button>
                    <button 
                      onClick={() => setShowOwnerProfile(false)}
                      className="flex-[2] py-5 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/20 active:scale-95 transition-all"
                    >
                      发起对话
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

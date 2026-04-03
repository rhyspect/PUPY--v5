import { motion } from 'motion/react';

interface DiaryProps {
  onBack: () => void;
}

export default function Diary({ onBack }: DiaryProps) {
  const logs = [
    {
      id: '1',
      date: '昨天 14:20',
      content: '今天和库珀去公园玩了，它交到了新朋友！',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
      pet: '库珀',
      location: '朝阳公园',
      mood: '开心',
      likes: 42,
      comments: 12
    },
    {
      id: '2',
      date: '昨天 10:15',
      content: '麻薯今天居然学会了握手，太聪明了！',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400',
      pet: '麻薯',
      location: '家里',
      mood: '自豪',
      likes: 28,
      comments: 5
    }
  ];

  return (
    <div className="fixed inset-0 z-[150] bg-surface flex flex-col max-w-md mx-auto overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-4 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-50">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-xl font-black font-headline text-slate-900 tracking-tight">昨日日志</h2>
      </header>

      {/* Diary List */}
      <div className="px-6 py-8 space-y-10 pb-20">
        {logs.map((log) => (
          <motion.div 
            key={log.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary-container overflow-hidden ring-4 ring-primary/5">
                  <img src={log.image} alt={log.pet} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">{log.pet}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{log.date}</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] rounded-full font-black uppercase tracking-widest shadow-sm">
                {log.mood}
              </div>
            </div>

            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl bg-slate-50 relative group">
              <img src={log.image} alt="日志图片" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span className="text-xs font-bold">{log.location}</span>
              </div>
            </div>

            <div className="px-4 space-y-4">
              <p className="text-slate-600 font-medium leading-relaxed">
                {log.content}
              </p>
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-xl">favorite</span>
                  <span className="text-xs font-bold">{log.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">chat_bubble</span>
                  <span className="text-xs font-bold">{log.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-colors ml-auto">
                  <span className="material-symbols-outlined text-xl">share</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-10 right-10 w-16 h-16 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all z-50">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
}

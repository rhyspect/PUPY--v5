import { motion } from 'motion/react';
import { Owner } from '../types';

interface OwnerProfileProps {
  owner: Owner;
  onClose: () => void;
  onStartChat: () => void;
}

export default function OwnerProfile({ owner, onClose, onStartChat }: OwnerProfileProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
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
              {(owner.photos || [owner.avatar]).map((photo, i) => (
                <img key={i} src={photo} className="w-full h-full object-cover snap-center flex-shrink-0" alt="" referrerPolicy="no-referrer" />
              ))}
            </div>
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="px-3 py-1 bg-black/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                1 / {(owner.photos?.length || 1)}
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">{owner.name}</h2>
                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-md font-black">{owner.mbti}</span>
              </div>
              <p className="text-slate-400 font-medium text-sm">{owner.signature}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-3xl space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">基本信息</p>
                <p className="font-bold text-slate-900">{owner.gender} • {owner.age}岁</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-3xl space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">常驻城市</p>
                <p className="font-bold text-slate-900">{owner.residentCity}</p>
              </div>
            </div>

            {owner.frequentCities && owner.frequentCities.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">常去城市</h4>
                <div className="flex flex-wrap gap-2">
                  {owner.frequentCities.map((city) => (
                    <span key={city} className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-black rounded-2xl tracking-wide border border-slate-100">
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {owner.hobbies && owner.hobbies.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">兴趣爱好</h4>
                <div className="flex flex-wrap gap-2">
                  {owner.hobbies.map((hobby) => (
                    <span key={hobby} className="px-4 py-2 bg-emerald-50 text-emerald-600 text-xs font-black rounded-2xl tracking-wide border border-emerald-100">
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button className="flex-1 py-5 bg-slate-100 text-slate-900 font-black rounded-3xl active:scale-95 transition-all">
                关注
              </button>
              <button 
                onClick={onStartChat}
                className="flex-[2] py-5 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/20 active:scale-95 transition-all"
              >
                发起对话
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

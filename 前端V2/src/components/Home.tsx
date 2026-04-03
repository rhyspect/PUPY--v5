import { useState } from 'react';
import { PETS } from '../constants';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';

export default function Home({ onMatch }: { onMatch: () => void }) {
  const [cards, setCards] = useState(PETS);
  const [lastDirection, setLastDirection] = useState<string | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const dislikeOpacity = useTransform(x, [-50, -150], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      swipe('right');
    } else if (info.offset.x < -100) {
      swipe('left');
    }
  };

  const swipe = (direction: string) => {
    setLastDirection(direction);
    if (direction === 'right') {
      // Simulate match logic
      if (Math.random() > 0.5) {
        onMatch();
      }
    }
    
    setTimeout(() => {
      setCards((prev) => prev.slice(1));
      setLastDirection(null);
      x.set(0);
    }, 200);
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-10 text-center space-y-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-4xl text-slate-300">sentiment_very_dissatisfied</span>
        </div>
        <h3 className="text-xl font-bold text-slate-800">附近没有更多爪住了</h3>
        <p className="text-sm text-slate-400">试试扩大搜索范围，或者稍后再来看看吧！</p>
        <button 
          onClick={() => setCards(PETS)}
          className="px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform"
        >
          重新探索
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 relative h-[70vh]">
      <AnimatePresence>
        {cards.map((pet, index) => {
          const isTop = index === 0;
          return (
            <motion.div
              key={pet.id}
              style={isTop ? { x, rotate, opacity } : {}}
              drag={isTop ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ 
                scale: isTop ? 1 : 0.95 - index * 0.05, 
                opacity: 1, 
                y: isTop ? 0 : index * 10,
                zIndex: cards.length - index 
              }}
              exit={{ 
                x: lastDirection === 'right' ? 500 : -500, 
                opacity: 0,
                rotate: lastDirection === 'right' ? 45 : -45,
                transition: { duration: 0.3 }
              }}
              className="absolute inset-x-6 top-0 aspect-[3/4.2] rounded-[3rem] overflow-hidden shadow-2xl bg-white border border-slate-100 touch-none"
            >
              <img 
                src={pet.image} 
                alt={pet.name} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              {/* Swipe Feedback */}
              {isTop && (
                <>
                  <motion.div 
                    style={{ opacity: likeOpacity }}
                    className="absolute top-20 right-10 border-4 border-emerald-500 text-emerald-500 font-black text-4xl px-4 py-2 rounded-2xl rotate-12 z-20 pointer-events-none"
                  >
                    喜欢
                  </motion.div>
                  <motion.div 
                    style={{ opacity: dislikeOpacity }}
                    className="absolute top-20 left-10 border-4 border-red-500 text-red-500 font-black text-4xl px-4 py-2 rounded-2xl -rotate-12 z-20 pointer-events-none"
                  >
                    无感
                  </motion.div>
                </>
              )}

              {/* Owner Info (Top Left) */}
              <div className="absolute top-6 left-6 right-6 flex flex-col gap-2 z-10">
                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl p-2 pr-4 rounded-[2rem] border border-white/20 self-start">
                  <img src={pet.ownerAvatar} alt="主人" className="w-10 h-10 rounded-2xl border-2 border-white/50 object-cover" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-black tracking-tight">{pet.ownerName}</span>
                      <span className="bg-primary/80 text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold">{pet.ownerMbti}</span>
                    </div>
                    <p className="text-white/60 text-[10px] truncate max-w-[120px]">{pet.ownerSignature}</p>
                  </div>
                </div>
                <div className="bg-black/20 backdrop-blur-md self-start px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-white text-xs">near_me</span>
                  <span className="text-white text-[10px] font-bold">{pet.distance}</span>
                </div>
              </div>

              {/* Pet Info */}
              <div className="absolute bottom-8 left-8 right-8 space-y-4">
                <div className="flex items-end gap-3">
                  <h2 className="text-4xl font-black text-white font-headline tracking-tight truncate flex-1">
                    {pet.name}, {pet.age}
                  </h2>
                  <div className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-xl text-[10px] font-black tracking-widest mb-1 border border-white/20">
                    {pet.mbti}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {pet.tags.map(tag => (
                    <span key={tag} className="bg-white/10 backdrop-blur-md text-white/90 px-3 py-1 rounded-full text-[10px] font-bold border border-white/10 tracking-wide">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Interaction Buttons */}
      <div className="absolute -bottom-24 left-0 right-0 flex items-center justify-center gap-6 pb-4">
        <button 
          onClick={() => swipe('left')}
          className="w-16 h-16 rounded-[2rem] bg-white flex items-center justify-center text-red-400 shadow-xl hover:scale-110 active:scale-90 transition-all border border-slate-100"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>
        <button 
          onClick={() => swipe('right')}
          className="w-20 h-20 rounded-[2.2rem] bg-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all shadow-primary/30"
        >
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
        </button>
      </div>

      {/* Background Decoration */}
      <div className="fixed top-1/2 -right-12 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none z-0">
        <span className="text-[20rem] font-black text-primary italic tracking-tighter">爪住</span>
      </div>
    </div>
  );
}

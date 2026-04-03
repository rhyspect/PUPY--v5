import { useState } from 'react';
import { PETS } from '../constants';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';

export default function Home({ onMatch, onViewOwner }: { onMatch: (owner?: any) => void, onViewOwner: (owner: any) => void }) {
  const [cards, setCards] = useState(PETS);
  const [lastDirection, setLastDirection] = useState<string | null>(null);
  const [showHeart, setShowHeart] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [-150, -50], [1, 0]);
  const dislikeOpacity = useTransform(x, [50, 150], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      swipe('right'); // Dislike
    } else if (info.offset.x < -100) {
      swipe('left'); // Like
    }
  };

  const swipe = (direction: string) => {
    setLastDirection(direction);
    
    if (direction === 'left') {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
      
      // Simulate a match randomly or for specific cards for demo purposes
      if (Math.random() > 0.5) {
        setTimeout(() => {
          onMatch();
        }, 3000);
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
        <h3 className="text-xl font-bold text-slate-800">附近没有更多PUPY爪住了</h3>
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
    <div className="px-6 flex flex-col items-center min-h-[75vh]">
      <div className="relative w-full aspect-[3/4.2] mb-8">
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <span className="material-symbols-outlined text-9xl text-primary drop-shadow-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            </motion.div>
          )}
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
                className="absolute inset-0 rounded-[3rem] overflow-hidden shadow-2xl bg-white border border-slate-100 touch-none"
              >
                <img 
                  src={pet.images[0]} 
                  alt={pet.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                {/* Swipe Feedback */}
                {isTop && (
                  <>
                    <motion.div 
                      style={{ opacity: likeOpacity }}
                      className="absolute top-20 left-10 border-4 border-emerald-500 text-emerald-500 font-black text-4xl px-4 py-2 rounded-2xl -rotate-12 z-20 pointer-events-none"
                    >
                      喜欢
                    </motion.div>
                    <motion.div 
                      style={{ opacity: dislikeOpacity }}
                      className="absolute top-20 right-10 border-4 border-red-500 text-red-500 font-black text-4xl px-4 py-2 rounded-2xl rotate-12 z-20 pointer-events-none"
                    >
                      无感
                    </motion.div>
                  </>
                )}

                {/* Owner Info (Top Left) */}
                <div className="absolute top-6 left-6 right-6 flex items-center gap-2 z-10">
                  <div 
                    onClick={() => onViewOwner(pet.owner)}
                    className="flex items-center gap-3 bg-black/40 backdrop-blur-xl p-2 pr-4 rounded-[2rem] border border-white/20 self-start cursor-pointer group active:scale-95 transition-transform"
                  >
                    <img 
                      src={pet.owner.avatar} 
                      alt="主人" 
                      className="w-10 h-10 rounded-2xl border-2 border-white/50 object-cover group-hover:scale-110 transition-transform" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-black tracking-tight group-hover:text-primary transition-colors">{pet.owner.name}</span>
                        <span className="bg-primary/80 text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold">{pet.owner.mbti}</span>
                      </div>
                      <p className="text-white/60 text-[10px] truncate max-w-[120px]">{pet.owner.signature}</p>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onMatch(pet.owner);
                    }}
                    className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-transform"
                  >
                    <span className="material-symbols-outlined text-xl">chat</span>
                  </button>
                </div>

                {/* Pet Info */}
                <div className="absolute bottom-8 left-8 right-8 space-y-4">
                  <div className="flex items-end gap-3">
                    <h2 className="text-4xl font-black text-white font-headline tracking-tight truncate flex-1">
                      {pet.name}
                    </h2>
                    <div className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-xl text-[10px] font-black tracking-widest mb-1 border border-white/20">
                      {pet.type}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white/10 backdrop-blur-md text-white/90 px-3 py-1 rounded-full text-[10px] font-bold border border-white/10 tracking-wide">
                      {pet.gender}
                    </span>
                    <span className="bg-white/10 backdrop-blur-md text-white/90 px-3 py-1 rounded-full text-[10px] font-bold border border-white/10 tracking-wide">
                      {pet.owner.residentCity}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Interaction Buttons */}
      <div className="flex items-center justify-center gap-8 pb-6">
        <button 
          onClick={() => swipe('left')}
          className="w-16 h-16 rounded-[2rem] bg-white flex items-center justify-center text-red-400 shadow-xl hover:scale-110 hover:bg-red-50 active:scale-90 transition-all border border-slate-100"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>
        <button 
          onClick={() => swipe('right')}
          className="w-20 h-20 rounded-[2.2rem] bg-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 hover:shadow-primary/40 active:scale-90 transition-all shadow-primary/30"
        >
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
        </button>
      </div>

      {/* Background Decoration */}
      <div className="fixed top-1/2 -right-12 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none z-0">
        <span className="text-[20rem] font-black text-primary italic tracking-tighter">PUPY爪住</span>
      </div>
    </div>
  );
}

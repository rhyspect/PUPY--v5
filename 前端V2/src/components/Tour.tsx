import { REALMS } from '../constants';
import { motion } from 'motion/react';

export default function Tour({ onSelectRealm }: { onSelectRealm: () => void }) {
  return (
    <div className="px-6 space-y-8">
      <section className="mb-10">
        <h1 className="font-headline text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          随风 <span className="text-primary italic">溜溜</span>
        </h1>
        <p className="text-slate-500 mt-2 font-medium">情绪化的分身世界：选择一个心仪场景</p>
      </section>

      <div className="space-y-8">
        {REALMS.map((realm) => (
          <div 
            key={realm.id} 
            onClick={onSelectRealm}
            className="relative group cursor-pointer"
          >
            <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
            <div className="relative h-[320px] rounded-[2.5rem] overflow-hidden shadow-xl transition-all duration-500 group-hover:-translate-y-2 border border-slate-100">
              <img 
                src={realm.image} 
                alt={realm.name} 
                className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-[10px] font-black tracking-widest uppercase border border-white/20">
                          {realm.onlineCount} 位小伙伴在线
                        </span>
                      </div>
                      <h2 className="text-2xl font-headline font-black text-white mb-1 truncate tracking-tight">{realm.name}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform shadow-primary/30">
                      <span className="material-symbols-outlined text-2xl">{realm.icon}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-white/80 text-xs leading-relaxed font-medium line-clamp-2 italic">
                      “{realm.story}”
                    </p>
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                      <p className="text-white text-[10px] font-bold leading-normal">
                        <span className="text-primary-container mr-1">功能:</span>
                        {realm.function}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-8 bg-white rounded-[2.5rem] text-center border-2 border-dashed border-slate-200 shadow-sm">
        <h3 className="font-headline font-bold text-slate-900 text-xl">我们的小院儿</h3>
        <p className="text-slate-500 text-sm mt-2 mb-6 font-medium">为您和您的朋友创建一个秘密领域</p>
        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-primary active:scale-95 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">door_open</span>
          创建传送门
        </button>
      </div>
    </div>
  );
}

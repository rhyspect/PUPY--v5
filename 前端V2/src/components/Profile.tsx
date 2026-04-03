import { motion } from 'motion/react';

interface ProfileProps {
  userPet: { name: string; image: string; hasPet: boolean };
  onStartCreation: () => void;
}

export default function Profile({ userPet, onStartCreation }: ProfileProps) {
  return (
    <div className="px-6 space-y-8 pb-10">
      <section className="text-center space-y-2">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary">个人空间</h1>
        <p className="text-slate-500 font-medium tracking-tight">已与 {userPet.name} 同步 • 在线</p>
      </section>

      <div className="relative grid grid-cols-1 gap-4">
        {/* Human Profile */}
        <div className="bg-white rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden shadow-sm border border-slate-100">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl rotate-3 ring-4 ring-primary/5">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="主人" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-headline text-2xl font-black text-slate-900 truncate tracking-tight">艾琳娜</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-primary font-bold italic text-sm">首席铲屎官</span>
                <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-md font-black">INFJ</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] rounded-full font-black tracking-widest">等级 42</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] rounded-full font-black tracking-widest">自然漫步者</span>
              </div>
            </div>
          </div>

          {/* Owner Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-50">
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-1">近期社交数量</p>
              <p className="text-lg font-black text-slate-900">128 <span className="text-[10px] font-bold text-slate-400 ml-0.5">次</span></p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-1">匹配成功次数</p>
              <p className="text-xl font-black text-slate-900">42 <span className="text-[10px] font-bold text-slate-400 ml-0.5">对</span></p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-1">社交成功率</p>
              <p className="text-lg font-black text-emerald-500">86%</p>
            </div>
            <div className="bg-primary/5 p-3 rounded-2xl border border-primary/10">
              <p className="text-primary/60 text-[9px] font-bold uppercase tracking-wider mb-1">急需社交指数</p>
              <div className="flex items-center gap-1.5">
                <p className="text-lg font-black text-primary">高</p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-1 h-2.5 rounded-full ${i <= 4 ? 'bg-primary' : 'bg-primary/20'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <button className="bg-primary text-white rounded-full px-6 py-3 font-bold shadow-2xl flex items-center gap-3 hover:scale-110 active:scale-95 transition-all border-4 border-white">
            <span className="material-symbols-outlined text-xl">sync</span>
            <span className="tracking-wide text-sm">现实 / 虚拟</span>
          </button>
        </div>

        {/* Pet Profile */}
        <div className="bg-emerald-50/50 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden border border-emerald-100/50">
          <div className="flex items-center gap-6 justify-end text-right">
            <div className="flex-1 min-w-0">
              <h2 className="font-headline text-2xl font-black text-slate-900 truncate tracking-tight">{userPet.name}</h2>
              <p className="text-emerald-600 font-bold italic text-sm">{userPet.hasPet ? '现实伴侣' : '云端克隆'}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-end">
                <span className="px-3 py-1 bg-white/80 text-emerald-600 text-[10px] rounded-full font-black uppercase tracking-widest shadow-sm">E型宠物</span>
                <span className="px-3 py-1 bg-white/80 text-emerald-600 text-[10px] rounded-full font-black uppercase tracking-widest shadow-sm">开心</span>
              </div>
            </div>
            <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl -rotate-3 bg-white ring-4 ring-emerald-500/10">
              <img src={userPet.image} className="w-full h-full object-cover" alt="宠物" />
            </div>
          </div>

          {/* Chat with Pet */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-5 border border-white/50 space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-500">chat_bubble</span>
              <h4 className="font-bold text-slate-900 text-sm">与 {userPet.name} 对话</h4>
            </div>
            <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/5">
              <p className="text-sm text-emerald-700 leading-relaxed font-medium">
                “主人，今天我们要去哪儿溜溜？我感觉充满了能量！”
              </p>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="跟它说点什么..."
                className="w-full bg-white/80 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-300"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner"><div className="h-full bg-emerald-500 w-3/4 shadow-sm" /></div>
            <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner"><div className="h-full bg-emerald-500 w-1/2 shadow-sm" /></div>
            <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner"><div className="h-full bg-emerald-500 w-full shadow-sm" /></div>
          </div>
          <p className="text-[10px] text-center font-black text-emerald-600/50 uppercase tracking-[0.2em]">数字生命状态监测</p>
        </div>
      </div>

      <button 
        onClick={onStartCreation}
        className="w-full py-5 rounded-[2rem] bg-slate-900 text-white font-bold text-lg shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95"
      >
        <span className="material-symbols-outlined">add_circle</span>
        <span>创建新的数字克隆</span>
      </button>
    </div>
  );
}

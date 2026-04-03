import { motion } from 'motion/react';

interface SettingsProps {
  onBack: () => void;
  onReset: () => void;
  userPet: { name: string; image: string; hasPet: boolean };
}

export default function Settings({ onBack, onReset, userPet }: SettingsProps) {
  return (
    <div className="fixed inset-0 z-[150] bg-surface flex flex-col max-w-md mx-auto">
      <header className="p-6 flex items-center gap-4 bg-white shadow-sm border-b border-slate-50">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-xl font-black font-headline text-slate-900 tracking-tight">系统设置</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        {/* Profile Section */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">我的伴侣</h3>
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-primary/10">
              <img src={userPet.image} alt={userPet.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-slate-900">{userPet.name}</h4>
              <p className="text-xs font-medium text-slate-500">
                {userPet.hasPet ? '现实伴侣' : '云端克隆'} • 12级
              </p>
            </div>
            <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-primary transition-colors">
              <span className="material-symbols-outlined">edit</span>
            </button>
          </div>
        </section>

        {/* General Settings */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">通用设置</h3>
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            {[
              { icon: 'notifications', label: '通知设置', color: 'text-blue-500' },
              { icon: 'lock', label: '隐私与安全', color: 'text-emerald-500' },
              { icon: 'language', label: '语言设置', color: 'text-purple-500' },
              { icon: 'palette', label: '个性化主题', color: 'text-orange-500' },
            ].map((item, i) => (
              <button 
                key={i}
                className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none"
              >
                <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${item.color}`}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <span className="flex-1 text-left font-medium text-slate-700">{item.label}</span>
                <span className="material-symbols-outlined text-slate-300">chevron_right</span>
              </button>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">高级操作</h3>
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <button 
              onClick={onReset}
              className="w-full flex items-center gap-4 p-5 hover:bg-red-50 text-red-500 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <span className="material-symbols-outlined">restart_alt</span>
              </div>
              <span className="flex-1 text-left font-medium">重置应用 (重新进入引导)</span>
            </button>
          </div>
        </section>

        <div className="text-center py-8">
          <p className="text-[10px] font-bold text-slate-300 tracking-[0.2em]">PUPY爪住 v1.0.4 • 2026</p>
        </div>
      </div>
    </div>
  );
}

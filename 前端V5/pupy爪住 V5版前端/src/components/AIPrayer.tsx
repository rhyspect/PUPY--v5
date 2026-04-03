import { motion } from 'motion/react';

interface AIPrayerProps {
  onBack: () => void;
}

export default function AIPrayer({ onBack }: AIPrayerProps) {
  return (
    <div className="fixed inset-0 z-[150] bg-surface flex flex-col max-w-md mx-auto overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-4 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-50">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-xl font-black font-headline text-slate-900 tracking-tight">AI 祈愿</h2>
      </header>

      {/* Hero Section */}
      <div className="px-6 py-8 space-y-8">
        <div className="bg-purple-500 rounded-[3rem] p-10 text-white space-y-6 relative overflow-hidden shadow-2xl shadow-purple-200">
          <div className="relative z-10 space-y-4">
            <h1 className="text-4xl font-black font-headline leading-tight">显化您的 <br /> 理想伴侣</h1>
            <p className="text-purple-100 text-sm font-medium leading-relaxed">
              通过 AI 祈愿，将您心中的理想宠物具象化。无论是性格、外貌还是灵魂特质，我们都能为您精准匹配。
            </p>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl" />
        </div>

        {/* Prayer Form */}
        <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">描述您的理想伴侣</h3>
            <textarea 
              placeholder="例如：我想要一只像云朵一样柔软、性格温顺、能听懂我心事的金毛犬..."
              className="w-full h-40 px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 font-medium text-sm resize-none placeholder:text-slate-300"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">核心特质</h3>
            <div className="flex flex-wrap gap-2">
              {['忠诚', '活泼', '安静', '治愈', '聪明', '勇敢'].map((tag, i) => (
                <button 
                  key={i}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold border-2 transition-all ${i === 3 ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full py-5 bg-purple-500 text-white font-black rounded-2xl shadow-xl shadow-purple-200 active:scale-95 transition-transform flex items-center justify-center gap-3">
            <span className="material-symbols-outlined">auto_awesome</span>
            <span>开启显化</span>
          </button>
        </div>
      </div>
    </div>
  );
}

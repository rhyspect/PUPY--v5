import { motion } from 'motion/react';

export default function Creation({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="px-6 space-y-10">
      <section className="text-center space-y-4">
        <h1 className="font-headline text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          创建您的 <span className="text-primary italic">数字克隆</span>
        </h1>
        <p className="text-slate-500 text-lg px-4 font-medium">上传一张宠物的清晰照片，生成它们的3D虚拟形象。</p>
      </section>

      <div className="relative group">
        <div className="w-full aspect-square border-4 border-dashed border-primary/20 rounded-[4rem] bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all duration-500 shadow-sm">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-primary text-4xl font-bold">add_a_photo</span>
          </div>
          <p className="font-bold text-slate-900 text-xl">上传宠物照片</p>
          <p className="text-slate-400 text-sm mt-2 font-medium">正脸肖像效果最佳</p>
        </div>

        <div className="absolute -bottom-6 -right-4 w-48 h-64 bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl p-4 border border-white/20 z-30">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-surface-container-low">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCip9UhM8dtpLNLJ7NmIX2DIvfcgrrW3fl0t-QTYhQQQPFeMpILCUy-ioYCJs5U3k2HnIvWYb4_l1ypiLo6OeoR0taBdyjl-IciAdTZ63Sh5IXNovvOkT_oaQ5UU-FbO9z8fuO77hFpPD_1h4_dwqIGsdj2tQQBnc8zPGIU50NNMWvN7UiZd_CuLVI4BssHxsJQIBbfbYjo4I1TEoMXNJJi9AMKF_H3smjsFEj9MeemkO52G9uqK4fOuyu6paDWjN_XIX6tcwIgyW8" 
              className="w-full h-full object-cover" 
              alt="3D 预览" 
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-3">
              <div className="h-2 w-16 bg-primary/20 rounded-full mb-2" />
              <div className="h-2 w-10 bg-primary/20 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-end mb-2 px-1">
          <span className="font-bold text-on-surface text-lg">正在扫描毛发纹理...</span>
          <span className="text-primary font-bold">84%</span>
        </div>
        <div className="h-4 w-full bg-surface-container rounded-full overflow-hidden p-1 shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '84%' }}
            className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary text-xl">auto_fix</span>
          </div>
          <p className="font-bold text-on-surface">神经细节</p>
          <p className="text-on-surface-variant text-xs">增强3D写实特征。</p>
        </div>
        <div className="bg-white p-6 rounded-3xl space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary text-xl">palette</span>
          </div>
          <p className="font-bold text-on-surface">调色板</p>
          <p className="text-on-surface-variant text-xs">提取独特的皮毛图案。</p>
        </div>
      </div>

      <button 
        onClick={onComplete}
        className="w-full bg-primary text-white font-bold py-5 rounded-3xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        下一步：审核特征
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingProps {
  onComplete: (data: { hasPet: boolean; petImage?: string; petName?: string }) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<'choice' | 'upload' | 'virtual'>('choice');
  const [petName, setPetName] = useState('');
  const [petImage, setPetImage] = useState<string | null>(null);

  const handleChoice = (hasPet: boolean) => {
    if (hasPet) {
      setStep('upload');
    } else {
      setStep('virtual');
    }
  };

  const handleFinish = () => {
    onComplete({
      hasPet: step === 'upload',
      petImage: petImage || 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=400',
      petName: petName || (step === 'upload' ? '我的宝贝' : '云端小萌'),
    });
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col p-8 overflow-y-auto no-scrollbar">
      <div className="max-w-xs mx-auto w-full flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 'choice' && (
            <motion.div
              key="choice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 text-center"
            >
              <div className="space-y-4">
                <h1 className="text-4xl font-black text-slate-900 font-headline tracking-tight leading-tight">欢迎来到 爪住</h1>
                <p className="text-slate-500 font-medium px-4">开启您的宠物社交与云端伴侣之旅，让爱超越次元</p>
              </div>

              <div className="grid gap-4">
                <button
                  onClick={() => handleChoice(true)}
                  className="group relative p-6 bg-emerald-50 border-2 border-emerald-100 rounded-[2.5rem] text-left transition-all hover:border-emerald-500 hover:shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-3xl">pets</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-900">我有宠物</h3>
                      <p className="text-xs text-emerald-600/70">上传照片，开启社交</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleChoice(false)}
                  className="group relative p-6 bg-purple-50 border-2 border-purple-100 rounded-[2.5rem] text-left transition-all hover:border-purple-500 hover:shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-3xl">cloud</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-900">我没有宠物</h3>
                      <p className="text-xs text-purple-600/70">构建您的虚拟云端伴侣</p>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold text-slate-900 font-headline">上传宠物照片</h2>
                <p className="text-sm text-slate-500">让大家认识一下您的毛孩子</p>
              </div>

              <div className="aspect-square rounded-[3rem] bg-slate-100 border-4 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
                {petImage ? (
                  <img src={petImage} className="w-full h-full object-cover" alt="预览" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-5xl text-slate-300 group-hover:scale-110 transition-transform">add_a_photo</span>
                    <span className="text-xs font-bold text-slate-400 mt-4">点击上传照片</span>
                  </>
                )}
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPetImage(URL.createObjectURL(file));
                  }}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4">宠物昵称</label>
                  <input 
                    type="text" 
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="例如：库珀" 
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <button
                  onClick={handleFinish}
                  disabled={!petName}
                  className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                >
                  完成设置
                </button>
              </div>
            </motion.div>
          )}

          {step === 'virtual' && (
            <motion.div
              key="virtual"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold text-slate-900 font-headline">构建虚拟伴侣</h2>
                <p className="text-sm text-slate-500">为您量身定制的云端萌宠</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=200',
                  'https://images.unsplash.com/photo-1591160674255-fc809b1edaa1?auto=format&fit=crop&q=80&w=200',
                  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=200',
                  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200'
                ].map((url, i) => (
                  <button 
                    key={i}
                    onClick={() => setPetImage(url)}
                    className={`aspect-square rounded-3xl overflow-hidden border-4 transition-all ${petImage === url ? 'border-purple-500 scale-95 shadow-lg' : 'border-transparent'}`}
                  >
                    <img src={url} className="w-full h-full object-cover" alt="宠物选项" />
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4">给它起个名字</label>
                  <input 
                    type="text" 
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="例如：小云" 
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                </div>
                <button
                  onClick={handleFinish}
                  disabled={!petName || !petImage}
                  className="w-full py-5 bg-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                >
                  唤醒伴侣
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

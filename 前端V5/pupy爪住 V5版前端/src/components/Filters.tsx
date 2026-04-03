import { motion } from 'motion/react';

interface FiltersProps {
  onClose: () => void;
}

export default function Filters({ onClose }: FiltersProps) {
  const filterCategories = [
    {
      id: 'breed',
      label: '品种',
      options: ['金毛', '柴犬', '边牧', '柯基', '哈士奇', '萨摩耶']
    },
    {
      id: 'mbti',
      label: '性格类型',
      options: ['E系宠物', 'I系宠物', '社恐', '社牛', '治愈系', '运动健将']
    },
    {
      id: 'distance',
      label: '距离范围',
      options: ['500米内', '1公里内', '2公里内', '5公里内', '同城']
    }
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-end justify-center p-4">
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-8 space-y-8"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black font-headline text-slate-900 tracking-tight">筛选条件</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-8">
          {filterCategories.map((category) => (
            <div key={category.id} className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">{category.label}</h3>
              <div className="flex flex-wrap gap-2">
                {category.options.map((option, i) => (
                  <button 
                    key={i}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold border-2 transition-all ${i === 0 ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl active:scale-95 transition-transform"
          >
            重置
          </button>
          <button 
            onClick={onClose}
            className="flex-[2] py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 active:scale-95 transition-transform"
          >
            应用筛选
          </button>
        </div>
      </motion.div>
    </div>
  );
}

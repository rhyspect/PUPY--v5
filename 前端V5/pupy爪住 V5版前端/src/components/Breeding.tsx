import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BreedingProps {
  onBack: () => void;
  onChat: (ownerName: string) => void;
}

export default function Breeding({ onBack, onChat }: BreedingProps) {
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [breedingList, setBreedingList] = useState([
    { 
      id: '1', 
      petName: '库珀', 
      petType: '金毛', 
      gender: '公', 
      age: '2岁', 
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
      costType: 'AA配种费',
      owner: '想喝咖啡吗？',
      lookingFor: '希望找一位性格温顺的萨摩耶或金毛MM',
      healthInfo: '疫苗齐全，无遗传病史',
      personality: '活泼开朗，非常绅士',
      vaccine: '已打三针疫苗',
      deworm: '已做内外驱虫',
      pedigree: '双血统证书',
      location: '北京·朝阳',
      description: '库珀是一个非常懂事的金毛，平时不拆家，性格很稳重。希望给它找一个好伴侣，延续优良基因。'
    },
    { 
      id: '2', 
      petName: '露西', 
      petType: '萨摩耶', 
      gender: '母', 
      age: '1.5岁', 
      image: 'https://images.unsplash.com/photo-1529429617329-c4698ff115b0?auto=format&fit=crop&q=80&w=400',
      costType: '公的全出',
      owner: '小王',
      lookingFor: '希望找一位体型匀称的萨摩耶帅哥',
      healthInfo: '定期体检，身体健康',
      personality: '粘人精，爱撒娇',
      vaccine: '已打两针疫苗',
      deworm: '已做内驱虫',
      pedigree: '无证书',
      location: '上海·浦东',
      description: '露西是家里的小公主，非常爱干净。希望找一个同样爱干净、性格好的萨摩耶帅哥。'
    },
    { 
      id: '3', 
      petName: '年糕', 
      petType: '柯基', 
      gender: '母', 
      age: '3岁', 
      image: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&q=80&w=400',
      costType: '母的全出',
      owner: '阿强',
      lookingFor: '希望找一位同样是柯基的小帅哥',
      healthInfo: '驱虫已做，疫苗齐全',
      personality: '聪明伶俐，有点小脾气',
      vaccine: '疫苗已打完',
      deworm: '内外驱虫已做',
      pedigree: '单血统',
      location: '广州·天河',
      description: '年糕虽然有点小脾气，但其实很粘人。希望找一个能包容它的小帅哥。'
    },
  ]);

  return (
    <div className="fixed inset-0 z-[150] bg-surface flex flex-col max-w-md mx-auto overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-4 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-50">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-xl font-black font-headline text-slate-900 tracking-tight">宠物恋爱</h2>
      </header>

      <div className="px-6 space-y-8 py-8 pb-10">
        <section className="text-center space-y-2">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary italic">缘分天空</h1>
          <p className="text-slate-500 font-medium tracking-tight">为你的毛孩子寻找命中注定的另一半</p>
        </section>

        <button 
          onClick={() => setShowPostModal(true)}
          className="w-full py-4 bg-primary text-white rounded-[2rem] font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">favorite</span>
          挂出恋爱匹配
        </button>

        <div className="grid grid-cols-1 gap-6">
          {breedingList.map((item) => (
            <div key={item.id} className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100 group">
              <div className="relative h-48">
                <img src={item.image} alt={item.petName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-primary shadow-sm">
                  {item.costType}
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black text-white ${item.gender === '公' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                    {item.gender}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black text-white bg-slate-900/50 backdrop-blur">
                    {item.age}
                  </span>
                </div>
              </div>
              <div 
                className="p-6 flex items-center justify-between cursor-pointer"
                onClick={() => setSelectedPet(item)}
              >
                <div>
                  <h3 className="text-xl font-black text-slate-900">{item.petName}</h3>
                  <p className="text-xs text-slate-400 font-medium">{item.petType} • 主人: {item.owner}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onChat(item.owner);
                    }}
                    className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <span className="material-symbols-outlined">chat_bubble</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPet(item);
                    }}
                    className="px-4 h-12 rounded-2xl bg-primary text-white text-xs font-black shadow-lg shadow-primary/20 active:scale-95 transition-all"
                  >
                    申请匹配
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {/* Post Modal */}
        {showPostModal && (
          <motion.div 
            key="post-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end justify-center p-4"
            onClick={() => setShowPostModal(false)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-[3rem] p-8 space-y-6"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-black text-slate-900 text-center">发布匹配信息</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">费用承担方式</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['AA配种费', '公的全出', '母的全出'].map((type) => (
                      <button key={type} className="py-3 rounded-2xl border-2 border-slate-100 text-[10px] font-black text-slate-600 hover:border-primary hover:text-primary transition-all">
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setShowPostModal(false)}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg"
                >
                  确认发布
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Apply Match Modal */}
        {selectedPet && (
          <motion.div 
            key="apply-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedPet(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedPet(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="overflow-y-auto no-scrollbar">
                <div className="relative h-64">
                  <img src={selectedPet.image} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-8">
                    <h3 className="text-3xl font-black text-slate-900 italic tracking-tight">{selectedPet.petName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-full">{selectedPet.petType}</span>
                      <span className={`px-3 py-1 text-white text-[10px] font-black rounded-full ${selectedPet.gender === '公' ? 'bg-blue-500' : 'bg-pink-500'}`}>{selectedPet.gender}</span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full">{selectedPet.age}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 pt-0 space-y-6">
                  <div className="bg-slate-50 p-6 rounded-[2rem] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPet.owner}`} className="w-full h-full object-cover rounded-2xl" alt="" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">发布主人</p>
                      <p className="text-sm font-black text-slate-900">{selectedPet.owner}</p>
                    </div>
                    <button 
                      onClick={() => onChat(selectedPet.owner)}
                      className="ml-auto w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-lg">chat</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">详细介绍</h4>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed italic">"{selectedPet.description}"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-4 rounded-3xl space-y-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">性格特征</p>
                      <p className="text-xs font-bold text-slate-700">{selectedPet.personality}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-3xl space-y-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">所在地区</p>
                      <p className="text-xs font-bold text-slate-700">{selectedPet.location}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-3xl space-y-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">疫苗状况</p>
                      <p className="text-xs font-bold text-slate-700">{selectedPet.vaccine}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-3xl space-y-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">血统证明</p>
                      <p className="text-xs font-bold text-slate-700">{selectedPet.pedigree}</p>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-[2rem] space-y-3 border border-primary/10">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-lg">favorite</span>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">心仪对象</p>
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{selectedPet.lookingFor}</p>
                  </div>

                  <div className="bg-slate-900 p-6 rounded-[2rem] space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-400 text-lg">payments</span>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">配种费用支付意向</p>
                    </div>
                    <p className="text-sm font-black text-white italic">{selectedPet.costType}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 pt-4 bg-white border-t border-slate-50">
                <button 
                  onClick={() => setSelectedPet(null)}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-black shadow-2xl shadow-primary/30 active:scale-95 transition-all text-lg italic"
                >
                  发送匹配申请
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

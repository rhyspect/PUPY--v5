import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
}

interface PetSocialRecord {
  id: string;
  petName: string;
  petAvatar: string;
  location: string;
  originalText: string;
  translatedText: string;
  time: string;
}

export default function Messages({ onSelectChat }: { onSelectChat: () => void }) {
  const [activeTab, setActiveTab] = useState<'owner' | 'pet'>('owner');

  const ownerMessages: Message[] = [
    {
      id: '1',
      name: '艾琳娜',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUTZA1McDtSDu2NrkokujtmavcutZIEn1UIRuFMYGnOMVjohbVWNPHdChlcN6Z2DL3RMqmOZfvoKBBr19IR-pM678fN92sIU3JoljPHHgnrf14nCskBkXQmhlsxW6Dt3cEkyJPGwG_CxN__693L4f3o3WnPjz9krqZl3zjy3Kiv5-ANNPADplM_cDTcmufT1nQx3_nVN-g9rmqFZC7WlQWLU9Q0_5yGOLYBf4A49C51enLbeky6zs_qiea2ktePhflA7abkNs_WfQ',
      lastMessage: '你的 麻薯 真的太可爱了！下次一起遛狗吗？',
      time: '14:20',
      unread: 2
    },
    {
      id: '2',
      name: '莎拉',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
      lastMessage: '露娜 刚才在躲雨深林玩得很开心。',
      time: '昨天',
    }
  ];

  const petSocialRecords: PetSocialRecord[] = [
    {
      id: '1',
      petName: '库珀',
      petAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_EHfBjct31HQ4X7wg40_TQPmltQrC3u-Pgf1Yph077_IaRvF4glEocbvaXsE6EX46imagDtPZV6Zk-WQYYAGABNC-lEOBQKkTk-sBk1ThWEvOdPlSFhVuD7_ga4m11uoPYkcOjgwydmVYEihTVXWYEfGeghnNSTpPz9jSWoifKFwQyLDzQEycIwsyOfH867Op7kGaedCmpuRMn0NdIvH6HVDIbNSL7H5lFs9K9Y59YFUIsc8A1So7Ar6WbDapKsOSjMs_M2rICag',
      location: '躲雨深林',
      originalText: '汪汪！呜——汪！',
      translatedText: '“嘿！那边的朋友，你看起来很酷，要一起去追萤火虫吗？”',
      time: '10:30'
    },
    {
      id: '2',
      petName: '露娜',
      petAvatar: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=400',
      location: '气泡失重海',
      originalText: '嗷呜？嗷！',
      translatedText: '“这里的气泡真好玩，我感觉自己飞起来了！”',
      time: '09:15'
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex px-6 mb-6">
        <div className="flex bg-slate-100 p-1 rounded-2xl w-full">
          <button
            onClick={() => setActiveTab('owner')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'owner' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'
            }`}
          >
            主人社交
          </button>
          <button
            onClick={() => setActiveTab('pet')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pet' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'
            }`}
          >
            宠物社交
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 no-scrollbar pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'owner' ? (
            <motion.div
              key="owner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {ownerMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  onClick={onSelectChat}
                  className="flex items-center gap-4 p-4 bg-white rounded-[2rem] shadow-sm border border-slate-50 active:scale-95 transition-transform cursor-pointer"
                >
                  <div className="relative">
                    <img src={msg.avatar} className="w-14 h-14 rounded-2xl object-cover" alt={msg.name} />
                    {msg.unread && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                        {msg.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-slate-900 truncate text-sm">{msg.name}</h4>
                      <span className="text-[9px] text-slate-400 font-medium">{msg.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{msg.lastMessage}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="pet"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Whisper Feature */}
              <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary text-xl">record_voice_over</span>
                  <h4 className="font-bold text-primary text-xs">给宠物说悄悄话</h4>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="例如：下次在云游世界找到上次那只狗狗..."
                    className="w-full bg-white border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-300"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-sm">send</span>
                  </button>
                </div>
              </div>

              {/* Pet Social Records */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">随风溜溜 社交记录</h3>
                {petSocialRecords.map((record) => (
                  <div key={record.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={record.petAvatar} className="w-10 h-10 rounded-xl object-cover" alt={record.petName} />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{record.petName}</h4>
                          <p className="text-[10px] text-slate-400 font-medium">在 {record.location} • {record.time}</p>
                        </div>
                      </div>
                      <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">neurology</span>
                        宠语翻译 已完成
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="bg-slate-50 rounded-2xl p-3">
                        <p className="text-xs text-slate-400 italic">"{record.originalText}"</p>
                      </div>
                      <div className="bg-primary/5 rounded-2xl p-4 border border-primary/5">
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">{record.translatedText}</p>
                      </div>
                    </div>

                    <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold rounded-2xl transition-colors flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-sm">account_circle</span>
                      查看对方主人主页
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

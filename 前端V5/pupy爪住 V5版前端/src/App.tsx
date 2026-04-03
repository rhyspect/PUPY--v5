/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen, NavItem, Pet, Owner } from './types';
import { PETS, REALMS } from './constants';

// Components
import Home from './components/Home';
import Tour from './components/Tour';
import Market from './components/Market';
import Messages from './components/Messages';
import Profile from './components/Profile';
import Creation from './components/Creation';
import Chat from './components/Chat';
import Onboarding from './components/Onboarding';
import Settings from './components/Settings';
import Breeding from './components/Breeding';
import Diary from './components/Diary';
import Filters from './components/Filters';
import AIPrayer from './components/AIPrayer';
import OwnerProfile from './components/OwnerProfile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen | 'settings' | 'breeding' | 'diary' | 'prayer'>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [userPet, setUserPet] = useState<Pet | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [activeChatOwner, setActiveChatOwner] = useState<Owner | null>(null);
  const [isDigitalTwinCreated, setIsDigitalTwinCreated] = useState(false);

  useEffect(() => {
    // Force reset for testing as requested by user
    const forceReset = true; 
    if (forceReset) {
      localStorage.removeItem('pupy_onboarded');
      localStorage.removeItem('pupy_pet');
    }

    const onboarded = localStorage.getItem('pupy_onboarded');
    const savedPet = localStorage.getItem('pupy_pet');
    if (onboarded === 'true' && savedPet) {
      setIsOnboarded(true);
      setUserPet(JSON.parse(savedPet));
    } else {
      setIsOnboarded(false);
    }
  }, []);

  const handleOnboardingComplete = (owner: Owner, pet: Pet) => {
    setUserPet(pet);
    setIsOnboarded(true);
    localStorage.setItem('pupy_onboarded', 'true');
    localStorage.setItem('pupy_pet', JSON.stringify(pet));
  };

  const handleMatch = (owner?: Owner) => {
    if (owner) setActiveChatOwner(owner);
    setNotification('匹配成功！对方也喜欢了你，快去聊天吧 ✨');
    setTimeout(() => setNotification(null), 4000);
    setCurrentScreen('chat');
  };

  const handleReset = () => {
    localStorage.removeItem('pupy_onboarded');
    localStorage.removeItem('pupy_pet');
    setIsOnboarded(false);
    setCurrentScreen('home');
  };

  if (isOnboarded === null) return null;

  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const navItems: NavItem[] = [
    { id: 'home', label: '首页', icon: 'pets' },
    { id: 'tour', label: '随风溜溜', icon: 'cloud' },
    { id: 'messages', label: '消息', icon: 'chat_bubble' },
    { id: 'market', label: '爪住集市', icon: 'medical_services' },
    { id: 'profile', label: '我的', icon: 'person' },
  ];

  return (
    <div className="relative min-h-screen max-w-md mx-auto bg-surface overflow-x-hidden">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 max-w-md mx-auto flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-2xl bg-primary-container overflow-hidden ring-4 ring-primary/5 cursor-pointer transition-transform active:scale-90"
            onClick={() => setIsDrawerOpen(true)}
          >
            {userPet && (
              <img 
                src={userPet.images?.[0] || userPet.image} 
                alt="个人资料" 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span className="text-2xl font-black text-primary italic tracking-tight font-headline">PUPY爪住</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-primary transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button 
            onClick={() => setCurrentScreen('settings')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
              currentScreen === 'settings' 
                ? 'bg-primary text-white shadow-lg' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="text-xs font-bold">设置</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentScreen === 'home' && <Home onMatch={handleMatch} onViewOwner={setSelectedOwner} />}
            {currentScreen === 'tour' && <Tour onSelectRealm={() => setCurrentScreen('messages')} />}
            {currentScreen === 'messages' && (
              <Messages 
                onSelectChat={(owner) => {
                  if (owner) setActiveChatOwner(owner);
                  setCurrentScreen('chat');
                }} 
                onViewOwner={setSelectedOwner}
              />
            )}
            {currentScreen === 'market' && (
              <Market 
                onChat={(ownerName) => {
                  const mockOwner: Owner = {
                    name: ownerName,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${ownerName}`,
                    photos: [`https://picsum.photos/seed/${ownerName}/400/600`],
                    gender: '其他',
                    age: 25,
                    residentCity: '未知',
                    frequentCities: ['未知'],
                    mbti: 'INTJ',
                    signature: '很高兴认识你！',
                    hobbies: ['宠物', '社交']
                  };
                  setActiveChatOwner(mockOwner);
                  setCurrentScreen('chat');
                }}
              />
            )}
            {currentScreen === 'profile' && (
              <Profile 
                userPet={userPet} 
                isDigitalTwinCreated={isDigitalTwinCreated}
                onStartCreation={() => setCurrentScreen('creation')} 
                onTwinCreated={() => setIsDigitalTwinCreated(true)}
              />
            )}
            {currentScreen === 'creation' && <Creation onComplete={() => {
              setIsDigitalTwinCreated(true);
              setCurrentScreen('profile');
            }} />}
            {currentScreen === 'chat' && (
              <Chat 
                owner={activeChatOwner} 
                onBack={() => setCurrentScreen('messages')} 
              />
            )}
            {currentScreen === 'breeding' && (
              <Breeding 
                onBack={() => setCurrentScreen('home')} 
                onChat={(ownerName) => {
                  const mockOwner: Owner = {
                    name: ownerName,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${ownerName}`,
                    photos: [`https://picsum.photos/seed/${ownerName}/400/600`],
                    gender: '其他',
                    age: 25,
                    residentCity: '未知',
                    frequentCities: ['未知'],
                    mbti: 'INTJ',
                    signature: '很高兴认识你！',
                    hobbies: ['宠物', '社交']
                  };
                  setActiveChatOwner(mockOwner);
                  setCurrentScreen('chat');
                }}
              />
            )}
            {currentScreen === 'diary' && <Diary onBack={() => setCurrentScreen('home')} />}
            {currentScreen === 'prayer' && <AIPrayer onBack={() => setCurrentScreen('home')} />}
            {currentScreen === 'settings' && (
              <Settings 
                userPet={userPet}
                onBack={() => setCurrentScreen('home')} 
                onReset={handleReset} 
              />
            )}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          {isFiltersOpen && <Filters onClose={() => setIsFiltersOpen(false)} />}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto p-4 flex justify-center">
        <div className="w-full bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-2xl flex justify-around items-center px-4 py-2 border border-slate-100">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-3xl transition-all duration-300 ${
                currentScreen === item.id 
                  ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' 
                  : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: currentScreen === item.id ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              <span className="text-[8px] font-bold mt-1 tracking-tight leading-none">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 z-[70] bg-white rounded-r-[3rem] shadow-2xl p-8 flex flex-col"
            >
              {userPet && (
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center overflow-hidden ring-4 ring-primary/5">
                    <img src={userPet.images?.[0] || userPet.image} className="w-full h-full object-cover" alt="宠物" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold font-headline text-lg leading-tight">{userPet.name}</h3>
                    <p className="text-xs font-medium text-slate-500">12级 • {userPet.hasPet ? '现实伴侣' : '云端分身'}</p>
                  </div>
                </div>
              )}
              <nav className="space-y-4">
                <button 
                  onClick={() => {
                    setIsFiltersOpen(true);
                    setIsDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-all"
                >
                  <span className="material-symbols-outlined">filter_list</span>
                  <span className="font-medium">宠物筛选</span>
                </button>
                <button 
                  onClick={() => {
                    setCurrentScreen('breeding');
                    setIsDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-all"
                >
                  <span className="material-symbols-outlined">fertile</span>
                  <span className="font-medium">繁育服务</span>
                </button>
                <button 
                  onClick={() => {
                    setCurrentScreen('diary');
                    setIsDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-all"
                >
                  <span className="material-symbols-outlined">history</span>
                  <span className="font-medium">昨日日志</span>
                </button>
                <button 
                  onClick={() => {
                    setCurrentScreen('prayer');
                    setIsDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-all"
                >
                  <span className="material-symbols-outlined">auto_awesome</span>
                  <span className="font-medium">AI 祈愿</span>
                </button>
                <button 
                  onClick={() => {
                    setCurrentScreen('settings');
                    setIsDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-all"
                >
                  <span className="material-symbols-outlined">settings</span>
                  <span className="font-medium">系统设置</span>
                </button>
              </nav>
              <div className="mt-auto bg-slate-50 p-6 rounded-[2.5rem] shadow-inner border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">领域能量</span>
                  <span className="text-xs font-bold text-primary">88%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[88%] h-full bg-primary rounded-full shadow-sm"></div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 80, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-6 right-6 z-[100] bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white">favorite</span>
            </div>
            <p className="text-xs font-bold leading-tight">{notification}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Owner Profile Modal */}
      <AnimatePresence>
        {selectedOwner && (
          <OwnerProfile 
            owner={selectedOwner} 
            onClose={() => setSelectedOwner(null)} 
            onStartChat={() => {
              setActiveChatOwner(selectedOwner);
              setSelectedOwner(null);
              setCurrentScreen('chat');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

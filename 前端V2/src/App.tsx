/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen, NavItem } from './types';
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen | 'settings'>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [userPet, setUserPet] = useState<{ name: string; image: string; hasPet: boolean }>({
    name: '我的宝贝',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkQ46VTBJUQHQ27bIyQQqBuSl5Ku5Xx2OObOZ5aN46YMxCHrvQradQR56WYFINAtJgeBbmM42y7ylt2MiLigepxLfXex5I_FoUn_8QgyaIVhvUFXxKY3ZNeLckXmpVslmHi1IxUIna97x74OWNMjLoAP3W80fQ9vuug7YMdrH7uMDLy2BdYGvW3wcHTfWOTGmJiap7UDnpxnEqiQXxe06YjQiYTqNVQF10vpYCOsHbjthVIGkv4B21IS80VwGBvbVC4VwpJLp6gZ4',
    hasPet: true,
  });

  useEffect(() => {
    const onboarded = localStorage.getItem('pupy_onboarded');
    const savedPet = localStorage.getItem('pupy_pet');
    if (onboarded === 'true') {
      setIsOnboarded(true);
      if (savedPet) setUserPet(JSON.parse(savedPet));
    } else {
      setIsOnboarded(false);
    }
  }, []);

  const handleOnboardingComplete = (data: { hasPet: boolean; petImage?: string; petName?: string }) => {
    const newPet = {
      name: data.petName || '我的宝贝',
      image: data.petImage || userPet.image,
      hasPet: data.hasPet,
    };
    setUserPet(newPet);
    setIsOnboarded(true);
    localStorage.setItem('pupy_onboarded', 'true');
    localStorage.setItem('pupy_pet', JSON.stringify(newPet));
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
    { id: 'market', label: '集市', icon: 'storefront' },
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
            <img 
              src={userPet.image} 
              alt="个人资料" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-2xl font-black text-primary italic tracking-tight font-headline">爪住</span>
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
            {currentScreen === 'home' && <Home onMatch={() => setCurrentScreen('chat')} />}
            {currentScreen === 'tour' && <Tour onSelectRealm={() => setCurrentScreen('messages')} />}
            {currentScreen === 'messages' && <Messages onSelectChat={() => setCurrentScreen('chat')} />}
            {currentScreen === 'market' && <Market />}
            {currentScreen === 'profile' && (
              <Profile 
                userPet={userPet} 
                onStartCreation={() => setCurrentScreen('creation')} 
              />
            )}
            {currentScreen === 'creation' && <Creation onComplete={() => setCurrentScreen('profile')} />}
            {currentScreen === 'chat' && <Chat onBack={() => setCurrentScreen('home')} />}
            {currentScreen === 'settings' && (
              <Settings 
                userPet={userPet}
                onBack={() => setCurrentScreen('home')} 
                onReset={handleReset} 
              />
            )}
          </motion.div>
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
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center overflow-hidden ring-4 ring-primary/5">
                  <img src={userPet.image} className="w-full h-full object-cover" alt="宠物" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold font-headline text-lg leading-tight">{userPet.name}</h3>
                  <p className="text-xs font-medium text-slate-500">12级 • {userPet.hasPet ? '现实伴侣' : '云端克隆'}</p>
                </div>
              </div>
              <nav className="space-y-4">
                <button className="w-full flex items-center gap-4 p-4 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-all">
                  <span className="material-symbols-outlined">filter_list</span>
                  <span className="font-medium">宠物筛选</span>
                </button>
                <button className="w-full flex items-center gap-4 p-4 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-all">
                  <span className="material-symbols-outlined">fertile</span>
                  <span className="font-medium">繁育服务</span>
                </button>
                <button className="w-full flex items-center gap-4 p-4 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-all">
                  <span className="material-symbols-outlined">map</span>
                  <span className="font-medium">云端地图设置</span>
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
    </div>
  );
}

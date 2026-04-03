import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Owner, Pet } from '../types';

interface OnboardingProps {
  onComplete: (owner: Owner, pet: Pet) => void;
}

const HOBBIES = [
  '登山', '滑雪', '摄影', '咖啡', '滑板', '徒步', '露营', '黑胶唱片', '瑜伽', '绘画',
  '烹饪', '旅行', '阅读', '健身', '潜水', '冲浪', '网球', '冥想', '园艺', '陶艺',
  '电影', '音乐制作', '编程', '写作', '观星', '古着', '探店', '骑行', '攀岩', '击剑'
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<'login' | 'register_choice' | 'register_phone' | 'register_email' | 'forgot_password' | 'owner_basic' | 'owner_hobbies' | 'pet_basic'>('login');
  const [isQuickLogin, setIsQuickLogin] = useState(false);
  const [loginData, setLoginData] = useState({ account: '', password: '' });
  const [registerData, setRegisterData] = useState({ phone: '', email: '', code: '', password: '' });
  
  const [ownerData, setOwnerData] = useState<Partial<Owner>>({
    name: 'PUPY 探索者',
    photos: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400'],
    gender: '女',
    age: 25,
    residentCity: '上海',
    frequentCities: [],
    hobbies: ['咖啡', '摄影', '旅行'],
    mbti: 'ENFP',
    signature: '很高兴来到 PUPY 世界 ✨'
  });

  const [petData, setPetData] = useState<Partial<Pet>>({
    name: '小可爱',
    images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400'],
    gender: '公',
    personality: 'E系浓宠',
    type: '金毛'
  });

  const handleQuickLogin = () => {
    handleComplete();
  };

  const handleComplete = () => {
    const finalOwner: Owner = {
      ...ownerData as Owner,
      avatar: ownerData.photos?.[0] || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100'
    };
    const finalPet: Pet = {
      ...petData as Pet,
      id: Date.now().toString(),
      hasPet: true,
      owner: finalOwner
    };
    onComplete(finalOwner, finalPet);
  };

  const CITIES = ['北京', '上海', '广州', '深圳', '杭州', '成都', '南京', '武汉', '重庆', '西安', '苏州', '天津', '长沙', '郑州', '东莞', '青岛', '沈阳', '宁波', '昆明', '无锡'];

  const addPhoto = (type: 'owner' | 'pet') => {
    const mockPhoto = `https://picsum.photos/seed/${Date.now()}/400/600`;
    if (type === 'owner') {
      setOwnerData(prev => ({ ...prev, photos: [...(prev.photos || []), mockPhoto].slice(0, 6) }));
    } else {
      setPetData(prev => ({ ...prev, images: [...(prev.images || []), mockPhoto].slice(0, 4) }));
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-white flex flex-col max-w-md mx-auto overflow-y-auto no-scrollbar">
      <AnimatePresence mode="wait">
        {step === 'login' && (
          <motion.div 
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 p-8 flex flex-col justify-center space-y-12"
          >
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-primary/5">
                <span className="material-symbols-outlined text-5xl text-primary">pets</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 italic tracking-tighter">PUPY</h1>
              <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px]">社交从宠物开始</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">手机号 / 邮箱</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">alternate_email</span>
                  <input 
                    type="text" 
                    placeholder="请输入你的账号"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-primary/20 font-bold text-sm"
                    value={loginData.account}
                    onChange={e => setLoginData({ ...loginData, account: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">密码</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">lock</span>
                  <input 
                    type="password" 
                    placeholder="请输入密码"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-primary/20 font-bold text-sm"
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                  />
                </div>
              </div>
              <button 
                onClick={() => setStep('forgot_password')}
                className="text-xs font-black text-primary text-right block w-full pr-4"
              >
                忘记密码？
              </button>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => setStep('owner_basic')}
                className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-2xl shadow-primary/30 active:scale-95 transition-all text-lg italic"
              >
                进入 PUPY 世界
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    setIsQuickLogin(false);
                    setStep('register_phone');
                  }}
                  className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-3xl hover:bg-primary/5 transition-colors group"
                >
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">smartphone</span>
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-primary uppercase tracking-widest">手机号注册</span>
                </button>
                <button 
                  onClick={() => {
                    setIsQuickLogin(false);
                    setStep('register_email');
                  }}
                  className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-3xl hover:bg-primary/5 transition-colors group"
                >
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">mail</span>
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-primary uppercase tracking-widest">邮箱注册</span>
                </button>
              </div>

              <div className="flex items-center gap-4 py-4">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">快捷登录</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>
              <div className="flex justify-center gap-8">
                <button 
                  onClick={() => {
                    setIsQuickLogin(true);
                    setStep('register_phone');
                  }}
                  className="w-16 h-16 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 hover:shadow-md transition-all active:scale-90"
                >
                  <span className="material-symbols-outlined text-2xl">smartphone</span>
                </button>
                <button 
                  onClick={() => {
                    setIsQuickLogin(true);
                    setStep('register_email');
                  }}
                  className="w-16 h-16 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 hover:shadow-md transition-all active:scale-90"
                >
                  <span className="material-symbols-outlined text-2xl">mail</span>
                </button>
              </div>
            </div>

            <p className="text-center text-xs font-bold text-slate-400">
              还没有账号？ <span onClick={() => setStep('register_choice')} className="text-primary cursor-pointer hover:underline">新用户注册</span>
            </p>
          </motion.div>
        )}

        {step === 'register_choice' && (
          <motion.div 
            key="register_choice"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 p-8 flex flex-col justify-center space-y-12"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">加入 PUPY</h2>
              <p className="text-sm text-slate-400 font-medium">选择你喜欢的注册方式</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => {
                  setIsQuickLogin(false);
                  setStep('register_phone');
                }}
                className="w-full p-6 bg-slate-50 rounded-[2.5rem] flex items-center gap-6 group hover:bg-primary/5 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-2xl">smartphone</span>
                </div>
                <div className="text-left">
                  <h4 className="font-black text-slate-900">手机号注册</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">快速验证，即刻出发</p>
                </div>
              </button>

              <button 
                onClick={() => {
                  setIsQuickLogin(false);
                  setStep('register_email');
                }}
                className="w-full p-6 bg-slate-50 rounded-[2.5rem] flex items-center gap-6 group hover:bg-primary/5 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-2xl">mail</span>
                </div>
                <div className="text-left">
                  <h4 className="font-black text-slate-900">邮箱注册</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">使用电子邮箱创建账号</p>
                </div>
              </button>
            </div>

            <button onClick={() => setStep('login')} className="text-sm font-bold text-slate-400">已有账号？返回登录</button>
          </motion.div>
        )}

        {step === 'register_phone' && (
          <motion.div 
            key="register_phone"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 p-8 flex flex-col justify-center space-y-10"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">{isQuickLogin ? '手机号快捷登录' : '手机号注册'}</h2>
              <p className="text-sm text-slate-400 font-medium">{isQuickLogin ? '验证手机号，即刻进入 PUPY' : '验证手机号，开启你的宠物社交'}</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">手机号码</label>
                <input 
                  type="tel" 
                  placeholder="请输入手机号"
                  className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl font-bold text-sm"
                  value={registerData.phone}
                  onChange={e => setRegisterData({ ...registerData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">验证码</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="请输入验证码"
                    className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl font-bold text-sm"
                    value={registerData.code}
                    onChange={e => setRegisterData({ ...registerData, code: e.target.value })}
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-primary">获取验证码</button>
                </div>
              </div>
            </div>
            <button 
              onClick={() => isQuickLogin ? handleQuickLogin() : setStep('owner_basic')}
              className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-2xl shadow-primary/30 active:scale-95 transition-all text-lg italic"
            >
              {isQuickLogin ? '立即登录' : '下一步'}
            </button>
            <button onClick={() => setStep('login')} className="text-sm font-bold text-slate-400">返回登录</button>
          </motion.div>
        )}

        {step === 'register_email' && (
          <motion.div 
            key="register_email"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 p-8 flex flex-col justify-center space-y-10"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">{isQuickLogin ? '邮箱快捷登录' : '邮箱注册'}</h2>
              <p className="text-sm text-slate-400 font-medium">{isQuickLogin ? '验证邮箱，即刻进入 PUPY' : '验证邮箱，开启你的宠物社交'}</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">电子邮箱</label>
                <input 
                  type="email" 
                  placeholder="请输入邮箱"
                  className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl font-bold text-sm"
                  value={registerData.email}
                  onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">{isQuickLogin ? '验证码' : '设置密码'}</label>
                <div className="relative">
                  <input 
                    type={isQuickLogin ? "text" : "password"} 
                    placeholder={isQuickLogin ? "请输入验证码" : "请输入密码"}
                    className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl font-bold text-sm"
                    value={isQuickLogin ? registerData.code : registerData.password}
                    onChange={e => isQuickLogin ? setRegisterData({ ...registerData, code: e.target.value }) : setRegisterData({ ...registerData, password: e.target.value })}
                  />
                  {isQuickLogin && (
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-primary">获取验证码</button>
                  )}
                </div>
              </div>
            </div>
            <button 
              onClick={() => isQuickLogin ? handleQuickLogin() : setStep('owner_basic')}
              className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-2xl shadow-primary/30 active:scale-95 transition-all text-lg italic"
            >
              {isQuickLogin ? '立即登录' : '下一步'}
            </button>
            <button onClick={() => setStep('login')} className="text-sm font-bold text-slate-400">返回登录</button>
          </motion.div>
        )}

        {step === 'forgot_password' && (
          <motion.div 
            key="forgot_password"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 p-8 flex flex-col justify-center space-y-10"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">找回密码</h2>
              <p className="text-sm text-slate-400 font-medium">通过验证码重置你的登录密码</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">手机号 / 邮箱</label>
                <input 
                  type="text" 
                  placeholder="请输入手机号或邮箱"
                  className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl font-bold text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">验证码</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="请输入验证码"
                    className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl font-bold text-sm"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-primary">获取验证码</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">新密码</label>
                <input 
                  type="password" 
                  placeholder="请输入新密码"
                  className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl font-bold text-sm"
                />
              </div>
            </div>
            <button 
              onClick={() => setStep('login')}
              className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-2xl shadow-primary/30 active:scale-95 transition-all text-lg italic"
            >
              重置并登录
            </button>
            <button onClick={() => setStep('login')} className="text-sm font-bold text-slate-400">返回登录</button>
          </motion.div>
        )}

        {step === 'owner_basic' && (
          <motion.div 
            key="owner_basic"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 p-8 space-y-10"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">完善主人信息</h2>
              <p className="text-sm text-slate-400 font-medium">让大家更好地认识你</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">上传照片 (4-6张)</label>
                <div className="grid grid-cols-3 gap-3">
                  {ownerData.photos?.map((photo, i) => (
                    <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden relative group">
                      <img src={photo} className="w-full h-full object-cover" alt="" />
                      <button 
                        onClick={() => setOwnerData(prev => ({ ...prev, photos: prev.photos?.filter((_, idx) => idx !== i) }))}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/40 backdrop-blur-md rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </div>
                  ))}
                  {(ownerData.photos?.length || 0) < 6 && (
                    <button 
                      onClick={() => addPhoto('owner')}
                      className="aspect-[3/4] rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-300 hover:text-primary hover:border-primary/20 transition-all"
                    >
                      <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                      <span className="text-[10px] font-black uppercase">上传</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">姓名</label>
                  <input 
                    type="text" 
                    placeholder="你的昵称"
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm"
                    value={ownerData.name}
                    onChange={e => setOwnerData({ ...ownerData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">岁数</label>
                  <input 
                    type="number" 
                    placeholder="25"
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm"
                    value={ownerData.age}
                    onChange={e => setOwnerData({ ...ownerData, age: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">性别</label>
                  <div className="flex gap-2">
                    {['男', '女'].map(g => (
                      <button 
                        key={g}
                        onClick={() => setOwnerData({ ...ownerData, gender: g as any })}
                        className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${ownerData.gender === g ? 'bg-primary text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">MBTI</label>
                  <input 
                    type="text" 
                    placeholder="ENFP"
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm"
                    value={ownerData.mbti}
                    onChange={e => setOwnerData({ ...ownerData, mbti: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">常驻城市 (单选)</label>
                  <div className="relative">
                    <select 
                      value={ownerData.residentCity}
                      onChange={e => setOwnerData({ ...ownerData, residentCity: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm appearance-none focus:ring-2 focus:ring-primary/20"
                    >
                      {CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">常去城市 (多选)</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {ownerData.frequentCities?.map(city => (
                      <span key={city} className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-xl flex items-center gap-1 shadow-sm">
                        {city}
                        <button 
                          onClick={() => setOwnerData({ ...ownerData, frequentCities: ownerData.frequentCities?.filter(c => c !== city) })}
                          className="hover:text-white/80"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <select 
                      onChange={e => {
                        const city = e.target.value;
                        if (city && !ownerData.frequentCities?.includes(city)) {
                          setOwnerData({ ...ownerData, frequentCities: [...(ownerData.frequentCities || []), city] });
                        }
                      }}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm appearance-none focus:ring-2 focus:ring-primary/20"
                      value=""
                    >
                      <option value="" disabled>选择常去城市...</option>
                      {CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">add</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep('owner_hobbies')}
              className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl active:scale-95 transition-all text-lg italic"
            >
              下一步
            </button>
          </motion.div>
        )}

        {step === 'owner_hobbies' && (
          <motion.div 
            key="owner_hobbies"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 p-8 space-y-10"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">你的兴趣爱好</h2>
              <p className="text-sm text-slate-400 font-medium">选择至少3个标签，找到志同道合的朋友</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {HOBBIES.map(hobby => (
                <button 
                  key={hobby}
                  onClick={() => {
                    const current = ownerData.hobbies || [];
                    if (current.includes(hobby)) {
                      setOwnerData({ ...ownerData, hobbies: current.filter(h => h !== hobby) });
                    } else {
                      setOwnerData({ ...ownerData, hobbies: [...current, hobby] });
                    }
                  }}
                  className={`px-6 py-3 rounded-2xl text-xs font-black transition-all ${ownerData.hobbies?.includes(hobby) ? 'bg-emerald-500 text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                >
                  {hobby}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setStep('pet_basic')}
              disabled={(ownerData.hobbies?.length || 0) < 3}
              className={`w-full py-5 font-black rounded-3xl shadow-xl active:scale-95 transition-all text-lg italic ${(ownerData.hobbies?.length || 0) >= 3 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
            >
              下一步
            </button>
          </motion.div>
        )}

        {step === 'pet_basic' && (
          <motion.div 
            key="pet_basic"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 p-8 space-y-10"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">上传宠物信息</h2>
              <p className="text-sm text-slate-400 font-medium">为你的毛孩子创建档案</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">宠物照片 (4张)</label>
                <div className="grid grid-cols-2 gap-4">
                  {petData.images?.map((photo, i) => (
                    <div key={i} className="aspect-square rounded-3xl overflow-hidden relative group">
                      <img src={photo} className="w-full h-full object-cover" alt="" />
                      <button 
                        onClick={() => setPetData(prev => ({ ...prev, images: prev.images?.filter((_, idx) => idx !== i) }))}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
                  {(petData.images?.length || 0) < 4 && (
                    <button 
                      onClick={() => addPhoto('pet')}
                      className="aspect-square rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-300 hover:text-primary hover:border-primary/20 transition-all"
                    >
                      <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                      <span className="text-[10px] font-black uppercase">上传照片</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">宠物名称</label>
                <input 
                  type="text" 
                  placeholder="它的名字"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm"
                  value={petData.name}
                  onChange={e => setPetData({ ...petData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">性别</label>
                  <div className="flex gap-2">
                    {['公', '母'].map(g => (
                      <button 
                        key={g}
                        onClick={() => setPetData({ ...petData, gender: g as any })}
                        className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${petData.gender === g ? 'bg-primary text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">品种</label>
                  <input 
                    type="text" 
                    placeholder="例如：金毛"
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm"
                    value={petData.type}
                    onChange={e => setPetData({ ...petData, type: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">性格核心 (E/I 维度)</label>
                <div className="space-y-3">
                  <button 
                    onClick={() => setPetData({ ...petData, personality: 'E系浓宠' })}
                    className={`w-full p-6 rounded-[2.5rem] border-2 transition-all flex items-center justify-between group ${petData.personality === 'E系浓宠' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5' : 'border-slate-100 bg-white'}`}
                  >
                    <div className="text-left">
                      <h4 className={`font-black text-lg italic ${petData.personality === 'E系浓宠' ? 'text-primary' : 'text-slate-900'}`}>E系浓宠</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">社交达狗 • 热情洋溢</p>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${petData.personality === 'E系浓宠' ? 'bg-primary text-white scale-110' : 'bg-slate-50 text-slate-300'}`}>
                      <span className="material-symbols-outlined">sentiment_very_satisfied</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => setPetData({ ...petData, personality: 'I系淡宠' })}
                    className={`w-full p-6 rounded-[2.5rem] border-2 transition-all flex items-center justify-between group ${petData.personality === 'I系淡宠' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5' : 'border-slate-100 bg-white'}`}
                  >
                    <div className="text-left">
                      <h4 className={`font-black text-lg italic ${petData.personality === 'I系淡宠' ? 'text-primary' : 'text-slate-900'}`}>I系淡宠</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">社恐小猫 • 岁月静好</p>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${petData.personality === 'I系淡宠' ? 'bg-primary text-white scale-110' : 'bg-slate-50 text-slate-300'}`}>
                      <span className="material-symbols-outlined">cloud</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={handleComplete}
              disabled={!petData.name || (petData.images?.length || 0) < 4}
              className={`w-full py-5 font-black rounded-3xl shadow-2xl active:scale-95 transition-all text-xl italic ${petData.name && (petData.images?.length || 0) >= 4 ? 'bg-primary text-white shadow-primary/30' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
            >
              开启 PUPY 之旅
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { motion } from 'motion/react';

export default function Market() {
  const categories = [
    { id: 'supermarket', label: '宠物超市', icon: 'shopping_cart', color: 'bg-emerald-50 text-emerald-600' },
    { id: 'walking', label: '帮忙溜溜', icon: 'directions_walk', color: 'bg-orange-50 text-orange-600' },
    { id: 'love', label: '宠物恋爱', icon: 'favorite', color: 'bg-pink-50 text-pink-600' },
    { id: 'care', label: '宠物护理', icon: 'medical_services', color: 'bg-blue-50 text-blue-600' },
  ];

  const products = [
    {
      id: 1,
      name: '大爪子美学雨衣 - 极光绿限定版',
      price: '¥298',
      likes: '1.2k',
      tag: '热门装备',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOr__kU9NP0XFqm6a_Vpvrq0lH0AgeBe2uWblYWsTMk70bzRhFVNsCEoI_cFFrxjzEzTxb6LuGleoveYFN6kpZTIs4nzipTYILQrLYNesOAz-r4QQvn7N7MBkzptbYNRKd1xWC9bCqqvkXhoQ1SSjWqeHN7zD6gqslYcet74g4rmBh7v6hxM6XLv-WhVPwsK9zWKv5SoVlpOuCJtze0Uc1zzZZYAHtGJ4Lnq3Gier9s99-AETKDw6zTHrI-3NOCXOo-Rv-r0Amdog'
    },
    {
      id: 2,
      name: '周末水疗特惠：蓬松版全套护理',
      price: '¥399起',
      tag: '专业美容',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgauGVPevSLvyzHgDDB2O7UKMA3_N_-xzmBaahYZFltSRDigRkmLAH67i06T34iYF3NcIRGeu2x41nLkY7dWQ1hqky_vS5Vr0T03Zs9o8IT_WMJ3Eg3oeGNcqDCxj_8yt2Rb_0oRxCdT0LQxalXlqys-42h_UmgMcguOHT2Oc35Ke4rn_AZk-_7EKKtPfkuSZIUTJBkdglRCfsJx6L4MWw_Ga8gljzbdUfxJh3NJJ6-gxQi4rXSur5slIAzbvZwJAG-L-0jeoZo0A'
    },
    {
      id: 3,
      name: '有机蓝莓超级零食 - 增强免疫力',
      price: '¥88',
      rating: '4.9',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_3cQwwCTQ6mhEt6nLX-IXNTgsxPxRgTbnIEUiOTdgMZhWnp8PJw2HN3R2HbIEMS1-XepF0_oQbrQ4BoT1TmrpwlGthag7jrEAbHDuUpL_jI-7V_b9x6HBPPyxvd6BFXOTXxNG6mBk1RqzdJ2x4_SgjRR1rey_fADqDTkNLQaY11lWIxn83207TbAYv5mOzMS8biVXTFAZLj12C6s2z9Bzh3WYCy_J35BaKCwINxx3LFnbR6l7jYPAbSKnZvPik7Pl7TuBxdpbeQY'
    }
  ];

  return (
    <div className="px-6 space-y-8">
      <section className="space-y-6">
        <div className="space-y-1">
          <h1 className="font-headline text-3xl font-black text-slate-900 tracking-tight">爪住集市</h1>
          <p className="text-sm font-medium text-slate-500">发现全球顶尖宠物好物</p>
        </div>
        <div className="relative group">
          <input 
            className="w-full bg-white border-none rounded-2xl py-4 pl-14 pr-6 shadow-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
            placeholder="搜索零食、玩具或伙伴..." 
            type="text"
          />
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        </div>
      </section>

      <section className="flex justify-between items-center overflow-x-auto gap-4 no-scrollbar pb-2">
        {categories.map(cat => (
          <div key={cat.id} className="flex flex-col items-center gap-3 min-w-[72px]">
            <div className={`w-14 h-14 ${cat.color} rounded-[1.8rem] flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer border border-white/50`}>
              <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-600 tracking-tight">{cat.label}</span>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-2 gap-4 pb-8">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-slate-100">
            <div className="relative aspect-square overflow-hidden">
              <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
              {product.tag && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">
                  {product.tag}
                </div>
              )}
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-slate-900 leading-snug text-sm line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-primary font-black text-lg">{product.price}</span>
                {product.likes && (
                  <div className="flex items-center gap-1 text-pink-500 bg-pink-50 px-2 py-1 rounded-lg text-[10px] font-bold">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    <span>{product.likes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

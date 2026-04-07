import { useState } from 'react';
import { motion } from 'motion/react';
import { addMarketCartItem, createMarketOrder, formatAssetPrice } from '../utils/marketAssets';

interface ProductDetailProps {
  onBack: () => void;
}

export default function ProductDetail({ onBack }: ProductDetailProps) {
  const product = {
    id: 'cloudcomfort-bed',
    title: 'CloudComfort™ 云感毛绒甜甜圈宠物床',
    image: 'https://images.unsplash.com/photo-1591160674255-fc809b1edaa1?auto=format&fit=crop&q=80&w=600',
    price: 299,
    sellerName: 'PUPY 官方自营',
  };
  const sizes = ['S (小型犬/猫)', 'M (中型犬)', 'L (大型犬)'];
  const [selectedSize, setSelectedSize] = useState(sizes[1]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [feedback, setFeedback] = useState('已默认选择 M 号规格，可直接加入购物车。');

  const handleShare = async () => {
    const shareText = `${product.title} - ${formatAssetPrice(product.price)}，来自 PUPY 爪住集市。`;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, text: shareText, url: window.location.href });
        setFeedback('分享面板已打开。');
        return;
      }
      await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      setFeedback('商品链接已复制，可以发给朋友啦。');
    } catch {
      setFeedback('分享暂未完成，你可以稍后再试。');
    }
  };

  const handleAddToCart = () => {
    addMarketCartItem({
      productId: `${product.id}-${selectedSize}`,
      title: `${product.title} · ${selectedSize}`,
      image: product.image,
      unitPrice: product.price,
      quantity,
      sellerName: product.sellerName,
      category: '主粮用品',
      type: 'toy',
      addedAt: new Date().toISOString(),
    });
    setFeedback(`已加入购物车：${selectedSize} × ${quantity}。可在会员资产中查看。`);
  };

  const handleBuyNow = () => {
    createMarketOrder({
      kind: 'shopping',
      title: product.title,
      image: product.image,
      sellerName: product.sellerName,
      status: '待支付',
      total: product.price * quantity,
      quantity,
      note: `规格：${selectedSize}`,
      items: [{
        productId: `${product.id}-${selectedSize}`,
        title: `${product.title} · ${selectedSize}`,
        image: product.image,
        unitPrice: product.price,
        quantity,
      }],
    });
    setFeedback(`订单已生成：${selectedSize} × ${quantity}，可在会员资产继续结算。`);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-white flex flex-col max-w-md mx-auto overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md">
        <button type="button" onClick={onBack} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={() => void handleShare()} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600" aria-label="分享商品">
            <span className="material-symbols-outlined">share</span>
          </button>
          <button type="button" onClick={() => { setIsFavorite((value) => !value); setFeedback(isFavorite ? '已取消收藏。' : '已收藏商品，当前页面会保留收藏状态。'); }} className={`w-10 h-10 rounded-full flex items-center justify-center ${isFavorite ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-600'}`} aria-label="收藏商品">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
          </button>
        </div>
      </header>

      {/* Product Image */}
      <div className="px-6">
        <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl bg-slate-50">
          <img 
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="px-8 py-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-black rounded-md uppercase tracking-widest">新品上市</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black rounded-md uppercase tracking-widest">官方自营</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-headline leading-tight tracking-tight">
            CloudComfort™ <br />
            云感毛绒甜甜圈宠物床
          </h1>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-500 font-headline">¥299</span>
            <span className="text-sm text-slate-400 line-through font-bold">¥450</span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="用户" />
              </div>
            ))}
          </div>
          <p className="text-xs font-bold text-slate-500">
            <span className="text-slate-900">1.2k+</span> 位宠主已购买，好评率 99%
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">选择规格</h3>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => (
              <button 
                key={size}
                type="button"
                onClick={() => { setSelectedSize(size); setFeedback(`已选择规格：${size}。`); }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold border-2 transition-all ${selectedSize === size ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-400'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-3xl bg-emerald-50/70 p-4 text-emerald-700">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest">选购数量</p>
            <p className="mt-1 text-xs font-bold">将同步到会员资产与订单记录</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm">
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500" aria-label="减少数量">-</button>
            <span className="min-w-6 text-center text-sm font-black text-slate-900">{quantity}</span>
            <button type="button" onClick={() => setQuantity((value) => value + 1)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white" aria-label="增加数量">+</button>
          </div>
        </div>

        <motion.div
          key={feedback}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.6rem] border border-emerald-100 bg-emerald-50 px-5 py-4 text-xs font-bold leading-relaxed text-emerald-700"
        >
          {feedback}
        </motion.div>

        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">产品详情</h3>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            CloudComfort™ 甜甜圈床采用超柔软人造毛皮制成，旨在模仿母亲的皮毛，为您的宠物提供最佳的睡眠体验。加高的边缘营造出安全感，并提供头部和颈部支撑。
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="material-symbols-outlined text-emerald-500">wash</span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">清洗方式</p>
              <p className="text-xs font-bold text-slate-900">可机洗/烘干</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="material-symbols-outlined text-emerald-500">eco</span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">材质</p>
              <p className="text-xs font-bold text-slate-900">环保人造毛皮</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 flex gap-4">
        <button type="button" onClick={handleAddToCart} className="w-16 h-16 rounded-[2rem] bg-slate-100 flex items-center justify-center text-slate-600 active:scale-95 transition-transform" aria-label="加入购物车">
          <span className="material-symbols-outlined">shopping_cart</span>
        </button>
        <button type="button" onClick={handleBuyNow} className="flex-1 h-16 rounded-[2rem] bg-emerald-500 text-white font-black text-lg shadow-xl shadow-emerald-200 active:scale-95 transition-transform">
          立即购买
        </button>
      </div>
    </div>
  );
}

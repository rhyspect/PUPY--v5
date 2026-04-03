import { motion } from 'motion/react';
import { useState } from 'react';

export default function Chat({ onBack }: { onBack: () => void }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: '嘿！库珀 看起来超级友好！', sent: false },
    { id: 2, text: '是的，他非常喜欢交新朋友。你们什么时候有空一起去公园？', sent: true },
    { id: 3, text: '这周末怎么样？躲雨深林领域现在很漂亮。', sent: false },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now(), text: message, sent: true }]);
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-surface flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="p-6 flex items-center gap-4 bg-white shadow-sm">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100" 
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shadow-sm" 
              alt="头像" 
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
          </div>
          <div className="min-w-0">
            <h3 className="font-headline font-bold text-slate-900 truncate">想喝咖啡吗？</h3>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">在线 • 距离 2公里</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        <div className="text-center">
          <span className="px-4 py-1 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-widest">今天 14:30</span>
        </div>
        
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-3xl shadow-sm ${
              msg.sent 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-white text-on-surface rounded-tl-none border border-slate-100'
            }`}>
              <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <footer className="p-6 bg-white border-t border-slate-100">
        <div className="flex items-center gap-3 bg-slate-50 rounded-full px-6 py-2 shadow-inner border border-slate-100">
          <button className="text-slate-400 hover:text-primary">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入消息..." 
            className="flex-1 bg-transparent border-none py-3 text-sm font-medium focus:ring-0"
          />
          <button 
            onClick={handleSend}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              message.trim() ? 'bg-primary text-white scale-110 shadow-lg' : 'text-slate-300'
            }`}
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

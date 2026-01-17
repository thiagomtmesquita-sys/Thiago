
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { CONTACT } from '../constants';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const ConsultationAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await geminiService.generateChatResponse(history, userMessage);
    setMessages(prev => [...prev, { role: 'model', text: response || '...' }]);
    setLoading(false);
  };

  const handleFinalize = async () => {
    const chatLog = messages.map(m => `${m.role === 'user' ? 'Cliente' : 'Assistente'}: ${m.text}`).join('\n');
    const result = await geminiService.createSummary(chatLog);
    
    const whatsappMessage = encodeURIComponent(
      `Olá Dr. Thiago, fiz uma consulta preliminar com o assistente do MTM Advocacia.\n\n*Resumo:* ${result.summary}\n*Área:* ${result.area}\n*Urgência:* ${result.urgency.toUpperCase()}`
    );
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${whatsappMessage}`, '_blank');
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-zinc-900 border border-gold/30 p-6 rounded-2xl text-center group transition-all hover:border-gold"
      >
        <h3 className="text-xl font-serif text-gold mb-2">Consulta Inteligente</h3>
        <p className="text-sm text-zinc-400">Refine sua dúvida jurídica com nossa IA antes de falar com o especialista.</p>
        <div className="mt-4 inline-flex items-center text-gold font-semibold group-hover:translate-x-1 transition-transform">
          Iniciar Chat <span className="ml-2">→</span>
        </div>
      </button>
    );
  }

  return (
    <div className="w-full glass rounded-3xl overflow-hidden flex flex-col h-[500px] border border-gold/40 shadow-2xl shadow-gold/5">
      <div className="p-4 bg-zinc-900 border-b border-gold/20 flex justify-between items-center">
        <div>
          <h3 className="font-serif text-gold font-bold">Assistente MTM</h3>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Pré-consulta Jurídica</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">&times;</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-2">
            <p className="text-gold/60 italic text-sm">"Como posso auxiliar em sua situação hoje?"</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-gold text-black rounded-tr-none' 
                : 'bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-gold/50 text-xs animate-pulse">Assistente está escrevendo...</div>}
      </div>

      <div className="p-4 bg-zinc-900 border-t border-gold/20 space-y-3">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Descreva seu caso..."
            className="flex-1 bg-black border border-zinc-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-gold"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-gold text-black w-10 h-10 rounded-full flex items-center justify-center font-bold"
          >
            ↑
          </button>
        </div>
        
        {messages.length > 2 && (
          <button 
            onClick={handleFinalize}
            className="w-full py-2 bg-zinc-800 text-gold text-xs font-bold rounded-full uppercase tracking-widest border border-gold/20 hover:bg-gold hover:text-black transition-colors"
          >
            Concluir e enviar para o Dr. Thiago
          </button>
        )}
      </div>
    </div>
  );
};

export default ConsultationAssistant;

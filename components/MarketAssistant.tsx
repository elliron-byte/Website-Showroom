
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';
import { WebsiteListing, ChatMessage } from '../types';

interface MarketAssistantProps {
  currentListing?: WebsiteListing;
}

export const MarketAssistant: React.FC<MarketAssistantProps> = ({ currentListing }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Welcome to the Investment Showroom! Are you looking to acquire your first digital asset? I can help you find low-maintenance websites with great ROI.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await chatWithAssistant(messages, userMsg, currentListing);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-indigo-950 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform shadow-indigo-950/20 active:scale-95"
        >
          <MessageSquare className="w-7 h-7" />
        </button>
      ) : (
        <div className="bg-white w-[360px] md:w-[420px] h-[550px] rounded-[2.5rem] flex flex-col shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="p-5 bg-indigo-950 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Investment Assistant</h4>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-indigo-200 uppercase tracking-widest font-black">AI Active</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl text-white/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 p-4 rounded-3xl rounded-tl-none border border-slate-200">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/80">
            <div className="relative">
              <input 
                type="text"
                placeholder="Ask about cheap websites..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-5 pr-14 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white transition-all disabled:opacity-50 shadow-md shadow-indigo-600/20 active:scale-90"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5 opacity-50">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span className="text-[9px] text-slate-600 uppercase tracking-widest font-black">Powered by Gemini</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

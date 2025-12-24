
import React, { useState } from 'react';
import { ContactSubmission } from '../types';

interface ContactUsProps {
  onSubmit: (submission: Omit<ContactSubmission, 'id' | 'timestamp'>) => void;
}

export const ContactUs: React.FC<ContactUsProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 animate-in fade-in duration-700">
      <div className="grid md:grid-cols-2 gap-12 items-stretch">
        {/* Left Side: Illustration + Manual Reach Out Footer */}
        <div className="order-2 md:order-1 flex flex-col justify-between">
          <div className="w-full max-w-lg mx-auto md:mx-0">
            <img 
              src="https://iili.io/fGrdtwX.jpg" 
              alt="Contact Illustration" 
              className="w-full h-auto drop-shadow-xl rounded-2xl"
            />
          </div>
          
          <div className="mt-12 md:mt-0 flex items-center gap-1.5 text-slate-500 pb-2">
            <span className="text-sm font-medium">Want to reach us manually?</span>
            <a 
              href="mailto:support@investmentshowroom.com" 
              className="text-sm font-bold text-indigo-600 hover:text-indigo-800 underline transition-colors cursor-pointer"
            >
              click here
            </a>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="order-1 md:order-2">
          <div className="max-w-md ml-auto h-full flex flex-col">
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-[#2d2d5f] mb-4">Get in touch</h1>
              <p className="text-slate-500 text-lg leading-relaxed">
                Feel free to contact us and we will get back to you as soon as it possible
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
              <div className="space-y-4 mb-8">
                <div>
                  <input 
                    type="text" 
                    placeholder="Name" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#f1f4f9] border-none rounded-xl py-4 px-6 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="E-mail" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#f1f4f9] border-none rounded-xl py-4 px-6 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="Message" 
                    required
                    rows={6}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-[#f1f4f9] border-none rounded-xl py-4 px-6 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-green-500/20 outline-none transition-all resize-none"
                  />
                </div>
              </div>
              
              <div className="mt-auto">
                <button 
                  type="submit"
                  disabled={submitted}
                  className={`w-40 bg-[#00d100] text-white py-3.5 rounded-xl font-bold text-lg hover:brightness-105 active:scale-95 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 ${submitted ? 'opacity-70' : ''}`}
                >
                  {submitted ? 'Sent!' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

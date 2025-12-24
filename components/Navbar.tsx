
import React from 'react';
import { Search } from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: 'dashboard' | 'showroom' | 'enquiries' | 'contact') => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeView }) => {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('dashboard')}
        >
          <img 
            src="https://iili.io/fGZeku4.png" 
            alt="Showroom Logo" 
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
          />
          <span className="text-xl font-bold tracking-tight text-slate-900">Showroom</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onNavigate('dashboard')}
            className={`text-sm font-bold transition-colors ${activeView === 'dashboard' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => onNavigate('showroom')}
            className={`text-sm font-bold transition-colors ${activeView === 'showroom' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            Showroom
          </button>
          <button 
            onClick={() => onNavigate('enquiries')}
            className={`text-sm font-bold transition-colors ${activeView === 'enquiries' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            Other Enquiries
          </button>
          <button 
            onClick={() => onNavigate('contact')}
            className={`text-sm font-bold transition-colors ${activeView === 'contact' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            Contact Us
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onNavigate('showroom')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

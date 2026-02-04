
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: 'dashboard' | 'showroom' | 'enquiries' | 'contact') => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (view: 'dashboard' | 'showroom' | 'enquiries' | 'contact') => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  const navLinks = [
    { label: 'Dashboard', id: 'dashboard' },
    { label: 'Showroom', id: 'showroom' },
    { label: 'Other Enquiries', id: 'enquiries' },
    { label: 'Contact Us', id: 'contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleNavigate('dashboard')}
        >
          <img 
            src="https://iili.io/fGZeku4.png" 
            alt="Showroom Logo" 
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
          />
          <span className="text-xl font-bold tracking-tight text-slate-900">Showroom</span>
        </div>
        
        {/* Desktop Links (Visible on Large Screens) */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button 
              key={link.id}
              onClick={() => handleNavigate(link.id as any)}
              className={`text-sm font-bold transition-colors ${activeView === link.id ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Action Buttons & Mobile Toggle */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => handleNavigate('showroom')}
            className="hidden sm:block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all"
          >
            Get Started
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-2xl p-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button 
                key={link.id}
                onClick={() => handleNavigate(link.id as any)}
                className={`text-left text-lg font-bold py-4 px-4 rounded-2xl transition-all ${
                  activeView === link.id 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button 
              onClick={() => handleNavigate('showroom')}
              className="mt-4 bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-center shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-transform"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

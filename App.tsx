
import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ListingCard } from './components/ListingCard';
import { ListingDetail } from './components/ListingDetail';
import { MarketAssistant } from './components/MarketAssistant';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { MOCK_LISTINGS } from './constants';
import { WebsiteListing } from './types';
import { Filter, ChevronDown, Rocket, Shield, LineChart, Globe, Info, ArrowRight } from 'lucide-react';

type ViewType = 'dashboard' | 'showroom' | 'enquiries' | 'contact' | 'admin';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Initialize listings from localStorage or fallback to MOCK_LISTINGS
  const [listings, setListings] = useState<WebsiteListing[]>(() => {
    const saved = localStorage.getItem('showroom_listings');
    return saved ? JSON.parse(saved) : MOCK_LISTINGS;
  });
  
  const [selectedListing, setSelectedListing] = useState<WebsiteListing | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'price_high' | 'price_low' | 'newest'>('newest');

  // Persistence effect
  useEffect(() => {
    localStorage.setItem('showroom_listings', JSON.stringify(listings));
  }, [listings]);

  // Route Detection for Admin
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('path') === 'admin') {
      setActiveView('admin');
    }
  }, []);

  const filteredListings = useMemo(() => {
    let result = [...listings];
    
    if (categoryFilter !== 'All') {
      result = result.filter(l => l.category === categoryFilter);
    }

    if (sortBy === 'price_high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'price_low') {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [listings, categoryFilter, sortBy]);

  const categories = ['All', 'SaaS', 'E-commerce', 'Tool', 'Content'];

  const handleDeleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const handleAddListing = (listing: WebsiteListing) => {
    setListings(prev => [listing, ...prev]);
  };

  const renderDashboard = () => (
    <div className="animate-in fade-in duration-500">
      <header className="relative pt-24 pb-20 px-4 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-emerald-100 rounded-full blur-[80px] opacity-40"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full mb-8 shadow-sm">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Investment Dashboard</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 leading-[0.95] tracking-tight">
            Investment <br/> <span className="text-indigo-600">Website Showroom</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            Wanting to own a website but you do not have the skills to make one? Buy a ready-made, profitable website from us today at a <span className="text-indigo-600 font-bold underline decoration-2 underline-offset-4">cheap price</span>.
          </p>
          
          <div className="flex justify-center gap-4 mb-16">
            <button 
              onClick={() => setActiveView('showroom')}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2"
            >
              Enter Showroom <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all shadow-sm">
              Learn More
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 card-shadow">
              <div className="text-indigo-600 mb-3 flex justify-center"><Rocket className="w-8 h-8" /></div>
              <h4 className="text-sm font-black text-slate-900 uppercase">Skill-Free Ownership</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1">No coding required</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 card-shadow">
              <div className="text-emerald-600 mb-3 flex justify-center"><Shield className="w-8 h-8" /></div>
              <h4 className="text-sm font-black text-slate-900 uppercase">Secure Handover</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1">Legal transfer assistance</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 card-shadow">
              <div className="text-blue-600 mb-3 flex justify-center"><LineChart className="w-8 h-8" /></div>
              <h4 className="text-sm font-black text-slate-900 uppercase">Instant Cashflow</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1">Ready-to-run revenue</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 card-shadow">
              <div className="text-amber-500 mb-3 flex justify-center"><Globe className="w-8 h-8" /></div>
              <h4 className="text-sm font-black text-slate-900 uppercase">Affordable Entry</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1">Budget-friendly assets</p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );

  const renderShowroom = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-slate-900 mb-2">Website Showroom</h2>
          <p className="text-slate-500 font-medium">Browse our hand-picked collection of digital assets ready for instant acquisition.</p>
        </div>

        <section className="mb-12">
          <div className="bg-white p-4 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
              <Filter className="w-5 h-5 text-slate-400 hidden md:block" />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    categoryFilter === cat 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-none relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full md:w-56 appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest rounded-2xl py-3 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer"
                >
                  <option value="newest">Newest Listed</option>
                  <option value="price_high">Highest Price</option>
                  <option value="price_low">Lowest Price (Cheap)</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map(listing => (
            <ListingCard 
              key={listing.id} 
              listing={listing} 
              onClick={setSelectedListing}
            />
          ))}
        </div>
        
        {filteredListings.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-200 border-dashed">
            <Info className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-slate-900 mb-2">No Matches Found</h3>
            <p className="text-slate-500 font-medium">Try broadening your search criteria for more investment opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );

  // Admin View Logic
  if (activeView === 'admin') {
    if (!isAdminLoggedIn) {
      return <AdminLogin onLogin={setIsAdminLoggedIn} />;
    }
    return (
      <AdminDashboard 
        listings={listings} 
        onAdd={handleAddListing} 
        onDelete={handleDeleteListing}
        onLogout={() => setIsAdminLoggedIn(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Navbar onNavigate={setActiveView} activeView={activeView} />
      
      {activeView === 'dashboard' && renderDashboard()}
      {activeView === 'showroom' && renderShowroom()}
      
      {(activeView === 'enquiries' || activeView === 'contact') && (
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-4">{activeView === 'enquiries' ? 'Other Enquiries' : 'Contact Us'}</h2>
          <p className="text-slate-500 max-w-xl mx-auto mb-8">This section is currently under development. Please check back soon or use our AI assistant for immediate help.</p>
          <button 
            onClick={() => setActiveView('dashboard')}
            className="text-indigo-600 font-bold hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      )}

      {selectedListing && (
        <ListingDetail 
          listing={selectedListing} 
          onClose={() => setSelectedListing(null)} 
        />
      )}

      <MarketAssistant currentListing={selectedListing || undefined} />
    </div>
  );
};

export default App;

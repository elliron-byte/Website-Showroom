
import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ListingCard } from './components/ListingCard';
import { ListingDetail } from './components/ListingDetail';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { ContactUs } from './components/ContactUs';
import { MOCK_LISTINGS } from './constants';
import { WebsiteListing, ContactSubmission } from './types';
import { ArrowRight } from 'lucide-react';

type ViewType = 'dashboard' | 'showroom' | 'enquiries' | 'contact' | 'admin';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  const [listings, setListings] = useState<WebsiteListing[]>(() => {
    try {
      const saved = localStorage.getItem('showroom_listings');
      return saved ? JSON.parse(saved) : MOCK_LISTINGS;
    } catch (e) {
      console.error("Failed to load listings from storage:", e);
      return MOCK_LISTINGS;
    }
  });

  const [submissions, setSubmissions] = useState<ContactSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('showroom_submissions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load submissions from storage:", e);
      return [];
    }
  });
  
  const [selectedListing, setSelectedListing] = useState<WebsiteListing | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'price_high' | 'price_low' | 'newest'>('newest');

  useEffect(() => {
    try {
      localStorage.setItem('showroom_listings', JSON.stringify(listings));
    } catch (e) {
      console.error("Failed to save listings to storage:", e);
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        alert("The image you uploaded is too large for browser storage. Please try a smaller image.");
      }
    }
  }, [listings]);

  useEffect(() => {
    try {
      localStorage.setItem('showroom_submissions', JSON.stringify(submissions));
    } catch (e) {
      console.error("Failed to save submissions to storage:", e);
    }
  }, [submissions]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('path') === 'admin') setActiveView('admin');
  }, []);

  const filteredListings = useMemo(() => {
    if (!Array.isArray(listings)) return [];
    let result = [...listings];
    if (categoryFilter !== 'All') result = result.filter(l => l.category === categoryFilter);
    if (sortBy === 'price_high') result.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sortBy === 'price_low') result.sort((a, b) => (a.price || 0) - (b.price || 0));
    return result;
  }, [listings, categoryFilter, sortBy]);

  const handleDeleteListing = (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setListings(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleContactSubmit = (data: Omit<ContactSubmission, 'id' | 'timestamp'>) => {
    const newSubmission: ContactSubmission = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setSubmissions(prev => [newSubmission, ...prev]);
  };

  const handleDeleteSubmission = (id: string) => {
    if (window.confirm('Delete this message?')) {
      setSubmissions(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleAddListing = (listing: WebsiteListing) => {
    setListings(prev => [listing, ...prev]);
  };

  const handleUpdateListing = (updatedListing: WebsiteListing) => {
    setListings(prev => prev.map(l => l.id === updatedListing.id ? updatedListing : l));
  };

  const handleContactSellerAction = () => {
    setSelectedListing(null);
    setActiveView('contact');
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
            <button onClick={() => setActiveView('showroom')} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2">Enter Showroom <ArrowRight className="w-5 h-5" /></button>
            <button onClick={() => setActiveView('contact')} className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all shadow-sm">Get in Touch</button>
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
          <p className="text-slate-500 font-medium">Browse our collection of digital assets ready for instant acquisition.</p>
        </div>
        <section className="mb-12">
          <div className="bg-white p-4 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
              {['All', 'SaaS', 'E-commerce', 'Tool', 'Content', 'Marketplace'].map(cat => (
                <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${categoryFilter === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>{cat}</button>
              ))}
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest rounded-2xl py-3 px-6 focus:outline-none cursor-pointer">
              <option value="newest">Newest Listed</option>
              <option value="price_high">Highest Price</option>
              <option value="price_low">Lowest Price</option>
            </select>
          </div>
        </section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map(listing => <ListingCard key={listing.id} listing={listing} onClick={setSelectedListing} />)}
        </div>
      </div>
    </div>
  );

  if (activeView === 'admin') {
    if (!isAdminLoggedIn) return <AdminLogin onLogin={setIsAdminLoggedIn} />;
    return (
      <AdminDashboard 
        listings={listings} 
        submissions={submissions}
        onAdd={handleAddListing}
        onUpdate={handleUpdateListing}
        onDelete={handleDeleteListing}
        onDeleteSubmission={handleDeleteSubmission}
        onLogout={() => setIsAdminLoggedIn(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Navbar onNavigate={setActiveView} activeView={activeView} />
      {activeView === 'dashboard' && renderDashboard()}
      {activeView === 'showroom' && renderShowroom()}
      {activeView === 'contact' && <ContactUs onSubmit={handleContactSubmit} />}
      {activeView === 'enquiries' && (
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Other Enquiries</h2>
          <p className="text-slate-500 max-w-xl mx-auto mb-8">This section is currently under development.</p>
          <button onClick={() => setActiveView('dashboard')} className="text-indigo-600 font-bold hover:underline">Return Home</button>
        </div>
      )}
      {selectedListing && (
        <ListingDetail 
          listing={selectedListing} 
          onClose={() => setSelectedListing(null)} 
          onContactSeller={handleContactSellerAction}
        />
      )}
    </div>
  );
};

export default App;

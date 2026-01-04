
import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ListingCard } from './components/ListingCard';
import { ListingDetail } from './components/ListingDetail';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { ContactUs } from './components/ContactUs';
import { MOCK_LISTINGS } from './constants';
import { WebsiteListing, ContactSubmission } from './types';
import { supabase } from './supabaseClient';
import { ArrowRight, Brain, Settings, Globe, MessageCircle, CheckCircle2, Clock, Wallet, Send, Loader2 } from 'lucide-react';

type ViewType = 'dashboard' | 'showroom' | 'enquiries' | 'contact' | 'admin';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [listings, setListings] = useState<WebsiteListing[]>([]);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  
  const [selectedListing, setSelectedListing] = useState<WebsiteListing | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'price_high' | 'price_low' | 'newest'>('newest');

  // Check for admin path in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('path') === 'admin') {
      setActiveView('admin');
    }
  }, []);

  // Real-time synchronization logic
  useEffect(() => {
    fetchInitialData();

    // Subscribe to real-time changes on the listings table
    const listingsChannel = supabase
      .channel('public:listings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setListings(prev => [payload.new as WebsiteListing, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setListings(prev => prev.map(l => l.id === payload.new.id ? payload.new as WebsiteListing : l));
        } else if (payload.eventType === 'DELETE') {
          setListings(prev => prev.filter(l => l.id !== payload.old.id));
        }
      })
      .subscribe();

    // Subscribe to real-time changes on the submissions table (for admin inbox)
    const submissionsChannel = supabase
      .channel('public:submissions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setSubmissions(prev => [payload.new as ContactSubmission, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setSubmissions(prev => prev.filter(s => s.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(listingsChannel);
      supabase.removeChannel(submissionsChannel);
    };
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (listingsError) throw listingsError;
      
      if (!listingsData || listingsData.length === 0) {
        setListings(MOCK_LISTINGS);
      } else {
        setListings(listingsData);
      }

      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .order('timestamp', { ascending: false });

      if (submissionsError) throw submissionsError;
      setSubmissions(submissionsData || []);

    } catch (error) {
      console.error("Error fetching from Supabase:", error);
      setListings(MOCK_LISTINGS);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredListings = useMemo(() => {
    if (!Array.isArray(listings)) return [];
    let result = [...listings];
    if (categoryFilter !== 'All') result = result.filter(l => l.category === categoryFilter);
    if (sortBy === 'price_high') result.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sortBy === 'price_low') result.sort((a, b) => (a.price || 0) - (b.price || 0));
    return result;
  }, [listings, categoryFilter, sortBy]);

  const handleDeleteListing = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      const { error } = await supabase.from('listings').delete().eq('id', id);
      if (error) alert("Failed to delete: " + error.message);
    }
  };

  const handleContactSubmit = async (data: Omit<ContactSubmission, 'id' | 'timestamp'>) => {
    const newSubmission = { ...data, timestamp: new Date().toISOString() };
    const { error } = await supabase.from('submissions').insert([newSubmission]);
    if (error) console.error("Contact submit error:", error);
  };

  const handleDeleteSubmission = async (id: string) => {
    if (window.confirm('Delete this message?')) {
      await supabase.from('submissions').delete().eq('id', id);
    }
  };

  const handleAddListing = async (listing: WebsiteListing) => {
    const { error } = await supabase.from('listings').insert([listing]);
    if (error) alert("Error adding: " + error.message);
  };

  const handleUpdateListing = async (updatedListing: WebsiteListing) => {
    const { error } = await supabase.from('listings').update(updatedListing).eq('id', updatedListing.id);
    if (error) alert("Error updating: " + error.message);
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
          <div className="bg-pattern p-4 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
              {['All', 'SaaS', 'E-commerce', 'Tool', 'Content', 'Marketplace', 'Finance'].map(cat => (
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

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing with cloud...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map(listing => <ListingCard key={listing.id} listing={listing} onClick={setSelectedListing} />)}
          </div>
        )}
      </div>
    </div>
  );

  const renderEnquiries = () => (
    <div className="max-w-7xl mx-auto px-6 py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-20">
        <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Other Enquiries</h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          I offer specialized training and custom development services tailored to help you succeed in the digital economy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="bg-pattern p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-indigo-400 transition-all group">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform">
            <Brain className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">1. Mentorship</h3>
          <p className="text-indigo-600 font-bold text-sm mb-6 uppercase tracking-wider">Build like this platform</p>
          <p className="text-slate-500 mb-8 leading-relaxed">A 1-month hands-on training program covering layout, responsive design, and deployment.</p>
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3 text-slate-700 font-semibold">
              <Wallet className="w-5 h-5 text-emerald-500" /> GHS 200 Fee
            </div>
            <div className="flex items-center gap-3 text-slate-700 font-semibold">
              <Clock className="w-5 h-5 text-indigo-500" /> 1 Month Duration
            </div>
          </div>
          <ul className="space-y-3 mb-10">
            {['Layout & Structure', 'Responsive Design', 'Live Practice'].map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-indigo-950 p-10 rounded-[2.5rem] shadow-xl text-white transform md:-translate-y-4">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-8">
            <Settings className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black mb-2 text-white">2. Setup & Usage</h3>
          <p className="text-indigo-300 font-bold text-sm mb-6 uppercase tracking-wider">For Website Buyers</p>
          <p className="text-indigo-100/70 mb-8 leading-relaxed">Exclusive training for clients who purchase an asset from this showroom.</p>
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3 text-indigo-100 font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Setup & Configuration
            </div>
            <div className="flex items-center gap-3 text-indigo-100 font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Content Management
            </div>
            <div className="flex items-center gap-3 text-indigo-100 font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Operational Confidence
            </div>
          </div>
        </div>

        <div className="bg-pattern p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-emerald-400 transition-all group">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition-transform">
            <Globe className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">3. Custom Dev</h3>
          <p className="text-emerald-600 font-bold text-sm mb-6 uppercase tracking-wider">Tailored Solutions</p>
          <p className="text-slate-500 mb-8 leading-relaxed">I build simple, clean, and functional websites based on your unique ideas or business requirements.</p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic text-slate-500 text-sm mb-10">
            "You tell me what you want, I design and develop it."
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Flexible Pricing</p>
        </div>
      </div>

      <div className="bg-indigo-600 rounded-[3rem] p-12 text-center text-white shadow-2xl shadow-indigo-600/20 max-w-4xl mx-auto">
        <h3 className="text-3xl font-black mb-4">Interested in learning or owning a website?</h3>
        <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">Contact me today to discuss your project and get started on your digital journey.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="https://t.me/yourusername" 
            className="bg-sky-500 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20"
          >
            <Send className="w-6 h-6" /> Chat on Telegram
          </a>
          <button 
            onClick={() => setActiveView('contact')}
            className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all shadow-sm"
          >
            Get in Touch
          </button>
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
    <div className="min-h-screen bg-main-pattern flex flex-col">
      <div className="flex-grow">
        <Navbar onNavigate={setActiveView} activeView={activeView} />
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'showroom' && renderShowroom()}
        {activeView === 'contact' && <ContactUs onSubmit={handleContactSubmit} />}
        {activeView === 'enquiries' && renderEnquiries()}
      </div>

      <footer className="py-12 border-t border-slate-200 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
            Copyright &copy; 2025 Showroom
          </p>
        </div>
      </footer>

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

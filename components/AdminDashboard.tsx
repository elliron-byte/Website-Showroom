
import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit, Globe, ExternalLink, LogOut, Mail, LayoutGrid, Image as ImageIcon, Upload, X, Clock, Code, Calendar, User, ShieldAlert, KeyRound } from 'lucide-react';
import { WebsiteListing, ContactSubmission } from '../types';

interface AdminDashboardProps {
  listings: WebsiteListing[];
  submissions: ContactSubmission[];
  onAdd: (listing: WebsiteListing) => void;
  onUpdate: (listing: WebsiteListing) => void;
  onDelete: (id: string) => void;
  onDeleteSubmission: (id: string) => void;
  onLogout: () => void;
}

type AdminTab = 'websites' | 'enquiries' | 'contact';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  listings, 
  submissions,
  onAdd, 
  onUpdate, 
  onDelete, 
  onDeleteSubmission,
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('websites');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [is2FAVerified, setIs2FAVerified] = useState(false);
  const [twoFAPassword, setTwoFAPassword] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [techStackString, setTechStackString] = useState('');
  
  const [newCreds, setNewCreds] = useState({
    number: '',
    password: ''
  });

  const [newSite, setNewSite] = useState<Partial<WebsiteListing>>({
    name: '', url: '', price: 0, monthlyProfit: 0, category: 'SaaS', description: '', techStack: [],
    performance: Array(6).fill(null).map((_, i) => ({ month: ['Jan','Feb','Mar','Apr','May','Jun'][i], revenue: 0, visitors: 0 })),
    age: 'Brand New', askingMultiple: 0, image: '', monthlyRevenue: 0, monthlyTraffic: 0
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("This image is too large (over 2MB). Please use a smaller image to ensure the app stays fast and doesn't crash storage.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSite(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    resetForm();
    setShowAddForm(true);
  };

  const openEditForm = (site: WebsiteListing) => {
    setEditingId(site.id);
    setNewSite({ ...site });
    setTechStackString(site.techStack.join(', '));
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newSite.image) {
        alert("Please upload an image for the website.");
        return;
      }

      const parsedPrice = Number(newSite.price) || 0;
      const parsedProfit = Number(newSite.monthlyProfit) || 0;
      const parsedTraffic = Number(newSite.monthlyTraffic) || 0;
      const parsedRevenue = Number(newSite.monthlyRevenue) || 0;
      const askingMultiple = parsedProfit > 0 ? Math.round((parsedPrice / parsedProfit) * 100) / 100 : 0;
      const techStack = techStackString.split(',').map(s => s.trim()).filter(s => s !== '');

      const finalListing: WebsiteListing = {
        id: editingId || Math.random().toString(36).substr(2, 9),
        name: String(newSite.name || 'Untitled Site'),
        url: String(newSite.url || ''),
        price: parsedPrice,
        description: String(newSite.description || ''),
        category: (newSite.category as any) || 'SaaS',
        monthlyRevenue: parsedRevenue,
        monthlyProfit: parsedProfit,
        monthlyTraffic: parsedTraffic,
        techStack: techStack.length > 0 ? techStack : ['React', 'Webflow'],
        image: String(newSite.image),
        performance: newSite.performance || Array(6).fill(null).map((_, i) => ({ month: ['Jan','Feb','Mar','Apr','May','Jun'][i], revenue: 0, visitors: 0 })),
        age: String(newSite.age || 'Brand New'),
        askingMultiple: askingMultiple
      };

      if (editingId) {
        onUpdate(finalListing);
      } else {
        onAdd(finalListing);
      }

      setShowAddForm(false);
      setTimeout(() => {
        resetForm();
      }, 100);
    } catch (err) {
      console.error("Error adding/updating asset:", err);
      alert("Failed to save asset. Please ensure all fields are filled correctly.");
    }
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFAPassword === 'Bernice') {
      setIs2FAVerified(true);
      setSettingsError('');
      const stored = localStorage.getItem('admin_credentials');
      const current = stored ? JSON.parse(stored) : { number: '0256414239', password: 'KuKu2009' };
      setNewCreds(current);
    } else {
      setSettingsError('Incorrect 2FA password.');
    }
  };

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCreds.number || !newCreds.password) {
      setSettingsError('Number and password cannot be empty.');
      return;
    }
    localStorage.setItem('admin_credentials', JSON.stringify(newCreds));
    alert('Credentials updated successfully. Please use these for your next login.');
    setShowSettings(false);
    setIs2FAVerified(false);
    setTwoFAPassword('');
  };

  const resetForm = () => {
    setNewSite({
      name: '', url: '', price: 0, monthlyProfit: 0, category: 'SaaS', description: '', techStack: [], 
      performance: Array(6).fill(null).map((_, i) => ({ month: ['Jan','Feb','Mar','Apr','May','Jun'][i], revenue: 0, visitors: 0 })), 
      age: 'Brand New', image: '', monthlyRevenue: 0, monthlyTraffic: 0
    });
    setTechStackString('');
    setEditingId(null);
  };

  const renderWebsitesContent = () => (
    <>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Manage Showroom</h1>
          <p className="text-slate-500 font-medium mt-1">Total Assets: {listings.length}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowSettings(true)}
            className="bg-pattern border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <ShieldAlert className="w-5 h-5" /> Security Settings
          </button>
          <button 
            onClick={openAddForm}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Website
          </button>
        </div>
      </div>

      <div className="bg-pattern rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-8 py-5 text-xs font-black uppercase text-slate-400">Website</th>
              <th className="px-8 py-5 text-xs font-black uppercase text-slate-400">Category</th>
              <th className="px-8 py-5 text-xs font-black uppercase text-slate-400">Price</th>
              <th className="px-8 py-5 text-right text-xs font-black uppercase text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {listings.map(site => (
              <tr key={site.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <img src={site.image || 'https://via.placeholder.com/150'} className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                    <div>
                      <div className="font-bold text-slate-900">{site.name}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 line-clamp-1">{site.url} <ExternalLink className="w-3 h-3" /></div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 uppercase">{site.category}</span>
                </td>
                <td className="px-8 py-6 font-black text-slate-900">GH₵{(site.price || 0).toLocaleString()}</td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEditForm(site)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(site.id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderContactContent = () => (
    <div>
      <h1 className="text-4xl font-black text-slate-900 mb-2">Inbox</h1>
      <p className="text-slate-500 font-medium mb-10">You have {submissions.length} new messages from the contact form.</p>
      
      {submissions.length === 0 ? (
        <div className="bg-pattern rounded-[2.5rem] border border-slate-200 p-12 text-center border-dashed">
          <Mail className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Inbox is Empty</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Customer support messages will be listed here in real-time.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {submissions.map((msg) => (
            <div key={msg.id} className="bg-pattern rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row gap-6 relative group">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{msg.name}</h4>
                    <a href={`mailto:${msg.email}`} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {msg.email}
                    </a>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl text-slate-600 text-sm leading-relaxed mb-4">
                  {msg.message}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <Calendar className="w-3 h-3" /> {new Date(msg.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="flex items-start">
                <button 
                  onClick={() => onDeleteSubmission(msg.id)}
                  className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-main-pattern flex flex-col">
      <nav className="bg-indigo-950 text-white px-8 py-4 flex items-center justify-between shadow-xl sticky top-0 z-[100]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('websites')}>
          <Globe className="w-6 h-6" />
          <span className="text-xl font-black uppercase tracking-tighter">Admin Center</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-1">
            <button onClick={() => setActiveTab('websites')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'websites' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <LayoutGrid className="w-4 h-4" /> Websites
            </button>
            <button onClick={() => setActiveTab('contact')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'contact' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <Mail className="w-4 h-4" /> Inbox {submissions.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{submissions.length}</span>}
            </button>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-12 flex-grow">
        {activeTab === 'websites' && renderWebsitesContent()}
        {activeTab === 'contact' && renderContactContent()}

        {showSettings && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => { setShowSettings(false); setIs2FAVerified(false); }}></div>
            <div className="relative bg-pattern w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900">Security Settings</h2>
                <button type="button" onClick={() => { setShowSettings(false); setIs2FAVerified(false); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {!is2FAVerified ? (
                <form onSubmit={handleVerify2FA} className="space-y-6">
                  <div className="bg-indigo-50 p-6 rounded-2xl flex items-start gap-4 mb-6">
                    <ShieldAlert className="w-6 h-6 text-indigo-600 mt-1" />
                    <p className="text-sm text-indigo-900 font-medium">To change credentials, please enter the 2FA password (Bernice).</p>
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-2 block">2FA Password</label>
                    <input 
                      required 
                      type="password"
                      value={twoFAPassword} 
                      onChange={e => setTwoFAPassword(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                      placeholder="Enter 2FA password" 
                    />
                  </div>
                  {settingsError && <p className="text-red-500 text-xs font-bold">{settingsError}</p>}
                  <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-colors uppercase tracking-widest text-sm">Verify 2FA</button>
                </form>
              ) : (
                <form onSubmit={handleUpdateCredentials} className="space-y-6">
                   <div className="bg-emerald-50 p-6 rounded-2xl flex items-start gap-4 mb-6">
                    <KeyRound className="w-6 h-6 text-emerald-600 mt-1" />
                    <p className="text-sm text-emerald-900 font-medium">2FA Verified. You can update admin credentials.</p>
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-2 block">New Admin Number</label>
                    <input 
                      required 
                      value={newCreds.number} 
                      onChange={e => setNewCreds({...newCreds, number: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                      placeholder="New Number" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-2 block">New Secret Password</label>
                    <input 
                      required 
                      type="password"
                      value={newCreds.password} 
                      onChange={e => setNewCreds({...newCreds, password: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                      placeholder="New Secret Password" 
                    />
                  </div>
                  {settingsError && <p className="text-red-500 text-xs font-bold">{settingsError}</p>}
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-emerald-700 transition-colors uppercase tracking-widest text-sm">Save Changes</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {showAddForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowAddForm(false)}></div>
            <form onSubmit={handleSubmit} className="relative bg-pattern w-full max-w-3xl rounded-[2.5rem] p-10 shadow-2xl my-8 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900">{editingId ? 'Edit Asset' : 'Register New Asset'}</h2>
                <button type="button" onClick={() => setShowAddForm(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-8 h-[60vh] overflow-y-auto px-2">
                <section>
                  <h3 className="text-xs font-black uppercase text-indigo-600 mb-4 tracking-widest flex items-center gap-2">
                    <Globe className="w-4 h-4" /> General Information
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Website Name</label>
                      <input required value={newSite.name} onChange={e => setNewSite({...newSite, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="e.g. CryptoPulse SaaS" />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Category</label>
                      <select value={newSite.category} onChange={e => setNewSite({...newSite, category: e.target.value as any})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer">
                        {['SaaS', 'E-commerce', 'Tool', 'Content', 'Marketplace', 'Finance'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Website URL</label>
                      <input required value={newSite.url} onChange={e => setNewSite({...newSite, url: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="https://..." />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Description</label>
                      <textarea required value={newSite.description} onChange={e => setNewSite({...newSite, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl h-32 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none" placeholder="Briefly explain what the site does..." />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-black uppercase text-indigo-600 mb-4 tracking-widest flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Media & Tech
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Hero Screenshot</label>
                      <div onClick={() => fileInputRef.current?.click()} className="group cursor-pointer border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 rounded-2xl p-6 transition-all relative overflow-hidden flex flex-col items-center justify-center min-h-[120px]">
                        {newSite.image ? (
                          <>
                            <img src={newSite.image} className="absolute inset-0 w-full h-full object-cover opacity-20" />
                            <div className="relative z-10 flex flex-col items-center text-center">
                              <ImageIcon className="w-6 h-6 text-indigo-600 mb-1" />
                              <span className="text-[10px] font-bold text-slate-600">Image Uploaded</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center text-center">
                            <Upload className="w-6 h-6 text-slate-300 group-hover:text-indigo-400 mb-2" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Click to Upload</span>
                          </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Tech Stack (Comma Separated)</label>
                      <div className="relative">
                        <Code className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                        <textarea value={techStackString} onChange={e => setTechStackString(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl h-[120px] focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none" placeholder="React, Node.js, Tailwind..." />
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                   <h3 className="text-xs font-black uppercase text-indigo-600 mb-4 tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Listing Price
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Price (GH₵)</label>
                      <input type="number" value={newSite.price} onChange={e => setNewSite({...newSite, price: e.target.valueAsNumber || 0})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none" />
                    </div>
                  </div>
                </section>
              </div>

              <div className="flex gap-4 pt-8 border-t border-slate-100 mt-6">
                <button type="submit" className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-colors uppercase tracking-widest text-sm">{editingId ? 'Update Asset' : 'Add Asset'}</button>
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-slate-100 text-slate-500 font-black py-4 rounded-2xl hover:bg-slate-200 transition-colors uppercase tracking-widest text-sm">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

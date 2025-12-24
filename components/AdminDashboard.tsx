
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Edit, Globe, ExternalLink, LogOut, MessageSquare, Mail, LayoutGrid, Image as ImageIcon, Upload, X } from 'lucide-react';
import { WebsiteListing } from '../types';

interface AdminDashboardProps {
  listings: WebsiteListing[];
  onAdd: (listing: WebsiteListing) => void;
  onUpdate: (listing: WebsiteListing) => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
}

type AdminTab = 'websites' | 'enquiries' | 'contact';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ listings, onAdd, onUpdate, onDelete, onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('websites');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newSite, setNewSite] = useState<Partial<WebsiteListing>>({
    name: '',
    url: '',
    price: 0,
    monthlyProfit: 0,
    category: 'SaaS',
    description: '',
    techStack: [],
    performance: [
      { month: 'Jan', revenue: 0, visitors: 0 },
      { month: 'Feb', revenue: 0, visitors: 0 },
      { month: 'Mar', revenue: 0, visitors: 0 },
      { month: 'Apr', revenue: 0, visitors: 0 },
      { month: 'May', revenue: 0, visitors: 0 },
      { month: 'Jun', revenue: 0, visitors: 0 },
    ],
    age: 'Brand New',
    askingMultiple: 0,
    image: '',
    monthlyRevenue: 0,
    monthlyTraffic: 0
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSite({ ...newSite, image: reader.result as string });
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
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSite.image) {
      alert("Please upload an image for the website.");
      return;
    }

    const profit = newSite.monthlyProfit || 1;
    const askingMultiple = Math.round((newSite.price! / profit) * 100) / 100;

    if (editingId) {
      const updatedListing: WebsiteListing = {
        ...newSite as WebsiteListing,
        id: editingId,
        askingMultiple,
      };
      onUpdate(updatedListing);
    } else {
      const listing: WebsiteListing = {
        ...newSite as WebsiteListing,
        id: Math.random().toString(36).substr(2, 9),
        askingMultiple,
        techStack: newSite.techStack?.length ? newSite.techStack : ['React', 'Webflow'],
      };
      onAdd(listing);
    }

    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setNewSite({
      name: '', url: '', price: 0, monthlyProfit: 0, category: 'SaaS', description: '', techStack: [], 
      performance: [
        { month: 'Jan', revenue: 0, visitors: 0 },
        { month: 'Feb', revenue: 0, visitors: 0 },
        { month: 'Mar', revenue: 0, visitors: 0 },
        { month: 'Apr', revenue: 0, visitors: 0 },
        { month: 'May', revenue: 0, visitors: 0 },
        { month: 'Jun', revenue: 0, visitors: 0 },
      ], 
      age: 'Brand New', image: '', monthlyRevenue: 0, monthlyTraffic: 0
    });
    setEditingId(null);
  };

  const renderWebsitesContent = () => (
    <>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Manage Showroom</h1>
          <p className="text-slate-500 font-medium mt-1">Total Assets: {listings.length}</p>
        </div>
        <button 
          onClick={openAddForm}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Website
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-8 py-5 text-xs font-black uppercase text-slate-400">Website</th>
              <th className="px-8 py-5 text-xs font-black uppercase text-slate-400">Category</th>
              <th className="px-8 py-5 text-xs font-black uppercase text-slate-400">Price</th>
              <th className="px-8 py-5 text-xs font-black uppercase text-slate-400">Profit/mo</th>
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
                <td className="px-8 py-6 font-black text-slate-900">${site.price.toLocaleString()}</td>
                <td className="px-8 py-6 text-emerald-600 font-bold">${site.monthlyProfit.toLocaleString()}</td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => openEditForm(site)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(site.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-all"
                    >
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

  const renderEnquiriesContent = () => (
    <div>
      <h1 className="text-4xl font-black text-slate-900 mb-2">Other Enquiries</h1>
      <p className="text-slate-500 font-medium mb-10">Manage general requests and custom acquisition offers.</p>
      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-12 text-center border-dashed">
        <MessageSquare className="w-16 h-16 text-slate-200 mx-auto mb-6" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">No New Enquiries</h3>
        <p className="text-slate-500 max-w-sm mx-auto">When users submit a request through the "Other Enquiries" page, they will appear here.</p>
      </div>
    </div>
  );

  const renderContactContent = () => (
    <div>
      <h1 className="text-4xl font-black text-slate-900 mb-2">Contact Submissions</h1>
      <p className="text-slate-500 font-medium mb-10">Messages received through the public contact form.</p>
      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-12 text-center border-dashed">
        <Mail className="w-16 h-16 text-slate-200 mx-auto mb-6" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Inbox is Empty</h3>
        <p className="text-slate-500 max-w-sm mx-auto">Customer support messages will be listed here in real-time.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-indigo-950 text-white px-8 py-4 flex items-center justify-between shadow-xl sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6" />
          <span className="text-xl font-black uppercase tracking-tighter">Admin Center</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-1">
            <button 
              onClick={() => setActiveTab('websites')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'websites' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <LayoutGrid className="w-4 h-4" /> Websites
            </button>
            <button 
              onClick={() => setActiveTab('enquiries')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'enquiries' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <MessageSquare className="w-4 h-4" /> Other Enquiries
            </button>
            <button 
              onClick={() => setActiveTab('contact')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'contact' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <Mail className="w-4 h-4" /> Contact Us
            </button>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-12 flex-grow">
        {activeTab === 'websites' && renderWebsitesContent()}
        {activeTab === 'enquiries' && renderEnquiriesContent()}
        {activeTab === 'contact' && renderContactContent()}

        {showAddForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowAddForm(false)}></div>
            <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl my-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900">{editingId ? 'Edit Asset' : 'Register New Asset'}</h2>
                <button type="button" onClick={() => setShowAddForm(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Website Name</label>
                    <input required value={newSite.name} onChange={e => setNewSite({...newSite, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="e.g. CryptoPulse SaaS" />
                  </div>
                  
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Asking Price ($)</label>
                    <input required type="number" value={newSite.price} onChange={e => setNewSite({...newSite, price: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                  </div>
                  
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Category</label>
                    <select value={newSite.category} onChange={e => setNewSite({...newSite, category: e.target.value as any})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer">
                      <option value="SaaS">SaaS</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Tool">Tool</option>
                      <option value="Content">Content</option>
                      <option value="Marketplace">Marketplace</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Image Upload</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="group cursor-pointer border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 rounded-2xl p-8 transition-all relative overflow-hidden flex flex-col items-center justify-center min-h-[160px]"
                    >
                      {newSite.image ? (
                        <>
                          <img src={newSite.image} className="absolute inset-0 w-full h-full object-cover opacity-20" />
                          <div className="relative z-10 flex flex-col items-center">
                            <ImageIcon className="w-8 h-8 text-indigo-600 mb-2" />
                            <span className="text-xs font-bold text-slate-600">Image Uploaded</span>
                            <span className="text-[10px] text-slate-400 mt-1">Click to change screenshot</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-slate-300 group-hover:text-indigo-400 mb-3 transition-colors" />
                          <span className="text-xs font-bold text-slate-500">Drop website screenshot here</span>
                          <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">or click to browse</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Monthly Profit ($)</label>
                    <input required type="number" value={newSite.monthlyProfit} onChange={e => setNewSite({...newSite, monthlyProfit: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Monthly Revenue ($)</label>
                    <input required type="number" value={newSite.monthlyRevenue} onChange={e => setNewSite({...newSite, monthlyRevenue: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                  </div>

                  <div className="col-span-2">
                    <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Website URL</label>
                    <input required value={newSite.url} onChange={e => setNewSite({...newSite, url: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="https://..." />
                  </div>

                  <div className="col-span-2">
                    <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Description</label>
                    <textarea required value={newSite.description} onChange={e => setNewSite({...newSite, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl h-32 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none" placeholder="Briefly explain what the site does, users, tech stack, etc..." />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-colors">
                    {editingId ? 'Update Asset' : 'Save Asset'}
                  </button>
                  <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-slate-100 text-slate-500 font-black py-4 rounded-2xl hover:bg-slate-200 transition-colors">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

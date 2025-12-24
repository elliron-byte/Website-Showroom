
import React, { useState } from 'react';
import { Plus, Trash2, Edit, Globe, ExternalLink, LogOut, DollarSign } from 'lucide-react';
import { WebsiteListing } from '../types';

interface AdminDashboardProps {
  listings: WebsiteListing[];
  onAdd: (listing: WebsiteListing) => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ listings, onAdd, onDelete, onLogout }) => {
  const [showAddForm, setShowAddForm] = useState(false);
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
    image: 'https://picsum.photos/seed/' + Math.random() + '/800/450',
    monthlyRevenue: 0,
    monthlyTraffic: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const listing: WebsiteListing = {
      ...newSite as WebsiteListing,
      id: Math.random().toString(36).substr(2, 9),
      askingMultiple: Math.round((newSite.price! / (newSite.monthlyProfit! || 1)) * 100) / 100
    };
    onAdd(listing);
    setShowAddForm(false);
    setNewSite({
      name: '', url: '', price: 0, monthlyProfit: 0, category: 'SaaS', description: '', techStack: [], 
      performance: newSite.performance, age: 'Brand New', askingMultiple: 0, image: 'https://picsum.photos/seed/' + Math.random() + '/800/450', 
      monthlyRevenue: 0, monthlyTraffic: 0
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-indigo-950 text-white px-8 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6" />
          <span className="text-xl font-black uppercase tracking-tighter">Admin Control</span>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-all"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900">Manage Showroom</h1>
            <p className="text-slate-500 font-medium mt-1">Total Assets: {listings.length}</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Website
          </button>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowAddForm(false)}></div>
            <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-black text-slate-900 mb-8">Register New Asset</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Site Name</label>
                  <input required value={newSite.name} onChange={e => setNewSite({...newSite, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl" placeholder="e.g. CryptoPulse SaaS" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Price ($)</label>
                  <input required type="number" value={newSite.price} onChange={e => setNewSite({...newSite, price: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Monthly Profit ($)</label>
                  <input required type="number" value={newSite.monthlyProfit} onChange={e => setNewSite({...newSite, monthlyProfit: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Website URL</label>
                  <input required value={newSite.url} onChange={e => setNewSite({...newSite, url: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl" placeholder="https://..." />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Description</label>
                  <textarea required value={newSite.description} onChange={e => setNewSite({...newSite, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl h-32" placeholder="Briefly explain what the site does..." />
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button type="submit" className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg">Save Asset</button>
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-slate-100 text-slate-500 font-black py-4 rounded-2xl">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-8 py-5 text-left text-xs font-black uppercase text-slate-400">Website</th>
                <th className="px-8 py-5 text-left text-xs font-black uppercase text-slate-400">Category</th>
                <th className="px-8 py-5 text-left text-xs font-black uppercase text-slate-400">Price</th>
                <th className="px-8 py-5 text-left text-xs font-black uppercase text-slate-400">Profit/mo</th>
                <th className="px-8 py-5 text-right text-xs font-black uppercase text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {listings.map(site => (
                <tr key={site.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={site.image} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-slate-900">{site.name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1">{site.url} <ExternalLink className="w-3 h-3" /></div>
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
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"><Edit className="w-4 h-4" /></button>
                      <button 
                        onClick={() => onDelete(site.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-all"
                      ><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

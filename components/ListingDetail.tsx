
import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Activity, DollarSign, Globe, Code, ShieldCheck, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WebsiteListing } from '../types';
import { getListingAnalysis } from '../services/geminiService';

interface ListingDetailProps {
  listing: WebsiteListing;
  onClose: () => void;
}

export const ListingDetail: React.FC<ListingDetailProps> = ({ listing, onClose }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsAnalyzing(true);
      const result = await getListingAnalysis(listing);
      setAnalysis(result);
      setIsAnalyzing(false);
    };
    fetchAnalysis();
  }, [listing]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col md:flex-row border border-slate-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Sidebar info */}
        <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50">
          <div className="mb-8">
            <img 
              src={listing.image} 
              alt={listing.name} 
              className="w-full aspect-video object-cover rounded-3xl mb-6 shadow-md border border-white"
            />
            <h2 className="text-3xl font-black text-slate-900 mb-2">{listing.name}</h2>
            <a 
              href={listing.url} 
              target="_blank" 
              className="text-indigo-600 font-semibold flex items-center gap-1.5 text-sm hover:underline"
            >
              {listing.url} <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-950 p-6 rounded-[2rem] shadow-xl">
              <span className="text-[10px] uppercase text-indigo-300 font-bold mb-1 block tracking-widest">Asking Price</span>
              <div className="text-4xl font-black text-white">{formatCurrency(listing.price)}</div>
              <div className="text-xs text-indigo-200/60 mt-2 font-medium bg-white/10 inline-block px-3 py-1 rounded-full">{listing.askingMultiple}x Monthly Multiple</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-[10px] uppercase text-slate-400 font-bold mb-1 block">Monthly Profit</span>
                <div className="text-lg font-bold text-emerald-600">{formatCurrency(listing.monthlyProfit)}</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-[10px] uppercase text-slate-400 font-bold mb-1 block">Monthly Revenue</span>
                <div className="text-lg font-bold text-slate-900">{formatCurrency(listing.monthlyRevenue)}</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase text-slate-400 font-bold mb-3 block">Tech Stack</span>
              <div className="flex flex-wrap gap-2">
                {listing.techStack.map(tech => (
                  <span key={tech} className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]">
              Contact Seller
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 p-8 md:p-12">
          <div className="mb-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" /> Financial Growth
            </h3>
            <div className="h-72 w-full bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={listing.performance}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> AI Valuation Summary
              </h3>
              <div className="bg-amber-50/50 p-6 rounded-[2rem] border border-amber-100 prose prose-slate max-w-none">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
                    <p className="text-sm text-amber-700 font-bold animate-pulse uppercase tracking-widest">Evaluating Asset Potential...</p>
                  </div>
                ) : (
                  <div className="text-slate-700 leading-relaxed text-sm">
                    {analysis}
                  </div>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Due Diligence
              </h3>
              <ul className="space-y-4">
                <li className="bg-emerald-50 p-5 rounded-2xl flex items-start gap-4 border border-emerald-100">
                  <div className="p-2.5 bg-white rounded-xl text-emerald-600 shadow-sm"><DollarSign className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900">Verified Revenue</h4>
                    <p className="text-xs text-emerald-700/70 mt-0.5 font-medium">Verified via direct API integration with payment processors.</p>
                  </div>
                </li>
                <li className="bg-blue-50 p-5 rounded-2xl flex items-start gap-4 border border-blue-100">
                  <div className="p-2.5 bg-white rounded-xl text-blue-600 shadow-sm"><Globe className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-blue-900">Traffic Authority</h4>
                    <p className="text-xs text-blue-700/70 mt-0.5 font-medium">Strong organic presence with consistent keyword rankings.</p>
                  </div>
                </li>
                <li className="bg-slate-50 p-5 rounded-2xl flex items-start gap-4 border border-slate-200">
                  <div className="p-2.5 bg-white rounded-xl text-slate-600 shadow-sm"><Code className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Handover Support</h4>
                    <p className="text-xs text-slate-600/70 mt-0.5 font-medium">Includes 30 days of technical support and training.</p>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

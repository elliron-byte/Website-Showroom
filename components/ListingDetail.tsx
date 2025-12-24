
import React from 'react';
import { X, ExternalLink, Info } from 'lucide-react';
import { WebsiteListing } from '../types';

interface ListingDetailProps {
  listing: WebsiteListing;
  onClose: () => void;
  onContactSeller: () => void;
}

export const ListingDetail: React.FC<ListingDetailProps> = ({ listing, onClose, onContactSeller }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(val);

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
              rel="noopener noreferrer"
              className="text-indigo-600 font-semibold flex items-center gap-1.5 text-sm hover:underline"
            >
              {listing.url} <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-950 p-6 rounded-[2rem] shadow-xl">
              <span className="text-[10px] uppercase text-indigo-300 font-bold mb-1 block tracking-widest">Price</span>
              <div className="text-4xl font-black text-white">{formatCurrency(listing.price)}</div>
            </div>

            <button 
              onClick={onContactSeller}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
            >
              Contact Seller
            </button>
            
            <p className="text-xs text-slate-400 text-center font-medium px-4">
              Our team will facilitate the transfer process once you connect with the seller.
            </p>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 p-8 md:p-12">
          <div className="mb-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-600" /> About this asset
            </h3>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm min-h-[300px]">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 opacity-60">
             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-tight">Category</h4>
                <p className="text-slate-600 font-medium">{listing.category}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

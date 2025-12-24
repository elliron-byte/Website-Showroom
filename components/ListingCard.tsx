
import React from 'react';
import { Users, Banknote, ArrowRight } from 'lucide-react';
import { WebsiteListing } from '../types';

interface ListingCardProps {
  listing: WebsiteListing;
  onClick: (listing: WebsiteListing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', maximumFractionDigits: 0 }).format(val);

  return (
    <div 
      onClick={() => onClick(listing)}
      className="group bg-white rounded-3xl overflow-hidden cursor-pointer border border-slate-200 hover:border-indigo-400 transition-all duration-300 card-shadow hover:-translate-y-1 flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={listing.image} 
          alt={listing.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-700 border border-indigo-100">
            {listing.category}
          </span>
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-600 border border-slate-100">
            {listing.age}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {listing.name}
          </h3>
          <span className="text-xl font-black text-slate-900">{formatCurrency(listing.price)}</span>
        </div>
        
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">
          {listing.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-5 border-y border-slate-100 py-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-slate-400 font-bold mb-1">Monthly Net</span>
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
              <Banknote className="w-3.5 h-3.5" />
              {formatCurrency(listing.monthlyProfit)}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-slate-400 font-bold mb-1">Traffic</span>
            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-sm">
              <Users className="w-3.5 h-3.5" />
              {listing.monthlyTraffic.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-1.5">
            {listing.techStack.slice(0, 2).map((tech, i) => (
              <span key={i} className="text-[10px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                {tech}
              </span>
            ))}
          </div>
          <div className="text-indigo-600 text-sm font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            View Listing <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

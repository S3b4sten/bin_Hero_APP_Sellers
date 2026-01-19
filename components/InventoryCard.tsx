
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { calculateCurrentPrice, formatCurrency, getDayCount } from '../utils';

interface InventoryCardProps {
  product: Product;
  onRemove: (id: string) => void;
  onMarkAsSold: (product: Product, price: number) => void;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ product, onRemove, onMarkAsSold }) => {
  const [currentPrice, setCurrentPrice] = useState(calculateCurrentPrice(product.originalPrice, product.createdAt));
  const day = getDayCount(product.createdAt);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPrice(calculateCurrentPrice(product.originalPrice, product.createdAt));
    }, 60000);
    return () => clearInterval(timer);
  }, [product]);

  return (
    <article className="group bg-white rounded-3xl border-4 border-[#062e1e] overflow-hidden flex flex-col h-full shadow-[0_6px_0_0_#062e1e] transition-all duration-300">
      <div className="relative aspect-video overflow-hidden bg-gray-100 border-b-4 border-[#062e1e]">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-[#062e1e] text-white px-3 py-1 rounded-full text-xs font-black shadow-sm">
          JOUR {day}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-black text-[#062e1e] leading-tight uppercase tracking-tighter line-clamp-1">{product.name}</h3>
          <span className="text-[10px] font-black bg-emerald-50 text-[#10b981] px-2 py-0.5 rounded border border-emerald-100">{product.category}</span>
        </div>
        
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Prix Client Actuel</span>
            <span className="text-3xl font-black text-[#10b981] tabular-nums tracking-tighter">{formatCurrency(currentPrice)}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Base</span>
            <span className="text-sm font-bold text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3">
          <button 
            onClick={() => onMarkAsSold(product, currentPrice)}
            className="bg-[#062e1e] text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-emerald-900 transition-all active:scale-95"
          >
            VENDU
          </button>
          <button 
            onClick={() => onRemove(product.id)}
            className="bg-white text-red-600 border-2 border-red-600 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-50 transition-all active:scale-95"
          >
            RETIRER
          </button>
        </div>
      </div>
    </article>
  );
};

export default InventoryCard;

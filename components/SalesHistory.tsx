
import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils';

interface SalesHistoryProps {
  soldProducts: Product[];
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ soldProducts }) => {
  const totalRevenue = soldProducts.reduce((sum, p) => sum + (p.soldPrice || 0), 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#062e1e] text-white p-8 rounded-[2.5rem] border-4 border-[#062e1e] mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-1">HISTORIQUE DES VENTES</h2>
          <p className="text-emerald-400 font-black uppercase tracking-widest text-xs">Performance de votre Binstore</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block">Revenu Total Généré</span>
          <span className="text-5xl font-black text-[#10b981] tabular-nums tracking-tighter">{formatCurrency(totalRevenue)}</span>
        </div>
      </div>

      {soldProducts.length === 0 ? (
        <div className="bg-white rounded-[2rem] border-4 border-dashed border-gray-200 p-20 text-center">
          <p className="font-black text-gray-300 uppercase tracking-widest">Aucune vente enregistrée pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {soldProducts.map((p) => (
            <div key={p.id} className="bg-white border-4 border-[#062e1e] p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_4px_0_0_#062e1e]">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#062e1e]">
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-[#062e1e] text-lg uppercase tracking-tighter">{p.name}</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendu le {new Date(p.soldAt!).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Prix de Vente</span>
                  <span className="text-2xl font-black text-[#10b981]">{formatCurrency(p.soldPrice || 0)}</span>
                </div>
                <div className="bg-emerald-50 text-[#062e1e] border-2 border-[#10b981] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  COMPLÉTÉ
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesHistory;

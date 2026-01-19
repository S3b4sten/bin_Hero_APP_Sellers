
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import InventoryCard from './components/InventoryCard';
import SalesHistory from './components/SalesHistory';
import SellForm from './components/SellForm';
import { Product } from './types';
import { formatCurrency } from './utils';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [view, setView] = useState<'inventory' | 'history'>('inventory');
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  // Stats calculées
  const activeProducts = products.filter(p => p.status === 'active');
  const soldProducts = products.filter(p => p.status === 'sold');
  const totalRevenue = soldProducts.reduce((sum, p) => sum + (p.soldPrice || 0), 0);

  const addProduct = (newProduct: Product) => {
    setProducts([{ ...newProduct, status: 'active' }, ...products]);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const markAsSold = (product: Product, price: number) => {
    setProducts(products.map(p => 
      p.id === product.id 
      ? { ...p, status: 'sold', soldPrice: price, soldAt: new Date().toISOString() } 
      : p
    ));
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#062e1e] font-sans selection:bg-[#10b981] selection:text-white">
      <Navbar 
        onSellClick={() => setIsSellModalOpen(true)} 
        onDashboardClick={() => setView('inventory')}
        onHistoryClick={() => setView('history')}
        activeView={view}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* KPI Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border-4 border-[#062e1e] p-8 rounded-[2.5rem] shadow-[0_6px_0_0_#10b981]">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">Stock Actif</span>
            <div className="text-5xl font-black text-[#062e1e] tracking-tighter">{activeProducts.length}</div>
            <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">Objets en bacs</p>
          </div>
          <div className="bg-white border-4 border-[#062e1e] p-8 rounded-[2.5rem] shadow-[0_6px_0_0_#062e1e]">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">Objets Vendus</span>
            <div className="text-5xl font-black text-[#10b981] tracking-tighter">{soldProducts.length}</div>
            <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">Succès total</p>
          </div>
          <div className="bg-[#10b981] border-4 border-[#062e1e] p-8 rounded-[2.5rem] shadow-[0_6px_0_0_#062e1e]">
            <span className="text-[10px] font-black text-[#062e1e] uppercase tracking-[0.2em] block mb-2">Profit Total</span>
            <div className="text-5xl font-black text-[#062e1e] tracking-tighter">{formatCurrency(totalRevenue)}</div>
            <p className="text-[10px] font-black text-[#062e1e] mt-2 uppercase opacity-60">Revenus nets</p>
          </div>
        </div>

        {view === 'inventory' ? (
          <>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase text-[#062e1e]">GESTION INVENTAIRE</h2>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Gérez vos bacs dynamiquement</p>
              </div>
              <button 
                onClick={() => setIsSellModalOpen(true)}
                className="bg-[#062e1e] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
              >
                + AJOUTER STOCK
              </button>
            </div>

            {activeProducts.length === 0 ? (
              <div className="bg-white rounded-[3rem] border-4 border-dashed border-gray-200 py-16 flex flex-col items-center justify-center text-center px-10">
                <div className="bg-emerald-50 p-6 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black italic tracking-tighter text-[#062e1e] mb-1 uppercase">VOTRE BAC EST VIDE</h3>
                <p className="text-gray-400 font-bold text-xs max-w-sm mb-6 uppercase tracking-tight">Utilisez notre IA pour lister vos retours d'objets en quelques secondes.</p>
                <button 
                   onClick={() => setIsSellModalOpen(true)}
                   className="bg-[#10b981] text-[#062e1e] border-4 border-[#062e1e] px-10 py-4 rounded-[2rem] font-black text-lg uppercase shadow-[0_6px_0_0_#062e1e] hover:shadow-none hover:translate-y-2 transition-all"
                >
                  DÉMARRER LE SCAN IA
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {activeProducts.map(product => (
                  <InventoryCard 
                    key={product.id} 
                    product={product} 
                    onRemove={removeProduct}
                    onMarkAsSold={markAsSold}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <SalesHistory soldProducts={soldProducts} />
        )}
      </main>

      {isSellModalOpen && (
        <SellForm 
          onClose={() => setIsSellModalOpen(false)} 
          onAddProduct={addProduct} 
        />
      )}

      <footer className="mt-20 border-t-4 border-[#062e1e] py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-[#062e1e] mb-2">BINDROP PRO</h1>
            <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Optimisé pour les Liquisateurs Modernes.</p>
          </div>
          <div className="flex gap-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#10b981]">© 2024 Entrepreneur Edition</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;


import React from 'react';

interface NavbarProps {
  onSellClick: () => void;
  onDashboardClick: () => void;
  onHistoryClick: () => void;
  activeView: 'inventory' | 'history';
}

const Navbar: React.FC<NavbarProps> = ({ onSellClick, onDashboardClick, onHistoryClick, activeView }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-[#062e1e] px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onDashboardClick}>
          <div className="bg-[#062e1e] p-2 rounded-lg text-[#10b981] shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <h1 className="text-2xl font-black italic tracking-tighter text-[#062e1e]">BINDROP</h1>
            <span className="text-[10px] font-black text-[#10b981] uppercase tracking-widest">PRO DASHBOARD</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onHistoryClick}
            className={`hidden md:flex px-4 py-2 rounded-xl font-black text-sm transition-all items-center gap-2 ${activeView === 'history' ? 'bg-[#062e1e] text-white' : 'text-[#062e1e] hover:bg-emerald-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Historique Ventes</span>
          </button>

          <button 
            onClick={onSellClick}
            className="flex bg-[#10b981] text-[#062e1e] px-6 py-3 rounded-full font-black text-sm hover:bg-emerald-400 transition-all items-center gap-2 border-2 border-[#062e1e] shadow-[0_4px_0_0_#062e1e] active:translate-y-1 active:shadow-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            <span>AJOUTER UN OBJET</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

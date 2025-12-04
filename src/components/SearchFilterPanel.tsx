import React, { useState } from 'react';
import { Search, X, Sliders, Check } from 'lucide-react';
import { create } from 'zustand';

interface FilterState {
  query: string;
  setQuery: (q: string) => void;
}

const useFilterStore = create<FilterState>((set) => ({
  query: '',
  setQuery: (q) => set({ query: q }),
}));

export const SearchFilterPanel = () => {
  const { query, setQuery } = useFilterStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all"
      >
        <Sliders size={24} />
      </button>

      <div className={`
        fixed inset-0 z-50 lg:static lg:z-auto bg-background/95 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none
        transition-all duration-300 flex flex-col lg:block p-6 lg:p-0
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible lg:opacity-100 lg:visible'}
      `}>
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-xl font-bold text-foreground">Filters</h2>
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground"><X size={24} /></button>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-secondary border border-border text-foreground rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Status</label>
            <div className="flex gap-2">
              {['Active', 'Reserved', 'Sold'].map(s => (
                <button key={s} className="px-3 py-1.5 rounded text-sm font-medium border border-border bg-secondary text-muted-foreground hover:text-foreground hover:border-muted-foreground">
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <button onClick={() => setIsOpen(false)} className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 flex justify-center items-center gap-2">
              <Check size={16} /> Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

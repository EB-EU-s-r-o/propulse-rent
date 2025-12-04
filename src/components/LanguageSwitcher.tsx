import React from 'react';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const changeLanguage = (lng: string) => {
    console.log(`Switching to ${lng}`);
  };

  return (
    <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5">
      <Globe size={16} className="text-muted-foreground" />
      <select 
        onChange={(e) => changeLanguage(e.target.value)} 
        className="bg-transparent text-sm text-muted-foreground outline-none cursor-pointer hover:text-foreground transition-colors"
        defaultValue="en"
      >
        <option value="en" className="bg-card">🇺🇸 EN</option>
        <option value="sk" className="bg-card">🇸🇰 SK</option>
        <option value="th" className="bg-card">🇹🇭 TH</option>
      </select>
    </div>
  );
};

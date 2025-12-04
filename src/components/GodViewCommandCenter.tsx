import React, { useState } from 'react';
import { Layers, DollarSign } from 'lucide-react';

export const GodViewCommandCenter = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative w-full h-[500px] bg-card overflow-hidden rounded-xl border border-border group">
      {/* Visual Mock of Map */}
      <div className="absolute inset-0 bg-background flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.3, transform: 'perspective(500px) rotateX(20deg) scale(1.5)' }}></div>
        
        {/* Building */}
        <div 
          className="relative w-24 h-48 bg-primary/20 border border-primary backdrop-blur-sm cursor-pointer hover:bg-primary/40 transition-all transform hover:-translate-y-2 shadow-[0_0_30px_hsl(var(--primary)/0.3)] z-10"
          onMouseEnter={() => setHovered(true)} 
          onMouseLeave={() => setHovered(false)}
        >
          <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-success rounded-full animate-ping"></div>
        </div>
      </div>

      {/* HUD Controls */}
      <div className="absolute top-4 left-4 bg-background/60 backdrop-blur-md border border-border rounded-lg p-1 flex flex-col gap-1 z-20">
        <button className="p-2 text-muted-foreground hover:text-foreground"><Layers size={16}/></button>
        <button className="p-2 text-muted-foreground hover:text-foreground"><DollarSign size={16}/></button>
      </div>

      {/* Live Ticker */}
      <div className="absolute top-4 right-4 bg-background/60 backdrop-blur-md border border-border rounded-lg px-4 py-2 flex items-center gap-4 text-xs font-mono text-success shadow-lg z-20">
        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-destructive animate-pulse"></span> LIVE: 142</span>
      </div>

      {/* Popup HUD */}
      {hovered && (
        <div className="absolute top-1/2 left-1/2 transform translate-x-16 -translate-y-24 bg-background/90 backdrop-blur-xl border border-primary/50 rounded-xl p-4 w-64 shadow-[0_0_50px_hsl(var(--primary)/0.3)] animate-fade-in z-30 pointer-events-none">
          <h3 className="font-bold text-foreground uppercase text-sm mb-2 border-b border-border pb-1">Millennium Tower</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><div className="text-muted-foreground">ROI</div><div className="text-success font-mono text-lg">8.5%</div></div>
            <div><div className="text-muted-foreground">Revenue</div><div className="text-foreground font-mono text-lg">฿12.5M</div></div>
          </div>
        </div>
      )}
    </div>
  );
};

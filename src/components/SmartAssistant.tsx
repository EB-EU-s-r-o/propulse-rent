import React, { useState } from 'react';
import { Sparkles, Wand2, TrendingUp } from 'lucide-react';

export const SmartAssistant = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesc, setGeneratedDesc] = useState("");

  const handleMagic = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedDesc("Experience luxury living in this stunning unit featuring Sea View. Located in the heart of the city, this residence offers unparalleled convenience.");
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4 text-indigo-300 font-bold uppercase tracking-widest text-xs">
        <Sparkles size={14} /> AI Power Tools
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
            <Wand2 size={16} className="text-purple-400" /> Auto-Description
          </h3>
          <button onClick={handleMagic} disabled={isGenerating} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-sm transition-all flex justify-center items-center gap-2 disabled:opacity-50">
            {isGenerating ? 'Drafting...' : 'Generate Magic Copy'}
          </button>
          {generatedDesc && <div className="p-3 bg-background/40 rounded border border-border text-xs text-muted-foreground italic animate-fade-in">"{generatedDesc}"</div>}
        </div>

        <div>
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3 text-sm"><TrendingUp size={16} className="text-pink-400" /> Lead IQ</h3>
          <div className="bg-card/50 rounded p-3 border border-border space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground text-xs">Intent</span>
              <span className="text-success font-bold bg-success/10 px-2 py-0.5 rounded text-[10px]">HOT</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-green-600 w-[90%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

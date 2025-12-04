import React, { useState } from 'react';
import { UploadCloud, ArrowRight, CheckCircle } from 'lucide-react';

type Step = 'upload' | 'map' | 'preview' | 'finish';

export const ImportWizard = () => {
  const [step, setStep] = useState<Step>('upload');
  
  return (
    <div className="max-w-2xl mx-auto bg-card rounded-xl border border-border overflow-hidden">
      <div className="bg-secondary/50 p-4 border-b border-border flex justify-between items-center text-sm">
        <div className={`flex items-center gap-2 ${step === 'upload' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>1. Upload</div>
        <div className="h-px bg-border w-8" />
        <div className={`flex items-center gap-2 ${step === 'map' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>2. Map</div>
        <div className="h-px bg-border w-8" />
        <div className={`flex items-center gap-2 ${step === 'finish' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>3. Finish</div>
      </div>

      <div className="p-8 min-h-[300px] flex flex-col justify-center">
        {step === 'upload' && (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-10 hover:border-primary transition-colors bg-secondary/30 cursor-pointer" onClick={() => setStep('map')}>
            <UploadCloud size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Click to Upload</h3>
            <p className="text-muted-foreground text-sm">Supports .CSV, .JSON</p>
          </div>
        )}

        {step === 'map' && (
          <div>
            <h3 className="text-foreground mb-4">Map Columns</h3>
            <div className="space-y-2 mb-6">
              <div className="grid grid-cols-3 gap-2 items-center text-sm text-muted-foreground">
                <div className="bg-secondary p-2 rounded">CSV: "Full Name"</div>
                <ArrowRight size={14} className="mx-auto"/>
                <div className="text-primary">DB: name</div>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center text-sm text-muted-foreground">
                <div className="bg-secondary p-2 rounded">CSV: "Phone"</div>
                <ArrowRight size={14} className="mx-auto"/>
                <div className="text-primary">DB: phone</div>
              </div>
            </div>
            <button onClick={() => setStep('finish')} className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm w-full">Next</button>
          </div>
        )}

        {step === 'finish' && (
          <div className="text-center">
            <CheckCircle size={48} className="mx-auto text-success mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Import Complete!</h3>
            <button onClick={() => setStep('upload')} className="text-muted-foreground text-sm hover:text-foreground mt-4">Import Another</button>
          </div>
        )}
      </div>
    </div>
  );
};

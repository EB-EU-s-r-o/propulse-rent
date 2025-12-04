import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';

interface PlanProps {
  currentPlan: 'Free' | 'Pro' | 'Enterprise';
  usage: { properties: number; propertiesLimit: number; };
}

export const SubscriptionPlan: React.FC<PlanProps> = ({ currentPlan, usage }) => {
  const usagePercent = (usage.properties / usage.propertiesLimit) * 100;
  const isNearLimit = usagePercent > 80;

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-foreground">Property Quota</h3>
          <span className={`text-sm font-mono ${isNearLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
            {usage.properties} / {usage.propertiesLimit}
          </span>
        </div>
        <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${isNearLimit ? 'bg-destructive' : 'bg-primary'}`} 
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>
        {isNearLimit && (
          <div className="mt-3 flex items-center gap-2 text-sm text-warning bg-warning/10 p-2 rounded">
            <AlertTriangle size={16} />
            <span>You are reaching your plan limits. Upgrade to add more properties.</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <PlanCard title="Starter" price="Free" features={['Up to 5 Properties', 'Basic CRM']} active={currentPlan === 'Free'} disabled />
        <PlanCard title="Professional" price="$49" features={['Up to 50 Properties', 'Advanced CRM', 'PDF Leases']} active={currentPlan === 'Pro'} recommended />
        <PlanCard title="Enterprise" price="Custom" features={['Unlimited', 'API Access', 'White-labeling']} active={currentPlan === 'Enterprise'} />
      </div>
    </div>
  );
};

const PlanCard = ({ title, price, features, active, recommended, disabled }: { 
  title: string; price: string; features: string[]; active?: boolean; recommended?: boolean; disabled?: boolean;
}) => (
  <div className={`relative p-6 rounded-xl border flex flex-col ${active ? 'bg-primary/10 border-primary ring-1 ring-primary' : 'bg-card border-border'}`}>
    {recommended && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">RECOMMENDED</span>}
    <div className="mb-4">
      <h3 className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">{title}</h3>
      <div className="text-2xl font-bold text-foreground mt-1">{price}</div>
    </div>
    <ul className="space-y-2 mb-6 flex-1">
      {features.map((feat, i) => (
        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground"><Check size={14} className="text-primary" />{feat}</li>
      ))}
    </ul>
    <button disabled={active || disabled} className={`w-full py-2 rounded-lg font-medium text-sm transition-all ${active ? 'bg-secondary text-muted-foreground' : 'bg-foreground text-background hover:bg-foreground/90'}`}>
      {active ? 'Current Plan' : 'Upgrade'}
    </button>
  </div>
);

import { MoreHorizontal, Mail, Phone } from 'lucide-react';
import type { Lead } from '@/data/mockData';

interface LeadCardProps {
  lead: Lead;
}

const LeadCard = ({ lead }: LeadCardProps) => {
  const sourceColors: Record<string, string> = {
    WP_API: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    WalkIn: 'bg-green-500/10 text-green-400 border-green-500/20',
    Facebook: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Referral: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Google: 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  return (
    <div className="lead-card">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <img 
            src={lead.avatar} 
            alt={lead.name}
            className="w-10 h-10 rounded-full border-2 border-border object-cover"
          />
          <div>
            <h4 className="font-semibold text-foreground text-sm">{lead.name}</h4>
            {lead.company && (
              <p className="text-xs text-muted-foreground">{lead.company}</p>
            )}
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Contact Icons */}
      <div className="flex gap-2 mb-3">
        <button className="p-1.5 rounded-md bg-secondary/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
          <Mail size={14} />
        </button>
        <button className="p-1.5 rounded-md bg-secondary/50 text-muted-foreground hover:text-success hover:bg-success/10 transition-colors">
          <Phone size={14} />
        </button>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-border/50">
        <span className={`badge-status text-[10px] ${sourceColors[lead.source] || sourceColors.WP_API}`}>
          {lead.source.replace('_', ' ')}
        </span>
        <span className="text-sm font-mono font-bold text-success bg-success/10 px-2 py-0.5 rounded">
          ฿{lead.value.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default LeadCard;

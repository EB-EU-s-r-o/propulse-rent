import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  delay?: number;
}

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-primary',
  delay = 0
}: StatCardProps) => {
  const changeColors = {
    positive: 'text-success bg-success/10',
    negative: 'text-destructive bg-destructive/10',
    neutral: 'text-muted-foreground bg-muted'
  };

  return (
    <div 
      className="stat-card animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-32 h-32 gradient-glow opacity-50" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-secondary/50 ${iconColor}`}>
            <Icon size={22} />
          </div>
          {change && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${changeColors[changeType]}`}>
              {change}
            </span>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold font-mono tracking-tight text-foreground">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;

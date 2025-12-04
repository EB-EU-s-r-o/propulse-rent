import { useState, useEffect } from 'react';
import { Bell, Plus, Filter, User, Menu, Zap, Search, Command } from 'lucide-react';
import { dashboardStats, type DashboardStats } from '@/data/mockData';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header = ({ toggleSidebar, sidebarOpen }: HeaderProps) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setStats(dashboardStats), 600);

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('th-TH', { 
      style: 'currency', 
      currency: 'THB',
      notation: 'compact',
      maximumFractionDigits: 1 
    }).format(val);

  return (
    <header
      className={`fixed top-0 right-0 z-40 transition-all duration-300 border-b border-border/50
      ${isScrolled ? 'bg-background/90 backdrop-blur-xl py-3' : 'bg-background py-4'}
      ${sidebarOpen ? 'left-64' : 'left-20'}`}
    >
      <div className="px-6 flex items-center justify-between">
        {/* Left: Mobile Menu & Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors lg:hidden"
          >
            <Menu size={22} />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 bg-secondary/50 border border-border/50 rounded-lg px-4 py-2 min-w-[280px] hover:border-primary/30 transition-colors group">
            <Search size={16} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search properties, leads..."
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none flex-1"
            />
            <kbd className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded border border-border/50">
              <Command size={10} /> K
            </kbd>
          </div>
        </div>

        {/* Center: Live Stats */}
        <div className="hidden lg:flex items-center gap-8">
          {!stats ? (
            <div className="flex gap-6 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-1">
                  <div className="h-3 w-16 bg-secondary rounded" />
                  <div className="h-5 w-12 bg-secondary rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-8 animate-fade-in">
              <StatItem label="Properties" value={stats.totalProperties} />
              <StatItem label="Active Units" value={stats.activeUnits} className="text-success" />
              <StatItem label="New Leads" value={stats.totalLeads} className="text-primary" />
              <StatItem label="Revenue" value={formatCurrency(stats.monthlyRevenue)} className="text-warning" />
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* New Lead Button */}
          <button className="hidden sm:flex items-center gap-2 gradient-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-glow hover:opacity-90">
            <Plus size={16} />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground/75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-foreground" />
            </span>
            New Lead
          </button>

          <IconButton icon={<Zap size={18} />} label="Quick Actions" />
          <IconButton icon={<Filter size={18} />} label="Filters" />

          <div className="relative">
            <IconButton icon={<Bell size={18} />} label="Notifications" />
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background" />
          </div>

          <div className="h-6 w-px bg-border mx-1" />

          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center overflow-hidden">
              <User size={18} />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

const StatItem = ({ 
  label, 
  value, 
  className = 'text-foreground' 
}: { 
  label: string; 
  value: string | number; 
  className?: string;
}) => (
  <div className="flex flex-col items-start">
    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
    <span className={`font-mono text-sm font-bold ${className}`}>{value}</span>
  </div>
);

const IconButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button
    className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
    aria-label={label}
    title={label}
  >
    {icon}
  </button>
);

export default Header;

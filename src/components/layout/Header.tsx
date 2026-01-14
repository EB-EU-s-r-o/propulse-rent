import React, { useState, useEffect } from 'react';
import { Bell, Plus, Filter, User, Menu, Zap, Search, Command, Moon, Sun } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { UserDropdown } from './UserDropdown';
import { useTheme } from '@/hooks/useTheme';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header = ({ toggleSidebar, sidebarOpen }: HeaderProps) => {
  const {
    totalProperties,
    activeUnits,
    totalLeads,
    monthlyRevenue,
    isLoading,
    fetchStats
  } = useDashboardStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    fetchStats();

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchStats]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-profile-trigger') && !target.closest('.user-dropdown-container')) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      className={`fixed top-0 right-0 z-40 transition-all duration-300 border-b border-border
      ${isScrolled ? 'bg-white py-3' : 'bg-white py-4'}
      ${sidebarOpen ? 'left-64' : 'left-20'}`}
    >
      <div className="px-6 flex items-center justify-between">
        {/* Left: Mobile Menu & Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            title="Toggle sidebar"
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-none transition-colors lg:hidden"
          >
            <Menu size={22} />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 bg-white border border-input rounded-none px-4 py-2 min-w-[280px] hover:border-black transition-colors group focus-within:border-black focus-within:ring-0">
            <Search size={16} className="text-muted-foreground group-focus-within:text-black transition-colors" />
            <input
              type="text"
              placeholder="Search properties, leads..."
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none flex-1"
            />
            <kbd className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-none border border-border font-mono">
              <Command size={10} /> K
            </kbd>
          </div>
        </div>

        {/* Center: Live Stats */}
        <div className="hidden xl:flex items-center gap-8">
          {isLoading ? (
            <div className="flex gap-6 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-1">
                  <div className="h-3 w-16 bg-secondary rounded-none" />
                  <div className="h-5 w-12 bg-secondary rounded-none" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-8 animate-in fade-in duration-500">
              <StatItem label="Properties" value={totalProperties} />
              <StatItem label="Active Units" value={activeUnits} className="text-black" />
              <StatItem label="New Leads" value={totalLeads} className="text-black" />
              <StatItem label="Revenue" value={formatCurrency(monthlyRevenue)} className="text-black" />
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* New Lead Button */}
          <button className="hidden sm:flex items-center gap-2 bg-black text-white px-4 py-2 rounded-none text-sm font-medium transition-all hover:bg-black/90 active:scale-95">
            <Plus size={16} />
            New Lead
          </button>

          <div className="h-8 w-px bg-border mx-2" />

          <ThemeToggle />
          <IconButton icon={<Zap size={18} />} label="Quick Actions" />
          <IconButton icon={<Filter size={18} />} label="Filters" />

          <div className="relative">
            <IconButton icon={<Bell size={18} />} label="Notifications" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-black ring-2 ring-white" />
          </div>

          <div className="h-8 w-px bg-border mx-2" />

          {/* User Profile Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              aria-label="User menu"
              className={`user-profile-trigger flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 ${isUserDropdownOpen ? 'text-foreground' : ''}`}
            >
              <div className={`w-9 h-9 rounded-none bg-secondary border border-border flex items-center justify-center overflow-hidden transition-all ${isUserDropdownOpen ? 'border-black' : ''}`}>
                <User size={18} className={isUserDropdownOpen ? 'text-black' : ''} />
              </div>
            </button>

            {/* User Dropdown Component */}
            <div className="user-dropdown-container">
              <UserDropdown
                isOpen={isUserDropdownOpen}
                onClose={() => setIsUserDropdownOpen(false)}
                user={{
                  name: "Admin User",
                  role: "Administrator",
                  avatar: "https://ui-avatars.com/api/?name=Admin&background=000000&color=fff"
                }}
              />
            </div>
          </div>
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
  <div className="flex flex-col items-start group cursor-default">
    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider group-hover:text-foreground transition-colors">{label}</span>
    <span className={`font-mono text-sm font-bold ${className} group-hover:scale-110 transition-transform origin-left`}>{value}</span>
  </div>
);

const IconButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button
    className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all hover:scale-110 active:scale-95"
    aria-label={label}
    title={label}
  >
    {icon}
  </button>
);

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all hover:scale-110 active:scale-95"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default Header;

import { 
  LayoutDashboard, 
  Building2, 
  LayoutGrid, 
  Users, 
  Zap, 
  Briefcase, 
  PieChart, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  LogOut,
  CreditCard
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Properties', icon: Building2, href: '/properties' },
  { name: 'Pipeline', icon: LayoutGrid, href: '/pipeline', badge: 9 },
  { name: 'Leads', icon: Users, href: '/leads', badge: 5 },
  { name: 'Deals', icon: Zap, href: '/deals' },
  { name: 'Payments', icon: CreditCard, href: '/payments', badge: 2 },
  { name: 'Reports', icon: PieChart, href: '/reports' },
];

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50 flex flex-col
      ${isOpen ? 'w-64' : 'w-20'}`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
            <span className="font-bold text-primary-foreground text-lg">R</span>
          </div>
          {isOpen && (
            <span className="text-xl font-bold tracking-tight text-foreground animate-fade-in">
              RENT<span className="text-primary">2026</span>
            </span>
          )}
        </Link>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-20 bg-secondary border border-border text-muted-foreground rounded-full p-1.5 hover:text-foreground hover:bg-primary hover:border-primary transition-all z-50"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.href || 
            (item.href !== '/' && currentPath.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`nav-item group relative ${isActive ? 'active' : ''}`}
            >
              <Icon
                size={20}
                className={`${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'} transition-colors flex-shrink-0`}
              />

              {isOpen && (
                <span className="truncate animate-fade-in">{item.name}</span>
              )}

              {/* Badge */}
              {item.badge && (
                isOpen ? (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary ring-2 ring-sidebar" />
                )
              )}

              {/* Tooltip */}
              {!isOpen && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-lg border border-border transition-opacity">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        <Link
          to="/settings"
          className="nav-item group"
        >
          <Settings size={20} className="text-muted-foreground group-hover:text-foreground" />
          {isOpen && <span>Settings</span>}
        </Link>
        <button className="nav-item group w-full text-destructive hover:bg-destructive/10">
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

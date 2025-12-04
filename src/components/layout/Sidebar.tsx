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
      className={`fixed left-0 top-0 h-screen bg-white border-r border-border transition-all duration-300 z-50 flex flex-col
      ${isOpen ? 'w-64' : 'w-20'}`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white rounded-none flex items-center justify-center">
            <span className="font-bold text-lg">R</span>
          </div>
          {isOpen && (
            <span className="text-xl font-bold tracking-tight text-black animate-fade-in">
              ROOF<span className="font-light">21</span>
            </span>
          )}
        </Link>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-20 bg-white border border-border text-muted-foreground rounded-none p-1.5 hover:text-black hover:border-black transition-all z-50"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-0 py-6 space-y-0 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.href ||
            (item.href !== '/' && currentPath.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`nav-item group relative ${isActive ? 'active bg-secondary/50 border-l-2 border-black' : 'hover:bg-secondary/30 border-l-2 border-transparent'}`}
            >
              <Icon
                size={20}
                className={`${isActive ? 'text-black' : 'text-muted-foreground group-hover:text-black'} transition-colors flex-shrink-0 ml-3`}
              />

              {isOpen && (
                <span className={`truncate animate-fade-in ml-3 ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.name}</span>
              )}

              {/* Badge */}
              {item.badge && (
                isOpen ? (
                  <span className="ml-auto mr-3 bg-black text-white text-xs font-bold px-2 py-0.5 rounded-none">
                    {item.badge}
                  </span>
                ) : (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-black" />
                )
              )}

              {/* Tooltip */}
              {!isOpen && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-black text-white text-xs rounded-none opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-lg transition-opacity">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-0 py-4 border-t border-border space-y-0">
        <Link
          to="/settings"
          className="nav-item group hover:bg-secondary/30 border-l-2 border-transparent"
        >
          <Settings size={20} className="text-muted-foreground group-hover:text-black ml-3" />
          {isOpen && <span className="ml-3 font-medium">Settings</span>}
        </Link>
        <button className="nav-item group w-full text-destructive hover:bg-destructive/10 border-l-2 border-transparent">
          <LogOut size={20} className="ml-3" />
          {isOpen && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  CreditCard,
  ArrowRight,
  Calendar
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import PropertyCard from '@/components/dashboard/PropertyCard';
import KanbanBoard from '@/components/dashboard/KanbanBoard';
import RecentPayments from '@/components/dashboard/RecentPayments';
import MiniChart from '@/components/dashboard/MiniChart';
import { 
  properties, 
  leads, 
  payments, 
  dashboardStats 
} from '@/data/mockData';

// Sample chart data
const revenueData = [
  { value: 3200000 },
  { value: 3800000 },
  { value: 3500000 },
  { value: 4100000 },
  { value: 3900000 },
  { value: 4250000 },
  { value: 4500000 },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 gradient-primary rounded-xl animate-pulse flex items-center justify-center">
            <span className="font-bold text-primary-foreground text-xl">R</span>
          </div>
          <p className="text-muted-foreground text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-2 rounded-lg border border-border/50">
          <Calendar size={16} />
          <span className="font-mono">December 2025</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Properties"
          value={dashboardStats.totalProperties}
          change="+3 this month"
          changeType="positive"
          icon={Building2}
          iconColor="text-primary"
          delay={0}
        />
        <StatCard
          title="Active Units"
          value={dashboardStats.activeUnits}
          change={`${Math.round(dashboardStats.occupancyRate * 100)}% occupied`}
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-success"
          delay={100}
        />
        <StatCard
          title="Total Leads"
          value={dashboardStats.totalLeads}
          change="+12 this week"
          changeType="positive"
          icon={Users}
          iconColor="text-warning"
          delay={200}
        />
        <StatCard
          title="Monthly Revenue"
          value={`฿${(dashboardStats.monthlyRevenue / 1000000).toFixed(1)}M`}
          change="+8.2%"
          changeType="positive"
          icon={CreditCard}
          iconColor="text-purple-400"
          delay={300}
        />
      </div>

      {/* Revenue Chart */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Revenue Trend</h2>
            <p className="text-sm text-muted-foreground">Last 7 months performance</p>
          </div>
          <span className="text-2xl font-bold font-mono text-success">
            ฿{(dashboardStats.monthlyRevenue / 1000000).toFixed(2)}M
          </span>
        </div>
        <MiniChart data={revenueData} height={100} />
      </div>

      {/* Properties Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Featured Properties</h2>
            <p className="text-sm text-muted-foreground">Your top performing properties</p>
          </div>
          <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
            View All <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.slice(0, 6).map((property, index) => (
            <PropertyCard key={property.id} property={property} delay={index * 100} />
          ))}
        </div>
      </section>

      {/* Lead Pipeline */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Lead Pipeline</h2>
            <p className="text-sm text-muted-foreground">Track your sales pipeline</p>
          </div>
          <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
            Open CRM <ArrowRight size={16} />
          </button>
        </div>
        <KanbanBoard leads={leads} />
      </section>

      {/* Recent Payments */}
      <section>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Recent Payments</h2>
              <p className="text-sm text-muted-foreground">Latest transactions</p>
            </div>
            <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
              View Ledger <ArrowRight size={16} />
            </button>
          </div>
          <RecentPayments payments={payments} />
        </div>
      </section>
    </div>
  );
};

export default Index;

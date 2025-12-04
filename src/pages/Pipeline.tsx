import { Plus, Filter, Download } from 'lucide-react';
import KanbanBoard from '@/components/dashboard/KanbanBoard';
import { leads } from '@/data/mockData';

const Pipeline = () => {
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const wonDeals = leads.filter(l => l.stage === 'Won');
  const wonValue = wonDeals.reduce((sum, lead) => sum + lead.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Pipeline</h1>
          <p className="text-muted-foreground mt-1">Manage your lead pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground bg-secondary/50 border border-border/50 rounded-lg transition-colors">
            <Download size={16} />
            Export
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground bg-secondary/50 border border-border/50 rounded-lg transition-colors">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-2 gradient-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium shadow-glow hover:opacity-90 transition-all">
            <Plus size={18} />
            Add Lead
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card !p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Leads</p>
          <p className="text-2xl font-bold font-mono text-foreground">{leads.length}</p>
        </div>
        <div className="stat-card !p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Pipeline Value</p>
          <p className="text-2xl font-bold font-mono text-primary">฿{(totalValue / 1000).toFixed(0)}K</p>
        </div>
        <div className="stat-card !p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Won Deals</p>
          <p className="text-2xl font-bold font-mono text-success">{wonDeals.length}</p>
        </div>
        <div className="stat-card !p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Won Value</p>
          <p className="text-2xl font-bold font-mono text-success">฿{(wonValue / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Kanban */}
      <KanbanBoard leads={leads} />
    </div>
  );
};

export default Pipeline;

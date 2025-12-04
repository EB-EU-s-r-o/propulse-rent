import { useState } from 'react';
import { Plus } from 'lucide-react';
import LeadCard from './LeadCard';
import type { Lead } from '@/data/mockData';

interface KanbanBoardProps {
  leads: Lead[];
}

const stages = [
  { id: 'New', label: 'New', color: 'bg-blue-500' },
  { id: 'Qualified', label: 'Qualified', color: 'bg-purple-500' },
  { id: 'Proposal', label: 'Proposal', color: 'bg-yellow-500' },
  { id: 'Negotiation', label: 'Negotiation', color: 'bg-orange-500' },
  { id: 'Won', label: 'Won', color: 'bg-green-500' },
  { id: 'Lost', label: 'Lost', color: 'bg-red-500' },
];

const KanbanBoard = ({ leads }: KanbanBoardProps) => {
  const [localLeads] = useState(leads);

  const getLeadsByStage = (stage: string) => 
    localLeads.filter(lead => lead.stage === stage);

  const getTotalValue = (stageLeads: Lead[]) =>
    stageLeads.reduce((sum, lead) => sum + lead.value, 0);

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {stages.map((stage) => {
          const stageLeads = getLeadsByStage(stage.id);
          const totalValue = getTotalValue(stageLeads);

          return (
            <div key={stage.id} className="kanban-column w-[300px] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                  <h3 className="text-sm font-semibold text-foreground">{stage.label}</h3>
                  <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                    {stageLeads.length}
                  </span>
                </div>
                <button className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors">
                  <Plus size={16} />
                </button>
              </div>

              {/* Total Value */}
              {totalValue > 0 && (
                <div className="mb-3 px-1">
                  <span className="text-xs text-muted-foreground">Total: </span>
                  <span className="text-xs font-mono font-semibold text-success">
                    ฿{totalValue.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-320px)]">
                {stageLeads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}

                {stageLeads.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    <p>No leads</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;

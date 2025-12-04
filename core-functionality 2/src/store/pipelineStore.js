import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePipelineStore = create(
    persist(
        (set, get) => ({
            leads: [
                { id: '1', name: 'Sarah Wilson', company: 'TechCorp Inc.', value: 12000, owner: 'Mike Ross', email: 'sarah@techcorp.com', stageId: 'new' },
                { id: '2', name: 'James Miller', company: 'Design Studio', value: 8500, owner: 'Rachel Zane', email: 'james@design.studio', stageId: 'qualified' },
                { id: '3', name: 'Robert Chen', company: 'Global Systems', value: 45000, owner: 'Harvey Specter', email: 'r.chen@globalsys.com', stageId: 'proposal' },
                { id: '4', name: 'Emily Davis', company: 'StartUp Hub', value: 5000, owner: 'Mike Ross', email: 'emily@startup.io', stageId: 'new' },
                { id: '5', name: 'Michael Brown', company: 'Logistics Co.', value: 22000, owner: 'Louis Litt', email: 'm.brown@logistics.co', stageId: 'lost' },
            ],
            stages: [
                { id: 'new', title: 'New Lead', color: '#3B82F6' },
                { id: 'qualified', title: 'Qualified', color: '#10B981' },
                { id: 'proposal', title: 'Proposal', color: '#F59E0B' },
                { id: 'negotiation', title: 'Negotiation', color: '#8B5CF6' },
                { id: 'won', title: 'Won', color: '#059669' },
                { id: 'lost', title: 'Lost', color: '#EF4444' },
            ],

            fetchLeads: async () => {
                try {
                    const { bitrixClient } = await import('../services/bitrixClient');
                    const leads = await bitrixClient.getLeads();
                    if (leads && leads.length > 0) {
                        set({ leads });
                    }
                } catch (error) {
                    console.error('Failed to fetch leads from Bitrix:', error);
                }
            },

            moveLead: (leadId, newStageId) => set((state) => {
                const updatedLeads = state.leads.map((lead) =>
                    lead.id === leadId ? { ...lead, stageId: newStageId } : lead
                );

                // Optimistic update - in real app, we would also call API
                import('../services/bitrixClient').then(({ bitrixClient }) => {
                    bitrixClient.updateLead(leadId, { STATUS_ID: newStageId });
                });

                return { leads: updatedLeads };
            }),

            addLead: (lead) => set((state) => ({
                leads: [...state.leads, { ...lead, id: Date.now().toString(), stageId: 'new' }]
            })),

            updateLead: (updatedLead) => set((state) => ({
                leads: state.leads.map((lead) =>
                    lead.id === updatedLead.id ? updatedLead : lead
                )
            })),

            deleteLead: (leadId) => set((state) => ({
                leads: state.leads.filter((lead) => lead.id !== leadId)
            })),
        }),
        {
            name: 'pipeline-storage', // name of the item in the storage (must be unique)
        }
    )
);

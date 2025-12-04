import { usePipelineStore } from '../store/pipelineStore';

// Mock Service mimicking Bitrix API calls
export const bitrixService = {
    fetchLeads: async () => {
        // In a real scenario, this would fetch from Bitrix API
        // For now, we rely on the store's initial state or persistence
        return new Promise((resolve) => {
            setTimeout(() => {
                const leads = usePipelineStore.getState().leads;
                resolve(leads);
            }, 500);
        });
    },

    updateDealStage: async (leadId, stageId) => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                usePipelineStore.getState().moveLead(leadId, stageId);
                resolve({ success: true });
            }, 300);
        });
    },

    createDeal: async (dealData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                usePipelineStore.getState().addLead(dealData);
                resolve({ success: true, id: Date.now() });
            }, 400);
        });
    }
};

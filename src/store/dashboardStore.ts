import { create } from 'zustand';
import propertiesData from '../data/properties.json';
import unitsData from '../data/units.json';
import leadsData from '../data/leads.json';

interface DashboardStats {
    totalProperties: number;
    activeUnits: number;
    totalLeads: number;
    monthlyRevenue: number;
    isLoading: boolean;
}

interface DashboardStore extends DashboardStats {
    fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
    totalProperties: 0,
    activeUnits: 0,
    totalLeads: 0,
    monthlyRevenue: 0,
    isLoading: true,

    fetchStats: async () => {
        set({ isLoading: true });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Calculate stats from real data
        const totalProperties = propertiesData.length;

        const activeUnits = unitsData.filter(u => u.status === 'Available').length;

        // Calculate leads (assuming leadsData structure matches pipelineStore)
        const totalLeads = leadsData.length;

        // Calculate revenue (e.g., sum of won deals or just a mock calculation based on units sold)
        // For now, let's sum up the price of 'Sold' units as "Revenue"
        const soldUnitsRevenue = unitsData
            .filter(u => u.status === 'Sold')
            .reduce((acc, curr) => acc + curr.price, 0);

        set({
            totalProperties,
            activeUnits,
            totalLeads,
            monthlyRevenue: soldUnitsRevenue,
            isLoading: false
        });
    }
}));

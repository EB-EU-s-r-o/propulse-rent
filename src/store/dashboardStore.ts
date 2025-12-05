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
    isAppReady: boolean;
    fetchStats: () => Promise<void>;
    initializeApp: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
    totalProperties: 0,
    activeUnits: 0,
    totalLeads: 0,
    monthlyRevenue: 0,
    isLoading: true,
    isAppReady: false,

    fetchStats: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Calculate stats from real data
        const totalProperties = propertiesData.length;
        const activeUnits = unitsData.filter(u => u.status === 'Available').length;
        const totalLeads = leadsData.length;
        const soldUnitsRevenue = unitsData
            .filter(u => u.status === 'Sold')
            .reduce((acc, curr) => acc + curr.price, 0);

        set({
            totalProperties,
            activeUnits,
            totalLeads,
            monthlyRevenue: soldUnitsRevenue,
        });
    },

    initializeApp: async () => {
        set({ isLoading: true, isAppReady: false });

        const minDelayPromise = new Promise(resolve => setTimeout(resolve, 1500));
        const fetchDataPromise = get().fetchStats();

        await Promise.all([minDelayPromise, fetchDataPromise]);

        set({ isLoading: false, isAppReady: true });
    }
}));

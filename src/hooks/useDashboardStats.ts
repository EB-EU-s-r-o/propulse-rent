import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/hooks/useOrg";

export interface DashboardStats {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  occupancyRate: number;
  totalLeads: number;
  openLeadValue: number;
  wonLeadValue: number;
  collectedThisMonth: number;
  pendingAmount: number;
  overdueAmount: number;
  revenueTrend: { label: string; value: number }[];
}

export const useDashboardStats = () => {
  const { orgId } = useOrg();

  return useQuery({
    queryKey: ["dashboard-stats", orgId],
    enabled: !!orgId,
    queryFn: async (): Promise<DashboardStats> => {
      const [propertiesRes, unitsRes, leadsRes, paymentsRes] = await Promise.all([
        supabase.from("properties").select("id"),
        supabase.from("units").select("id, status"),
        supabase.from("leads").select("id, stage, value"),
        supabase.from("payments").select("amount, status, due_date, paid_at"),
      ]);

      for (const res of [propertiesRes, unitsRes, leadsRes, paymentsRes]) {
        if (res.error) throw res.error;
      }

      const units = unitsRes.data ?? [];
      const leads = leadsRes.data ?? [];
      const payments = paymentsRes.data ?? [];

      const occupiedUnits = units.filter((u) => u.status === "occupied").length;
      const vacantUnits = units.filter((u) => u.status === "vacant").length;

      const now = new Date();
      const monthKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}`;
      const collectedThisMonth = payments
        .filter(
          (p) =>
            p.status === "paid" &&
            p.paid_at &&
            monthKey(new Date(p.paid_at)) === monthKey(now),
        )
        .reduce((s, p) => s + Number(p.amount), 0);

      const trend: { label: string; value: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const value = payments
          .filter(
            (p) => p.status === "paid" && p.paid_at && monthKey(new Date(p.paid_at)) === monthKey(d),
          )
          .reduce((s, p) => s + Number(p.amount), 0);
        trend.push({ label: d.toLocaleDateString("en-GB", { month: "short" }), value });
      }

      return {
        totalProperties: propertiesRes.data?.length ?? 0,
        totalUnits: units.length,
        occupiedUnits,
        vacantUnits,
        occupancyRate: units.length ? occupiedUnits / units.length : 0,
        totalLeads: leads.length,
        openLeadValue: leads
          .filter((l) => l.stage !== "won" && l.stage !== "lost")
          .reduce((s, l) => s + Number(l.value), 0),
        wonLeadValue: leads
          .filter((l) => l.stage === "won")
          .reduce((s, l) => s + Number(l.value), 0),
        collectedThisMonth,
        pendingAmount: payments
          .filter((p) => p.status === "pending")
          .reduce((s, p) => s + Number(p.amount), 0),
        overdueAmount: payments
          .filter((p) => p.status === "overdue")
          .reduce((s, p) => s + Number(p.amount), 0),
        revenueTrend: trend,
      };
    },
  });
};

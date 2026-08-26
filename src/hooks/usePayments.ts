import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useOrg } from "@/hooks/useOrg";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

export type Payment = Tables<"payments">;
export type Tenant = Tables<"tenants">;
export type Lease = Tables<"leases">;

export type PaymentRow = Payment & {
  leases:
    | (Lease & {
        tenants: { full_name: string } | null;
        units: { unit_number: string; properties: { title: string } | null } | null;
      })
    | null;
};

const fail = (action: string, error: unknown) => {
  logger.error(action, error);
  toast.error(`Could not ${action}. Please try again.`);
};

export const usePayments = () => {
  const { orgId } = useOrg();
  return useQuery({
    queryKey: ["payments", orgId],
    enabled: !!orgId,
    queryFn: async (): Promise<PaymentRow[]> => {
      const { data, error } = await supabase
        .from("payments")
        .select(
          "*, leases(*, tenants(full_name), units(unit_number, properties(title)))",
        )
        .order("due_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PaymentRow[];
    },
  });
};

export const useTenants = () => {
  const { orgId } = useOrg();
  return useQuery({
    queryKey: ["tenants", orgId],
    enabled: !!orgId,
    queryFn: async (): Promise<Tenant[]> => {
      const { data, error } = await supabase.from("tenants").select("*").order("full_name");
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useLeases = () => {
  const { orgId } = useOrg();
  return useQuery({
    queryKey: ["leases", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leases")
        .select("*, tenants(full_name), units(unit_number, properties(title))")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as (Lease & {
        tenants: { full_name: string } | null;
        units: { unit_number: string; properties: { title: string } | null } | null;
      })[];
    },
  });
};

export const usePaymentMutations = () => {
  const qc = useQueryClient();
  const { orgId } = useOrg();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["payments"] });
    qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
  };

  const create = useMutation({
    mutationFn: async (values: Omit<TablesInsert<"payments">, "organization_id">) => {
      if (!orgId) throw new Error("No organization");
      const { error } = await supabase.from("payments").insert({ ...values, organization_id: orgId });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Payment saved");
    },
    onError: (e) => fail("save the payment", e),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...values }: TablesUpdate<"payments"> & { id: string }) => {
      const { error } = await supabase.from("payments").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Payment updated");
    },
    onError: (e) => fail("update the payment", e),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("payments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Payment deleted");
    },
    onError: (e) => fail("delete the payment", e),
  });

  return { create, update, remove };
};

export const useTenantMutations = () => {
  const qc = useQueryClient();
  const { orgId } = useOrg();

  const create = useMutation({
    mutationFn: async (values: Omit<TablesInsert<"tenants">, "organization_id">) => {
      if (!orgId) throw new Error("No organization");
      const { data, error } = await supabase
        .from("tenants")
        .insert({ ...values, organization_id: orgId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tenants"] });
      toast.success("Tenant saved");
    },
    onError: (e) => fail("save the tenant", e),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tenants").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tenants"] });
      toast.success("Tenant deleted");
    },
    onError: (e) => fail("delete the tenant", e),
  });

  return { create, remove };
};

export const useLeaseMutations = () => {
  const qc = useQueryClient();
  const { orgId } = useOrg();

  const create = useMutation({
    mutationFn: async (values: Omit<TablesInsert<"leases">, "organization_id">) => {
      if (!orgId) throw new Error("No organization");
      const { data, error } = await supabase
        .from("leases")
        .insert({ ...values, organization_id: orgId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leases"] });
      qc.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Lease saved");
    },
    onError: (e) => fail("save the lease", e),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leases").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leases"] });
      toast.success("Lease deleted");
    },
    onError: (e) => fail("delete the lease", e),
  });

  return { create, remove };
};

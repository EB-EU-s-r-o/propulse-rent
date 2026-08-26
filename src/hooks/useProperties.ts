import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useOrg } from "@/hooks/useOrg";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

export type Property = Tables<"properties">;
export type Unit = Tables<"units">;
export type PropertyWithUnits = Property & { units: Unit[] };

export const useProperties = () => {
  const { orgId } = useOrg();

  return useQuery({
    queryKey: ["properties", orgId],
    enabled: !!orgId,
    queryFn: async (): Promise<PropertyWithUnits[]> => {
      const { data, error } = await supabase
        .from("properties")
        .select("*, units(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PropertyWithUnits[];
    },
  });
};

const fail = (action: string, error: unknown) => {
  logger.error(action, error);
  toast.error(`Could not ${action}. Please try again.`);
};

export const usePropertyMutations = () => {
  const qc = useQueryClient();
  const { orgId } = useOrg();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["properties"] });
    qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
  };

  const create = useMutation({
    mutationFn: async (values: Omit<TablesInsert<"properties">, "organization_id">) => {
      if (!orgId) throw new Error("No organization");
      const { data, error } = await supabase
        .from("properties")
        .insert({ ...values, organization_id: orgId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Property saved");
    },
    onError: (e) => fail("save the property", e),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...values }: TablesUpdate<"properties"> & { id: string }) => {
      const { error } = await supabase.from("properties").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Property updated");
    },
    onError: (e) => fail("update the property", e),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Property deleted");
    },
    onError: (e) => fail("delete the property", e),
  });

  return { create, update, remove };
};

export const useUnitMutations = () => {
  const qc = useQueryClient();
  const { orgId } = useOrg();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["properties"] });
    qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    qc.invalidateQueries({ queryKey: ["units"] });
  };

  const create = useMutation({
    mutationFn: async (values: Omit<TablesInsert<"units">, "organization_id">) => {
      if (!orgId) throw new Error("No organization");
      const { error } = await supabase.from("units").insert({ ...values, organization_id: orgId });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Unit added");
    },
    onError: (e) => fail("add the unit", e),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...values }: TablesUpdate<"units"> & { id: string }) => {
      const { error } = await supabase.from("units").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Unit updated");
    },
    onError: (e) => fail("update the unit", e),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("units").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Unit deleted");
    },
    onError: (e) => fail("delete the unit", e),
  });

  return { create, update, remove };
};

export const useUnits = () => {
  const { orgId } = useOrg();
  return useQuery({
    queryKey: ["units", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("units")
        .select("*, properties(title)")
        .order("unit_number");
      if (error) throw error;
      return (data ?? []) as (Unit & { properties: { title: string } | null })[];
    },
  });
};

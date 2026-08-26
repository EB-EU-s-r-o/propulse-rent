import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Enums, Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useOrg } from "@/hooks/useOrg";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

export type Lead = Tables<"leads">;
export type LeadStage = Enums<"lead_stage">;

export const LEAD_STAGES: { id: LeadStage; label: string; color: string }[] = [
  { id: "new", label: "New", color: "bg-sky-500" },
  { id: "contacted", label: "Contacted", color: "bg-violet-500" },
  { id: "viewing", label: "Viewing", color: "bg-amber-400" },
  { id: "offer", label: "Offer", color: "bg-orange-400" },
  { id: "won", label: "Won", color: "bg-emerald-500" },
  { id: "lost", label: "Lost", color: "bg-rose-500" },
];

export const useLeads = () => {
  const { orgId } = useOrg();
  return useQuery({
    queryKey: ["leads", orgId],
    enabled: !!orgId,
    queryFn: async (): Promise<Lead[]> => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("position", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
};

const fail = (action: string, error: unknown) => {
  logger.error(action, error);
  toast.error(`Could not ${action}. Please try again.`);
};

export const useLeadMutations = () => {
  const qc = useQueryClient();
  const { orgId } = useOrg();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["leads"] });
    qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
  };

  const create = useMutation({
    mutationFn: async (values: Omit<TablesInsert<"leads">, "organization_id">) => {
      if (!orgId) throw new Error("No organization");
      const { error } = await supabase.from("leads").insert({ ...values, organization_id: orgId });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Lead saved");
    },
    onError: (e) => fail("save the lead", e),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...values }: TablesUpdate<"leads"> & { id: string }) => {
      const { error } = await supabase.from("leads").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Lead updated");
    },
    onError: (e) => fail("update the lead", e),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Lead deleted");
    },
    onError: (e) => fail("delete the lead", e),
  });

  /** Optimistic stage change used by the Kanban drag & drop. */
  const moveStage = useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: LeadStage }) => {
      const { error } = await supabase.from("leads").update({ stage }).eq("id", id);
      if (error) throw error;
    },
    onMutate: async ({ id, stage }) => {
      const key = ["leads", orgId];
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<Lead[]>(key);
      qc.setQueryData<Lead[]>(key, (old) =>
        (old ?? []).map((l) => (l.id === id ? { ...l, stage } : l)),
      );
      return { previous, key };
    },
    onError: (e, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(ctx.key, ctx.previous);
      fail("move the lead", e);
    },
    onSettled: () => invalidate(),
  });

  return { create, update, remove, moveStage };
};

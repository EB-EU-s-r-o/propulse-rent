import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface OrgMembership {
  organizationId: string;
  organizationName: string;
  role: string;
}

/** Returns the organization the signed-in user belongs to (first membership). */
export const useOrg = () => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["org", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<OrgMembership | null> => {
      const { data, error } = await supabase
        .from("organization_members")
        .select("organization_id, role, organizations(name)")
        .order("created_at", { ascending: true })
        .limit(1);
      if (error) throw error;
      const row = data?.[0];
      if (!row) return null;
      return {
        organizationId: row.organization_id,
        organizationName:
          (row.organizations as { name: string } | null)?.name ?? "My agency",
        role: row.role as string,
      };
    },
  });

  return {
    orgId: query.data?.organizationId ?? null,
    orgName: query.data?.organizationName ?? "",
    role: query.data?.role ?? null,
    canDelete: query.data?.role === "admin" || query.data?.role === "manager",
    isLoading: query.isLoading,
  };
};

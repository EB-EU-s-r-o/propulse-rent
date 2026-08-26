-- ============ ORGANIZATIONS & MEMBERSHIP ============
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.organization_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'agent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;
GRANT ALL ON public.organizations TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organization_members TO authenticated;
GRANT ALL ON public.organization_members TO service_role;

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- helper functions (security definer, avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.current_org_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT organization_id FROM public.organization_members
  WHERE user_id = auth.uid() ORDER BY created_at LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_org_member(_org_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.organization_members
    WHERE organization_id = _org_id AND user_id = auth.uid())
$$;

CREATE OR REPLACE FUNCTION public.has_org_role(_org_id UUID, _roles app_role[])
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.organization_members
    WHERE organization_id = _org_id AND user_id = auth.uid() AND role = ANY(_roles))
$$;

CREATE POLICY "Members view their organizations" ON public.organizations
  FOR SELECT TO authenticated USING (public.is_org_member(id));
CREATE POLICY "Users create organizations" ON public.organizations
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Org admins update organization" ON public.organizations
  FOR UPDATE TO authenticated USING (public.has_org_role(id, ARRAY['admin']::app_role[]))
  WITH CHECK (public.has_org_role(id, ARRAY['admin']::app_role[]));

CREATE POLICY "Members view org membership" ON public.organization_members
  FOR SELECT TO authenticated USING (public.is_org_member(organization_id));
CREATE POLICY "Org admins manage membership" ON public.organization_members
  FOR ALL TO authenticated
  USING (public.has_org_role(organization_id, ARRAY['admin']::app_role[]))
  WITH CHECK (public.has_org_role(organization_id, ARRAY['admin']::app_role[]));

-- ============ BUSINESS ENUMS ============
CREATE TYPE public.unit_status AS ENUM ('vacant','occupied','reserved','maintenance');
CREATE TYPE public.lead_stage AS ENUM ('new','contacted','viewing','offer','won','lost');
CREATE TYPE public.payment_status AS ENUM ('paid','pending','overdue','failed');
CREATE TYPE public.lease_status AS ENUM ('active','pending','ended','cancelled');

-- ============ PROPERTIES ============
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  property_type TEXT NOT NULL DEFAULT 'multifamily',
  address TEXT,
  city TEXT,
  country TEXT,
  description TEXT,
  image_url TEXT,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  status unit_status NOT NULL DEFAULT 'vacant',
  base_rent NUMERIC(12,2) NOT NULL DEFAULT 0,
  area_sqm NUMERIC(10,2),
  rooms INTEGER,
  floor INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  kyc_status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.leases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  rent_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  deposit_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status lease_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  value NUMERIC(12,2) NOT NULL DEFAULT 0,
  stage lead_stage NOT NULL DEFAULT 'new',
  source TEXT,
  notes TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  assigned_to UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  lease_id UUID REFERENCES public.leases(id) ON DELETE SET NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EUR',
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  status payment_status NOT NULL DEFAULT 'pending',
  method TEXT,
  invoice_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.units TO authenticated;
GRANT ALL ON public.units TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenants TO authenticated;
GRANT ALL ON public.tenants TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leases TO authenticated;
GRANT ALL ON public.leases TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['properties','units','tenants','leases','leads','payments'] LOOP
    EXECUTE format('CREATE POLICY "Org members view %1$s" ON public.%1$s FOR SELECT TO authenticated USING (public.is_org_member(organization_id));', t);
    EXECUTE format('CREATE POLICY "Org members insert %1$s" ON public.%1$s FOR INSERT TO authenticated WITH CHECK (public.is_org_member(organization_id));', t);
    EXECUTE format('CREATE POLICY "Org members update %1$s" ON public.%1$s FOR UPDATE TO authenticated USING (public.is_org_member(organization_id)) WITH CHECK (public.is_org_member(organization_id));', t);
    EXECUTE format('CREATE POLICY "Org managers delete %1$s" ON public.%1$s FOR DELETE TO authenticated USING (public.has_org_role(organization_id, ARRAY[''admin'',''manager'']::app_role[]));', t);
    EXECUTE format('CREATE TRIGGER update_%1$s_updated_at BEFORE UPDATE ON public.%1$s FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();', t);
  END LOOP;
END $$;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_units_property ON public.units(property_id);
CREATE INDEX idx_leases_unit ON public.leases(unit_id);
CREATE INDEX idx_payments_lease ON public.payments(lease_id);
CREATE INDEX idx_leads_org_stage ON public.leads(organization_id, stage);

-- ============ AUTO-PROVISION ORG + ADMIN ROLE FOR NEW USERS ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  new_org_id UUID;
  dname TEXT;
BEGIN
  dname := COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1));

  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (NEW.id, dname, NEW.raw_user_meta_data ->> 'avatar_url')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.organizations (name, created_by)
  VALUES (COALESCE(NEW.raw_user_meta_data ->> 'organization_name', dname || '''s agency'), NEW.id)
  RETURNING id INTO new_org_id;

  INSERT INTO public.organization_members (organization_id, user_id, role)
  VALUES (new_org_id, NEW.id, 'admin');

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- backfill existing users
DO $$
DECLARE u RECORD; new_org_id UUID;
BEGIN
  FOR u IN SELECT p.id, COALESCE(p.display_name,'Agency') AS dn FROM public.profiles p
           WHERE NOT EXISTS (SELECT 1 FROM public.organization_members m WHERE m.user_id = p.id) LOOP
    INSERT INTO public.organizations (name, created_by) VALUES (u.dn || '''s agency', u.id) RETURNING id INTO new_org_id;
    INSERT INTO public.organization_members (organization_id, user_id, role) VALUES (new_org_id, u.id, 'admin');
    INSERT INTO public.user_roles (user_id, role) VALUES (u.id, 'admin') ON CONFLICT (user_id, role) DO NOTHING;
  END LOOP;
END $$;
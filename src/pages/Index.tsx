import { Link } from 'react-router-dom';
import {
  Building2, TrendingUp, Wallet, AlertTriangle, ArrowRight, Target, DoorOpen, Sparkles,
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useLeads, LEAD_STAGES } from '@/hooks/useLeads';
import { usePayments } from '@/hooks/usePayments';
import { useProperties } from '@/hooks/useProperties';
import { formatCompactMoney, formatMoney, formatDate } from '@/lib/format';

const Kpi = ({ label, value, sub, icon: Icon, tone = 'text-foreground' }: {
  label: string; value: string; sub: string; icon: typeof Building2; tone?: string;
}) => (
  <div className="stat-card animate-fade-in">
    <div className="flex items-center justify-between text-muted-foreground">
      <span className="text-xs uppercase tracking-widest">{label}</span>
      <Icon size={16} />
    </div>
    <div className={`mt-3 text-3xl font-bold font-mono ${tone}`}>{value}</div>
    <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
  </div>
);

const Index = () => {
  const { data: s, isLoading } = useDashboardStats();
  const { data: leads = [] } = useLeads();
  const { data: payments = [] } = usePayments();
  const { data: properties = [] } = useProperties();

  if (isLoading || !s) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="stat-card h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  const isEmpty = s.totalProperties === 0 && s.totalLeads === 0;
  const occupancy = Math.round(s.occupancyRate * 100);
  const avgRent =
    properties.flatMap((p) => p.units).reduce((a, u) => a + Number(u.base_rent), 0) /
    Math.max(1, s.totalUnits);
  const vacancyLoss = s.vacantUnits * avgRent;
  const overdue = payments.filter((p) => p.status === 'overdue').slice(0, 5);
  const hotLeads = leads
    .filter((l) => l.stage === 'offer' || l.stage === 'viewing')
    .sort((a, b) => Number(b.value) - Number(a.value))
    .slice(0, 5);

  const actions = [
    s.overdueAmount > 0 && { text: `Vymôcť dlžné nájomné ${formatMoney(s.overdueAmount)}`, to: '/payments', tone: 'text-destructive' },
    s.vacantUnits > 0 && { text: `Obsadiť ${s.vacantUnits} voľných jednotiek (−${formatMoney(vacancyLoss)}/mes.)`, to: '/properties', tone: 'text-warning' },
    hotLeads.length > 0 && { text: `Uzavrieť ${hotLeads.length} horúcich obchodov`, to: '/pipeline', tone: 'text-success' },
  ].filter(Boolean) as { text: string; to: string; tone: string }[];

  return (
    <div className="space-y-6">
      {/* Executive briefing */}
      <section className="stat-card relative overflow-hidden">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Owner Command Center</p>
        <h1 className="mt-2 text-3xl md:text-5xl font-bold text-foreground leading-tight">
          Portfólio {formatCompactMoney(s.openLeadValue + s.wonLeadValue)} v obchode.
          <span className="block text-muted-foreground font-light">
            {occupancy}% obsadenosť · {formatCompactMoney(s.collectedThisMonth)} vybraté tento mesiac
          </span>
        </h1>
        {actions.length > 0 && (
          <div className="mt-6 grid gap-2 md:grid-cols-3">
            {actions.map((a) => (
              <Link key={a.text} to={a.to} className="group flex items-center justify-between border border-border bg-secondary/40 px-4 py-3 hover:border-foreground transition-colors">
                <span className={`text-sm font-medium ${a.tone}`}>{a.text}</span>
                <ArrowRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        )}
      </section>

      {isEmpty && (
        <section className="stat-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="text-primary" />
            <div>
              <h2 className="font-semibold text-foreground">Začnite pridaním prvej nehnuteľnosti</h2>
              <p className="text-sm text-muted-foreground">Command center sa naplní reálnymi číslami hneď ako pridáte dáta.</p>
            </div>
          </div>
          <Link to="/properties" className="bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold">Pridať nehnuteľnosť</Link>
        </section>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Vybraté" value={formatCompactMoney(s.collectedThisMonth)} sub="tento mesiac" icon={Wallet} tone="text-success" />
        <Kpi label="Po splatnosti" value={formatCompactMoney(s.overdueAmount)} sub={`čaká ${formatCompactMoney(s.pendingAmount)}`} icon={AlertTriangle} tone={s.overdueAmount ? 'text-destructive' : 'text-foreground'} />
        <Kpi label="Obsadenosť" value={`${occupancy}%`} sub={`${s.occupiedUnits}/${s.totalUnits} jednotiek · ${s.totalProperties} objektov`} icon={Building2} />
        <Kpi label="Pipeline" value={formatCompactMoney(s.openLeadValue)} sub={`${s.totalLeads} leadov · vyhraté ${formatCompactMoney(s.wonLeadValue)}`} icon={Target} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="stat-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2"><TrendingUp size={16} /> Cashflow — 6 mesiacov</h2>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={s.revenueTrend}>
                <defs>
                  <linearGradient id="cf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v: number) => formatMoney(v)}
                  contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--popover-foreground))' }}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#cf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="stat-card">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4"><DoorOpen size={16} /> Strata z neobsadenosti</h2>
          <div className="text-3xl font-bold font-mono text-warning">−{formatMoney(vacancyLoss)}</div>
          <p className="text-xs text-muted-foreground mt-1">mesačne · {s.vacantUnits} voľných jednotiek</p>
          <div className="mt-6 h-2 bg-secondary">
            <div className="h-full bg-primary transition-all" style={{ width: `${occupancy}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{occupancy}% obsadené</p>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="stat-card">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold text-foreground">Horúce obchody</h2>
            <Link to="/pipeline" className="text-sm text-primary flex items-center gap-1">Pipeline <ArrowRight size={14} /></Link>
          </div>
          {hotLeads.length === 0 ? <p className="text-sm text-muted-foreground">Žiadne obchody v štádiu obhliadky alebo ponuky.</p> : (
            <ul className="divide-y divide-border">
              {hotLeads.map((l) => {
                const st = LEAD_STAGES.find((x) => x.id === l.stage);
                return (
                  <li key={l.id} className="py-2 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-foreground"><span className={`w-2 h-2 ${st?.color}`} />{l.name}</span>
                    <span className="font-mono text-foreground">{formatMoney(Number(l.value))}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="stat-card">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold text-foreground">Dlžníci</h2>
            <Link to="/payments" className="text-sm text-primary flex items-center gap-1">Platby <ArrowRight size={14} /></Link>
          </div>
          {overdue.length === 0 ? <p className="text-sm text-muted-foreground">Všetko zaplatené načas.</p> : (
            <ul className="divide-y divide-border">
              {overdue.map((p) => (
                <li key={p.id} className="py-2 flex items-center justify-between text-sm">
                  <span className="text-foreground">{p.leases?.tenants?.full_name ?? '—'} <span className="text-muted-foreground">· {formatDate(p.due_date)}</span></span>
                  <span className="font-mono text-destructive">{formatMoney(Number(p.amount))}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;

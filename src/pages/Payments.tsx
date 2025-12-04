import { useState } from 'react';
import { Download, FileText, Filter, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { payments } from '@/data/mockData';

const Payments = () => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(payments.length / rowsPerPage);
  const paginatedPayments = payments.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = payments.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0);

  const statusColors: Record<string, string> = {
    Paid: 'badge-available',
    Pending: 'badge-reserved',
    Overdue: 'badge-maintenance'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground mt-1">Track all rent payments and invoices</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground bg-secondary/50 border border-border/50 rounded-lg transition-colors">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground bg-secondary/50 border border-border/50 rounded-lg transition-colors">
            <FileText size={16} />
            CSV
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground bg-secondary/50 border border-border/50 rounded-lg transition-colors">
            <Download size={16} />
            PDF
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card !p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Received</p>
          <p className="text-3xl font-bold font-mono text-success">฿{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="stat-card !p-5">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-3xl font-bold font-mono text-warning">฿{pendingAmount.toLocaleString()}</p>
        </div>
        <div className="stat-card !p-5">
          <p className="text-sm text-muted-foreground mb-1">Overdue</p>
          <p className="text-3xl font-bold font-mono text-destructive">฿{overdueAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      <div className="stat-card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tenant</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unit</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Method</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedPayments.map((payment, index) => (
                <tr 
                  key={payment.id}
                  className="hover:bg-secondary/20 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-foreground">{payment.tenant}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-muted-foreground">{payment.unit}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-mono text-muted-foreground">{payment.date}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-mono font-semibold text-foreground">
                      ฿{payment.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-muted-foreground">{payment.method}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`badge-status ${statusColors[payment.status]}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <a href="#" className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors">
                      {payment.invoice}
                      <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
          <span className="text-sm text-muted-foreground">
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, payments.length)} of {payments.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-muted-foreground font-mono">
              {page + 1} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;

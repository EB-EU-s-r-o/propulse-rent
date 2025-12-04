import { ExternalLink, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Payment } from '@/data/mockData';
import { useEffect, useRef } from 'react';

interface RecentPaymentsProps {
  payments: Payment[];
}

const RecentPayments = ({ payments }: RecentPaymentsProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tenant</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unit</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Method</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Invoice</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {payments.map((payment, index) => (
            <PaymentRow key={payment.id} payment={payment} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PaymentRow = ({ payment, index }: { payment: Payment; index: number }) => {
  const rowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (rowRef.current) {
      rowRef.current.style.setProperty('--delay', `${index * 50}ms`);
    }
  }, [index]);

  const statusColors: Record<string, string> = {
    Paid: 'badge-available',
    Pending: 'badge-reserved',
    Overdue: 'badge-maintenance'
  };

  const methodIcons: Record<string, React.ReactNode> = {
    Stripe: <StripeIcon />,
    'Bank Transfer': <BankIcon />,
    Cash: <CashIcon />
  };

  return (
    <tr
      ref={rowRef}
      className="hover:bg-secondary/30 transition-colors animate-fade-in"
    >
      <td className="py-4 px-4">
        <span className="text-sm font-medium text-foreground">{payment.tenant}</span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-muted-foreground">{payment.unit}</span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm font-mono text-muted-foreground">{payment.date}</span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm font-mono font-semibold text-foreground">
          ฿{payment.amount.toLocaleString()}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          {methodIcons[payment.method]}
          <span className="text-sm text-muted-foreground">{payment.method}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className={`badge-status ${statusColors[payment.status]}`}>
          {payment.status}
        </span>
      </td>
      <td className="py-4 px-4 text-right">
        <a
          href="#"
          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          {payment.invoice}
          <ExternalLink size={12} />
        </a>
      </td>
    </tr>
  );
};

const StripeIcon = () => (
  <div className="w-5 h-5 rounded-none bg-[#635BFF]/10 flex items-center justify-center">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#635BFF">
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
    </svg>
  </div>
);

const BankIcon = () => (
  <div className="w-5 h-5 rounded-none bg-secondary flex items-center justify-center text-muted-foreground">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
    </svg>
  </div>
);

const CashIcon = () => (
  <div className="w-5 h-5 rounded-none bg-success/10 flex items-center justify-center text-success">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  </div>
);

export default RecentPayments;

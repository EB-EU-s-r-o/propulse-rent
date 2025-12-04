import React from 'react';
import { Download, CheckCircle, Clock, AlertCircle, Search, Filter } from 'lucide-react';

const mockPayments = [
    { id: 'pay_001', tenant: 'John Doe', property: 'Palm Oasis #101', amount: 35000, currency: 'THB', date: '2025-10-01', status: 'Paid', method: 'Bank Transfer' },
    { id: 'pay_002', tenant: 'Jane Smith', property: 'Sunset Villa A2', amount: 120000, currency: 'THB', date: '2025-10-02', status: 'Pending', method: 'Credit Card' },
    { id: 'pay_003', tenant: 'Robert Brown', property: 'City Condo 5F', amount: 25000, currency: 'THB', date: '2025-09-28', status: 'Overdue', method: 'Cash' },
    { id: 'pay_004', tenant: 'Alice Cooper', property: 'Palm Oasis #102', amount: 35000, currency: 'THB', date: '2025-10-05', status: 'Paid', method: 'Bank Transfer' },
    { id: 'pay_005', tenant: 'Mike Ross', property: 'Ocean View 3B', amount: 45000, currency: 'THB', date: '2025-10-03', status: 'Paid', method: 'PromptPay' },
];

const StatusBadge = ({ status }) => {
    const styles = {
        Paid: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981', icon: CheckCircle },
        Pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', icon: Clock },
        Overdue: { bg: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', icon: AlertCircle },
    };
    const style = styles[status] || styles.Pending;
    const Icon = style.icon;

    return (
        <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            borderRadius: '100px',
            background: style.bg,
            color: style.color,
            fontSize: '12px',
            fontWeight: '600'
        }}>
            <Icon size={12} />
            {status}
        </span>
    );
};

export const PaymentHistory = () => {
    return (
        <div className="payment-history fade-in">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2>Payment History</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Track all tenant payments and invoices</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary">
                        <Download size={16} /> Export
                    </button>
                    <button className="btn btn-primary">
                        <Filter size={16} /> Filter
                    </button>
                </div>
            </div>

            <div className="table-container" style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>ID</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Tenant</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Property</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Amount</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Date</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Method</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockPayments.map((payment) => (
                            <tr key={payment.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} className="table-row">
                                <td style={{ padding: '16px', fontSize: '14px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{payment.id}</td>
                                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500' }}>{payment.tenant}</td>
                                <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>{payment.property}</td>
                                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                    {payment.amount.toLocaleString()} {payment.currency}
                                </td>
                                <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>{payment.date}</td>
                                <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>{payment.method}</td>
                                <td style={{ padding: '16px' }}>
                                    <StatusBadge status={payment.status} />
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <button className="btn-icon" title="Download Invoice">
                                        <Download size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

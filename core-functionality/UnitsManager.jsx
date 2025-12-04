import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Download, Code, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { generateXMLFeed, downloadFile } from './feedGenerator';
import { generateWPExport } from './wpExporter';

export const UnitsManager = ({ units, property }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'unitNumber', direction: 'asc' });

    // Filter and Sort Logic
    const filteredUnits = useMemo(() => {
        let result = [...units];

        // Status Filter
        if (statusFilter !== 'All') {
            result = result.filter(u => u.status === statusFilter);
        }

        // Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(u =>
                u.unitNumber.toLowerCase().includes(lowerTerm) ||
                u.type.toLowerCase().includes(lowerTerm)
            );
        }

        // Sort
        if (sortConfig.key) {
            result.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return result;
    }, [units, searchTerm, statusFilter, sortConfig]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getStatusBadge = (status) => {
        const styles = {
            Available: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981', icon: CheckCircle },
            Reserved: { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', icon: AlertCircle },
            Sold: { bg: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', icon: XCircle },
        };
        const style = styles[status] || styles.Available;
        const Icon = style.icon;

        return (
            <span className="badge" style={{ backgroundColor: style.bg, color: style.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Icon size={12} /> {status}
            </span>
        );
    };

    // Export Handlers (Specific to this property's units)
    const handleExportXML = () => {
        const xmlContent = generateXMLFeed([property], filteredUnits);
        downloadFile(xmlContent, `${property.title.replace(/\s+/g, '_')}_feed.xml`, 'text/xml');
    };

    const handleExportWP = () => {
        const jsonContent = generateWPExport([property], filteredUnits);
        downloadFile(jsonContent, `${property.title.replace(/\s+/g, '_')}_wp_export.json`, 'application/json');
    };

    return (
        <div className="units-manager">
            <div className="units-toolbar">
                <div className="search-box">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search units..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filters">
                    <div className="filter-group">
                        <Filter size={16} />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="All">All Statuses</option>
                            <option value="Available">Available</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Sold">Sold</option>
                        </select>
                    </div>
                </div>

                <div className="actions" style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary btn-sm" onClick={handleExportXML}>
                        <Code size={14} /> XML
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={handleExportWP}>
                        <Download size={14} /> JSON
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table className="crm-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('unitNumber')} style={{ cursor: 'pointer' }}>
                                Unit No <ArrowUpDown size={12} />
                            </th>
                            <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                                Type <ArrowUpDown size={12} />
                            </th>
                            <th onClick={() => handleSort('floor')} style={{ cursor: 'pointer' }}>
                                Floor <ArrowUpDown size={12} />
                            </th>
                            <th onClick={() => handleSort('areaSqm')} style={{ cursor: 'pointer' }}>
                                Size (sqm) <ArrowUpDown size={12} />
                            </th>
                            <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                                Price <ArrowUpDown size={12} />
                            </th>
                            <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                                Status <ArrowUpDown size={12} />
                            </th>
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUnits.length > 0 ? (
                            filteredUnits.map(unit => (
                                <tr key={unit.id}>
                                    <td style={{ fontWeight: 600 }}>{unit.unitNumber}</td>
                                    <td>{unit.type}</td>
                                    <td>{unit.floor}</td>
                                    <td>{unit.areaSqm} m²</td>
                                    <td style={{ fontFamily: 'monospace' }}>
                                        {new Intl.NumberFormat('th-TH', { style: 'currency', currency: unit.currency }).format(unit.price)}
                                    </td>
                                    <td>{getStatusBadge(unit.status)}</td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{unit.view}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                                    No units found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="units-footer" style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)' }}>
                Showing {filteredUnits.length} of {units.length} units
            </div>
        </div>
    );
};

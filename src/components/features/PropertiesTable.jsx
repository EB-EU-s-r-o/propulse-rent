import React from 'react';
import { MapPin, Building, Home, MoreVertical, Edit3, Trash2, Eye } from 'lucide-react';

export const PropertiesTable = ({ properties, onEdit, onDelete }) => {
    return (
        <div className="table-container">
            <table className="crm-table">
                <thead>
                    <tr>
                        <th>Property Name</th>
                        <th>Type</th>
                        <th>Location</th>
                        <th>Total Units</th>
                        <th>Available</th>
                        <th>Price Range</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {properties.map((property) => (
                        <tr key={property.id}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="avatar" style={{ borderRadius: '4px', width: '32px', height: '32px', overflow: 'hidden' }}>
                                        {property.images && property.images.length > 0 ? (
                                            <img src={property.images[0]} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <Building size={16} />
                                        )}
                                    </div>
                                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{property.title}</span>
                                </div>
                            </td>
                            <td>{property.type}</td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <MapPin size={14} style={{ color: 'var(--text-tertiary)' }} />
                                    {property.location.city}, {property.location.area}
                                </div>
                            </td>
                            <td>{property.stats.totalUnits}</td>
                            <td>
                                <span className={`badge ${property.stats.availableUnits > 0 ? 'badge-success' : 'badge-warning'}`}
                                    style={{
                                        backgroundColor: property.stats.availableUnits > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: property.stats.availableUnits > 0 ? '#10B981' : '#F59E0B'
                                    }}>
                                    {property.stats.availableUnits} units
                                </span>
                            </td>
                            <td>{property.stats.priceRange}</td>
                            <td>
                                <span className="badge" style={{
                                    backgroundColor: property.status === 'Active' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                                    color: property.status === 'Active' ? '#3B82F6' : '#9CA3AF'
                                }}>
                                    {property.status}
                                </span>
                            </td>
                            <td>
                                <div className="row-actions">
                                    <button onClick={() => onEdit(property)} data-tooltip="Edit">
                                        <Edit3 size={14} />
                                    </button>
                                    <button className="danger" onClick={() => onDelete(property.id)} data-tooltip="Delete">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

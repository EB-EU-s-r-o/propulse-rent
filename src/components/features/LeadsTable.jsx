import React from 'react';
import { Edit3, Trash2, Zap, MoreVertical } from 'lucide-react';

export const LeadsTable = ({ leads, stages, onEdit, onDelete, onConvert }) => {
    const getStage = (stageId) => stages?.find(s => s.id === stageId) || { title: stageId, color: '#999' };

    return (
        <div className="table-container">
            <table className="crm-table">
                <thead>
                    <tr>
                        <th style={{ width: '40px' }}><input type="checkbox" /></th>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Value</th>
                        <th>Owner</th>
                        <th style={{ width: '100px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.map((lead) => {
                        const stage = getStage(lead.stageId);
                        return (
                            <tr key={lead.id}>
                                <td><input type="checkbox" /></td>
                                <td>
                                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{lead.name}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{lead.email}</div>
                                </td>
                                <td>{lead.company}</td>
                                <td>
                                    <span className="badge" style={{
                                        backgroundColor: `${stage.color}20`, // 20 hex = ~12% opacity
                                        color: stage.color
                                    }}>
                                        {stage.title}
                                    </span>
                                </td>
                                <td>${lead.value.toLocaleString()}</td>
                                <td>
                                    <div className="avatar" title={lead.owner}>
                                        {lead.owner.charAt(0)}
                                    </div>
                                </td>
                                <td>
                                    <div className="row-actions">
                                        <button onClick={() => onEdit(lead)} data-tooltip="Edit">
                                            <Edit3 size={14} />
                                        </button>
                                        <button onClick={() => onConvert(lead)} data-tooltip="Convert">
                                            <Zap size={14} />
                                        </button>
                                        <button className="danger" onClick={() => onDelete(lead.id)} data-tooltip="Delete">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

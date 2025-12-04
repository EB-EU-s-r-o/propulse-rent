import React from 'react';
import {
    Shield, Box, Smartphone, Monitor, User,
    LogOut, Moon, Activity, ChevronRight, Download
} from 'lucide-react';

export const UserDropdown = ({ isOpen, user, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="glass-dropdown fade-in-up">
            {/* Header */}
            <div className="dropdown-header">
                <div className="dropdown-avatar-large">
                    <img
                        src={user?.avatar || "https://ui-avatars.com/api/?name=Admin&background=random"}
                        alt="User"
                    />
                </div>
                <div className="dropdown-user-info">
                    <h3>{user?.name || 'Admin User'}</h3>
                    <span className="role-badge">Administrator</span>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="action-grid">
                <button className="action-card" onClick={() => console.log('Security')}>
                    <Shield size={20} />
                    <span>Security</span>
                </button>
                <button className="action-card" onClick={() => console.log('Extensions')}>
                    <Box size={20} />
                    <span>Extensions</span>
                </button>
            </div>

            {/* Menu List */}
            <div className="menu-list">
                <button className="menu-item-premium">
                    <div className="menu-icon"><Smartphone size={18} /></div>
                    <span className="menu-text">Quick mobile login</span>
                    <ChevronRight size={16} className="menu-arrow" />
                </button>

                <button className="menu-item-premium">
                    <div className="menu-icon"><Monitor size={18} /></div>
                    <span className="menu-text">MacOS app</span>
                    <span className="download-badge">Download</span>
                </button>

                <button className="menu-item-premium">
                    <div className="menu-icon"><User size={18} /></div>
                    <span className="menu-text">Change account</span>
                    <ChevronRight size={16} className="menu-arrow" />
                </button>
            </div>

            {/* Footer */}
            <div className="dropdown-footer">
                <button className="footer-link"><Moon size={14} /> Theme</button>
                <button className="footer-link"><Activity size={14} /> Company pulse</button>
                <button className="footer-link logout"><LogOut size={14} /> Log out</button>
            </div>
        </div>
    );
};

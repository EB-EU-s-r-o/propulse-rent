import React from 'react';
import {
    Shield, Box, Smartphone, Monitor, User,
    LogOut, Moon, Activity, ChevronRight, Download
} from 'lucide-react';

interface UserDropdownProps {
    isOpen: boolean;
    user?: {
        name: string;
        avatar: string;
        role: string;
    };
    onClose: () => void;
}

export const UserDropdown = ({ isOpen, user, onClose }: UserDropdownProps) => {
    if (!isOpen) return null;

    return (
        <div className="absolute top-16 right-6 w-80 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-elevated z-50 animate-in fade-in slide-in-from-top-5 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-border/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                    <img
                        src={user?.avatar || "https://ui-avatars.com/api/?name=Admin&background=random"}
                        alt="User"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">{user?.name || 'Admin User'}</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {user?.role || 'Administrator'}
                    </span>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2 p-2">
                <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-secondary/50 hover:bg-secondary hover:text-primary transition-colors group">
                    <Shield size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs font-medium">Security</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-secondary/50 hover:bg-secondary hover:text-primary transition-colors group">
                    <Box size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs font-medium">Extensions</span>
                </button>
            </div>

            {/* Menu List */}
            <div className="p-2 space-y-1">
                <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors text-sm group">
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Smartphone size={16} />
                    </div>
                    <span className="flex-1 text-left">Quick mobile login</span>
                    <ChevronRight size={14} className="text-muted-foreground" />
                </button>

                <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors text-sm group">
                    <div className="p-1.5 rounded-md bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                        <Monitor size={16} />
                    </div>
                    <span className="flex-1 text-left">MacOS app</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-secondary border border-border rounded text-muted-foreground">Download</span>
                </button>

                <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors text-sm group">
                    <div className="p-1.5 rounded-md bg-secondary text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        <User size={16} />
                    </div>
                    <span className="flex-1 text-left">Change account</span>
                    <ChevronRight size={14} className="text-muted-foreground" />
                </button>
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <button className="flex items-center gap-1.5 hover:text-foreground transition-colors px-2 py-1.5 rounded hover:bg-secondary/50">
                    <Moon size={14} /> Theme
                </button>
                <button className="flex items-center gap-1.5 hover:text-foreground transition-colors px-2 py-1.5 rounded hover:bg-secondary/50">
                    <Activity size={14} /> Company pulse
                </button>
                <button className="flex items-center gap-1.5 text-destructive hover:bg-destructive/10 transition-colors px-2 py-1.5 rounded">
                    <LogOut size={14} /> Log out
                </button>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { Bell, Check, Trash2, MessageSquare, CreditCard } from 'lucide-react';

const MOCK_NOTIFS = [
  { id: '1', type: 'lead', title: 'New Lead', message: 'Somchai requested a viewing.', timestamp: '2 min ago', read: false },
  { id: '2', type: 'payment', title: 'Rent Received', message: 'Unit 12B paid ฿25,000.', timestamp: '1 hour ago', read: false },
];

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFS);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all">
        <Bell size={20} />
        {unreadCount > 0 && <span className="absolute top-1 right-1 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-background">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/50">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <div className="flex gap-2">
              <button onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))} className="p-1 hover:bg-secondary rounded text-muted-foreground"><Check size={16} /></button>
              <button onClick={() => setNotifications([])} className="p-1 hover:bg-secondary rounded text-muted-foreground"><Trash2 size={16} /></button>
            </div>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No new notifications</div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className={`p-4 border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-primary/5' : ''}`}>
                  <div className={`mt-1 p-2 rounded-full h-fit ${!notif.read ? 'bg-secondary' : 'bg-secondary/50'}`}>
                    {notif.type === 'lead' ? <MessageSquare size={14} className="text-primary"/> : <CreditCard size={14} className="text-success"/>}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-xs ${!notif.read ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>{notif.title}</h4>
                      <span className="text-[10px] text-muted-foreground">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{notif.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

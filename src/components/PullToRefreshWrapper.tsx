import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshWrapperProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
}

export const PullToRefreshWrapper: React.FC<PullToRefreshWrapperProps> = ({ children, onRefresh }) => {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const THRESHOLD = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const y = e.touches[0].clientY;
    if (window.scrollY === 0 && y > startY) setPullDistance(y - startY);
  };

  const handleTouchEnd = async () => {
    if (pullDistance > THRESHOLD) {
      setRefreshing(true);
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
      await onRefresh();
      setRefreshing(false);
    }
    setPullDistance(0);
  };

  return (
    <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} className="min-h-screen relative">
      <div 
        className="absolute top-0 left-0 w-full flex justify-center items-center pointer-events-none transition-all duration-200"
        style={{ height: refreshing ? 60 : pullDistance > 0 ? pullDistance / 2 : 0, opacity: pullDistance > 0 || refreshing ? 1 : 0 }}
      >
        <RefreshCw size={24} className={`text-primary ${refreshing ? 'animate-spin' : ''}`} style={{ transform: `rotate(${pullDistance * 2}deg)` }} />
      </div>
      <div style={{ transform: `translateY(${refreshing ? 60 : pullDistance > 0 ? pullDistance / 3 : 0}px)`, transition: refreshing ? 'transform 0.2s' : 'none' }}>
        {children}
      </div>
    </div>
  );
};

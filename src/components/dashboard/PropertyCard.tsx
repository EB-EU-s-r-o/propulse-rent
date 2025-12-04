import { MapPin, Bed, Bath, Maximize, Eye, Edit, Trash2 } from 'lucide-react';
import type { Property } from '@/data/mockData';

interface PropertyCardProps {
  property: Property;
  delay?: number;
}

const PropertyCard = ({ property, delay = 0 }: PropertyCardProps) => {
  const statusColors = {
    Active: 'badge-available',
    Maintenance: 'badge-maintenance',
    Sold: 'badge-occupied'
  };

  const occupancyPercent = Math.round(property.stats.occupancyRate * 100);

  return (
    <div 
      className="property-card group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`badge-status ${statusColors[property.status]}`}>
            {property.status}
          </span>
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-sm">
          <ActionButton icon={<Eye size={18} />} label="View" variant="secondary" />
          <ActionButton icon={<Edit size={18} />} label="Edit" variant="primary" />
          <ActionButton icon={<Trash2 size={18} />} label="Delete" variant="destructive" />
        </div>

        {/* Type Tag */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-medium bg-background/80 backdrop-blur-sm text-foreground px-2.5 py-1 rounded-full border border-border/50">
            {property.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground truncate mb-1 group-hover:text-primary transition-colors">
          {property.title}
        </h3>
        
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin size={14} className="mr-1 flex-shrink-0" />
          <span className="truncate">{property.location.city}, {property.location.district}</span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 pb-4 border-b border-border/50">
          <div className="flex items-center gap-1.5">
            <Building2Icon />
            <span>{property.stats.totalUnits} units</span>
          </div>
          <div className="flex items-center gap-1.5">
            <OccupancyIcon percent={occupancyPercent} />
            <span>{occupancyPercent}% occupied</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold font-mono text-primary">
              ฿{property.priceRange.min.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-sm"> - ฿{property.priceRange.max.toLocaleString()}</span>
            <span className="text-muted-foreground text-xs">/mo</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {property.features.slice(0, 3).map((feature) => (
            <span 
              key={feature}
              className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded"
            >
              {feature}
            </span>
          ))}
          {property.features.length > 3 && (
            <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
              +{property.features.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ 
  icon, 
  label, 
  variant 
}: { 
  icon: React.ReactNode; 
  label: string;
  variant: 'primary' | 'secondary' | 'destructive';
}) => {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
  };

  return (
    <button 
      className={`p-2.5 rounded-full transition-all ${variants[variant]}`}
      title={label}
    >
      {icon}
    </button>
  );
};

const Building2Icon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01"/>
    <path d="M16 6h.01"/>
    <path d="M12 6h.01"/>
    <path d="M12 10h.01"/>
    <path d="M12 14h.01"/>
    <path d="M16 10h.01"/>
    <path d="M16 14h.01"/>
    <path d="M8 10h.01"/>
    <path d="M8 14h.01"/>
  </svg>
);

const OccupancyIcon = ({ percent }: { percent: number }) => (
  <div className="w-3.5 h-3.5 rounded-full border-2 border-current relative overflow-hidden">
    <div 
      className="absolute bottom-0 left-0 right-0 bg-current transition-all"
      style={{ height: `${percent}%` }}
    />
  </div>
);

export default PropertyCard;

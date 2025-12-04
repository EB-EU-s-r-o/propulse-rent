import { useState } from 'react';
import { Plus, Filter, Grid, List, Search } from 'lucide-react';
import PropertyCard from '@/components/dashboard/PropertyCard';
import { properties } from '@/data/mockData';

const Properties = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Properties</h1>
          <p className="text-muted-foreground mt-1">{properties.length} properties in portfolio</p>
        </div>
        <button className="flex items-center gap-2 gradient-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-glow hover:opacity-90">
          <Plus size={18} />
          Add Property
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 bg-secondary/50 border border-border/50 rounded-lg px-4 py-2 min-w-[280px]">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none flex-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground bg-secondary/50 border border-border/50 rounded-lg transition-colors">
            <Filter size={16} />
            Filters
          </button>
          <div className="flex bg-secondary/50 border border-border/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
        {filteredProperties.map((property, index) => (
          <PropertyCard key={property.id} property={property} delay={index * 50} />
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No properties found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Properties;

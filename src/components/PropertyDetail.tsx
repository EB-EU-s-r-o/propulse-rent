import React, { useState } from 'react';
import { MapPin, Bed, Bath, Maximize, FileText, BarChart2, Home, Edit, Trash } from 'lucide-react';

type TabType = 'overview' | 'units' | 'docs' | 'analytics';

const MOCK_PROPERTY = {
  id: '1',
  title: 'The Millennium Tower',
  address: '123 Charoen Nakhon Rd, Bangkok',
  description: 'Luxury high-rise condominium overlooking the Chao Phraya river. Features state-of-the-art facilities including a sky gym, infinity pool, and private dock access.',
  images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop'],
  specs: { beds: 120, baths: 150, size: 45000 },
  units: [
    { id: 'u1', number: '12A', status: 'Available', price: '45,000' },
    { id: 'u2', number: '12B', status: 'Occupied', price: '48,000' },
    { id: 'u3', number: '14C', status: 'Maintenance', price: '55,000' },
  ]
};

export const PropertyDetail = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const property = MOCK_PROPERTY;

  return (
    <div className="bg-background min-h-screen text-foreground pb-20">
      {/* Hero */}
      <div className="relative h-64 md:h-96 w-full bg-card">
        <img src={property.images[0]} alt="Cover" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-muted-foreground">
              <MapPin size={18} className="mr-2 text-primary" />
              {property.address}
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors text-sm">
              <Edit size={16} /> Edit
            </button>
            <button className="flex items-center gap-2 bg-destructive/20 hover:bg-destructive/40 text-destructive px-4 py-2 rounded-lg font-medium transition-colors border border-destructive/20 text-sm">
              <Trash size={16} /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-border mb-6 overflow-x-auto">
            {(['overview', 'units', 'docs', 'analytics'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 flex items-center gap-2 text-sm font-medium transition-all border-b-2 capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                {tab === 'overview' && <Home size={16} />}
                {tab === 'units' && <Bed size={16} />}
                {tab === 'docs' && <FileText size={16} />}
                {tab === 'analytics' && <BarChart2 size={16} />}
                {tab}
              </button>
            ))}
          </div>

          <div className="min-h-[300px]">
            {activeTab === 'overview' && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-4">
                    <div className="p-2 bg-secondary rounded-full text-primary"><Bed size={18} /></div>
                    <div><div className="text-[10px] text-muted-foreground uppercase">Total Units</div><div className="text-lg font-bold">{property.specs.beds}</div></div>
                  </div>
                  <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-4">
                    <div className="p-2 bg-secondary rounded-full text-primary"><Maximize size={18} /></div>
                    <div><div className="text-[10px] text-muted-foreground uppercase">Total Area</div><div className="text-lg font-bold">{property.specs.size} m²</div></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </div>
            )}
            {activeTab === 'units' && (
              <div className="animate-fade-in">
                <table className="w-full text-left text-sm text-muted-foreground">
                  <thead className="bg-card text-muted-foreground">
                    <tr><th className="p-3">Unit</th><th className="p-3">Status</th><th className="p-3">Price</th></tr>
                  </thead>
                  <tbody>
                    {property.units.map(u => (
                      <tr key={u.id} className="border-b border-border hover:bg-card/50">
                        <td className="p-3 text-foreground">{u.number}</td>
                        <td className="p-3">{u.status}</td>
                        <td className="p-3">฿{u.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-wider">Occupancy Rate</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-success">92%</span>
              <span className="text-sm text-muted-foreground mb-1">Current</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full mt-2">
              <div className="bg-success h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

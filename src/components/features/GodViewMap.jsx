import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Layers, Activity, DollarSign, Users, Eye } from 'lucide-react';

// Fix for default marker icon in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const mockProperties = [
    { id: 1, title: 'Palm Oasis Villa', lat: 12.9236, lng: 100.8824, price: '฿12.5M', roi: '8.5%', occupancy: '92%' },
    { id: 2, title: 'Seaview Condo', lat: 12.9150, lng: 100.8700, price: '฿4.2M', roi: '6.2%', occupancy: '85%' },
    { id: 3, title: 'City Center Loft', lat: 12.9350, lng: 100.8900, price: '฿6.8M', roi: '7.1%', occupancy: '88%' },
    { id: 4, title: 'Beachfront Penthouse', lat: 12.8900, lng: 100.8600, price: '฿25M', roi: '9.0%', occupancy: '95%' },
];

const MapController = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 13, { duration: 2 });
    }, [center, map]);
    return null;
};

export const GodViewMap = () => {
    const [activeLayer, setActiveLayer] = useState('satellite');
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [selectedProp, setSelectedProp] = useState(null);
    const [center, setCenter] = useState([12.9236, 100.8824]); // Pattaya

    const toggleLayer = () => {
        setActiveLayer(prev => prev === 'satellite' ? 'street' : 'satellite');
    };

    return (
        <div className="god-view-container fade-in">
            <div className="map-wrapper">
                <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url={activeLayer === 'satellite'
                            ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        }
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {mockProperties.map(prop => (
                        <Marker
                            key={prop.id}
                            position={[prop.lat, prop.lng]}
                            eventHandlers={{
                                click: () => {
                                    setSelectedProp(prop);
                                    setCenter([prop.lat, prop.lng]);
                                },
                            }}
                        >
                            <Popup>
                                <div className="map-popup">
                                    <h4>{prop.title}</h4>
                                    <p className="price">{prop.price}</p>
                                    <div className="popup-stats">
                                        <span>ROI: {prop.roi}</span>
                                        <span>Occ: {prop.occupancy}</span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    <MapController center={center} />
                </MapContainer>

                {/* HUD Overlay */}
                <div className="map-hud">
                    <div className="hud-controls">
                        <button
                            className={`hud-btn ${activeLayer === 'satellite' ? 'active' : ''}`}
                            onClick={toggleLayer}
                            title="Toggle Satellite/Street"
                        >
                            <Layers size={20} />
                        </button>
                        <button
                            className={`hud-btn ${showHeatmap ? 'active' : ''}`}
                            onClick={() => setShowHeatmap(!showHeatmap)}
                            title="Toggle Heatmap"
                        >
                            <Activity size={20} />
                        </button>
                    </div>

                    {selectedProp && (
                        <div className="hud-panel fade-in">
                            <div className="hud-header">
                                <h3>{selectedProp.title}</h3>
                                <button className="close-btn" onClick={() => setSelectedProp(null)}>&times;</button>
                            </div>
                            <div className="hud-grid">
                                <div className="hud-stat">
                                    <div className="stat-icon"><DollarSign size={16} /></div>
                                    <div className="stat-info">
                                        <span className="label">Proj. Revenue</span>
                                        <span className="value">฿1.2M / yr</span>
                                    </div>
                                </div>
                                <div className="hud-stat">
                                    <div className="stat-icon"><Activity size={16} /></div>
                                    <div className="stat-info">
                                        <span className="label">ROI</span>
                                        <span className="value text-success">{selectedProp.roi}</span>
                                    </div>
                                </div>
                                <div className="hud-stat">
                                    <div className="stat-icon"><Users size={16} /></div>
                                    <div className="stat-info">
                                        <span className="label">Occupancy</span>
                                        <span className="value">{selectedProp.occupancy}</span>
                                    </div>
                                </div>
                                <div className="hud-stat">
                                    <div className="stat-icon"><Eye size={16} /></div>
                                    <div className="stat-info">
                                        <span className="label">Live Visitors</span>
                                        <span className="value text-accent">12</span>
                                    </div>
                                </div>
                            </div>
                            <div className="hud-actions">
                                <button className="btn btn-primary btn-sm btn-full">View Details</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

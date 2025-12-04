import React, { useState } from 'react';
import { X, Calendar, Check, RotateCcw } from 'lucide-react';

export const FiltersPanel = ({ isOpen, onClose }) => {
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [bedrooms, setBedrooms] = useState('any');

    const propertyTypes = ['Condo', 'Villa', 'House', 'Land', 'Commercial'];
    const amenities = ['Pool', 'Gym', 'Parking', 'Garden', 'Security', 'Sea View'];

    const toggleType = (type) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter(t => t !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    return (
        <div className={`filters-panel ${isOpen ? 'open' : ''}`}>
            <div className="filters-header">
                <h3>Advanced Filters</h3>
                <button onClick={onClose} className="close-btn">
                    <X size={20} />
                </button>
            </div>

            <div className="filters-content">
                {/* Status */}
                <div className="filter-group">
                    <label>Status</label>
                    <select className="filter-select">
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="sold">Sold</option>
                        <option value="rented">Rented</option>
                    </select>
                </div>

                {/* Property Type */}
                <div className="filter-group">
                    <label>Property Type</label>
                    <div className="tags-container">
                        {propertyTypes.map(type => (
                            <button
                                key={type}
                                className={`filter-tag ${selectedTypes.includes(type) ? 'active' : ''}`}
                                onClick={() => toggleType(type)}
                            >
                                {type}
                                {selectedTypes.includes(type) && <Check size={12} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="filter-group">
                    <label>Price Range (THB)</label>
                    <div className="range-inputs">
                        <input
                            type="number"
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                        />
                        <span className="range-separator">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                        />
                    </div>
                </div>

                {/* Bedrooms */}
                <div className="filter-group">
                    <label>Bedrooms</label>
                    <div className="segment-control">
                        {['Any', '1', '2', '3', '4+'].map(opt => (
                            <button
                                key={opt}
                                className={`segment-btn ${bedrooms === opt.toLowerCase() ? 'active' : ''}`}
                                onClick={() => setBedrooms(opt.toLowerCase())}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Amenities */}
                <div className="filter-group">
                    <label>Amenities</label>
                    <div className="checkbox-grid">
                        {amenities.map(amenity => (
                            <label key={amenity} className="checkbox-item">
                                <input type="checkbox" />
                                <span>{amenity}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Date Range */}
                <div className="filter-group">
                    <label>Added Date</label>
                    <div className="date-input-wrapper">
                        <input type="date" className="filter-input" />
                        <Calendar size={16} className="input-icon" />
                    </div>
                </div>
            </div>

            <div className="filters-footer">
                <button className="btn btn-secondary btn-full" onClick={() => {
                    setPriceRange({ min: '', max: '' });
                    setSelectedTypes([]);
                    setBedrooms('any');
                }}>
                    <RotateCcw size={16} /> Reset
                </button>
                <button className="btn btn-primary btn-full" onClick={onClose}>
                    Apply Filters
                </button>
            </div>
        </div>
    );
};

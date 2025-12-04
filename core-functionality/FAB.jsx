import React from 'react';
import { Plus } from 'lucide-react';

export const FAB = ({ onClick }) => {
    return (
        <button className="fab" onClick={onClick} title="Add Quick Note">
            <Plus size={24} />
        </button>
    );
};

import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { PipelineColumn } from './PipelineColumn';
import { PipelineCard } from './PipelineCard';
import { usePipelineStore } from '../store/pipelineStore';

export const PipelineBoard = () => {
    const { leads, stages, moveLead, fetchLeads } = usePipelineStore();
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Require slight movement to start drag (prevents accidental clicks)
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        const activeLeadId = active.id;
        const overId = over.id;

        // Find the lead being dragged
        const activeLead = leads.find(l => l.id === activeLeadId);

        if (!activeLead) return;

        // Check if dropped on a column
        const overStage = stages.find(s => s.id === overId);

        if (overStage) {
            // Dropped directly on a column
            if (activeLead.stageId !== overStage.id) {
                moveLead(activeLeadId, overStage.id);
            }
        } else {
            // Dropped on another card?
            // In a simple Kanban, we usually just care about the column.
            // If dnd-kit reports the card ID as 'over', we need to find which column that card belongs to.
            const overLead = leads.find(l => l.id === overId);
            if (overLead && activeLead.stageId !== overLead.stageId) {
                moveLead(activeLeadId, overLead.stageId);
            }
        }

        setActiveId(null);
    };

    const activeLead = activeId ? leads.find(l => l.id === activeId) : null;

    return (
        <div className="pipeline-board">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="pipeline-columns-container">
                    {stages.map((stage) => (
                        <PipelineColumn
                            key={stage.id}
                            stage={stage}
                            leads={leads.filter(l => l.stageId === stage.id)}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeLead ? <PipelineCard lead={activeLead} /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

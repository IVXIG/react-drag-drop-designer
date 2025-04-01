
import React from 'react';
import { ControlProps } from '../types/designTypes';
import ControlRenderer from './VB6Controls/ControlRenderer';
import PlaceholderControl from './VB6Controls/PlaceholderControl';
import EmptyDesignArea from './VB6Controls/EmptyDesignArea';
import { useDesignAreaInteractions } from '../hooks/useDesignAreaInteractions';

interface VB6DesignAreaProps {
  onControlsChange?: (controls: ControlProps[]) => void;
  onControlSelect?: (controlId: string | null) => void;
  selectedControlId?: string | null;
  activeTool?: string;
}

const VB6DesignArea: React.FC<VB6DesignAreaProps> = ({ 
  onControlsChange,
  onControlSelect,
  selectedControlId: externalSelectedId,
  activeTool: externalActiveTool 
}) => {
  const {
    controls,
    activeTool,
    isDraggingNew,
    newControlPosition,
    designAreaRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useDesignAreaInteractions(
    'Pointer', 
    [], 
    null, 
    onControlsChange, 
    onControlSelect, 
    externalSelectedId, 
    externalActiveTool
  );
  
  return (
    <div 
      ref={designAreaRef}
      className="vb6-design-area bg-white border border-gray-400 flex-1 relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      data-active-tool={activeTool}
    >
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }} />
      
      {controls.map(control => (
        <ControlRenderer key={control.id} control={control} />
      ))}
      
      {isDraggingNew && activeTool !== 'Pointer' && (
        <PlaceholderControl position={newControlPosition} />
      )}
      
      {controls.length === 0 && !isDraggingNew && (
        <EmptyDesignArea activeTool={activeTool} />
      )}
    </div>
  );
};

export default VB6DesignArea;

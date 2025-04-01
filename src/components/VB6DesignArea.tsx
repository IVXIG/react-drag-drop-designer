
import React from 'react';
import { ControlProps } from '../types/designTypes';
import ControlRenderer from './VB6Controls/ControlRenderer';
import PlaceholderControl from './VB6Controls/PlaceholderControl';
import EmptyDesignArea from './VB6Controls/EmptyDesignArea';
import { useDesignAreaInteractions } from '../hooks/useDesignAreaInteractions';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  const {
    controls,
    activeTool,
    isDraggingNew,
    newControlPosition,
    designAreaRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useDesignAreaInteractions(
    'Pointer', 
    [], 
    null, 
    onControlsChange, 
    onControlSelect, 
    externalSelectedId, 
    externalActiveTool
  );
  
  // Adjust the grid size for mobile devices
  const gridSize = isMobile ? '10px 10px' : '20px 20px';
  
  return (
    <div 
      ref={designAreaRef}
      className="vb6-design-area bg-white border border-gray-400 flex-1 relative overflow-auto"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      data-active-tool={activeTool}
      style={{ touchAction: isDraggingNew ? 'none' : 'auto' }}
    >
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
        backgroundSize: gridSize
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


import { useState, useRef, useEffect } from 'react';
import { ControlProps } from '../types/designTypes';
import { useControlPlacement } from './design/useControlPlacement';
import { useControlSelection } from './design/useControlSelection';
import { useControlMovement } from './design/useControlMovement';
import { useControlDeletion } from './design/useControlDeletion';

export const useDesignAreaInteractions = (
  initialActiveTool: string = 'Pointer',
  initialControls: ControlProps[] = [],
  initialSelectedId: string | null = null,
  onControlsChange?: (controls: ControlProps[]) => void,
  onControlSelect?: (controlId: string | null) => void,
  externalSelectedId?: string | null,
  externalActiveTool?: string
) => {
  const [controls, setControls] = useState<ControlProps[]>(initialControls);
  const designAreaRef = useRef<HTMLDivElement>(null);
  
  const {
    activeTool,
    isPlacingControl,
    placeNewControl
  } = useControlPlacement(initialActiveTool, designAreaRef, externalActiveTool);
  
  const {
    selectedControlId,
    handleControlClick
  } = useControlSelection(initialSelectedId, onControlSelect, externalSelectedId);
  
  const {
    isMovingControl,
    startMovingControl,
    moveControl,
    stopMovingControl
  } = useControlMovement(designAreaRef);
  
  const { handleDeleteControl } = useControlDeletion(
    selectedControlId, 
    setControls, 
    setSelectedControlId => {
      if (onControlSelect) {
        onControlSelect(null);
      }
    }
  );

  useEffect(() => {
    if (onControlsChange) {
      onControlsChange(controls);
    }
  }, [controls, onControlsChange]);
  
  const handlePointerDown = (clientX: number, clientY: number, isTouch: boolean = false) => {
    if (activeTool === 'Pointer') {
      const result = handleControlClick(clientX, clientY, controls);
      
      if (result.controlId) {
        setControls(result.updatedControls);
        
        // Find the clicked control element to get its rect for movement
        const controlElement = document.querySelector(`[data-id="${result.controlId}"]`);
        if (controlElement) {
          startMovingControl(clientX, clientY, controlElement.getBoundingClientRect());
        }
      } else if (!isTouch) {
        // Only deselect on non-touch devices (to prevent deselection on mobile when scrolling)
        setControls(result.updatedControls);
      }
    } else {
      // Handle placing a new control
      const newControl = placeNewControl(clientX, clientY, controls);
      if (newControl) {
        setControls(prev => [...prev.map(c => ({ ...c, isSelected: false })), newControl]);
      }
    }
  };
  
  const handlePointerMove = (clientX: number, clientY: number) => {
    if (isMovingControl && selectedControlId) {
      setControls(prevControls => moveControl(clientX, clientY, selectedControlId, prevControls));
    }
  };
  
  const handlePointerUp = () => {
    stopMovingControl();
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    handlePointerDown(e.clientX, e.clientY);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    handlePointerMove(e.clientX, e.clientY);
  };
  
  const handleMouseUp = () => {
    handlePointerUp();
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handlePointerDown(touch.clientX, touch.clientY, true);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      if (isMovingControl) {
        e.preventDefault(); // Prevent scrolling when moving a control
      }
      const touch = e.touches[0];
      handlePointerMove(touch.clientX, touch.clientY);
    }
  };
  
  const handleTouchEnd = () => {
    handlePointerUp();
  };

  return {
    controls,
    activeTool,
    isPlacingControl,
    selectedControlId,
    designAreaRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleDeleteControl
  };
};

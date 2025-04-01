
import { useState, useRef, useEffect } from 'react';
import { ControlProps } from '../types/designTypes';
import { getDefaultText } from '../utils/controlUtils';
import { toast } from 'sonner';

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
  const [activeTool, setActiveTool] = useState<string>(externalActiveTool || initialActiveTool);
  const [isDraggingNew, setIsDraggingNew] = useState(false);
  const [newControlPosition, setNewControlPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [selectedControlId, setSelectedControlId] = useState<string | null>(externalSelectedId || initialSelectedId);
  const [isMovingControl, setIsMovingControl] = useState(false);
  const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 });
  const designAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (externalActiveTool) {
      setActiveTool(externalActiveTool);
    }
  }, [externalActiveTool]);
  
  useEffect(() => {
    if (externalSelectedId !== undefined && externalSelectedId !== selectedControlId) {
      setSelectedControlId(externalSelectedId);
      
      setControls(prevControls => 
        prevControls.map(control => ({
          ...control,
          isSelected: control.id === externalSelectedId
        }))
      );
    }
  }, [externalSelectedId, selectedControlId]);

  useEffect(() => {
    if (onControlsChange) {
      onControlsChange(controls);
    }
  }, [controls, onControlsChange]);

  useEffect(() => {
    if (onControlSelect && selectedControlId !== externalSelectedId) {
      onControlSelect(selectedControlId);
    }
  }, [selectedControlId, onControlSelect, externalSelectedId]);
  
  const getRelativeCoordinates = (clientX: number, clientY: number) => {
    if (!designAreaRef.current) return { x: 0, y: 0 };
    
    const rect = designAreaRef.current.getBoundingClientRect();
    const scrollX = designAreaRef.current.scrollLeft;
    const scrollY = designAreaRef.current.scrollTop;
    
    return {
      x: clientX - rect.left + scrollX,
      y: clientY - rect.top + scrollY
    };
  };
  
  const handlePointerDown = (clientX: number, clientY: number, isTouch: boolean = false) => {
    if (activeTool === 'Pointer') {
      const controlElements = document.querySelectorAll('.vb6-control');
      let found = false;
      
      controlElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          const id = element.getAttribute('data-id');
          setSelectedControlId(id);
          
          setIsMovingControl(true);
          
          setMoveOffset({
            x: clientX - rect.left,
            y: clientY - rect.top
          });
          
          setControls(prevControls => 
            prevControls.map(control => ({
              ...control,
              isSelected: control.id === id
            }))
          );
          found = true;
        }
      });
      
      if (!found && !isTouch) {
        setSelectedControlId(null);
        setControls(prevControls => 
          prevControls.map(control => ({
            ...control,
            isSelected: false
          }))
        );
      }
      
      return;
    }
    
    if (designAreaRef.current) {
      const { x, y } = getRelativeCoordinates(clientX, clientY);
      
      setIsDraggingNew(true);
      setNewControlPosition({ top: y, left: x, width: 0, height: 0 });
    }
  };
  
  const handlePointerMove = (clientX: number, clientY: number) => {
    if (isDraggingNew && activeTool !== 'Pointer') {
      if (designAreaRef.current) {
        const { x, y } = getRelativeCoordinates(clientX, clientY);
        
        setNewControlPosition(prev => ({
          ...prev,
          width: Math.max(10, x - prev.left),
          height: Math.max(10, y - prev.top)
        }));
      }
    } else if (isMovingControl && selectedControlId) {
      if (designAreaRef.current) {
        const { x, y } = getRelativeCoordinates(clientX, clientY);
        
        setControls(prevControls =>
          prevControls.map(control =>
            control.id === selectedControlId
              ? { 
                  ...control, 
                  left: Math.max(0, x - moveOffset.x),
                  top: Math.max(0, y - moveOffset.y)
                }
              : control
          )
        );
      }
    }
  };
  
  const handlePointerUp = () => {
    if (isDraggingNew && activeTool !== 'Pointer') {
      const { top, left, width, height } = newControlPosition;
      
      if (width > 5 && height > 5) {
        const newControlId = `${activeTool}-${Date.now()}`;
        const newControl: ControlProps = {
          id: newControlId,
          type: activeTool,
          top,
          left,
          width,
          height,
          text: getDefaultText(activeTool, controls.length + 1),
          isSelected: true
        };
        
        setControls(prev => [...prev.map(c => ({ ...c, isSelected: false })), newControl]);
        setSelectedControlId(newControl.id);
        
        toast(`Added ${activeTool} control`);
      }
      
      setIsDraggingNew(false);
    }
    
    setIsMovingControl(false);
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
      if (isDraggingNew || isMovingControl) {
        e.preventDefault(); // Prevent scrolling when dragging
      }
      const touch = e.touches[0];
      handlePointerMove(touch.clientX, touch.clientY);
    }
  };
  
  const handleTouchEnd = () => {
    handlePointerUp();
  };
  
  const handleDeleteControl = () => {
    if (selectedControlId) {
      setControls(prevControls => prevControls.filter(control => control.id !== selectedControlId));
      setSelectedControlId(null);
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedControlId) {
        handleDeleteControl();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedControlId]);

  return {
    controls,
    activeTool,
    isDraggingNew,
    newControlPosition,
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

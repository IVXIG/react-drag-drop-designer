
import { useState } from 'react';
import { ControlProps } from '../../types/designTypes';

export const useControlMovement = (designAreaRef: React.RefObject<HTMLDivElement>) => {
  const [isMovingControl, setIsMovingControl] = useState(false);
  const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 });
  
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

  const startMovingControl = (clientX: number, clientY: number, elementRect: DOMRect) => {
    setIsMovingControl(true);
    setMoveOffset({
      x: clientX - elementRect.left,
      y: clientY - elementRect.top
    });
  };

  const moveControl = (clientX: number, clientY: number, controlId: string, controls: ControlProps[]) => {
    if (!isMovingControl || !controlId || !designAreaRef.current) {
      return controls;
    }

    const { x, y } = getRelativeCoordinates(clientX, clientY);
    
    return controls.map(control =>
      control.id === controlId
        ? { 
            ...control, 
            left: Math.max(0, x - moveOffset.x),
            top: Math.max(0, y - moveOffset.y)
          }
        : control
    );
  };

  const stopMovingControl = () => {
    setIsMovingControl(false);
  };

  return {
    isMovingControl,
    startMovingControl,
    moveControl,
    stopMovingControl
  };
};

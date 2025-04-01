
import { useState, useEffect } from 'react';
import { ControlProps } from '../../types/designTypes';
import { getDefaultText } from '../../utils/controlUtils';
import { toast } from 'sonner';

export const useControlPlacement = (
  initialActiveTool: string = 'Pointer',
  designAreaRef: React.RefObject<HTMLDivElement>,
  externalActiveTool?: string
) => {
  const [activeTool, setActiveTool] = useState<string>(externalActiveTool || initialActiveTool);
  const [isPlacingControl, setIsPlacingControl] = useState(activeTool !== 'Pointer');

  useEffect(() => {
    if (externalActiveTool) {
      setActiveTool(externalActiveTool);
      if (externalActiveTool !== 'Pointer') {
        setIsPlacingControl(true);
      } else {
        setIsPlacingControl(false);
      }
    }
  }, [externalActiveTool]);

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

  const placeNewControl = (clientX: number, clientY: number, controlsList: ControlProps[]) => {
    if (!isPlacingControl || activeTool === 'Pointer' || !designAreaRef.current) {
      return null;
    }

    const { x, y } = getRelativeCoordinates(clientX, clientY);
    
    // Create control with default size at clicked position
    const defaultWidth = activeTool === 'Label' ? 80 : 100;
    const defaultHeight = activeTool === 'Label' ? 20 : 30;
    
    const newControlId = `${activeTool}-${Date.now()}`;
    const newControl: ControlProps = {
      id: newControlId,
      type: activeTool,
      top: Math.max(0, y - defaultHeight / 2),
      left: Math.max(0, x - defaultWidth / 2),
      width: defaultWidth,
      height: defaultHeight,
      text: getDefaultText(activeTool, controlsList.length + 1),
      isSelected: true
    };
    
    toast(`Added ${activeTool} control`);
    return newControl;
  };

  return {
    activeTool,
    isPlacingControl,
    getRelativeCoordinates,
    placeNewControl
  };
};

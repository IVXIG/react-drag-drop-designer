
import { useState, useEffect } from 'react';
import { ControlProps } from '../../types/designTypes';

export const useControlSelection = (
  initialSelectedId: string | null = null,
  onControlSelect?: (controlId: string | null) => void,
  externalSelectedId?: string | null
) => {
  const [selectedControlId, setSelectedControlId] = useState<string | null>(externalSelectedId || initialSelectedId);
  
  useEffect(() => {
    if (externalSelectedId !== undefined && externalSelectedId !== selectedControlId) {
      setSelectedControlId(externalSelectedId);
    }
  }, [externalSelectedId, selectedControlId]);

  useEffect(() => {
    if (onControlSelect && selectedControlId !== externalSelectedId) {
      onControlSelect(selectedControlId);
    }
  }, [selectedControlId, onControlSelect, externalSelectedId]);

  const selectControl = (controlId: string | null, controls: ControlProps[]) => {
    setSelectedControlId(controlId);
    
    return controls.map(control => ({
      ...control,
      isSelected: control.id === controlId
    }));
  };

  const handleControlClick = (clientX: number, clientY: number, controls: ControlProps[]) => {
    const controlElements = document.querySelectorAll('.vb6-control');
    let found = false;
    let clickedControlId = null;
    
    controlElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        clickedControlId = element.getAttribute('data-id');
        found = true;
      }
    });
    
    if (found) {
      return {
        controlId: clickedControlId,
        updatedControls: selectControl(clickedControlId, controls)
      };
    } else {
      return {
        controlId: null,
        updatedControls: selectControl(null, controls)
      };
    }
  };

  return {
    selectedControlId,
    selectControl,
    handleControlClick
  };
};

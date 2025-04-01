
import { useEffect } from 'react';
import { ControlProps } from '../../types/designTypes';

export const useControlDeletion = (
  selectedControlId: string | null,
  setControls: React.Dispatch<React.SetStateAction<ControlProps[]>>,
  setSelectedControlId: React.Dispatch<React.SetStateAction<string | null>>
) => {
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
    handleDeleteControl
  };
};

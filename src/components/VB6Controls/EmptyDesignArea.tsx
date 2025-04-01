
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface EmptyDesignAreaProps {
  activeTool: string;
}

const EmptyDesignArea: React.FC<EmptyDesignAreaProps> = ({ activeTool }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center justify-center h-full text-gray-400 p-4 text-center">
      {activeTool === 'Pointer' 
        ? isMobile 
          ? 'Select a tool from the toolbox, then tap to place it on the design area'
          : 'Select a tool from the toolbox, then click to place it on the design area'
        : isMobile
          ? `Tap on the design area to place a ${activeTool} control`
          : `Click on the design area to place a ${activeTool} control`}
    </div>
  );
};

export default EmptyDesignArea;

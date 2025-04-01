
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
          ? 'Tap a tool from the toolbox and then tap and drag to add controls'
          : 'Select a tool from the toolbox to add controls'
        : isMobile
          ? `Tap and drag to add a ${activeTool} control`
          : `Click and drag to add a ${activeTool} control`}
    </div>
  );
};

export default EmptyDesignArea;

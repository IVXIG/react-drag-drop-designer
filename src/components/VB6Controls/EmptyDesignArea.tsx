
import React from 'react';

interface EmptyDesignAreaProps {
  activeTool: string;
}

const EmptyDesignArea: React.FC<EmptyDesignAreaProps> = ({ activeTool }) => {
  return (
    <div className="flex items-center justify-center h-full text-gray-400">
      {activeTool === 'Pointer' 
        ? 'Select a tool from the toolbox to add controls'
        : `Click and drag to add a ${activeTool} control`}
    </div>
  );
};

export default EmptyDesignArea;

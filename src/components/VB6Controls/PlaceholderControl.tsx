
import React from 'react';

interface PlaceholderControlProps {
  position: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

const PlaceholderControl: React.FC<PlaceholderControlProps> = ({ position }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
        border: '1px dashed #000',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
      }}
    />
  );
};

export default PlaceholderControl;

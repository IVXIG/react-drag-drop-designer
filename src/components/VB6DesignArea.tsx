
import React, { useState, useRef, useEffect } from 'react';

interface ControlProps {
  id: string;
  type: string;
  top: number;
  left: number;
  width: number;
  height: number;
  text: string;
}

const VB6DesignArea: React.FC = () => {
  const [controls, setControls] = useState<ControlProps[]>([]);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [isDraggingNew, setIsDraggingNew] = useState(false);
  const [newControlPosition, setNewControlPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const designAreaRef = useRef<HTMLDivElement>(null);
  
  // Listen for the active tool changes
  useEffect(() => {
    const checkActiveTool = () => {
      if (designAreaRef.current) {
        const tool = designAreaRef.current.getAttribute('data-active-tool');
        setActiveTool(tool);
      }
    };
    
    // Check initially
    checkActiveTool();
    
    // Set up a MutationObserver to watch for attribute changes
    const observer = new MutationObserver(checkActiveTool);
    
    if (designAreaRef.current) {
      observer.observe(designAreaRef.current, { attributes: true });
    }
    
    return () => observer.disconnect();
  }, []);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!activeTool || activeTool === 'Pointer') return;
    
    if (designAreaRef.current) {
      const rect = designAreaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setIsDraggingNew(true);
      setNewControlPosition({ top: y, left: x, width: 0, height: 0 });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingNew || !activeTool || activeTool === 'Pointer') return;
    
    if (designAreaRef.current) {
      const rect = designAreaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setNewControlPosition(prev => ({
        ...prev,
        width: x - prev.left,
        height: y - prev.top
      }));
    }
  };
  
  const handleMouseUp = () => {
    if (!isDraggingNew || !activeTool || activeTool === 'Pointer') return;
    
    const { top, left, width, height } = newControlPosition;
    
    // Only add control if it has some size
    if (width > 5 && height > 5) {
      const newControl: ControlProps = {
        id: `control-${Date.now()}`,
        type: activeTool,
        top,
        left,
        width,
        height,
        text: activeTool
      };
      
      setControls(prev => [...prev, newControl]);
    }
    
    setIsDraggingNew(false);
  };
  
  const renderControl = (control: ControlProps) => {
    const style = {
      position: 'absolute' as const,
      top: `${control.top}px`,
      left: `${control.left}px`,
      width: `${control.width}px`,
      height: `${control.height}px`,
      backgroundColor: 'white',
      border: '1px solid #000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      cursor: 'move',
    };
    
    switch(control.type) {
      case 'Label':
        return (
          <div
            key={control.id}
            style={{
              ...style,
              border: 'none',
              backgroundColor: 'transparent',
            }}
          >
            Label
          </div>
        );
      case 'TextBox':
        return (
          <input
            key={control.id}
            type="text"
            style={style}
            placeholder="TextBox"
          />
        );
      case 'CommandButton':
        return (
          <button
            key={control.id}
            style={style}
          >
            Command
          </button>
        );
      case 'CheckBox':
        return (
          <div
            key={control.id}
            style={style}
          >
            <input type="checkbox" id={control.id} />
            <label htmlFor={control.id}>CheckBox</label>
          </div>
        );
      case 'OptionButton':
        return (
          <div
            key={control.id}
            style={style}
          >
            <input type="radio" id={control.id} name="radioGroup" />
            <label htmlFor={control.id}>Option</label>
          </div>
        );
      default:
        return (
          <div
            key={control.id}
            style={{
              ...style,
              border: '1px dashed #000',
            }}
          >
            {control.type}
          </div>
        );
    }
  };
  
  return (
    <div 
      ref={designAreaRef}
      className="vb6-design-area bg-white border border-gray-400 flex-1 relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid background */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }} />
      
      {/* Render all controls */}
      {controls.map(renderControl)}
      
      {/* Preview of new control being drawn */}
      {isDraggingNew && activeTool && activeTool !== 'Pointer' && (
        <div
          style={{
            position: 'absolute',
            top: `${newControlPosition.top}px`,
            left: `${newControlPosition.left}px`,
            width: `${newControlPosition.width}px`,
            height: `${newControlPosition.height}px`,
            border: '1px dashed #000',
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
          }}
        />
      )}
      
      {/* Empty form state */}
      {controls.length === 0 && !isDraggingNew && (
        <div className="flex items-center justify-center h-full text-gray-400">
          Select a tool and draw on the form to add controls
        </div>
      )}
    </div>
  );
};

export default VB6DesignArea;

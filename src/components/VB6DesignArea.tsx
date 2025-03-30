
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ControlProps {
  id: string;
  type: string;
  top: number;
  left: number;
  width: number;
  height: number;
  text: string;
  isSelected: boolean;
}

const VB6DesignArea: React.FC = () => {
  const [controls, setControls] = useState<ControlProps[]>([]);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [isDraggingNew, setIsDraggingNew] = useState(false);
  const [newControlPosition, setNewControlPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);
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
    if (!activeTool || activeTool === 'Pointer') {
      // Handle selection mode
      const controlElements = document.querySelectorAll('.vb6-control');
      let found = false;
      
      controlElements.forEach((element) => {
        if (element.contains(e.target as Node)) {
          const id = element.getAttribute('data-id');
          setSelectedControlId(id);
          setControls(prevControls => 
            prevControls.map(control => ({
              ...control,
              isSelected: control.id === id
            }))
          );
          found = true;
        }
      });
      
      if (!found) {
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
    
    // Handle adding new controls
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
        width: Math.max(10, x - prev.left),
        height: Math.max(10, y - prev.top)
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
        text: getDefaultText(activeTool),
        isSelected: true
      };
      
      // Deselect other controls
      setControls(prev => [...prev.map(c => ({ ...c, isSelected: false })), newControl]);
      setSelectedControlId(newControl.id);
    }
    
    setIsDraggingNew(false);
  };
  
  const getDefaultText = (type: string): string => {
    switch(type) {
      case 'Label':
        return 'Label1';
      case 'CommandButton':
        return 'Command1';
      case 'TextBox':
        return '';
      case 'CheckBox':
        return 'Check1';
      case 'OptionButton':
        return 'Option1';
      case 'ComboBox':
        return '';
      case 'ListBox':
        return '';
      case 'Frame':
        return 'Frame1';
      default:
        return type;
    }
  };
  
  const renderControl = (control: ControlProps) => {
    const baseStyle = {
      position: 'absolute' as const,
      top: `${control.top}px`,
      left: `${control.left}px`,
      width: `${control.width}px`,
      height: `${control.height}px`,
      border: control.isSelected ? '1px dashed blue' : '1px solid transparent',
      cursor: 'move'
    };
    
    switch(control.type) {
      case 'Label':
        return (
          <div
            key={control.id}
            className="vb6-control"
            data-id={control.id}
            style={{
              ...baseStyle,
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              fontSize: '12px',
            }}
          >
            {control.text}
          </div>
        );
      case 'TextBox':
        return (
          <Input
            key={control.id}
            className="vb6-control"
            data-id={control.id}
            style={baseStyle}
            placeholder="TextBox"
            value={control.text}
          />
        );
      case 'CommandButton':
        return (
          <Button
            key={control.id}
            className="vb6-control"
            variant="outline"
            data-id={control.id}
            style={{
              ...baseStyle,
              backgroundColor: '#D4D0C8',
              color: 'black',
              borderRadius: '0',
              border: '2px outset #D4D0C8'
            }}
          >
            {control.text}
          </Button>
        );
      case 'CheckBox':
        return (
          <div
            key={control.id}
            className="vb6-control"
            data-id={control.id}
            style={{
              ...baseStyle,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'transparent'
            }}
          >
            <Checkbox id={control.id} />
            <label htmlFor={control.id} className="text-xs">{control.text}</label>
          </div>
        );
      case 'OptionButton':
        return (
          <div
            key={control.id}
            className="vb6-control"
            data-id={control.id}
            style={{
              ...baseStyle,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'transparent'
            }}
          >
            <input type="radio" id={control.id} name="radioGroup" />
            <label htmlFor={control.id} className="text-xs">{control.text}</label>
          </div>
        );
      case 'ComboBox':
        return (
          <select
            key={control.id}
            className="vb6-control"
            data-id={control.id}
            style={{
              ...baseStyle,
              fontSize: '12px',
              backgroundColor: 'white'
            }}
          >
            <option>Item 1</option>
            <option>Item 2</option>
            <option>Item 3</option>
          </select>
        );
      case 'ListBox':
        return (
          <select
            key={control.id}
            className="vb6-control"
            data-id={control.id}
            style={{
              ...baseStyle,
              fontSize: '12px',
              backgroundColor: 'white'
            }}
            multiple
          >
            <option>Item 1</option>
            <option>Item 2</option>
            <option>Item 3</option>
          </select>
        );
      case 'Frame':
        return (
          <fieldset
            key={control.id}
            className="vb6-control"
            data-id={control.id}
            style={{
              ...baseStyle,
              borderRadius: '0',
              border: '1px solid #000',
              backgroundColor: '#D4D0C8'
            }}
          >
            <legend className="text-xs px-1">{control.text}</legend>
          </fieldset>
        );
      case 'Image':
      case 'PictureBox':
        return (
          <div
            key={control.id}
            className="vb6-control"
            data-id={control.id}
            style={{
              ...baseStyle,
              backgroundColor: 'white',
              border: '1px solid black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px'
            }}
          >
            {control.type}
          </div>
        );
      case 'DateTimePicker':
        return (
          <input
            key={control.id}
            className="vb6-control"
            data-id={control.id}
            style={baseStyle}
            type="date"
          />
        );
      case 'Shape':
        return (
          <div
            key={control.id}
            className="vb6-control"
            data-id={control.id}
            style={{
              ...baseStyle,
              backgroundColor: 'black',
              borderRadius: control.width === control.height ? '50%' : '0'
            }}
          />
        );
      default:
        return (
          <div
            key={control.id}
            className="vb6-control"
            data-id={control.id}
            style={{
              ...baseStyle,
              border: '1px dashed #000',
              backgroundColor: 'rgba(200, 200, 200, 0.3)'
            }}
          >
            {control.type}
          </div>
        );
    }
  };
  
  const handleDeleteControl = () => {
    if (selectedControlId) {
      setControls(prevControls => prevControls.filter(control => control.id !== selectedControlId));
      setSelectedControlId(null);
    }
  };
  
  // Add keyboard event listeners for keyboard controls
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

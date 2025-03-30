import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';

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

interface VB6DesignAreaProps {
  onControlsChange?: (controls: ControlProps[]) => void;
  onControlSelect?: (controlId: string | null) => void;
  selectedControlId?: string | null;
  activeTool?: string;
}

const VB6DesignArea: React.FC<VB6DesignAreaProps> = ({ 
  onControlsChange,
  onControlSelect,
  selectedControlId: externalSelectedId,
  activeTool: externalActiveTool 
}) => {
  const [controls, setControls] = useState<ControlProps[]>([]);
  const [activeTool, setActiveTool] = useState<string>(externalActiveTool || 'Pointer');
  const [isDraggingNew, setIsDraggingNew] = useState(false);
  const [newControlPosition, setNewControlPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [selectedControlId, setSelectedControlId] = useState<string | null>(externalSelectedId || null);
  const [isMovingControl, setIsMovingControl] = useState(false);
  const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 });
  const designAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (externalActiveTool) {
      setActiveTool(externalActiveTool);
    }
  }, [externalActiveTool]);
  
  useEffect(() => {
    if (externalSelectedId !== undefined && externalSelectedId !== selectedControlId) {
      setSelectedControlId(externalSelectedId);
      
      setControls(prevControls => 
        prevControls.map(control => ({
          ...control,
          isSelected: control.id === externalSelectedId
        }))
      );
    }
  }, [externalSelectedId, selectedControlId]);

  useEffect(() => {
    if (onControlsChange) {
      onControlsChange(controls);
    }
  }, [controls, onControlsChange]);

  useEffect(() => {
    if (onControlSelect && selectedControlId !== externalSelectedId) {
      onControlSelect(selectedControlId);
    }
  }, [selectedControlId, onControlSelect, externalSelectedId]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'Pointer') {
      const controlElements = document.querySelectorAll('.vb6-control');
      let found = false;
      
      controlElements.forEach((element) => {
        if (element.contains(e.target as Node)) {
          const id = element.getAttribute('data-id');
          setSelectedControlId(id);
          
          setIsMovingControl(true);
          
          const rect = element.getBoundingClientRect();
          setMoveOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          });
          
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
    
    if (designAreaRef.current) {
      const rect = designAreaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setIsDraggingNew(true);
      setNewControlPosition({ top: y, left: x, width: 0, height: 0 });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingNew && activeTool !== 'Pointer') {
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
    } else if (isMovingControl && selectedControlId) {
      if (designAreaRef.current) {
        const rect = designAreaRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - moveOffset.x;
        const y = e.clientY - rect.top - moveOffset.y;
        
        setControls(prevControls =>
          prevControls.map(control =>
            control.id === selectedControlId
              ? { ...control, left: Math.max(0, x), top: Math.max(0, y) }
              : control
          )
        );
      }
    }
  };
  
  const handleMouseUp = () => {
    if (isDraggingNew && activeTool !== 'Pointer') {
      const { top, left, width, height } = newControlPosition;
      
      if (width > 5 && height > 5) {
        const newControlId = `${activeTool}-${Date.now()}`;
        const newControl: ControlProps = {
          id: newControlId,
          type: activeTool,
          top,
          left,
          width,
          height,
          text: getDefaultText(activeTool, controls.length + 1),
          isSelected: true
        };
        
        setControls(prev => [...prev.map(c => ({ ...c, isSelected: false })), newControl]);
        setSelectedControlId(newControl.id);
        
        toast(`Added ${activeTool} control`);
      }
      
      setIsDraggingNew(false);
    }
    
    setIsMovingControl(false);
  };
  
  const getDefaultText = (type: string, index: number): string => {
    const nameBase = type.charAt(0).toUpperCase() + type.slice(1);
    switch(type) {
      case 'Label':
        return `Label${index}`;
      case 'CommandButton':
        return `Command${index}`;
      case 'TextBox':
        return '';
      case 'CheckBox':
        return `Check${index}`;
      case 'OptionButton':
        return `Option${index}`;
      case 'ComboBox':
        return '';
      case 'ListBox':
        return '';
      case 'Frame':
        return `Frame${index}`;
      default:
        return `${nameBase}${index}`;
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
      data-active-tool={activeTool}
    >
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }} />
      
      {controls.map(renderControl)}
      
      {isDraggingNew && activeTool !== 'Pointer' && (
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
      
      {controls.length === 0 && !isDraggingNew && (
        <div className="flex items-center justify-center h-full text-gray-400">
          {activeTool === 'Pointer' 
            ? 'Select a tool from the toolbox to add controls'
            : `Click and drag to add a ${activeTool} control`}
        </div>
      )}
    </div>
  );
};

export default VB6DesignArea;

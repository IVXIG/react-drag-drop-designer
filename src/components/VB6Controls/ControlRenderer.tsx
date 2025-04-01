
import React from 'react';
import { ControlProps } from '../../types/designTypes';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface ControlRendererProps {
  control: ControlProps;
}

const ControlRenderer: React.FC<ControlRendererProps> = ({ control }) => {
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

export default ControlRenderer;

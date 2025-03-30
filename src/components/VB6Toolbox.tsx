
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Square, 
  Type, 
  CheckSquare, 
  Circle, 
  Radio, 
  Calendar, 
  List, 
  Image, 
  TextCursor, 
  MousePointer
} from 'lucide-react';

interface ToolboxItemProps {
  icon: React.ReactNode;
  name: string;
  isSelected: boolean;
  onClick: () => void;
}

const ToolboxItem: React.FC<ToolboxItemProps> = ({ icon, name, isSelected, onClick }) => {
  return (
    <Button
      variant="ghost"
      className={`w-10 h-10 p-0 flex flex-col items-center justify-center rounded-none ${
        isSelected ? 'bg-blue-200 border-2 border-blue-600' : 'hover:bg-gray-200'
      }`}
      onClick={onClick}
      title={name}
    >
      {icon}
    </Button>
  );
};

const VB6Toolbox: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string>('Pointer');
  
  const handleSelectTool = (toolName: string) => {
    setSelectedTool(toolName);
    console.log(`Selected tool: ${toolName}`);
    
    // Simulate tool activation
    const designArea = document.querySelector('.vb6-design-area');
    if (designArea) {
      designArea.setAttribute('data-active-tool', toolName);
    }
  };

  const toolboxItems = [
    { name: 'Pointer', icon: <MousePointer size={16} /> },
    { name: 'Label', icon: <TextCursor size={16} /> },
    { name: 'TextBox', icon: <Type size={16} /> },
    { name: 'CommandButton', icon: <Square size={16} /> },
    { name: 'CheckBox', icon: <CheckSquare size={16} /> },
    { name: 'OptionButton', icon: <Radio size={16} /> },
    { name: 'ComboBox', icon: <List size={16} /> },
    { name: 'ListBox', icon: <List size={16} /> },
    { name: 'Frame', icon: <Square size={16} strokeWidth={1} /> },
    { name: 'Image', icon: <Image size={16} /> },
    { name: 'PictureBox', icon: <Image size={16} /> },
    { name: 'DateTimePicker', icon: <Calendar size={16} /> },
    { name: 'Shape', icon: <Circle size={16} /> },
  ];

  return (
    <div className="bg-[#D4D0C8] border-r border-gray-400 w-14 h-full flex flex-col">
      <div className="p-1 bg-gray-300 border-b border-gray-400 text-center text-xs font-bold">
        Tools
      </div>
      <div className="grid grid-cols-1 gap-1 p-1 overflow-auto">
        {toolboxItems.map((tool) => (
          <ToolboxItem
            key={tool.name}
            icon={tool.icon}
            name={tool.name}
            isSelected={selectedTool === tool.name}
            onClick={() => handleSelectTool(tool.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default VB6Toolbox;

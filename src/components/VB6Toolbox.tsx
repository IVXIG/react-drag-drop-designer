
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
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
  MousePointer,
  Frame
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ToolboxItemProps {
  icon: React.ReactNode;
  name: string;
  isSelected: boolean;
  onClick: () => void;
  isMobile: boolean;
}

const ToolboxItem: React.FC<ToolboxItemProps> = ({ icon, name, isSelected, onClick, isMobile }) => {
  return (
    <Button
      variant="ghost"
      className={`${isMobile ? 'w-12 h-12' : 'w-10 h-10'} p-0 flex flex-col items-center justify-center rounded-none ${
        isSelected ? 'bg-blue-200 border-2 border-blue-600' : 'hover:bg-gray-200'
      }`}
      onClick={onClick}
      title={name}
      data-tool-name={name}
    >
      {icon}
    </Button>
  );
};

interface VB6ToolboxProps {
  onToolSelect?: (toolName: string) => void;
  selectedTool?: string;
}

const VB6Toolbox: React.FC<VB6ToolboxProps> = ({ onToolSelect, selectedTool: externalSelectedTool }) => {
  const [selectedTool, setSelectedTool] = useState<string>(externalSelectedTool || 'Pointer');
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (externalSelectedTool && externalSelectedTool !== selectedTool) {
      setSelectedTool(externalSelectedTool);
    }
  }, [externalSelectedTool]);

  const handleSelectTool = (toolName: string) => {
    setSelectedTool(toolName);
    
    if (onToolSelect) {
      onToolSelect(toolName);
    }
    
    // Set the active tool on the design area
    const designArea = document.querySelector('.vb6-design-area');
    if (designArea) {
      designArea.setAttribute('data-active-tool', toolName);
    }
  };

  const toolboxItems = [
    { name: 'Pointer', icon: <MousePointer size={isMobile ? 20 : 16} /> },
    { name: 'Label', icon: <TextCursor size={isMobile ? 20 : 16} /> },
    { name: 'TextBox', icon: <Type size={isMobile ? 20 : 16} /> },
    { name: 'CommandButton', icon: <Square size={isMobile ? 20 : 16} /> },
    { name: 'CheckBox', icon: <CheckSquare size={isMobile ? 20 : 16} /> },
    { name: 'OptionButton', icon: <Radio size={isMobile ? 20 : 16} /> },
    { name: 'ComboBox', icon: <List size={isMobile ? 20 : 16} /> },
    { name: 'ListBox', icon: <List size={isMobile ? 20 : 16} strokeWidth={1} /> },
    { name: 'Frame', icon: <Square size={isMobile ? 20 : 16} strokeWidth={1} /> },
    { name: 'Image', icon: <Image size={isMobile ? 20 : 16} /> },
    { name: 'PictureBox', icon: <Image size={isMobile ? 20 : 16} strokeWidth={1} /> },
    { name: 'DateTimePicker', icon: <Calendar size={isMobile ? 20 : 16} /> },
    { name: 'Shape', icon: <Circle size={isMobile ? 20 : 16} /> },
  ];

  return (
    <div className={`bg-[#D4D0C8] border-r border-gray-400 ${isMobile ? 'w-full h-auto' : 'w-14 h-full'} flex flex-col`}>
      <div className="p-1 bg-gray-300 border-b border-gray-400 text-center text-xs font-bold">
        Tools
      </div>
      <div className={`${isMobile ? 'grid grid-flow-col auto-cols-max' : 'grid grid-cols-1'} gap-1 p-1 overflow-auto`}>
        {toolboxItems.map((tool) => (
          <ToolboxItem
            key={tool.name}
            icon={tool.icon}
            name={tool.name}
            isSelected={selectedTool === tool.name}
            onClick={() => handleSelectTool(tool.name)}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
};

export default VB6Toolbox;

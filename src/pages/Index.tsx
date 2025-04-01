
import React, { useState } from 'react';
import VB6Menubar from '../components/VB6Menubar';
import VB6Toolbox from '../components/VB6Toolbox';
import VB6DesignArea from '../components/VB6DesignArea';
import VB6CodeWindow from '../components/VB6CodeWindow';
import { Button } from "@/components/ui/button";
import { LayoutTemplate, Code, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [formName, setFormName] = useState('Form1');
  const [viewMode, setViewMode] = useState<'design' | 'code'>('design');
  const [controls, setControls] = useState<any[]>([]);
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('Pointer');
  const isMobile = useIsMobile();

  const handleControlsChange = (updatedControls: any[]) => {
    setControls(updatedControls);
  };

  const handleControlSelect = (controlId: string | null) => {
    setSelectedControlId(controlId);
  };
  
  const handleToolSelect = (toolName: string) => {
    setSelectedTool(toolName);
    // Reset selection when choosing a new tool
    if (toolName !== 'Pointer') {
      setSelectedControlId(null);
    }
    toast(`Selected tool: ${toolName}`);
  };
  
  const handleDeleteControl = () => {
    if (selectedControlId) {
      setControls(prevControls => prevControls.filter(control => control.id !== selectedControlId));
      setSelectedControlId(null);
      toast(`Control deleted`);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#D4D0C8] overflow-hidden">
      <VB6Menubar />
      <div className="flex border-b border-gray-400 bg-[#D4D0C8] p-1">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 text-xs h-6 ${viewMode === 'design' ? 'bg-gray-300' : ''}`}
          onClick={() => setViewMode('design')}
          title="View Object"
        >
          <LayoutTemplate size={isMobile ? 10 : 12} />
          {!isMobile && "Object"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 text-xs h-6 ${viewMode === 'code' ? 'bg-gray-300' : ''}`}
          onClick={() => setViewMode('code')}
          title="View Code"
        >
          <Code size={isMobile ? 10 : 12} />
          {!isMobile && "Code"}
        </Button>
        {selectedControlId && (
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-xs h-6 ml-auto"
            onClick={handleDeleteControl}
            title="Delete Control"
          >
            <Trash2 size={isMobile ? 10 : 12} />
            {!isMobile && "Delete"}
          </Button>
        )}
      </div>
      <div className={`flex-1 flex ${isMobile ? 'flex-col' : 'flex-row'} overflow-hidden`}>
        <div className={isMobile ? 'w-full h-16 overflow-x-auto' : ''}>
          <VB6Toolbox 
            onToolSelect={handleToolSelect}
            selectedTool={selectedTool}
          />
        </div>
        <div className="flex-1 p-2 overflow-hidden">
          <div className="bg-[#D4D0C8] border border-gray-400 h-full flex flex-col">
            <div className="p-1 bg-gray-300 border-b border-gray-400 text-xs font-bold">
              {formName} - {viewMode === 'design' ? 'Form' : 'Code'}
            </div>
            {viewMode === 'design' ? (
              <VB6DesignArea 
                onControlsChange={handleControlsChange}
                onControlSelect={handleControlSelect}
                selectedControlId={selectedControlId}
                activeTool={selectedTool}
              />
            ) : (
              <VB6CodeWindow 
                selectedControlId={selectedControlId}
                controls={controls}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

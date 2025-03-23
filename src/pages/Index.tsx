
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ==============================
// TitleBar Component
// ==============================
interface TitleBarProps {
  title: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  windowRef: React.RefObject<HTMLDivElement>;
}

const TitleBar: React.FC<TitleBarProps> = ({ 
  title, 
  onClose, 
  onMinimize, 
  onMaximize,
  windowRef 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!windowRef.current) return;
    
    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !windowRef.current) return;
      
      const newLeft = e.clientX - offset.x;
      const newTop = e.clientY - offset.y;
      
      windowRef.current.style.left = `${newLeft}px`;
      windowRef.current.style.top = `${newTop}px`;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset, windowRef]);

  return (
    <div 
      className="flex justify-between items-center px-2 py-1 bg-[#000080] text-white cursor-move"
      onMouseDown={handleMouseDown}
    >
      <div className="font-bold">{title}</div>
      <div className="flex gap-1">
        {onMinimize && (
          <div 
            className="px-2 py-0.5 bg-[#D4D0C8] text-black border border-[#808080] hover:bg-[#C0C0C0] cursor-pointer"
            onClick={onMinimize}
          >
            _
          </div>
        )}
        {onMaximize && (
          <div 
            className="px-2 py-0.5 bg-[#D4D0C8] text-black border border-[#808080] hover:bg-[#C0C0C0] cursor-pointer"
            onClick={onMaximize}
          >
            □
          </div>
        )}
        {onClose && (
          <div 
            className="px-2 py-0.5 bg-[#D4D0C8] text-black border border-[#808080] hover:bg-[#C0C0C0] cursor-pointer"
            onClick={onClose}
          >
            ✕
          </div>
        )}
      </div>
    </div>
  );
};

// ==============================
// ToolBox Component
// ==============================
interface ToolBoxProps {
  onDragStart: (controlType: string) => void;
}

interface ToolCategory {
  name: string;
  controls: string[];
}

const ToolBox: React.FC<ToolBoxProps> = ({ onDragStart }) => {
  const [expanded, setExpanded] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Common Controls': true,
    'Additional Controls': false
  });

  const categories: ToolCategory[] = [
    {
      name: 'Common Controls',
      controls: ['Label', 'TextBox', 'CommandButton', 'CheckBox', 'OptionButton', 'ComboBox', 'ListBox', 'Frame']
    },
    {
      name: 'Additional Controls',
      controls: ['Timer', 'PictureBox', 'Image', 'Shape', 'Line', 'Data', 'OLE', 'ActiveX']
    }
  ];

  const toggleToolbox = () => {
    setExpanded(!expanded);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
  };

  const handleDragStart = (e: React.DragEvent, control: string) => {
    e.dataTransfer.setData('text/plain', control);
    onDragStart(control);
  };

  return (
    <div className="absolute left-0 top-8 w-[200px] h-[calc(100vh-32px)] bg-[#F0F0F0] border-r-2 border-[#000080] shadow-md">
      <div 
        className="px-2 py-1 bg-[#000080] text-white font-bold text-center cursor-pointer"
        onClick={toggleToolbox}
      >
        Toolbox
      </div>
      {expanded && (
        <div className="flex flex-col p-2 overflow-y-auto h-[calc(100%-28px)]">
          {categories.map((category) => (
            <div key={category.name} className="mb-2">
              <div 
                className="px-2 py-1 bg-[#D4D0C8] text-[#000080] font-bold cursor-pointer border border-[#808080]"
                onClick={() => toggleCategory(category.name)}
              >
                {category.name}
              </div>
              {expandedCategories[category.name] && (
                <ul className="p-1 m-0 list-none">
                  {category.controls.map((control) => (
                    <li 
                      key={control} 
                      className="px-2 py-1 bg-white border border-[#808080] mb-1 cursor-move"
                      draggable
                      onDragStart={(e) => handleDragStart(e, control)}
                    >
                      {control}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==============================
// DraggableControl Component
// ==============================
interface DraggableControlProps {
  id: string;
  type: string;
  properties: Record<string, any>;
  selected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, left: number, top: number) => void;
  onResize?: (id: string, width: number, height: number) => void;
  onDoubleClick?: (id: string) => void;
}

const DraggableControl: React.FC<DraggableControlProps> = ({
  id,
  type,
  properties,
  selected,
  onSelect,
  onMove,
  onResize,
  onDoubleClick
}) => {
  const controlRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const {
    left = 0,
    top = 0,
    width = 100,
    height = 30,
    caption = 'Command1',
    text = 'Text1',
    visible = true,
    enabled = true
  } = properties;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && controlRef.current) {
        const newLeft = e.clientX - dragOffset.x;
        const newTop = e.clientY - dragOffset.y;
        onMove(id, newLeft, newTop);
      } else if (isResizing && controlRef.current && onResize) {
        const newWidth = Math.max(20, resizeStart.width + (e.clientX - resizeStart.x));
        const newHeight = Math.max(20, resizeStart.height + (e.clientY - resizeStart.y));
        onResize(id, newWidth, newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [id, isDragging, isResizing, dragOffset, resizeStart, onMove, onResize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
    
    if (controlRef.current) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - left,
        y: e.clientY - top
      });
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
    
    if (controlRef.current) {
      setIsResizing(true);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width,
        height
      });
    }
  };

  const handleDoubleClick = () => {
    if (onDoubleClick) {
      onDoubleClick(id);
    }
  };

  if (!visible) return null;

  let content;
  switch (type) {
    case 'CommandButton':
      content = <div className="w-full h-full flex items-center justify-center">{caption}</div>;
      break;
    case 'TextBox':
      content = <input type="text" value={text} readOnly className="w-full h-full border-none outline-none bg-white" />;
      break;
    case 'Label':
      content = <div className="w-full h-full flex items-center">{text}</div>;
      break;
    case 'CheckBox':
      content = (
        <div className="flex items-center">
          <input type="checkbox" className="mr-1" disabled={!enabled} />
          <span>{caption}</span>
        </div>
      );
      break;
    case 'OptionButton':
      content = (
        <div className="flex items-center">
          <input type="radio" className="mr-1" disabled={!enabled} />
          <span>{caption}</span>
        </div>
      );
      break;
    case 'ComboBox':
      content = (
        <select className="w-full h-full" disabled={!enabled}>
          <option>Item 1</option>
          <option>Item 2</option>
          <option>Item 3</option>
        </select>
      );
      break;
    case 'ListBox':
      content = (
        <select multiple className="w-full h-full" disabled={!enabled}>
          <option>Item 1</option>
          <option>Item 2</option>
          <option>Item 3</option>
        </select>
      );
      break;
    case 'Frame':
      content = <div className="w-full h-full p-1 text-center border-t-0">{caption}</div>;
      break;
    default:
      content = <div>{type}</div>;
  }

  return (
    <div
      ref={controlRef}
      className={cn(
        "absolute",
        selected ? 'border-2 border-blue-500' : ''
      )}
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        opacity: enabled ? 1 : 0.6,
        cursor: isDragging ? 'grabbing' : 'grab',
        pointerEvents: 'auto',
        backgroundColor: type === 'Frame' ? 'transparent' : '',
        borderStyle: type === 'Frame' ? 'groove' : '',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {content}
      {selected && onResize && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 opacity-50 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
};

// ==============================
// DesignerCanvas Component
// ==============================
interface CanvasProps {
  onControlSelected: (controlId: string | null) => void;
  setControls: React.Dispatch<React.SetStateAction<Control[]>>;
  controls: Control[];
  onOpenCodeWindow: (controlId: string) => void;
}

interface Control {
  id: string;
  type: string;
  properties: Record<string, any>;
}

const DesignerCanvas: React.FC<CanvasProps> = ({ 
  onControlSelected, 
  controls, 
  setControls,
  onOpenCodeWindow
}) => {
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const controlType = e.dataTransfer.getData('text/plain');
    
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newControl: Control = {
      id: `${controlType}_${Date.now()}`,
      type: controlType,
      properties: {
        name: `${controlType}${controls.length + 1}`,
        left: x,
        top: y,
        width: getDefaultWidth(controlType),
        height: getDefaultHeight(controlType),
        caption: `${controlType}${controls.length + 1}`,
        text: controlType === 'Label' ? 'Label1' : '',
        visible: true,
        enabled: true
      }
    };
    
    const updatedControls = [...controls, newControl];
    setControls(updatedControls);
    setSelectedControlId(newControl.id);
    onControlSelected(newControl.id);

    // Show toast notification
    toast.success(`${controlType} control added to form`);
  };

  const getDefaultWidth = (type: string): number => {
    switch (type) {
      case 'CommandButton': return 100;
      case 'TextBox': return 150;
      case 'Label': return 80;
      case 'CheckBox': return 120;
      case 'OptionButton': return 120;
      case 'ComboBox': return 150;
      case 'ListBox': return 150;
      case 'Frame': return 200;
      default: return 100;
    }
  };

  const getDefaultHeight = (type: string): number => {
    switch (type) {
      case 'CommandButton': return 30;
      case 'TextBox': return 24;
      case 'Label': return 24;
      case 'CheckBox': return 24;
      case 'OptionButton': return 24;
      case 'ComboBox': return 24;
      case 'ListBox': return 100;
      case 'Frame': return 150;
      default: return 30;
    }
  };

  const handleControlSelected = (controlId: string) => {
    setSelectedControlId(controlId);
    onControlSelected(controlId);
  };

  const handleCanvasClick = () => {
    setSelectedControlId(null);
    onControlSelected(null);
  };

  const handleControlMove = (id: string, left: number, top: number) => {
    setControls(controls.map(control => 
      control.id === id 
        ? { ...control, properties: { ...control.properties, left, top } } 
        : control
    ));
  };

  const handleControlResize = (id: string, width: number, height: number) => {
    setControls(controls.map(control => 
      control.id === id 
        ? { ...control, properties: { ...control.properties, width, height } } 
        : control
    ));
  };

  const handleControlDoubleClick = (id: string) => {
    onOpenCodeWindow(id);
  };

  return (
    <div 
      ref={canvasRef}
      className="bg-white w-full h-full relative"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleCanvasClick}
    >
      <div className="absolute top-0 left-0 grid grid-cols-[repeat(20,20px)] grid-rows-[repeat(20,20px)] w-full h-full">
        {Array.from({ length: 20 }).map((_, rowIndex) => (
          Array.from({ length: 20 }).map((_, colIndex) => (
            <div 
              key={`${rowIndex}-${colIndex}`} 
              className="border border-gray-100"
            />
          ))
        ))}
      </div>
      {controls.map(control => (
        <DraggableControl
          key={control.id}
          id={control.id}
          type={control.type}
          properties={control.properties}
          selected={control.id === selectedControlId}
          onSelect={handleControlSelected}
          onMove={handleControlMove}
          onResize={handleControlResize}
          onDoubleClick={handleControlDoubleClick}
        />
      ))}
    </div>
  );
};

// ==============================
// PropertyGrid Component
// ==============================
interface PropertyGridProps {
  selectedControl: Control | null;
  onPropertyChange?: (id: string, property: string, value: any) => void;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ selectedControl, onPropertyChange }) => {
  const handlePropertyChange = (property: string, value: any) => {
    if (selectedControl && onPropertyChange) {
      onPropertyChange(selectedControl.id, property, value);
    }
  };

  if (!selectedControl) {
    return (
      <div className="p-4 text-gray-500 italic">
        No control selected. Select a control to view its properties.
      </div>
    );
  }

  const properties = selectedControl.properties;
  const propertyEntries = Object.entries(properties);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-4 px-2 py-1 bg-[#D4D0C8] text-[#000080] font-bold">
        {selectedControl.type} Properties
      </div>
      <div className="grid grid-cols-2 gap-1">
        {propertyEntries.map(([property, value]) => (
          <React.Fragment key={property}>
            <div className="px-2 py-1 bg-[#D4D0C8] text-[#000080] font-bold border border-[#808080]">
              {property}
            </div>
            <div className="px-2 py-1 border border-[#808080] bg-white">
              {typeof value === 'boolean' ? (
                <input 
                  type="checkbox" 
                  checked={value} 
                  onChange={(e) => handlePropertyChange(property, e.target.checked)}
                />
              ) : typeof value === 'number' ? (
                <input 
                  type="number" 
                  value={value} 
                  className="w-full"
                  onChange={(e) => handlePropertyChange(property, Number(e.target.value))}
                />
              ) : (
                <input 
                  type="text" 
                  value={String(value)} 
                  className="w-full"
                  onChange={(e) => handlePropertyChange(property, e.target.value)}
                />
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// ==============================
// ProjectExplorer Component
// ==============================
interface ProjectExplorerProps {
  onSelectFile: (file: string) => void;
  onCreateNewFile: (type: string) => void;
}

interface ProjectFile {
  name: string;
  type: string;
  children?: ProjectFile[];
}

const ProjectExplorer: React.FC<ProjectExplorerProps> = ({ onSelectFile, onCreateNewFile }) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'Project1': true
  });
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number, y: number } | null>(null);
  const [contextMenuTarget, setContextMenuTarget] = useState<string | null>(null);

  const projectFiles: ProjectFile[] = [
    {
      name: 'Project1',
      type: 'folder',
      children: [
        { name: 'Form1.frm', type: 'form' },
        { name: 'Module1.bas', type: 'module' },
        { name: 'Class1.cls', type: 'class' },
        { 
          name: 'Forms',
          type: 'folder',
          children: [
            { name: 'Form2.frm', type: 'form' },
            { name: 'Form3.frm', type: 'form' }
          ]
        }
      ]
    }
  ];

  const toggleFolder = (folderName: string) => {
    setExpandedFolders({
      ...expandedFolders,
      [folderName]: !expandedFolders[folderName]
    });
  };

  const handleFileClick = (fileName: string) => {
    onSelectFile(fileName);
  };

  const handleContextMenu = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setContextMenuTarget(target);
  };

  const closeContextMenu = () => {
    setContextMenuPos(null);
    setContextMenuTarget(null);
  };

  useEffect(() => {
    if (contextMenuPos) {
      const handleClickOutside = () => closeContextMenu();
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenuPos]);

  const handleAddFile = (type: string) => {
    onCreateNewFile(type);
    closeContextMenu();
  };

  const renderFiles = (files: ProjectFile[], level = 0) => {
    return (
      <ul className={cn("list-none pl-4", level === 0 ? "pl-0" : "")}>
        {files.map((file) => (
          <li key={file.name} className="my-1">
            {file.type === 'folder' ? (
              <div>
                <div 
                  className="flex items-center cursor-pointer text-blue-800 font-medium"
                  onClick={() => toggleFolder(file.name)}
                  onContextMenu={(e) => handleContextMenu(e, file.name)}
                >
                  <span className="mr-1">{expandedFolders[file.name] ? '📂' : '📁'}</span>
                  {file.name}
                </div>
                {expandedFolders[file.name] && file.children && (
                  renderFiles(file.children, level + 1)
                )}
              </div>
            ) : (
              <div 
                className="flex items-center cursor-pointer ml-5 text-green-800"
                onClick={() => handleFileClick(file.name)}
                onContextMenu={(e) => handleContextMenu(e, file.name)}
              >
                <span className="mr-1">
                  {file.type === 'form' ? '📄' : file.type === 'module' ? '📝' : '📋'}
                </span>
                {file.name}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="p-2 h-full overflow-y-auto">
      <div className="mb-2 px-2 py-1 bg-[#D4D0C8] text-[#000080] font-bold">
        Project - Project1
      </div>
      {renderFiles(projectFiles)}

      {contextMenuPos && (
        <div 
          className="absolute bg-[#D4D0C8] border border-[#808080] shadow-md z-50"
          style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
        >
          <div 
            className="px-4 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
            onClick={() => handleAddFile('form')}
          >
            Add Form
          </div>
          <div 
            className="px-4 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
            onClick={() => handleAddFile('module')}
          >
            Add Module
          </div>
          <div 
            className="px-4 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
            onClick={() => handleAddFile('class')}
          >
            Add Class
          </div>
          <div 
            className="px-4 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
            onClick={closeContextMenu}
          >
            Properties
          </div>
        </div>
      )}
    </div>
  );
};

// ==============================
// Code Editor Component
// ==============================
interface CodeEditorProps {
  controlId: string | null;
  onClose: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ controlId, onClose }) => {
  const [code, setCode] = useState<string>('');
  const windowRef = useRef<HTMLDivElement>(null);

  // Generate some placeholder code when control changes
  useEffect(() => {
    if (controlId) {
      const controlType = controlId.split('_')[0];
      const eventType = controlType === 'CommandButton' ? 'Click' : 'Change';
      
      const newCode = `Private Sub ${controlId}_${eventType}()
  ' Add your code here
  MsgBox "Hello from ${controlId}!"
End Sub
`;
      setCode(newCode);
    }
  }, [controlId]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  // Initialize window position
  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.style.left = '250px';
      windowRef.current.style.top = '100px';
      windowRef.current.style.width = '500px';
      windowRef.current.style.height = '400px';
    }
  }, []);

  return (
    <div 
      ref={windowRef}
      className="absolute bg-[#F0F0F0] border-2 border-[#000080] rounded shadow-md z-30"
    >
      <TitleBar 
        title={`Code Window - ${controlId}`} 
        windowRef={windowRef}
        onClose={onClose}
      />
      <div className="h-[calc(100%-28px)] overflow-hidden p-2 bg-white w-full">
        <textarea 
          className="w-full h-full font-mono text-sm p-2 outline-none border border-[#808080]"
          value={code}
          onChange={handleCodeChange}
          spellCheck={false}
        />
      </div>
    </div>
  );
};

// ==============================
// Dialog Windows
// ==============================
interface DialogProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ title, onClose, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div 
        ref={dialogRef}
        className="bg-[#D4D0C8] border-2 border-[#808080] shadow-lg rounded"
        style={{ width: '400px' }}
      >
        <div className="px-2 py-1 bg-[#000080] text-white font-bold flex justify-between items-center">
          <span>{title}</span>
          <span 
            className="cursor-pointer"
            onClick={onClose}
          >
            ✕
          </span>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const AboutDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <Dialog title="About Visual Basic" onClose={onClose}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Microsoft Visual Basic 6.0</h2>
        <p className="mb-2">This is a web-based recreation of the Visual Basic 6.0 IDE.</p>
        <p className="mb-4">Created with React and Tailwind CSS.</p>
        <div className="mt-8 text-center">
          <button 
            className="px-4 py-1 bg-[#D4D0C8] border border-[#808080] rounded"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </Dialog>
  );
};

const NewProjectDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [projectType, setProjectType] = useState('Standard EXE');

  const handleCreateProject = () => {
    toast.success(`New ${projectType} project created`);
    onClose();
  };

  return (
    <Dialog title="New Project" onClose={onClose}>
      <div>
        <div className="mb-4">
          <div className="font-bold mb-2">Project Type:</div>
          <select 
            className="w-full p-1 border border-[#808080]"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
          >
            <option>Standard EXE</option>
            <option>ActiveX EXE</option>
            <option>ActiveX DLL</option>
            <option>ActiveX Control</option>
            <option>VB Application Wizard</option>
            <option>Data Project</option>
            <option>IIS Application</option>
            <option>Add-in</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button 
            className="px-4 py-1 bg-[#D4D0C8] border border-[#808080] rounded"
            onClick={handleCreateProject}
          >
            OK
          </button>
          <button 
            className="px-4 py-1 bg-[#D4D0C8] border border-[#808080] rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
};

const OpenProjectDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedProject, setSelectedProject] = useState('Project1.vbp');

  const handleOpenProject = () => {
    toast.success(`Project ${selectedProject} opened`);
    onClose();
  };

  return (
    <Dialog title="Open Project" onClose={onClose}>
      <div>
        <div className="mb-4">
          <div className="font-bold mb-2">Project Name:</div>
          <select 
            className="w-full p-1 border border-[#808080]"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option>Project1.vbp</option>
            <option>Project2.vbp</option>
            <option>Calculator.vbp</option>
            <option>TextEditor.vbp</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button 
            className="px-4 py-1 bg-[#D4D0C8] border border-[#808080] rounded"
            onClick={handleOpenProject}
          >
            Open
          </button>
          <button 
            className="px-4 py-1 bg-[#D4D0C8] border border-[#808080] rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
};

// ==============================
// Main VB6 IDE Component
// ==============================
interface Control {
  id: string;
  type: string;
  properties: Record<string, any>;
}

const Index = () => {
  // Application state
  const [isInDesignMode, setIsInDesignMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  
  // Window state
  const [mainWindowVisible, setMainWindowVisible] = useState(true);
  const [propertyWindowVisible, setPropertyWindowVisible] = useState(true);
  const [projectWindowVisible, setProjectWindowVisible] = useState(true);
  const [codeWindowVisible, setCodeWindowVisible] = useState(false);
  const [minimizedWindows, setMinimizedWindows] = useState<Record<string, boolean>>({});
  
  // Dialog state
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showOpenProjectDialog, setShowOpenProjectDialog] = useState(false);
  
  // Window refs for dragging
  const mainWindowRef = useRef<HTMLDivElement>(null);
  const propertyWindowRef = useRef<HTMLDivElement>(null);
  const projectWindowRef = useRef<HTMLDivElement>(null);
  
  // Controls state
  const [controls, setControls] = useState<Control[]>([]);
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);
  const [currentCodeControlId, setCurrentCodeControlId] = useState<string | null>(null);
  
  // Menu and toolbar state
  const [projectIsDirty, setProjectIsDirty] = useState(false);
  
  // Handle window actions
  const toggleMinimize = (windowName: string) => {
    setMinimizedWindows({
      ...minimizedWindows,
      [windowName]: !minimizedWindows[windowName]
    });
  };
  
  // Handle property changes
  const handlePropertyChange = (id: string, property: string, value: any) => {
    setControls(controls.map(control => 
      control.id === id 
        ? { 
            ...control, 
            properties: { 
              ...control.properties, 
              [property]: value 
            } 
          } 
        : control
    ));
    setProjectIsDirty(true);
    toast.success(`Changed ${property} to ${value}`);
  };
  
  // Get selected control
  const getSelectedControl = () => {
    if (!selectedControlId) return null;
    return controls.find(control => control.id === selectedControlId) || null;
  };
  
  // Handle file selection
  const handleFileSelected = (file: string) => {
    toast.success(`File opened: ${file}`);
  };
  
  // Handle new file creation
  const handleCreateNewFile = (type: string) => {
    const fileExtension = type === 'form' ? 'frm' : type === 'module' ? 'bas' : 'cls';
    const fileName = `New${type.charAt(0).toUpperCase() + type.slice(1)}1.${fileExtension}`;
    toast.success(`Created new ${type}: ${fileName}`);
  };
  
  // Open code window
  const handleOpenCodeWindow = (controlId: string) => {
    setCurrentCodeControlId(controlId);
    setCodeWindowVisible(true);
  };
  
  // Run project
  const handleRunProject = () => {
    if (isRunning) {
      setIsRunning(false);
      setIsInDesignMode(true);
      toast.success("Project stopped");
    } else {
      setIsInDesignMode(false);
      setIsRunning(true);
      toast.success("Project running");
    }
  };
  
  // Handle toolbar button clicks (File menu)
  const handleNewProject = () => {
    setShowNewProjectDialog(true);
  };
  
  const handleOpenProject = () => {
    setShowOpenProjectDialog(true);
  };
  
  const handleSaveProject = () => {
    setProjectIsDirty(false);
    toast.success("Project saved");
  };
  
  // Format and position windows
  useEffect(() => {
    if (mainWindowRef.current) {
      mainWindowRef.current.style.left = '220px';
      mainWindowRef.current.style.top = '40px';
      mainWindowRef.current.style.width = '600px';
      mainWindowRef.current.style.height = 'calc(100vh - 80px)';
    }
    
    if (propertyWindowRef.current) {
      propertyWindowRef.current.style.right = '20px';
      propertyWindowRef.current.style.bottom = '20px';
      propertyWindowRef.current.style.width = '250px';
      propertyWindowRef.current.style.height = 'calc(50vh - 60px)';
    }
    
    if (projectWindowRef.current) {
      projectWindowRef.current.style.right = '20px';
      projectWindowRef.current.style.top = '40px';
      projectWindowRef.current.style.width = '250px';
      projectWindowRef.current.style.height = 'calc(50vh - 60px)';
    }
  }, []);

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#87CEEB]">
      {/* Top Toolbar */}
      <div className="w-full h-8 bg-[#D4D0C8] border-b-2 border-[#000080] flex items-center px-2">
        <button 
          className="bg-[#000080] text-white border border-white rounded px-3 py-1 mr-2 font-bold text-sm"
          onClick={() => {
            toast.success("File menu clicked");
          }}
        >
          File
        </button>
        <button 
          className="bg-[#000080] text-white border border-white rounded px-3 py-1 mr-2 font-bold text-sm"
          onClick={() => {
            toast.success("Edit menu clicked");
          }}
        >
          Edit
        </button>
        <button 
          className="bg-[#000080] text-white border border-white rounded px-3 py-1 mr-2 font-bold text-sm"
          onClick={() => {
            // Toggle visibility of windows
            if (!projectWindowVisible) {
              setProjectWindowVisible(true);
              toast.success("Project Explorer opened");
            } else if (!propertyWindowVisible) {
              setPropertyWindowVisible(true);
              toast.success("Properties window opened");
            } else {
              toast.success("View menu clicked");
            }
          }}
        >
          View
        </button>
        <button 
          className="bg-[#000080] text-white border border-white rounded px-3 py-1 mr-2 font-bold text-sm"
          onClick={() => {
            handleCreateNewFile('form');
          }}
        >
          Project
        </button>
        <button 
          className="bg-[#000080] text-white border border-white rounded px-3 py-1 mr-2 font-bold text-sm"
          onClick={() => {
            if (selectedControlId) {
              toast.success("Control formatted");
            } else {
              toast.error("No control selected");
            }
          }}
        >
          Format
        </button>
        <button 
          className="bg-[#000080] text-white border border-white rounded px-3 py-1 mr-2 font-bold text-sm"
          onClick={() => {
            toast.success("Debug menu clicked");
          }}
        >
          Debug
        </button>
        <button 
          className="bg-[#000080] text-white border border-white rounded px-3 py-1 mr-2 font-bold text-sm"
          onClick={handleRunProject}
        >
          {isRunning ? "Stop" : "Run"}
        </button>
        <button 
          className="bg-[#000080] text-white border border-white rounded px-3 py-1 mr-2 font-bold text-sm"
          onClick={() => {
            toast.success("Tools menu clicked");
          }}
        >
          Tools
        </button>
        <button 
          className="bg-[#000080] text-white border border-white rounded px-3 py-1 mr-2 font-bold text-sm"
          onClick={() => {
            toast.success("Add-Ins menu clicked");
          }}
        >
          Add-Ins
        </button>
        <button 
          className="bg-[#000080] text-white border border-white rounded px-3 py-1 mr-2 font-bold text-sm"
          onClick={() => {
            if (!mainWindowVisible) {
              setMainWindowVisible(true);
              toast.success("Form Designer opened");
            } else if (!propertyWindowVisible) {
              setPropertyWindowVisible(true);
              toast.success("Properties window opened");
            } else if (!projectWindowVisible) {
              setProjectWindowVisible(true);
              toast.success("Project Explorer opened");
            } else {
              toast.success("Window menu clicked");
            }
          }}
        >
          Window
        </button>
        <button 
          className="bg-[#000080] text-white border border-white rounded px-3 py-1 mr-2 font-bold text-sm"
          onClick={() => setShowAboutDialog(true)}
        >
          Help
        </button>
      </div>

      {/* Secondary Toolbar */}
      <div className="w-full h-10 bg-[#D4D0C8] border-b-2 border-[#000080] flex items-center px-2">
        <button 
          className="px-2 py-1 bg-[#D4D0C8] border border-[#808080] rounded mr-2 flex items-center"
          onClick={handleNewProject}
        >
          <span className="mr-1">📄</span> New
        </button>
        <button 
          className="px-2 py-1 bg-[#D4D0C8] border border-[#808080] rounded mr-2 flex items-center"
          onClick={handleOpenProject}
        >
          <span className="mr-1">📂</span> Open
        </button>
        <button 
          className="px-2 py-1 bg-[#D4D0C8] border border-[#808080] rounded mr-2 flex items-center"
          onClick={handleSaveProject}
        >
          <span className="mr-1">💾</span> Save
        </button>
        <div className="border-r border-[#808080] h-8 mx-2"></div>
        <button 
          className="px-2 py-1 bg-[#D4D0C8] border border-[#808080] rounded mr-2 flex items-center"
          onClick={handleRunProject}
        >
          <span className="mr-1">{isRunning ? "⏹️" : "▶️"}</span> {isRunning ? "Stop" : "Start"}
        </button>
        <div className="border-r border-[#808080] h-8 mx-2"></div>
        <button 
          className="px-2 py-1 bg-[#D4D0C8] border border-[#808080] rounded mr-2 flex items-center"
          onClick={() => {
            if (selectedControlId) {
              const control = controls.find(c => c.id === selectedControlId);
              if (control) {
                handleOpenCodeWindow(selectedControlId);
              }
            } else {
              toast.error("No control selected");
            }
          }}
        >
          <span className="mr-1">📝</span> View Code
        </button>
        <button 
          className="px-2 py-1 bg-[#D4D0C8] border border-[#808080] rounded mr-2 flex items-center"
          onClick={() => {
            if (mainWindowVisible && !minimizedWindows['main']) {
              toast.success("Form view active");
            } else {
              setMainWindowVisible(true);
              setMinimizedWindows({...minimizedWindows, main: false});
            }
          }}
        >
          <span className="mr-1">📄</span> Form
        </button>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 w-full h-6 bg-[#D4D0C8] border-t border-[#808080] flex items-center px-2 text-sm">
        <div className="flex-1">
          {isRunning ? "Running..." : isInDesignMode ? "Design" : "Break"}
        </div>
        <div className="px-2 border-l border-[#808080]">
          {selectedControlId ? selectedControlId : "Project1"}
        </div>
        <div className="px-2 border-l border-[#808080]">
          {projectIsDirty ? "Modified" : "Saved"}
        </div>
      </div>

      {/* ToolBox */}
      <ToolBox onDragStart={(control) => console.log(`Started dragging ${control}`)} />

      {/* Main Form Designer Window */}
      {mainWindowVisible && (
        <div 
          ref={mainWindowRef}
          className={cn(
            "absolute bg-[#F0F0F0] border-2 border-[#000080] rounded shadow-md",
            minimizedWindows['main'] ? 'h-8 overflow-hidden' : ''
          )}
          style={{ zIndex: 10 }}
        >
          <TitleBar 
            title="Form1.frm [Design]" 
            windowRef={mainWindowRef}
            onClose={() => setMainWindowVisible(false)}
            onMinimize={() => toggleMinimize('main')}
          />
          {!minimizedWindows['main'] && (
            <div className="h-[calc(100%-28px)] overflow-hidden">
              <DesignerCanvas 
                onControlSelected={setSelectedControlId} 
                controls={controls}
                setControls={setControls}
                onOpenCodeWindow={handleOpenCodeWindow}
              />
            </div>
          )}
        </div>
      )}

      {/* Project Explorer Window */}
      {projectWindowVisible && (
        <div 
          ref={projectWindowRef}
          className={cn(
            "absolute bg-[#F0F0F0] border-2 border-[#000080] rounded shadow-md",
            minimizedWindows['project'] ? 'h-8 overflow-hidden' : ''
          )}
          style={{ zIndex: 20 }}
        >
          <TitleBar 
            title="Project Explorer" 
            windowRef={projectWindowRef}
            onClose={() => setProjectWindowVisible(false)}
            onMinimize={() => toggleMinimize('project')}
          />
          {!minimizedWindows['project'] && (
            <div className="h-[calc(100%-28px)] overflow-hidden">
              <ProjectExplorer 
                onSelectFile={handleFileSelected}
                onCreateNewFile={handleCreateNewFile}
              />
            </div>
          )}
        </div>
      )}

      {/* Properties Window */}
      {propertyWindowVisible && (
        <div 
          ref={propertyWindowRef}
          className={cn(
            "absolute bg-[#F0F0F0] border-2 border-[#000080] rounded shadow-md",
            minimizedWindows['property'] ? 'h-8 overflow-hidden' : ''
          )}
          style={{ zIndex: 20 }}
        >
          <TitleBar 
            title="Properties" 
            windowRef={propertyWindowRef}
            onClose={() => setPropertyWindowVisible(false)}
            onMinimize={() => toggleMinimize('property')}
          />
          {!minimizedWindows['property'] && (
            <div className="h-[calc(100%-28px)] overflow-hidden">
              <PropertyGrid 
                selectedControl={getSelectedControl()} 
                onPropertyChange={handlePropertyChange}
              />
            </div>
          )}
        </div>
      )}

      {/* Code Window */}
      {codeWindowVisible && (
        <CodeEditor 
          controlId={currentCodeControlId}
          onClose={() => setCodeWindowVisible(false)}
        />
      )}

      {/* Dialogs */}
      {showAboutDialog && (
        <AboutDialog onClose={() => setShowAboutDialog(false)} />
      )}
      
      {showNewProjectDialog && (
        <NewProjectDialog onClose={() => setShowNewProjectDialog(false)} />
      )}
      
      {showOpenProjectDialog && (
        <OpenProjectDialog onClose={() => setShowOpenProjectDialog(false)} />
      )}
    </div>
  );
};

export default Index;

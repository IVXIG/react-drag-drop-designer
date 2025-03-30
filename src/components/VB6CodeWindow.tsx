
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface VB6CodeWindowProps {
  selectedControlId: string | null;
  controls: any[];
}

const VB6CodeWindow: React.FC<VB6CodeWindowProps> = ({ selectedControlId, controls }) => {
  const [code, setCode] = useState<string>('');
  const [activeCodeType, setActiveCodeType] = useState<'events' | 'declarations'>('events');
  
  useEffect(() => {
    if (selectedControlId) {
      const selectedControl = controls.find(control => control.id === selectedControlId);
      if (selectedControl) {
        // Generate sample VB6-style code for the selected control
        const generatedCode = generateVB6Code(selectedControl);
        setCode(generatedCode);
        toast(`Editing code for ${selectedControl.type} ${selectedControl.id}`);
      }
    } else {
      // If no control is selected, show the form's code
      setCode(generateFormCode());
    }
  }, [selectedControlId, controls]);
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };
  
  const handleRunCode = () => {
    toast.success("Code executed (simulation)");
    console.log("Running VB6 code:", code);
  };
  
  const generateVB6Code = (control: any) => {
    const { type, id, text } = control;
    const controlName = text || id;
    
    switch(type) {
      case 'CommandButton':
        return `Private Sub ${controlName}_Click()
  ' Add your code here
  MsgBox "Button clicked!"
End Sub

Private Sub ${controlName}_GotFocus()
  ' Add your code here
End Sub`;
      
      case 'TextBox':
        return `Private Sub ${controlName}_Change()
  ' Add your code here
End Sub

Private Sub ${controlName}_KeyPress(KeyAscii As Integer)
  ' Add your code here
End Sub`;
      
      case 'CheckBox':
        return `Private Sub ${controlName}_Click()
  ' Add your code here
  If ${controlName}.Value = 1 Then
    ' Checked
  Else
    ' Unchecked
  End If
End Sub`;
      
      case 'OptionButton':
        return `Private Sub ${controlName}_Click()
  ' Add your code here
  If ${controlName}.Value = True Then
    ' Selected
  End If
End Sub`;
      
      case 'ComboBox':
      case 'ListBox':
        return `Private Sub ${controlName}_Click()
  ' Add your code here
End Sub

Private Sub ${controlName}_Change()
  ' Selected item: ${controlName}.Text
  ' Selected index: ${controlName}.ListIndex
End Sub`;
      
      default:
        return `' No specific events for ${type} control ${controlName}`;
    }
  };
  
  const generateFormCode = () => {
    return `VERSION 5.00
Begin VB.Form Form1
   Caption         =   "Form1"
   ClientHeight    =   3195
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   4680
   LinkTopic       =   "Form1"
   ScaleHeight     =   3195
   ScaleWidth      =   4680
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "Form1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

' Form level declarations
Dim FormLoaded As Boolean

Private Sub Form_Load()
  ' Add your form initialization code here
  FormLoaded = True
  
  ' Initialize controls
  ' Example: Command1.Caption = "Click Me"
End Sub

Private Sub Form_Unload(Cancel As Integer)
  ' Add your form cleanup code here
  Dim Response As Integer
  
  ' Example: Ask for confirmation
  'Response = MsgBox("Are you sure you want to exit?", vbYesNo + vbQuestion, "Confirm Exit")
  'If Response = vbNo Then
  '  Cancel = 1
  'End If
End Sub`;
  };

  return (
    <div className="bg-white h-full w-full flex flex-col overflow-hidden">
      <div className="p-1 bg-gray-300 border-b border-gray-400 text-xs font-bold flex">
        <div 
          className={`px-2 py-1 cursor-pointer ${activeCodeType === 'events' ? 'bg-white' : ''}`}
          onClick={() => setActiveCodeType('events')}
        >
          Events
        </div>
        <div 
          className={`px-2 py-1 cursor-pointer ${activeCodeType === 'declarations' ? 'bg-white' : ''}`}
          onClick={() => setActiveCodeType('declarations')}
        >
          Declarations
        </div>
        <div className="ml-auto flex gap-1">
          <button 
            className="bg-[#D4D0C8] border border-black px-2 text-xs"
            onClick={handleRunCode}
          >
            Run
          </button>
        </div>
      </div>
      <textarea
        className="flex-1 p-2 font-mono text-xs resize-none focus:outline-none bg-white text-black w-full h-full"
        value={code}
        onChange={handleCodeChange}
        spellCheck={false}
      />
    </div>
  );
};

export default VB6CodeWindow;

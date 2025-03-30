
import React, { useState, useEffect } from 'react';

interface VB6CodeWindowProps {
  selectedControlId: string | null;
  controls: any[];
}

const VB6CodeWindow: React.FC<VB6CodeWindowProps> = ({ selectedControlId, controls }) => {
  const [code, setCode] = useState<string>('');
  
  useEffect(() => {
    if (selectedControlId) {
      const selectedControl = controls.find(control => control.id === selectedControlId);
      if (selectedControl) {
        // Generate sample VB6-style code for the selected control
        const generatedCode = generateVB6Code(selectedControl);
        setCode(generatedCode);
      }
    } else {
      // If no control is selected, show the form's code
      setCode(generateFormCode());
    }
  }, [selectedControlId, controls]);
  
  const generateVB6Code = (control: any) => {
    const { type, id, text } = control;
    
    switch(type) {
      case 'CommandButton':
        return `Private Sub ${id}_Click()\n  ' Add your code here\n  MsgBox "Button clicked!"\nEnd Sub\n\nPrivate Sub ${id}_GotFocus()\n  ' Add your code here\nEnd Sub`;
      
      case 'TextBox':
        return `Private Sub ${id}_Change()\n  ' Add your code here\nEnd Sub\n\nPrivate Sub ${id}_KeyPress(KeyAscii As Integer)\n  ' Add your code here\nEnd Sub`;
      
      case 'CheckBox':
        return `Private Sub ${id}_Click()\n  ' Add your code here\n  If ${id}.Value = 1 Then\n    ' Checked\n  Else\n    ' Unchecked\n  End If\nEnd Sub`;
      
      case 'OptionButton':
        return `Private Sub ${id}_Click()\n  ' Add your code here\n  If ${id}.Value = True Then\n    ' Selected\n  End If\nEnd Sub`;
      
      case 'ComboBox':
      case 'ListBox':
        return `Private Sub ${id}_Click()\n  ' Add your code here\nEnd Sub\n\nPrivate Sub ${id}_Change()\n  ' Selected item: ${id}.Text\n  ' Selected index: ${id}.ListIndex\nEnd Sub`;
      
      default:
        return `' No specific events for ${type} control ${id}`;
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
Private Sub Form_Load()
  ' Add your form initialization code here
End Sub

Private Sub Form_Unload(Cancel As Integer)
  ' Add your form cleanup code here
End Sub`;
  };

  return (
    <div className="bg-white h-full w-full flex flex-col overflow-hidden">
      <div className="p-1 bg-gray-300 border-b border-gray-400 text-xs font-bold">
        Code Window
      </div>
      <textarea
        className="flex-1 p-2 font-mono text-xs resize-none focus:outline-none bg-white text-black w-full h-full"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
};

export default VB6CodeWindow;

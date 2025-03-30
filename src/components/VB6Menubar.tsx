
import React from 'react';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "@/components/ui/menubar";
import { 
  FilePlus, 
  FolderOpen, 
  PlusSquare, 
  X, 
  Save, 
  FileOutput, 
  Clock, 
  Printer, 
  LogOut 
} from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const VB6Menubar = () => {
  // تنفيذ وظائف قائمة File
  const handleNewProject = () => {
    console.log("إنشاء مشروع جديد");
    alert("تم بدء إنشاء مشروع جديد");
  };

  const handleOpenProject = () => {
    console.log("فتح مشروع موجود");
    alert("تم فتح نافذة اختيار المشروع");
  };

  const handleAddProject = () => {
    console.log("إضافة مشروع آخر إلى المشروع الحالي");
    alert("تم فتح نافذة إضافة مشروع");
  };

  const handleCloseProject = () => {
    console.log("إغلاق المشروع الحالي");
    alert("تم إغلاق المشروع الحالي");
  };

  const [showSaveDialog, setShowSaveDialog] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleSave = () => {
    console.log("حفظ المشروع الحالي في جهاز الكمبيوتر");
    setShowSaveDialog(true);
    
    // Simulate the saving process with a delay
    setTimeout(() => {
      // Create actual file content for VB6 project
      const vbpContent = 
`Type=Exe
Reference=*\G{00020430-0000-0000-C000-000000000046}#2.0#0#..\..\..\..\Windows\SysWOW64\stdole2.tlb#OLE Automation
Reference=*\G{00000205-0000-0010-8000-00AA006D2EA4}#2.5#0#..\..\..\..\Program Files (x86)\Common Files\System\ado\msado25.tlb#Microsoft ActiveX Data Objects 2.5 Library
Form=Form1.frm
Module=Module1; Module1.bas
Class=Class1; Class1.cls
IconForm="Form1"
Startup="Form1"
Command32=""
Name="Project1"
HelpContextID="0"
CompatibleMode="0"
MajorVer=1
MinorVer=0
RevisionVer=0
AutoIncrementVer=0
ServerSupportFiles=0
VersionCompanyName="My Company"
CompilationType=0
OptimizationType=0
FavorPentiumPro(tm)=0
CodeViewDebugInfo=0
NoAliasing=0
BoundsCheck=0
OverflowCheck=0
FlPointCheck=0
FDIVCheck=0
UnroundedFP=0
StartMode=0
Unattended=0
Retained=0
ThreadPerObject=0
MaxNumberOfThreads=1`;

      // Create the file and trigger download
      const element = document.createElement("a");
      const file = new Blob([vbpContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = "MyProject.vbp";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      setSaveSuccess(true);
      
      // Hide the success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
        setShowSaveDialog(false);
      }, 3000);
    }, 1500);
  };

  const handleSaveAs = () => {
    console.log("حفظ المشروع تحت اسم مختلف");
    alert("تم فتح نافذة حفظ باسم");
  };

  const handleExportProject = () => {
    console.log("تصدير المشروع إلى صيغة أخرى");
    alert("تم فتح نافذة تصدير المشروع");
  };

  const handleRecentFiles = () => {
    console.log("عرض أحدث الملفات التي تم فتحها");
    alert("جاري عرض الملفات الحديثة");
  };

  const handlePrint = () => {
    console.log("طباعة المشروع أو الكود البرمجي");
    alert("تم فتح نافذة الطباعة");
  };

  const handleExit = () => {
    console.log("الخروج من برنامج VB6");
    if (confirm("هل أنت متأكد من الخروج من البرنامج؟")) {
      alert("تم الخروج من البرنامج");
    }
  };

  return (
    <div className="w-full bg-[#D4D0C8] border-b border-gray-400">
      <Menubar className="border-0 rounded-none bg-[#D4D0C8] px-1">
        <MenubarMenu>
          <MenubarTrigger className="text-black font-normal hover:bg-blue-700 hover:text-white data-[state=open]:bg-blue-700 data-[state=open]:text-white">File</MenubarTrigger>
          <MenubarContent className="bg-[#D4D0C8] text-black border border-gray-400">
            <MenubarItem 
              className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white"
              onClick={handleNewProject}
            >
              <FilePlus className="mr-2 h-4 w-4" />
              New Project
              <MenubarShortcut>Ctrl+N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem 
              className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white"
              onClick={handleOpenProject}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              Open Project
              <MenubarShortcut>Ctrl+O</MenubarShortcut>
            </MenubarItem>
            <MenubarItem 
              className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white"
              onClick={handleAddProject}
            >
              <PlusSquare className="mr-2 h-4 w-4" />
              Add Project
            </MenubarItem>
            <MenubarItem 
              className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white"
              onClick={handleCloseProject}
            >
              <X className="mr-2 h-4 w-4" />
              Close Project
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem 
              className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white"
              onClick={handleSave}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
              <MenubarShortcut>Ctrl+S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem 
              className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white"
              onClick={handleSaveAs}
            >
              <Save className="mr-2 h-4 w-4" />
              Save As...
            </MenubarItem>
            <MenubarItem 
              className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white"
              onClick={handleExportProject}
            >
              <FileOutput className="mr-2 h-4 w-4" />
              Export Project
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem 
              className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white"
              onClick={handleRecentFiles}
            >
              <Clock className="mr-2 h-4 w-4" />
              Recent Files
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem 
              className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white"
              onClick={handlePrint}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
              <MenubarShortcut>Ctrl+P</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem 
              className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white"
              onClick={handleExit}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Exit
              <MenubarShortcut>Alt+F4</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="text-black font-normal hover:bg-blue-700 hover:text-white data-[state=open]:bg-blue-700 data-[state=open]:text-white">Edit</MenubarTrigger>
          <MenubarContent className="bg-[#D4D0C8] text-black border border-gray-400">
            <MenubarItem className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white">Placeholder</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="text-black font-normal hover:bg-blue-700 hover:text-white data-[state=open]:bg-blue-700 data-[state=open]:text-white">View</MenubarTrigger>
          <MenubarContent className="bg-[#D4D0C8] text-black border border-gray-400">
            <MenubarItem className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white">Placeholder</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="text-black font-normal hover:bg-blue-700 hover:text-white data-[state=open]:bg-blue-700 data-[state=open]:text-white">Help</MenubarTrigger>
          <MenubarContent className="bg-[#D4D0C8] text-black border border-gray-400">
            <MenubarItem className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white">About</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {/* Save dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent className="bg-[#D4D0C8] border border-gray-400">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {saveSuccess ? "Save Complete" : "Saving Project"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {saveSuccess 
                ? "Your project has been saved successfully to your device." 
                : "Please wait while your project is being saved..."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {saveSuccess && (
              <AlertDialogAction className="bg-blue-700 text-white hover:bg-blue-800">
                OK
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VB6Menubar;

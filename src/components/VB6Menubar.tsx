import React from 'react';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
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

  const handleSave = () => {
    console.log("حفظ المشروع الحالي في جهاز الكمبيوتر");
    
    // Simulate downloading a file
    const element = document.createElement("a");
    const file = new Blob(["// Visual Basic 6.0 Project"], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "myproject.vbp";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    alert("تم حفظ المشروع في جهازك");
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
    </div>
  );
};

export default VB6Menubar;

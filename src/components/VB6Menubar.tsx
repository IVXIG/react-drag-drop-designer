
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

const VB6Menubar = () => {
  return (
    <div className="w-full bg-[#D4D0C8] border-b border-gray-400">
      <Menubar className="border-0 rounded-none bg-[#D4D0C8] px-1">
        <MenubarMenu>
          <MenubarTrigger className="text-black font-normal hover:bg-blue-700 hover:text-white data-[state=open]:bg-blue-700 data-[state=open]:text-white">File</MenubarTrigger>
          <MenubarContent className="bg-[#D4D0C8] text-black border border-gray-400">
            <MenubarItem className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white">
              New Project
              <MenubarShortcut>Ctrl+N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white">
              Open Project
              <MenubarShortcut>Ctrl+O</MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white">
              Add Project
            </MenubarItem>
            <MenubarItem className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white">
              Close Project
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white">
              Save
              <MenubarShortcut>Ctrl+S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white">
              Save As...
            </MenubarItem>
            <MenubarItem className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white">
              Export Project
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white">
              Recent Files
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white">
              Print
              <MenubarShortcut>Ctrl+P</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem className="hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white">
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

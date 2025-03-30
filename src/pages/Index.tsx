
import React from 'react';
import VB6Menubar from '../components/VB6Menubar';
import VB6Toolbox from '../components/VB6Toolbox';
import VB6DesignArea from '../components/VB6DesignArea';

const Index = () => {
  return (
    <div className="w-full h-screen flex flex-col bg-[#D4D0C8]">
      <VB6Menubar />
      <div className="flex-1 flex">
        <VB6Toolbox />
        <div className="flex-1 p-2">
          <div className="bg-[#D4D0C8] border border-gray-400 h-full flex flex-col">
            <div className="p-1 bg-gray-300 border-b border-gray-400 text-xs font-bold">
              Form1
            </div>
            <VB6DesignArea />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

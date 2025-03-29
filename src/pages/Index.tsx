
import React from 'react';
import VB6Menubar from '../components/VB6Menubar';

const Index = () => {
  return (
    <div className="w-full h-screen flex flex-col bg-[#D4D0C8]">
      <VB6Menubar />
      <div className="flex-1">
        <iframe 
          src="/vb6.html" 
          className="w-full h-full border-none"
          title="Microsoft Visual Basic 6.0"
        />
      </div>
    </div>
  );
};

export default Index;

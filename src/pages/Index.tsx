
import React, { useState, useRef, useEffect } from 'react';
import { toast } from "sonner";

const Index = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <iframe 
        src="/vb6.html" 
        className="w-full h-full border-none"
        title="VB6 IDE"
      />
    </div>
  );
};

export default Index;

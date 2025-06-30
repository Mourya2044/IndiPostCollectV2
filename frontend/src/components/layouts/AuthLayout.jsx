import React, {useMemo} from 'react';
import { BubbleEffect } from '../BubbleEffect';

const AuthLayout = ({ children }) => {
  const bubbles = useMemo(()=>{
    return (
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BubbleEffect />
        <BubbleEffect />
      </div>
    );  
  },[]);

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Left Form Section */}
      <div className="w-full md:w-[60vw] px-12 py-12 flex flex-col justify-center relative z-30">
        <h2 className="text-2xl font-semibold text-IPCprimary mb-4 py-1">
          IndiPostCollect
        </h2>
        {children}
      </div>

      {/* Right India Post Design Section */}
      <div className="hidden md:block md:w-[40vw] bg-gradient-to-br from-IPCprimary via-IPCprimary to-IPCprimary relative">
        {/* Floating bubbles */}
        {bubbles}

        {/* Info Card moved to top */}
        <div className="absolute top-12 left-12 bg-white rounded-xl shadow-xl p-6 w-72 text-Postalprimary-bg z-20">
          <img
            src="/India Post New Logo.png"
            alt="India Post Logo"
            className="w-24 h-24 object-contain mb-4 rounded-full"
          />
          <h3 className="text-lg font-semibold mb-1 text-IPCprimary">
            Indian Postal Services
          </h3>
          <p className="text-sm text-gray-700">
            Delivering trust across the nation since 1854.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

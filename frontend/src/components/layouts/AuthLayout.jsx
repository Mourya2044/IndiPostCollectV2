import React, { useMemo } from 'react';
import { BubbleEffect } from '../BubbleEffect';

const AuthLayout = ({ children }) => {
  const bubbles = useMemo(() => {
    return (
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <BubbleEffect />
        <BubbleEffect />
      </div>
    );
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-background overflow-hidden font-sans">
      {/* Left Form Section */}
      <div className="w-full md:w-[60vw] px-8 md:px-16 py-12 flex flex-col justify-center relative z-30">
        <h2 className="text-2xl font-light text-foreground mb-12 tracking-widest uppercase">
          IndiPostCollect
        </h2>
        {children}
      </div>

      {/* Right India Post Design Section */}
      <div className="hidden md:flex md:w-[40vw] bg-IPCprimary relative border-l border-border flex-col items-center justify-center p-12">
        {bubbles}

        {/* Sharp Info Card */}
        <div className="bg-background border border-border p-8 w-80 z-20 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-IPCsecondary/10 -translate-y-1/2 translate-x-1/2 rounded-full" />
          
          <img
            src="/India Post New Logo.png"
            alt="India Post Logo"
            className="w-20 h-20 object-contain mb-6"
          />
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            Indian Postal Services
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Delivering trust across the nation since 1854. Authentic stamps, verified collectors.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

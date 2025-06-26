import React from 'react';
import { BubbleEffect } from '../BubbleEffect';

const AuthLayout = ({ children }) => {
  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Left Form Section */}
      <div className="w-full md:w-[60vw] px-12 py-12 flex flex-col justify-center relative z-30">
        <h2 className="text-2xl font-semibold text-Postalprimary-bg mb-4">
          IndiPostCollect
        </h2>
        {children}
      </div>

      {/* Right India Post Design Section */}
      <div className="hidden md:block md:w-[40vw] bg-gradient-to-br from-red-900 via-Postalprimary-bg to-red-800 relative">
        {/* Floating bubbles */}
        <BubbleEffect />
        <BubbleEffect />

        {/* Info Card moved to top */}
        <div className="absolute top-12 left-12 bg-white rounded-xl shadow-xl p-6 w-72 text-Postalprimary-bg z-20">
          <img
            src="/India Post New Logo.png"
            alt="India Post Logo"
            className="w-24 h-24 object-contain mb-4 rounded-full"
          />
          <h3 className="text-lg font-semibold mb-1">
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

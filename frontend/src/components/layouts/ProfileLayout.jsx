import React from 'react';
import { BubbleEffect } from '../BubbleEffect';

const ProfileLayout = ({ children }) => {
  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-white overflow-hidden">

      {/* Left India Post Design Section */}
      <div className="hidden md:block md:w-[20vw] bg-gradient-to-br from-[#da251c] via-[#b71c1c] to-[#8e0000] relative overflow-hidden">
        <BubbleEffect />
        
      </div>

      {/* Middle Profile Section */}
      <div className="w-full md:w-[70vw] px-8 md:px-16 py-10 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-[#da251c] mb-6">Your Profile</h2>
        {children}
      </div>

      {/* Right India Post Design Section */}
      <div className="hidden md:block md:w-[20vw] bg-gradient-to-br from-[#da251c] via-[#b71c1c] to-[#8e0000] relative overflow-hidden">
        <BubbleEffect />
      </div>
    </div>
  );
};

export default ProfileLayout;

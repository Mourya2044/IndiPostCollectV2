import React from 'react';

const ProfileLayout = ({ children }) => {
  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      
      {/* Left India Post Design Section */}
      <div className="hidden md:block md:w-[20vw] bg-gradient-to-br from-[#da251c] via-[#b71c1c] to-[#8e0000] relative">
        {/* Floating yellow design elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#ffd700] opacity-20 rounded-full"></div>
        <div className="absolute bottom-20 right-16 w-24 h-24 bg-[#ffd700] opacity-20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-[#ffd700] opacity-30 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Middle Profile Section */}
      <div className="w-full md:w-[70vw] px-8 md:px-16 py-10 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-[#da251c] mb-6">Your Profile</h2>
        {children}
      </div>

      {/* Right India Post Design Section */}
      <div className="hidden md:block md:w-[20vw] bg-gradient-to-br from-[#da251c] via-[#b71c1c] to-[#8e0000] relative">
        {/* Floating yellow design elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#ffd700] opacity-20 rounded-full"></div>
        <div className="absolute bottom-20 right-16 w-24 h-24 bg-[#ffd700] opacity-20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-[#ffd700] opacity-30 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
};

export default ProfileLayout;

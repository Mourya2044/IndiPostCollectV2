import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Left Form Section */}
      <div className="w-full md:w-[60vw] px-12 py-12 flex flex-col justify-center relative z-30">
        <h2 className="text-2xl font-semibold text-[#da251c] mb-4">IndiPostCollect</h2>
        {children}
      </div>

      {/* Right India Post Design Section */}
      <div className="hidden md:block md:w-[40vw] bg-gradient-to-br from-[#da251c] via-[#b71c1c] to-[#8e0000] relative">
        {/* Floating yellow circles */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#ffd700] opacity-20 rounded-full"></div>
        <div className="absolute bottom-20 right-16 w-24 h-24 bg-[#ffd700] opacity-20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-[#ffd700] opacity-30 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

        {/* Info Card with Logo */}
        <div className="absolute bottom-12 left-12 bg-white rounded-xl shadow-xl p-6 w-72 text-[#da251c]">
          <img
            src="/India Post New Logo.png"
            alt="India Post Logo"
            className="w-24 h-24 object-contain mb-4 rounded-full"
          />
          <h3 className="text-lg font-semibold mb-1">Indian Postal Services</h3>
          <p className="text-sm text-gray-700">Delivering trust across the nation since 1854.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md p-10 text-white">
        <h2 className="text-3xl font-bold text-center mb-8 tracking-wide">
          IndiPost<span className="text-blue-400">Collect</span>
        </h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

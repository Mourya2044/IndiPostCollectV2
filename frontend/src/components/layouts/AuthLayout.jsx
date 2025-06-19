import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-600 to-black">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md shadow-xl text-white">
        <h2 className="text-2xl font-semibold text-center mb-6">IndiPostCollect</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

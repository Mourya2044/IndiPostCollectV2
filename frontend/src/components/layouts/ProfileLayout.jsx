import React from 'react';

const ProfileLayout = ({ children }) => {
  return (
    <div className="w-screen h-screen flex flex-col bg-gradient-to-br from-IPCprimary to-IPCprimary text-IPClight-bg overflow-hidden">
      <header className="w-full px-6 py-4 shadow-md bg-IPClight-bg text-IPCprimary">
        <h1 className="text-3xl px-7 font-bold">Your Profile</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-6 md:px-16 py-8 bg-white  shadow-inner text-[#3b3b3b]">
        {children}
      </main>
    </div>
  );
};

export default ProfileLayout;

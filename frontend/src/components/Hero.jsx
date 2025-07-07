import React from 'react'

const Hero = () => {
  return (
    <div className='bg-[url("/home.png")] h-[80vh] bg-cover bg-center w-full flex items-center justify-center'>
      <div className="w-full md:w-1/2 flex-1/2 text-IPClight-bg p-10">
        <h1 className='text-6xl mb-5'>Relive History, One Stamp at a Time.</h1>
        <p className='text-lg'>The most interesting thing about a postage stamp is the persistence with which it sticks to its job. - Napoleon Hill</p>
      </div>
      <div className="w-0 md:w-1/2 flex-1/2" />
    </div>
  )
}

export default Hero

export const HeroSecondary = ({ headline, subtitle, cta }) => {
  return (
    <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm scale-110 "
        style={{
          backgroundImage: "url('/marketplacestampimg.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-black opacity-30" />

      {/* Text Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-light mb-6">{headline}</h1>

        <p className="text-lg mb-10 font-light">{subtitle}</p>

        <button
        onClick={() => {
        const element = document.getElementById('collection');
        if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      }}
      className="inline-block px-8 py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
      >
      {cta}
      </button>

      </div>
    </div>
  );
};
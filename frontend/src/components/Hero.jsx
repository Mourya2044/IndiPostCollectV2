import React from 'react'

const Hero = () => {
  return (
    <div className='bg-[url("/home.png")] h-[80vh] bg-cover bg-center w-full flex items-center justify-center'>
      <div className="w-full md:w-50 flex-1 text-IPClight-bg p-10">
        <h1 className='text-6xl mb-5'>Relive History, One Stamp at a Time.</h1>
        <p className='text-lg'>The most interesting thing about a postage stamp is the persistence with which it sticks to its job. - Napoleon Hill</p>
      </div>
      <div className="hidden md:w-50 flex-1" />
    </div>
  )
}

export default Hero

export const HeroMarketplace = () => {
  return (
    <div className="w-full p-20 bg-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-8 leading-tight">
          Rare Stamps
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-12 font-light">
          Discover and collect authenticated rare stamps from trusted dealers worldwide.
        </p>

        {/* Single CTA */}
        <div className="px-8 py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors">
          EXPLORE COLLECTION
        </div>
      </div>
    </div>
  );
}
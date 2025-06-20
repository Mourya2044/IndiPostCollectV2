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

export const Hero2 = () => {

  return (
    <div className="w-full h-[30vh] bg-gradient-to-br from-[#da251c] via-[#b71c1c] to-[#8e0000] overflow-hidden">
      {/* bg elements */}
      <div className="relative">
        {/* <div className="absolute left-10 w-20 h-20 bg-[#ffeb7b] opacity-50 rounded-full blur-3xl animate-pulse delay-1000" /> */}
        <div className="absolute left-32 w-40 h-40 bg-[#ffeb7b] opacity-50 rounded-full blur-3xl animate-pulse delay-750" />
        <div className="absolute right-56 w-60 h-60 bg-[#ffd700] opacity-50 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="relative w-full h-full flex items-center justify-center text-white">
        <h1 className="text-4xl font-bold w-full flex-1 text-center">MARKETPLACE</h1>
      </div>
    </div>
  )
}
import React from 'react'

const Hero = () => {
  return (
    <div className='bg-[url("/home.png")] h-[80vh] bg-cover bg-center w-full flex items-center justify-center'>
      <div className="w-50 flex-1 text-IPClight-bg p-10">
        <h1 className='text-6xl mb-5'>Relive History, One Stamp at a Time.</h1>
        <p className='text-lg'>The most interesting thing about a postage stamp is the persistence with which it sticks to its job. - Napoleon Hill</p>
      </div>
      <div className="w-50 flex-1"/>
    </div>
  )
}

export default Hero
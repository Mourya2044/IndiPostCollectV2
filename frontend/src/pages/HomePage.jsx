import React from 'react'
import Hero from '../components/Hero'

const Home = () => {
  return (
    <div className='flex flex-col items-center h-full bg-gray-100'>
      <Hero />
      <div className='flex flex-col items-center justify-center h-full'>
        <h1 className='text-4xl font-bold text-gray-800 mb-4'>Welcome to IndiPostCollect</h1>
        <p className='text-lg text-gray-600'>Your one-stop destination for Indian postal history and collectibles.</p>
      </div>
    </div>
  )
}

export default Home
import React from 'react'
import { Hero2 } from '../components/Hero'
import Products from '../components/marketplace/Products'

const MarketplacePage = () => {
  return (
    <div className="flex flex-col items-center h-full bg-gray-100 w-full">
        <Hero2 />
        <Products />
    </div>
  )
}

export default MarketplacePage
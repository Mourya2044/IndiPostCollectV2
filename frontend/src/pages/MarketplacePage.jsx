import React from 'react'
import { HeroMarketplace } from '../components/Hero'
import Products from '../components/marketplace/Products'

const MarketplacePage = () => {
  return (
    <div className="flex flex-col items-center h-full bg-gray-100 w-full">
        <HeroMarketplace />
        <Products />
    </div>
  )
}

export default MarketplacePage
import React from 'react'
import { HeroSecondary } from '../components/Hero'
import Products from '../components/stampsDisplay/Products'

const MarketplacePage = () => {
  return (
    <div className="flex flex-col items-center h-full bg-gray-100 w-full">
        <HeroSecondary headline="Rare Stamps" subtitle="Discover and collect authenticated rare stamps from trusted dealers worldwide." cta="EXPLORE COLLECTION" />
        <Products isMuseumPiece={false} />
    </div>
  )
}

export default MarketplacePage
import React from 'react'
import { HeroSecondary } from '../components/Hero'
import Products from '../components/stampsDisplay/Products'


const MarketplacePage = () => {
  return (
    <div
      className="flex flex-col items-center min-h-screen w-full bg-cover bg-center"
    >
      <div className=" w-full">
        <HeroSecondary
          headline="Rare Stamps"
          subtitle="Discover and collect authenticated rare stamps from trusted dealers worldwide."
          cta="EXPLORE COLLECTION"
        />
        <div id="collection" className="max-w-7xl mx-auto w-full px-4 py-8">
          <Products isMuseumPiece={false} />
        </div>
      </div>
    </div>
  )
}

export default MarketplacePage

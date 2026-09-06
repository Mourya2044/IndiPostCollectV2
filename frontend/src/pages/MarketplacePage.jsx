import React from 'react'
import { HeroSecondary } from '../components/Hero'
import Products from '../components/stampsDisplay/Products'

const MarketplacePage = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      <HeroSecondary
        headline="Rare Stamps"
        subtitle="Discover and collect authenticated rare stamps from trusted dealers worldwide."
        cta="Explore Collection"
        isMuseum={false}
      />
      <Products isMuseumPiece={false} />
    </div>
  )
}

export default MarketplacePage

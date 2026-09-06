import React from 'react'
import { HeroSecondary } from '../components/Hero'
import Products from '../components/stampsDisplay/Products'

const MuseumPage = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      <HeroSecondary
        headline="Museum Collection"
        subtitle="Explore our curated archive of museum-quality stamps — preserved pieces of philatelic history."
        cta="View Collection"
        isMuseum={true}
      />
      <Products isMuseumPiece={true} />
    </div>
  )
}

export default MuseumPage
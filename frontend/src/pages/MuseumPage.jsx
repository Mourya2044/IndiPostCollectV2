import React from 'react'
import { HeroSecondary } from '../components/Hero'
import Products from '../components/stampsDisplay/Products'

const MuseumPage = () => {
  return (
    <div className="flex flex-col items-center h-full bg-gray-100 w-full">
        <HeroSecondary headline="Museum Collection" subtitle="Explore our curated collection of museum-quality stamps." cta="VIEW COLLECTION" />
        <Products isMuseumPiece={true} />
    </div>
  )
}

export default MuseumPage
import React from 'react'
import Hero from '../components/Hero'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='flex flex-col items-center h-full bg-gray-100'>
      <Hero />
      {/* History Section */}
      <section className="w-full mx-auto p-10 mb-4 mt-4">
        <h2 className="text-4xl font-bold text-slate-700 mb-6">The History of Stamp Collecting</h2>
        <p className="text-lg text-gray-600 mb-8">Explore the origins and evolution of philately, the art of stamp collecting.</p>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-3xl font-semibold text-slate-700 mb-4">The Penny Black</h3>
          <p className="text-lg text-gray-600 mb-6">
            The world's first adhesive postage stamp, the Penny Black, was issued in the United
            Kingdom in 1840. This groundbreaking stamp revolutionized postal services and sparked the beginning of
            stamp collecting as a hobby.
          </p>
          <Link to="/learn" className="inline-block hover:bg-IPCtext bg-IPCsecondary text-white px-6 py-3 rounded transition-colors duration-300">
            Learn More
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-3xl font-semibold text-slate-700 mb-4">Stamp Collecting Goes Global</h3>
          <p className="text-lg text-gray-600 mb-6">
            As postal services expanded worldwide, stamp collecting quickly became a popular
            pastime among the general public. By the 1860s, the first stamp albums and specialized catalogs were
            introduced, further fueling the growth of philately.
          </p>
          <Link to="/learn" className="inline-block hover:bg-IPCtext bg-IPCsecondary text-white px-6 py-3 rounded transition-colors duration-300">
            Explore History
          </Link>
        </div>
      </section>

      {/* Fascinating Facts Section */}
      <section className="w-full mx-auto p-10 mb-4 mt-4">
        <h2 className="text-4xl font-bold text-slate-700 mb-6">Fascinating Facts About Stamps</h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover the unique stories and characteristics behind some of the world's most remarkable stamps.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-3xl font-semibold text-slate-700 mb-4">The Inverted Jenny</h3>
          <p className="text-lg text-gray-600 mb-6">
            The Inverted Jenny is a rare stamp from the United States featuring an inverted
            picture of a Curtiss JN-4 biplane. This printing error has made it one of the most valuable and
            sought-after stamps in the world.
          </p>
          <Link to="/learn" className="inline-block hover:bg-IPCtext bg-IPCsecondary text-white px-6 py-3 rounded transition-colors duration-300">
            Learn More
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-3xl font-semibold text-slate-700 mb-4">The Blue Mauritius</h3>
          <p className="text-lg text-gray-600 mb-6">
            The Blue Mauritius, also known as the 'Penny Bordeaux', is a rare stamp issued by
            the British colony of Mauritius in 1847. It is considered one of the most valuable and famous stamps in
            the world, with only a few surviving examples.
          </p>
          <Link to="/museum" className="inline-block hover:bg-IPCtext bg-IPCsecondary text-white px-6 py-3 rounded transition-colors duration-300">
            Explore Rare Stamps
          </Link>
        </div>
      </section>

      {/* Start Your Collection Section */}
      <section className="w-full mx-auto p-10 mb-4 mt-4">
        <h2 className="text-4xl font-bold text-slate-700 mb-6">Start Your Stamp Collection</h2>
        <p className="text-lg text-gray-600 mb-8">
          Begin your journey into the world of philately with these helpful tips and resources.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-3xl font-semibold text-slate-700 mb-4">Beginner's Guide to Stamp Collecting</h3>
          <p className="text-lg text-gray-600 mb-6">
            Learn the basics of stamp collecting, including essential tools, storage techniques,
            and how to build a collection that suits your interests.
          </p>
          <Link to="/learn" className="inline-block hover:bg-IPCtext bg-IPCsecondary text-white px-6 py-3 rounded transition-colors duration-300">
            Read Guide
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-3xl font-semibold text-slate-700 mb-4">Stamp Collecting Clubs and Museums</h3>
          <p className="text-lg text-gray-600 mb-6">
            Connect with fellow philatelists, attend local stamp collecting events, and visit
            museums to explore the rich history and culture of stamp collecting.
          </p>
          <Link to="/community" className="inline-block hover:bg-IPCtext bg-IPCsecondary text-white px-6 py-3 rounded transition-colors duration-300">
            Find Local Clubs
          </Link>
        </div>
      </section>

      {/* Dive into the Hobby Section */}
      <section className="w-full mx-auto p-10 mb-4 mt-4">
        <h2 className="text-4xl font-bold text-slate-700 mb-6">Dive into the Hobby</h2>
        <p className="text-lg text-gray-600 mb-8">
          Explore the many ways to engage with the world of stamp collecting.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-3xl font-semibold text-slate-700 mb-4">Start Your Collection</h3>
          <p className="text-lg text-gray-600 mb-6">
            Begin your stamp collection by focusing on a specific theme, country, or historical
            era that interests you. Discover the joy of hunting for rare and unique stamps.
          </p>
          <Link to="/marketplace" className="inline-block hover:bg-IPCtext bg-IPCsecondary text-white px-6 py-3 rounded transition-colors duration-300">
            Browse Stamps
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-3xl font-semibold text-slate-700 mb-4">Join the Community</h3>
          <p className="text-lg text-gray-600 mb-6">
            Connect with fellow stamp collectors, share knowledge, and trade stamps through our
            online platform and local meetups.
          </p>
          <Link to="/community" className="inline-block hover:bg-IPCtext bg-IPCsecondary text-white px-6 py-3 rounded transition-colors duration-300">
            Join Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
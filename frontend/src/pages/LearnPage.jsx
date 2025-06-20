import React, { useState, useEffect } from 'react';

const StampHistoryPage = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const timelineEvents = [
    {
      period: "1840s - The Penny Black Era",
      description: "The world's first postage stamp, the Penny Black, is issued in the United Kingdom, kickstarting the hobby of stamp collecting."
    },
    {
      period: "1860s - Specialized Collections",
      description: "Collectors begin to specialize in particular countries, themes, or time periods, leading to the growth of more focused collections."
    },
    {
      period: "1890s - Stamp Clubs and Societies",
      description: "The first stamp collecting clubs and societies are formed, providing a platform for enthusiasts to connect and share their passion."
    },
    {
      period: "1920s - Stamp Auctions and Dealers",
      description: "The rise of stamp auctions and dealers helps to facilitate the trading and sale of rare and valuable stamps, further fueling the hobby."
    },
    {
      period: "1990s - Digital Philately",
      description: "The internet and digital technology revolutionize the way stamp collectors find, buy, and share their collections, leading to the growth of online communities and marketplaces."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-cover bg-center text-white py-20 px-8 text-center mb-12 relative bg-[url('/history-hero.jpg')]">
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to the History of Stamps
          </h1>
          <p className="text-2xl mb-8">
            Learn about Fascinating history of various stamps.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="p-8">
        
        {/* Origins Section */}
        <div 
          id="origins"
          data-animate
          className={`bg-white rounded-lg p-8 mb-8 shadow-sm transition-all duration-1000 ${
            visibleSections.has('origins') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-black text-3xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
            The Origins of Stamp Collecting
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            Stamp collecting, also known as philately, is the collection and study of postage stamps and other related
            philatelic materials. The hobby of stamp collecting began shortly after the introduction of the world's
            first postage stamp, the Penny Black, in 1840.
          </p>
          <p className="mb-4 leading-relaxed text-gray-700">
            The Penny Black was issued by the United Kingdom and quickly gained popularity among the public, who were
            excited by the convenience of this new way to send letters. Soon, people began collecting these stamps as a
            hobby, and the practice of philately was born.
          </p>
        </div>

        {/* Golden Age Section */}
        <div 
          id="golden-age"
          data-animate
          className={`bg-white rounded-lg p-8 mb-8 shadow-sm transition-all duration-1000 delay-200 ${
            visibleSections.has('golden-age') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-black text-3xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
            The Golden Age of Stamp Collecting
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            The late 19th and early 20th centuries are often referred to as the "Golden Age" of stamp collecting. During
            this time, the number of stamp collectors grew exponentially, and the hobby became increasingly popular
            among the upper and middle classes.
          </p>
          <p className="mb-4 leading-relaxed text-gray-700">
            The rise of the postal system and the increasing availability of stamps from around the world fueled the
            growth of philately. Collectors began to specialize in certain countries, themes, or time periods, and the
            first stamp collecting clubs and societies were formed.
          </p>
        </div>

        {/* Timeline Section */}
        <div 
          id="timeline"
          data-animate
          className={`bg-white rounded-lg p-8 mb-8 shadow-sm transition-all duration-1000 delay-400 ${
            visibleSections.has('timeline') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-black text-3xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
            The Evolution of Philately
          </h2>
          
          <div className="relative pl-8">
            {timelineEvents.map((event, index) => (
              <div key={index} className="relative mb-8 last:mb-0">
                {/* Timeline dot */}
                <div className="absolute -left-6 top-0 w-3 h-3 bg-[#da251c] rounded-full"></div>
                
                <h3 className="text-black text-xl font-bold mb-2">{event.period}</h3>
                <p className="text-gray-700 leading-relaxed">{event.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div 
          id="impact"
          data-animate
          className={`bg-white rounded-lg p-8 mb-8 shadow-sm transition-all duration-1000 delay-600 ${
            visibleSections.has('impact') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-black text-3xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
            The Impact of Stamp Collecting
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            Stamp collecting has had a significant impact on various aspects of society, including:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li className="leading-relaxed">
              Promoting global awareness and cultural exchange by exposing collectors to stamps from around the world
            </li>
            <li className="leading-relaxed">
              Serving as a valuable educational tool, teaching about history, geography, and the development of
              transportation and communication
            </li>
            <li className="leading-relaxed">
              Providing economic opportunities through the buying, selling, and trading of rare and valuable stamps
            </li>
            <li className="leading-relaxed">
              Fostering a sense of community and fellowship among philatelists, who share a common passion for the
              hobby
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StampHistoryPage;
import React from 'react'

const Hero = () => {
  return (
    <div className='bg-[url("/home.png")] h-[80vh] bg-cover bg-center w-full flex items-center justify-center'>
      <div className="w-full md:w-1/2 flex-1/2 text-IPClight-bg p-10">
        <h1 className='text-6xl mb-5'>Relive History, One Stamp at a Time.</h1>
        <p className='text-lg'>The most interesting thing about a postage stamp is the persistence with which it sticks to its job. - Napoleon Hill</p>
      </div>
      <div className="w-0 md:w-1/2 flex-1/2" />
    </div>
  )
}

export default Hero

export const HeroSecondary = ({ headline, subtitle, cta, isMuseum = false }) => {
  return (
    <div className="relative w-full h-[52vh] min-h-[340px] flex items-end overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-IPCprimary" />

      {/* Geometric accent shapes */}
      <div className="absolute top-0 right-0 w-[45%] h-full opacity-10">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full border-[40px] border-IPClight-bg" />
        <div className="absolute bottom-[-20%] right-[15%] w-64 h-64 rounded-full border-[24px] border-IPCsecondary" />
      </div>
      <div className="absolute top-8 left-[55%] w-px h-32 bg-white/10" />
      <div className="absolute top-8 left-[55%] w-24 h-px bg-white/10" />

      {/* Bottom decorative strip */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-IPCsecondary" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-8 pb-14 pt-16">
        {/* Eyebrow label */}
        <p className="text-IPCtext text-xs tracking-[0.3em] uppercase mb-4 font-medium">
          {isMuseum ? '— Museum Collection' : '— Marketplace'}
        </p>

        <h1 className="text-5xl md:text-6xl font-light text-white mb-5 leading-tight">
          {headline}
        </h1>

        <div className="flex items-center gap-8">
          <p className="text-white/60 text-sm font-light max-w-md leading-relaxed">
            {subtitle}
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('collection');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="shrink-0 inline-flex items-center gap-3 px-7 py-3 bg-IPCsecondary text-white text-xs tracking-widest uppercase font-semibold hover:bg-IPCsecondary/90 transition-all duration-200"
          >
            {cta}
            <span className="text-lg leading-none">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const timelineEvents = [
  { year: '1840', title: 'Penny Black Era', description: "The world's first postage stamp is issued in the United Kingdom, kickstarting the hobby of stamp collecting." },
  { year: '1860', title: 'Specialized Collections', description: 'Collectors begin to specialize in particular countries, themes, or time periods, leading to more focused collections.' },
  { year: '1890', title: 'Clubs & Societies', description: 'The first stamp collecting clubs and societies are formed, providing platforms for enthusiasts to connect and share.' },
  { year: '1920', title: 'Auctions & Dealers', description: 'The rise of stamp auctions and dealers facilitates trading of rare and valuable stamps, further fueling the hobby.' },
  { year: '1990', title: 'Digital Philately', description: 'The internet revolutionizes how collectors find, buy, and share their collections, spawning global online communities.' },
];

const LearnPage = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [activeYear, setActiveYear] = useState(0);

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
    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const animClass = (id, delay = '') =>
    `transition-all duration-700 ${delay} ${visibleSections.has(id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`;

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <div className="relative bg-IPCprimary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full border-[80px] border-white translate-x-40 -translate-y-40" />
        </div>
        <div className="relative max-w-4xl mx-auto px-8 py-24">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-IPCtext mb-4">Philately</p>
          <h1 className="text-5xl font-light text-white leading-tight mb-4">
            The History of Stamps
          </h1>
          <p className="text-lg text-white/60 max-w-xl leading-relaxed">
            Explore the fascinating origins and evolution of philately — the art and science of stamp collecting.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-0">

        {/* ── Origins ── */}
        <section
          id="origins"
          data-animate
          className={`border border-border p-8 mb-px ${animClass('origins')}`}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-IPCsecondary mb-3">Origins</p>
          <h2 className="text-2xl font-semibold text-foreground mb-5">The Birth of Philately</h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Stamp collecting, also known as philately, is the collection and study of postage stamps and related materials.
              The hobby began shortly after the introduction of the world's first postage stamp — the <strong className="text-foreground">Penny Black</strong> — in 1840.
            </p>
            <p>
              Issued by the United Kingdom and quickly gaining popularity, people began saving these adhesive labels as a hobby.
              The practice spread globally within a single decade, making philately one of the world's most popular pastimes.
            </p>
          </div>
        </section>

        {/* ── Golden Age ── */}
        <section
          id="golden-age"
          data-animate
          className={`border border-border p-8 mb-px ${animClass('golden-age', 'delay-100')}`}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-IPCsecondary mb-3">Growth</p>
          <h2 className="text-2xl font-semibold text-foreground mb-5">The Golden Age</h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              The late 19th and early 20th centuries are often called the "Golden Age" of stamp collecting. During this period,
              the number of stamp collectors grew exponentially, and the hobby became increasingly popular among the upper and middle classes.
            </p>
            <p>
              Collectors began to specialize in certain countries, themes, or time periods, and the first stamp collecting clubs
              and societies were formed to share knowledge and foster community among enthusiasts.
            </p>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section
          id="timeline"
          data-animate
          className={`border border-border p-8 mb-px ${animClass('timeline', 'delay-200')}`}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-IPCsecondary mb-3">Timeline</p>
          <h2 className="text-2xl font-semibold text-foreground mb-8">The Evolution of Philately</h2>

          <div className="flex gap-2 mb-8 flex-wrap">
            {timelineEvents.map(({ year }, i) => (
              <button
                key={year}
                onClick={() => setActiveYear(i)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-widest border transition-all ${
                  activeYear === i
                    ? 'bg-IPCprimary text-white border-IPCprimary'
                    : 'border-border text-muted-foreground hover:border-IPCprimary hover:text-IPCprimary'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          <div className="border-l-2 border-IPCsecondary pl-6">
            {timelineEvents.map((event, index) => (
              <div
                key={event.year}
                className={`mb-6 last:mb-0 transition-all duration-300 ${
                  activeYear === index ? 'opacity-100' : 'opacity-30'
                }`}
                onClick={() => setActiveYear(index)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-IPCsecondary">{event.year}</span>
                  <h3 className="text-sm font-semibold text-foreground">{event.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Impact ── */}
        <section
          id="impact"
          data-animate
          className={`border border-border p-8 ${animClass('impact', 'delay-300')}`}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-IPCsecondary mb-3">Impact</p>
          <h2 className="text-2xl font-semibold text-foreground mb-5">Why Stamps Matter</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
            {[
              { n: '01', text: 'Promote global awareness and cultural exchange by exposing collectors to postal designs from around the world.' },
              { n: '02', text: 'Serve as a valuable educational tool, teaching history, geography, and the development of communication.' },
              { n: '03', text: 'Provide economic opportunity through the buying, selling, and trading of rare and valuable stamps.' },
              { n: '04', text: 'Foster a sense of community among philatelists who share a common passion for postal history.' },
            ].map(({ n, text }) => (
              <div key={n} className="bg-background p-5 flex gap-4">
                <span className="text-xs font-bold text-IPCprimary/30 shrink-0 w-6">{n}</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LearnPage;
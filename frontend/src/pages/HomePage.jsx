import React from 'react'
import Hero from '../components/Hero'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, ShoppingBag, Library, Users, Star, Clock } from 'lucide-react'

// ── Section data ──────────────────────────────────────────────
const historyCards = [
  {
    eyebrow: 'The Penny Black Era',
    title: 'The World\'s First Stamp',
    body: 'Issued in 1840 by the United Kingdom, the Penny Black revolutionised postal services and sparked philately as a hobby. A single engraved image of Queen Victoria — no country name needed.',
    cta: 'Learn More', to: '/learn',
  },
  {
    eyebrow: 'Global Expansion',
    title: 'Stamp Collecting Goes Global',
    body: 'By the 1860s, the first stamp albums and specialised catalogues were introduced. Nations competed to issue the most beautiful stamps, turning a postal tool into an art form.',
    cta: 'Explore History', to: '/learn',
  },
]

const facts = [
  {
    eyebrow: 'Printing Error',
    title: 'The Inverted Jenny',
    body: 'A 1918 U.S. airmail stamp depicting the Curtiss JN-4 biplane printed upside-down. Only 100 exist, making it one of the most valuable stamps ever.',
    cta: 'Learn More', to: '/learn',
  },
  {
    eyebrow: 'Colonial Rarity',
    title: 'The Blue Mauritius',
    body: 'Issued in 1847 by British Mauritius, fewer than 30 examples survive. A single copy has sold for over $2 million at auction.',
    cta: 'Explore Rare Stamps', to: '/museum',
  },
]

const actions = [
  { icon: ShoppingBag, label: 'Marketplace', desc: 'Browse and buy authenticated stamps from trusted collectors.', cta: 'Browse Stamps', to: '/marketplace', accent: 'bg-IPCprimary' },
  { icon: Library, label: 'Museum', desc: 'Explore our curated archive of historically significant stamps.', cta: 'Visit Museum', to: '/museum', accent: 'bg-IPCaccent' },
  { icon: Users, label: 'Community', desc: 'Share discoveries and connect with fellow philatelists.', cta: 'Join Now', to: '/community', accent: 'bg-IPCsecondary' },
  { icon: BookOpen, label: 'Learn', desc: 'Read the history of stamps and discover stories behind them.', cta: 'Read Guide', to: '/learn', accent: 'bg-IPCprimary' },
]

// ── Reusable article card ─────────────────────────────────────
const ArticleCard = ({ eyebrow, title, body, cta, to, index }) => (
  <article
    className="group border border-border bg-background hover:border-IPCprimary/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex flex-col"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="p-6 flex flex-col flex-1 gap-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-IPCsecondary">{eyebrow}</p>
      <h3 className="text-xl font-semibold text-foreground leading-snug group-hover:text-IPCprimary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{body}</p>
      <div className="pt-2 border-t border-border mt-2">
        <Link
          to={to}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-IPCprimary hover:gap-3 transition-all"
        >
          {cta} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  </article>
)

// ── Section wrapper ───────────────────────────────────────────
const Section = ({ eyebrow, title, children, className = '' }) => (
  <section className={`max-w-7xl mx-auto px-6 py-16 ${className}`}>
    <div className="mb-10">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-IPCsecondary mb-3">{eyebrow}</p>
      <h2 className="text-3xl font-light text-foreground">{title}</h2>
      <div className="mt-3 w-12 h-0.5 bg-IPCsecondary" />
    </div>
    {children}
  </section>
)

const Home = () => {
  return (
    <div className="flex flex-col bg-background">
      <Hero />

      {/* ── Stats strip ── */}
      <div className="border-y border-border bg-IPCprimary text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {[
            { value: '1840', label: 'Year of First Stamp' },
            { value: '500+', label: 'Rare Stamps Listed' },
            { value: '12K+', label: 'Collectors Worldwide' },
            { value: '98%', label: 'Authenticated Items' },
          ].map(({ value, label }) => (
            <div key={label} className="px-6 py-2 text-center">
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-[10px] uppercase tracking-widest text-IPCtext mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── History Section ── */}
      <Section eyebrow="Philately" title="The History of Stamp Collecting">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {historyCards.map((card, i) => (
            <div key={card.title} className="bg-background">
              <ArticleCard {...card} index={i} />
            </div>
          ))}
        </div>
      </Section>

      {/* ── Facts Section ── */}
      <Section eyebrow="Did you know?" title="Fascinating Facts About Stamps" className="bg-IPCprimary/3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {facts.map((card, i) => (
            <div key={card.title} className="bg-background">
              <ArticleCard {...card} index={i} />
            </div>
          ))}
        </div>
      </Section>

      {/* ── Action Cards ── */}
      <Section eyebrow="Explore" title="Dive Into the Hobby">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {actions.map(({ icon: Icon, label, desc, cta, to, accent }) => (
            <div key={label} className="bg-background group border border-transparent hover:border-IPCprimary/30 transition-all duration-300 hover:-translate-y-0.5 flex flex-col p-6 gap-4">
              <div className={`w-10 h-10 ${accent} flex items-center justify-center shrink-0`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-1">{label}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
              <Link
                to={to}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-IPCprimary hover:gap-3 transition-all group-hover:text-IPCsecondary"
              >
                {cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Bottom CTA banner ── */}
      <div className="relative bg-IPCprimary text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 opacity-5">
          <div className="absolute -top-10 -right-10 w-80 h-80 rounded-full border-[50px] border-white" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-IPCtext mb-2">Start Today</p>
            <h2 className="text-3xl font-light text-white">Begin Your Stamp Collection</h2>
            <p className="text-white/60 text-sm mt-2 max-w-md">Join thousands of collectors who have found their piece of postal history.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-IPCsecondary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Browse Stamps <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/community"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white text-xs font-semibold uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              Join Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
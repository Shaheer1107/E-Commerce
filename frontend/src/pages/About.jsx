import React from 'react'
import NewsletterBox from '../components/NewsletterBox';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div className="bg-[#0f0e0c] text-[#faf8f5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Split Hero ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-screen">

        {/* Left — warm light panel */}
        <div className="bg-[#faf8f5] text-[#0f0e0c] px-8 sm:px-14 py-20 flex flex-col justify-end gap-6 order-2 md:order-1">
          <p className="text-[9px] tracking-[0.35em] uppercase text-[#b8a97a]">About us — Textiles</p>
          <h1 className="text-[52px] sm:text-[64px] font-normal leading-none"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            Style is<br />a form of<br /><em className="italic text-[#b8a97a]">self expression</em>
          </h1>
          <p className="text-[13px] leading-[1.9] text-[#555] font-light max-w-sm">
            We built Textiles for people who believe clothing is more than fabric — it's identity,
            confidence, and a quiet statement to the world.
          </p>
          <div className="w-12 h-0.5 bg-[#0f0e0c]" />
        </div>

        {/* Right — full-bleed image */}
        <div className="relative min-h-[60vh] md:min-h-0 overflow-hidden order-1 md:order-2">
          <img src={assets.about_img} alt="Textiles" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[rgba(15,14,12,0.35)]" />
          <div className="absolute top-10 right-10 bg-[#b8a97a] text-[#0f0e0c] text-[9px] tracking-[0.2em] uppercase px-4 py-2.5 font-medium">
            Est. 2016
          </div>
        </div>
      </section>

      {/* ── Scrolling marquee ── */}
      <div className="bg-[#b8a97a] py-3.5 overflow-hidden whitespace-nowrap">
        <div className="inline-flex" style={{ animation: 'marquee 20s linear infinite' }}>
          {[...Array(2)].map((_, i) => (
            <span key={i} className="inline-flex">
              {['Quality First', 'Curated Collections', 'Trusted Worldwide', 'Free Returns', 'Sustainable Sourcing'].map(t => (
                <span key={t} className="inline-flex items-center gap-8 px-10 text-[10px] tracking-[0.3em] uppercase text-[#0f0e0c] font-medium">
                  {t} <span className="opacity-40">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>

      {/* ── Our Story + Stats ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-t border-[#1e1d1a]">

        {/* Story */}
        <div className="px-8 sm:px-14 py-20 border-b md:border-b-0 md:border-r border-[#1e1d1a]">
          <div className="text-[120px] font-bold text-[#1e1d1a] leading-none mb-[-16px] select-none"
               style={{ fontFamily: "'Playfair Display', serif" }}>01</div>
          <h2 className="text-[32px] sm:text-[38px] font-normal leading-[1.2] mb-6 text-[#faf8f5]"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            Our <em className="italic text-[#b8a97a]">journey</em> began<br />with a question.
          </h2>
          <p className="text-[13px] leading-[1.9] text-[#888] font-light">
            Why does online shopping feel so transactional? We believed it could feel like discovery —
            browsing a space where every piece has been chosen with intention. Since 2016, we've built
            Textiles around that belief, growing from a small curated store to a destination for
            thousands of customers worldwide.
          </p>
        </div>

        {/* Stats */}
        <div className="px-8 sm:px-14 py-20 flex flex-col justify-center gap-0">
          {[
            ['200+', 'Brands', 'Carefully vetted partners who share our standards.'],
            ['50k', 'Customers', 'People who chose us and came back.'],
            ['8yrs', 'Experience', 'Of refining what great shopping feels like.'],
          ].map(([num, label, desc], i) => (
            <div key={label} className={`flex items-baseline gap-5 py-8 ${i < 2 ? 'border-b border-[#1e1d1a]' : ''}`}>
              <span className="text-[52px] font-normal text-[#b8a97a] leading-none shrink-0"
                    style={{ fontFamily: "'Playfair Display', serif" }}>{num}</span>
              <div>
                <div className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#faf8f5] mb-1">{label}</div>
                <div className="text-[12px] text-[#666] font-light leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="border-t border-[#1e1d1a]">
        <div className="px-8 sm:px-14 py-12 border-b border-[#1e1d1a] flex items-end justify-between flex-wrap gap-4">
          <h2 className="text-[36px] sm:text-[44px] font-normal text-[#faf8f5]"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            Why choose <em className="italic text-[#b8a97a]">us</em>
          </h2>
          <span className="text-[10px] tracking-[0.15em] uppercase text-[#555]">Three principles</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {[
            ['01', 'Quality Assurance', 'We meticulously select and vet each product to ensure it meets our stringent standards before it ever reaches your door.'],
            ['02', 'Effortless Convenience', 'A smooth interface and ordering process means you spend less time navigating and more time discovering.'],
            ['03', 'Genuine Care', 'Our team is here at every step — not as a helpline, but as people who genuinely want your experience to be exceptional.'],
          ].map(([num, title, text], i) => (
            <div
              key={num}
              className={`group px-10 sm:px-12 py-14 relative overflow-hidden transition-colors duration-300 hover:bg-[#161510]
                ${i < 2 ? 'border-b sm:border-b-0 sm:border-r border-[#1e1d1a]' : ''}`}
            >
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b8a97a] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#b8a97a] mb-5">— {num}</div>
              <div className="text-[20px] font-normal text-[#faf8f5] mb-4 leading-snug"
                   style={{ fontFamily: "'Playfair Display', serif" }}>{title}</div>
              <p className="text-[12px] leading-[1.9] text-[#666] font-light">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Closing Quote ── */}
      <section className="border-t border-[#1e1d1a] px-8 sm:px-16 py-24 flex flex-col items-center text-center">
        <div className="text-[72px] text-[#b8a97a] leading-none mb-4 opacity-60 select-none"
             style={{ fontFamily: "'Playfair Display', serif" }}>"</div>
        <p className="text-[26px] sm:text-[34px] font-normal italic leading-[1.4] text-[#faf8f5] max-w-2xl mb-8"
           style={{ fontFamily: "'Playfair Display', serif" }}>
          Shopping should feel like a discovery,<br />not a transaction.
        </p>
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#555]">Textiles — our founding principle</div>
      </section>
    </div>
  );
};

export default About;
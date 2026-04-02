import React from 'react'
import NewsletterBox from '../components/NewsletterBox';
import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div className="bg-[#0f0e0c] text-[#faf8f5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Hero ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[85vh] border-b border-[#1e1d1a]">

        {/* Left */}
        <div className="px-8 sm:px-14 py-20 flex flex-col justify-end gap-5 border-b md:border-b-0 md:border-r border-[#1e1d1a] order-2 md:order-1">
          <span className="text-[9px] tracking-[0.35em] uppercase text-[#b8a97a]">Get in touch</span>
          <h1
            className="text-[52px] sm:text-[72px] font-normal leading-[0.95]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Let's<br />start a<br /><em className="italic text-[#b8a97a]">conversation</em>
          </h1>
          <p className="text-[13px] leading-[1.9] text-[#666] font-light max-w-sm">
            We're here for questions, partnerships, press inquiries, or just to say hello.
            Reach out — we read everything.
          </p>
        </div>

        {/* Right — image */}
        <div className="relative min-h-[55vh] md:min-h-0 overflow-hidden order-1 md:order-2">
          <img
            src={assets.contact_img}
            alt="Contact Textiles"
            className="w-full h-full object-cover"
            style={{ filter: 'grayscale(40%) brightness(0.7)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15,14,12,0.4) 0%, transparent 60%)' }} />
          <div className="absolute bottom-8 right-8 border border-[rgba(196,160,100,0.3)] px-5 py-2.5 text-[9px] tracking-[0.2em] uppercase text-[#b8a97a]">
            We're here for you
          </div>
        </div>
      </section>

      {/* ── Info Strip ── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 border-b border-[#1e1d1a]">
        {[
          {
            icon: <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>,
            icon2: <circle cx="12" cy="10" r="3"/>,
            label: 'Our Store',
            value: '54709 Willms Station\nSuite 350, Washington, USA',
          },
          {
            icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-.95a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>,
            label: 'Phone',
            value: '(415) 555-0132',
          },
          {
            icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
            label: 'Email',
            value: 'admin@Textiles.com',
          },
        ].map(({ icon, icon2, label, value }, i) => (
          <div
            key={label}
            className={`group px-10 sm:px-12 py-12 flex flex-col gap-3 transition-colors duration-300 hover:bg-[#161510]
              ${i < 2 ? 'border-b sm:border-b-0 sm:border-r border-[#1e1d1a]' : ''}`}
          >
            <div className="w-9 h-9 border border-[rgba(196,160,100,0.2)] flex items-center justify-center mb-1 group-hover:border-[rgba(196,160,100,0.45)] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b8a97a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {icon}{icon2}
              </svg>
            </div>
            <div className="text-[9px] tracking-[0.25em] uppercase text-[#b8a97a]">{label}</div>
            <div className="text-[13px] text-[#888] font-light leading-[1.7] whitespace-pre-line">{value}</div>
          </div>
        ))}
      </section>

      {/* ── Careers ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-[#1e1d1a]">

        {/* Left */}
        <div className="px-8 sm:px-14 py-20 flex flex-col justify-center gap-6 border-b md:border-b-0 md:border-r border-[#1e1d1a]">
          <div
            className="text-[100px] sm:text-[120px] font-bold text-[#1a1917] leading-none select-none mb-[-12px]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >02</div>
          <h2
            className="text-[34px] sm:text-[42px] font-normal leading-[1.15] text-[#faf8f5]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Careers at<br /><em className="italic text-[#b8a97a]">Textiles</em>
          </h2>
          <p className="text-[13px] text-[#666] font-light leading-[1.9] max-w-sm">
            We're always looking for passionate, creative people who want to shape the future
            of fashion retail. See what's open.
          </p>
          <button className="group/btn inline-flex items-center gap-3 mt-2 border border-[rgba(196,160,100,0.3)] px-7 py-3.5 text-[10px] tracking-[0.2em] uppercase text-[#b8a97a] w-fit transition-all duration-300 hover:bg-[#b8a97a] hover:text-[#0f0e0c] hover:border-[#b8a97a]">
            Explore Jobs
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover/btn:translate-x-1">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>

        {/* Right — job listings */}
        <div className="px-8 sm:px-14 py-20 flex flex-col justify-center">
          {[
            ['Senior Designer', 'Creative — Full time'],
            ['Frontend Engineer', 'Technology — Full time'],
            ['Brand Partnerships', 'Marketing — Remote'],
            ['Customer Experience Lead', 'Operations — Full time'],
          ].map(([title, dept]) => (
            <div
              key={title}
              className="group/job flex items-center justify-between py-6 border-b border-[#1a1917] first:border-t first:border-[#1a1917] cursor-pointer"
            >
              <div>
                <div className="text-[14px] text-[#888] font-light transition-colors duration-200 group-hover/job:text-[#b8a97a]">{title}</div>
                <div className="text-[9px] tracking-[0.15em] uppercase text-[#333] mt-1">{dept}</div>
              </div>
              <div className="w-7 h-7 border border-[#222] flex items-center justify-center transition-colors duration-200 group-hover/job:border-[rgba(196,160,100,0.4)]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Contact;
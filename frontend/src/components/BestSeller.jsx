import React, { useContext, useEffect, useRef, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [headerVisible, setHeaderVisible] = useState(false);
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);

  // ── Preserve original logic ──────────────────────────────────────────────
  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  // ── Header reveal ────────────────────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Card stagger reveal ──────────────────────────────────────────────────
  useEffect(() => {
    if (!bestSeller.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            setVisibleItems((prev) => [...new Set([...prev, idx])]);
          }
        });
      },
      { threshold: 0.1 }
    );
    itemRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [bestSeller]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        /* ── Section shell ─────────────────────────────── */
        .bs-section {
          position: relative;
          padding: 96px 48px 112px;
          background: #0e0c0a;
          overflow: hidden;
        }

        /* Grain texture */
        .bs-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        /* Radial gold glow — bottom right */
        .bs-glow {
          position: absolute;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(196,160,100,0.07) 0%, transparent 65%);
          bottom: -200px;
          right: -150px;
          pointer-events: none;
          z-index: 0;
        }
        /* Subtle glow top left */
        .bs-glow-2 {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(196,160,100,0.04) 0%, transparent 70%);
          top: -100px;
          left: -100px;
          pointer-events: none;
          z-index: 0;
        }

        /* Corner brackets */
        .bs-corner {
          position: absolute;
          width: 48px;
          height: 48px;
          z-index: 1;
        }
        .bs-corner-tl { top: 24px; left: 24px; border-top: 1px solid rgba(196,160,100,0.18); border-left: 1px solid rgba(196,160,100,0.18); }
        .bs-corner-tr { top: 24px; right: 24px; border-top: 1px solid rgba(196,160,100,0.18); border-right: 1px solid rgba(196,160,100,0.18); }
        .bs-corner-bl { bottom: 24px; left: 24px; border-bottom: 1px solid rgba(196,160,100,0.18); border-left: 1px solid rgba(196,160,100,0.18); }
        .bs-corner-br { bottom: 24px; right: 24px; border-bottom: 1px solid rgba(196,160,100,0.18); border-right: 1px solid rgba(196,160,100,0.18); }

        /* Thin gold top-border transition from cream section above */
        .bs-top-rule {
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(196,160,100,0.3) 30%, rgba(196,160,100,0.3) 70%, transparent);
          z-index: 2;
        }

        /* ── Header ─────────────────────────────────────── */
        .bs-header {
          position: relative;
          z-index: 2;
          text-align: center;
          margin-bottom: 72px;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.9s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .bs-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Override Title colors for dark background */
        .bs-header .title-eyebrow-text {
          color: #c4a064 !important;
        }
        .bs-header .title-main {
          color: #f5f0e8 !important;
        }
        .bs-header .title-main em {
          color: #c4a064 !important;
        }

        .bs-desc {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.06em;
          line-height: 1.9;
          color: #a89e92;
          max-width: 420px;
          margin: 20px auto 0;
        }

        /* Diamond rule */
        .bs-rule {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 40px auto 0;
          max-width: 240px;
        }
        .bs-rule-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(196,160,100,0.25));
        }
        .bs-rule-line.right {
          background: linear-gradient(to left, transparent, rgba(196,160,100,0.25));
        }
        .bs-rule-diamond {
          width: 6px;
          height: 6px;
          background: #c4a064;
          transform: rotate(45deg);
          opacity: 0.6;
        }

        /* ── Ranking numerals ────────────────────────────── */
        .bs-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px 20px;
        }
        @media (min-width: 480px)  { .bs-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 768px)  { .bs-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1024px) { .bs-grid { grid-template-columns: repeat(5, 1fr); } }

        /* Card wrapper — adds rank numeral + dark-mode overrides for ProductItem */
        .bs-card-wrap {
          position: relative;
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1);
        }
        .bs-card-wrap.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Rank numeral — top-left ghost text */
        .bs-rank {
          position: absolute;
          top: -18px;
          left: -4px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 72px;
          font-weight: 300;
          color: rgba(196,160,100,0.07);
          line-height: 1;
          z-index: 0;
          pointer-events: none;
          user-select: none;
          transition: color 0.3s ease;
        }
        .bs-card-wrap:hover .bs-rank {
          color: rgba(196,160,100,0.13);
        }

        /* Dark-mode skin for ProductItem cards inside BestSeller */
        .bs-card-wrap .product-img-wrap {
          background: #1c1916 !important;
        }
        .bs-card-wrap .product-name {
          color: #d4cfc8 !important;
        }
        .bs-card-wrap:hover .product-name,
        .bs-card-wrap .product-card-link:hover .product-name {
          color: #c4a064 !important;
        }
        .bs-card-wrap .product-price {
          color: #6b6054 !important;
        }
        .bs-card-wrap .product-badge {
          background: #c4a064;
          color: #0e0c0a;
        }

        /* ── Footer CTA ─────────────────────────────────── */
        .bs-footer {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 48px;
          margin-top: 72px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s;
        }
        .bs-footer.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .bs-footer-line {
          flex: 1;
          max-width: 120px;
          height: 1px;
          background: rgba(196,160,100,0.12);
        }

        .bs-view-all {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: 'Montserrat', sans-serif;
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c4a064;
          text-decoration: none;
          padding: 14px 36px;
          border: 1px solid rgba(196,160,100,0.25);
          position: relative;
          overflow: hidden;
          transition: color 0.35s ease, border-color 0.35s ease;
          cursor: pointer;
          background: transparent;
        }
        .bs-view-all::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #c4a064;
          transform: translateY(101%);
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .bs-view-all:hover::before {
          transform: translateY(0);
        }
        .bs-view-all:hover {
          color: #0e0c0a;
          border-color: #c4a064;
        }
        .bs-view-all span,
        .bs-view-all svg {
          position: relative;
          z-index: 1;
        }
        .bs-view-all svg {
          transition: transform 0.3s ease;
        }
        .bs-view-all:hover svg {
          transform: translateX(4px);
        }

        @media (max-width: 600px) {
          .bs-section  { padding: 64px 20px 80px; }
          .bs-footer   { gap: 20px; }
          .bs-footer-line { max-width: 48px; }
        }
      `}</style>

      <section className="bs-section" ref={sectionRef}>
        {/* Decorative */}
        <div className="bs-top-rule" />
        <div className="bs-glow" />
        <div className="bs-glow-2" />
        <div className="bs-corner bs-corner-tl" />
        <div className="bs-corner bs-corner-tr" />
        <div className="bs-corner bs-corner-bl" />
        <div className="bs-corner bs-corner-br" />

        {/* Header */}
        <header className={`bs-header ${headerVisible ? 'visible' : ''}`}>
          <Title text1={'BEST'} text2={'SELLERS'} />
          <p className="bs-desc">
            The pieces our community keeps coming back to —
            enduring style that speaks for itself.
          </p>
          <div className="bs-rule">
            <div className="bs-rule-line" />
            <div className="bs-rule-diamond" />
            <div className="bs-rule-line right" />
          </div>
        </header>

        {/* Grid — all original data & props preserved */}
        <div className="bs-grid">
          {bestSeller.map((item, index) => (
            <div
              key={item._id}
              className={`bs-card-wrap ${visibleItems.includes(index) ? 'visible' : ''}`}
              data-index={index}
              ref={(el) => (itemRefs.current[index] = el)}
              style={{ transitionDelay: `${index * 90}ms` }}
            >
              <span className="bs-rank">0{index + 1}</span>
              <ProductItem
                id={item._id}
                image={item.images}
                name={item.name}
                price={item.price}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`bs-footer ${headerVisible ? 'visible' : ''}`}>
          <div className="bs-footer-line" />
          <a href="/bestsellers" className="bs-view-all">
            <span>Explore Bestsellers</span>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1 5H13M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <div className="bs-footer-line" />
        </div>
      </section>
    </>
  );
};

export default BestSeller;
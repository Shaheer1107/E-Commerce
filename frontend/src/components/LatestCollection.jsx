import React, { useContext, useEffect, useRef, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);

  // ── Preserve original logic ──────────────────────────────────────────────
  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  // ── Scroll-triggered staggered reveal ───────────────────────────────────
  useEffect(() => {
    if (!latestProducts.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            setVisibleItems((prev) => [...new Set([...prev, idx])]);
          }
        });
      },
      { threshold: 0.12 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [latestProducts]);

  // ── Section header reveal ────────────────────────────────────────────────
  const [headerVisible, setHeaderVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        .lc-section {
          position: relative;
          padding: 96px 48px 112px;
          background: #faf8f5;
          overflow: hidden;
        }

        /* Subtle background texture */
        .lc-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        /* Decorative corner lines */
        .lc-corner {
          position: absolute;
          width: 48px;
          height: 48px;
          z-index: 1;
        }
        .lc-corner-tl { top: 24px; left: 24px; border-top: 1px solid rgba(196,160,100,0.25); border-left: 1px solid rgba(196,160,100,0.25); }
        .lc-corner-tr { top: 24px; right: 24px; border-top: 1px solid rgba(196,160,100,0.25); border-right: 1px solid rgba(196,160,100,0.25); }
        .lc-corner-bl { bottom: 24px; left: 24px; border-bottom: 1px solid rgba(196,160,100,0.25); border-left: 1px solid rgba(196,160,100,0.25); }
        .lc-corner-br { bottom: 24px; right: 24px; border-bottom: 1px solid rgba(196,160,100,0.25); border-right: 1px solid rgba(196,160,100,0.25); }

        /* ── Header ─────────────────────────────────────── */
        .lc-header {
          position: relative;
          z-index: 2;
          text-align: center;
          margin-bottom: 72px;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.9s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .lc-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .lc-desc {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.06em;
          line-height: 1.9;
          color: #9a8f82;
          max-width: 420px;
          margin: 20px auto 0;
        }

        /* ── Horizontal rule with diamond ───────────────── */
        .lc-rule {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 40px auto 0;
          max-width: 240px;
        }
        .lc-rule-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(196,160,100,0.35));
        }
        .lc-rule-line.right {
          background: linear-gradient(to left, transparent, rgba(196,160,100,0.35));
        }
        .lc-rule-diamond {
          width: 6px;
          height: 6px;
          background: #c4a064;
          transform: rotate(45deg);
          opacity: 0.7;
        }

        /* ── Product Grid ────────────────────────────────── */
        .lc-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px 20px;
        }

        @media (min-width: 480px) {
          .lc-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 768px) {
          .lc-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (min-width: 1024px) {
          .lc-grid { grid-template-columns: repeat(5, 1fr); }
        }

        /* ── Card entrance animation ─────────────────────── */
        .lc-item {
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1);
        }
        .lc-item.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── View All CTA ───────────────────────────────── */
        .lc-footer {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 48px;
          margin-top: 72px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s;
        }
        .lc-footer.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .lc-footer-line {
          flex: 1;
          max-width: 120px;
          height: 1px;
          background: rgba(196,160,100,0.2);
        }

        .lc-view-all {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: 'Montserrat', sans-serif;
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #1a1612;
          text-decoration: none;
          padding: 14px 36px;
          border: 1px solid rgba(26,22,18,0.2);
          position: relative;
          overflow: hidden;
          transition: color 0.35s ease, border-color 0.35s ease;
          cursor: pointer;
          background: transparent;
        }
        .lc-view-all::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #1a1612;
          transform: translateY(101%);
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .lc-view-all:hover::before {
          transform: translateY(0);
        }
        .lc-view-all:hover {
          color: #f5f0e8;
          border-color: #1a1612;
        }
        .lc-view-all span,
        .lc-view-all svg {
          position: relative;
          z-index: 1;
        }
        .lc-view-all svg {
          transition: transform 0.3s ease;
        }
        .lc-view-all:hover svg {
          transform: translateX(4px);
        }

        /* Count badge */
        .lc-count-badge {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.12em;
          color: #9a8f82;
          text-transform: uppercase;
        }

        @media (max-width: 600px) {
          .lc-section { padding: 64px 20px 80px; }
          .lc-footer { gap: 20px; }
          .lc-footer-line { max-width: 48px; }
        }
      `}</style>

      <section className="lc-section" ref={sectionRef}>
        {/* Corner accents */}
        <div className="lc-corner lc-corner-tl" />
        <div className="lc-corner lc-corner-tr" />
        <div className="lc-corner lc-corner-bl" />
        <div className="lc-corner lc-corner-br" />

        {/* Header */}
        <header className={`lc-header ${headerVisible ? 'visible' : ''}`}>
          <Title text1={'LATEST'} text2={'COLLECTIONS'} />
          <p className="lc-desc">
            Thoughtfully curated pieces for the modern wardrobe —
            refined silhouettes and exceptional materials, season after season.
          </p>
          <div className="lc-rule">
            <div className="lc-rule-line" />
            <div className="lc-rule-diamond" />
            <div className="lc-rule-line right" />
          </div>
        </header>

        {/* Product grid — all original data & props preserved */}
        <div className="lc-grid">
          {latestProducts.map((item, index) => (
            <div
              key={item._id}
              className={`lc-item ${visibleItems.includes(index) ? 'visible' : ''}`}
              data-index={index}
              ref={(el) => (itemRefs.current[index] = el)}
              style={{ transitionDelay: `${(index % 5) * 80}ms` }}
            >
              <ProductItem
                id={item._id}
                image={item.images}
                name={item.name}
                price={item.price}
              />
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className={`lc-footer ${headerVisible ? 'visible' : ''}`}>
          <div className="lc-footer-line" />
          <a href="/collection" className="lc-view-all">
            <span>View All Pieces</span>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1 5H13M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <div className="lc-footer-line" />
        </div>
      </section>
    </>
  );
};

export default LatestCollection;
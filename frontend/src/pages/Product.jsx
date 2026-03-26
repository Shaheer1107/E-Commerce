import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [added, setAdded] = useState(false);

  const fetchProductData = () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.images[0]);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const handleAddToCart = () => {
    addToCart(productData._id, size);
    if (size) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return productData ? (
    <>
      <style>{STYLES}</style>
      <div className="pd-root">

        {/* ── Breadcrumb ── */}
        <div className="pd-breadcrumb">
          <span>Home</span>
          <span className="pd-bc-sep">✦</span>
          <span>{productData.category}</span>
          <span className="pd-bc-sep">✦</span>
          <span className="pd-bc-active">{productData.name}</span>
        </div>

        {/* ── Main grid ── */}
        <div className="pd-grid">

          {/* LEFT — thumbnails */}
          <div className="pd-thumbs">
            {productData.images.map((item, index) => (
              <button
                key={index}
                className={`pd-thumb ${image === item ? 'pd-thumb--active' : ''}`}
                onClick={() => setImage(item)}
              >
                <img src={item} alt={`View ${index + 1}`} />
                <div className="pd-thumb-overlay" />
              </button>
            ))}
          </div>

          {/* CENTER — main image */}
          <div className="pd-main-img-wrap">
            <div className="pd-main-img-frame">
              <img
                key={image}
                className="pd-main-img"
                src={image}
                alt={productData.name}
              />
              {/* Decorative corner marks */}
              <div className="pd-corner pd-corner--tl" />
              <div className="pd-corner pd-corner--tr" />
              <div className="pd-corner pd-corner--bl" />
              <div className="pd-corner pd-corner--br" />
            </div>
            {/* Floating category tag */}
            <div className="pd-category-tag">{productData.subCategory || productData.category}</div>
          </div>

          {/* RIGHT — details */}
          <div className="pd-details">

            {/* Name */}
            <div className="pd-name-block">
              <div className="pd-name-rule" />
              <h1 className="pd-name">{productData.name}</h1>
            </div>

            {/* Stars */}
            <div className="pd-stars">
              {[1,2,3,4].map(i => (
                <svg key={i} className="pd-star pd-star--full" viewBox="0 0 16 16">
                  <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.71 4.13L8 10.4l-3.71 2.15L5 8.42 2 5.5l4.15-.75z"/>
                </svg>
              ))}
              <svg className="pd-star pd-star--half" viewBox="0 0 16 16">
                <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.71 4.13L8 10.4V1z" className="pd-star-fill"/>
                <path d="M8 1v9.4l-3.71 2.15L5 8.42 2 5.5l4.15-.75z" className="pd-star-empty"/>
              </svg>
              <span className="pd-rating-count">122 reviews</span>
            </div>

            {/* Price */}
            <div className="pd-price-block">
              <span className="pd-price">{currency}{productData.price}</span>
              <div className="pd-price-line" />
            </div>

            {/* Description */}
            <p className="pd-desc">{productData.description}</p>

            {/* Size selector */}
            <div className="pd-size-block">
              <div className="pd-size-header">
                <span className="pd-size-label">Select Size</span>
                {size && <span className="pd-size-chosen">{size} selected</span>}
              </div>
              <div className="pd-sizes">
                {productData.sizes.map((item, index) => (
                  <button
                    key={index}
                    className={`pd-size-btn ${item === size ? 'pd-size-btn--active' : ''}`}
                    onClick={() => setSize(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              className={`pd-cart-btn ${added ? 'pd-cart-btn--added' : ''}`}
            >
              <span className="pd-cart-btn-inner">
                {added ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l3.5 3.5L12 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Added to Cart
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1h2l1.4 7h7l1.6-5H4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="6" cy="12" r="1" fill="currentColor"/>
                      <circle cx="11" cy="12" r="1" fill="currentColor"/>
                    </svg>
                    Add to Cart
                  </>
                )}
              </span>
            </button>

            {/* Trust badges */}
            <div className="pd-trust">
              {[
                { icon: '✦', text: '100% Original product' },
                { icon: '◈', text: 'Cash on delivery available' },
                { icon: '↺', text: 'Easy return within 7 days' },
              ].map((b, i) => (
                <div key={i} className="pd-trust-item">
                  <span className="pd-trust-icon">{b.icon}</span>
                  <span className="pd-trust-text">{b.text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Tabs: Description & Reviews ── */}
        <div className="pd-tabs-section">
          <div className="pd-tabs">
            {['description', 'reviews'].map((tab) => (
              <button
                key={tab}
                className={`pd-tab ${activeTab === tab ? 'pd-tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'description' ? 'Description' : 'Reviews (122)'}
              </button>
            ))}
            <div className="pd-tabs-fill" />
          </div>

          <div className="pd-tab-body">
            {activeTab === 'description' ? (
              <div className="pd-tab-content">
                <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence.</p>
                <p>E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.</p>
              </div>
            ) : (
              <div className="pd-tab-content pd-reviews">
                {[
                  { name: 'Sofia M.', rating: 5, text: 'Absolutely beautiful quality. The fabric feels luxurious and the fit is perfect.' },
                  { name: 'James R.', rating: 4, text: 'Great product, fast delivery. Would highly recommend to anyone looking for quality.' },
                  { name: 'Aisha K.', rating: 5, text: 'Exceeded my expectations. The colour is exactly as shown and the sizing is true to chart.' },
                ].map((r, i) => (
                  <div key={i} className="pd-review-item">
                    <div className="pd-review-top">
                      <span className="pd-reviewer">{r.name}</span>
                      <div className="pd-review-stars">
                        {Array.from({ length: r.rating }).map((_, si) => (
                          <svg key={si} className="pd-star pd-star--full pd-star--sm" viewBox="0 0 16 16">
                            <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.71 4.13L8 10.4l-3.71 2.15L5 8.42 2 5.5l4.15-.75z"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="pd-review-text">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />

      </div>
    </>
  ) : (
    <div className="opacity-0" />
  );
};

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

/* ── Root ── */
.pd-root {
  border-top: 1px solid #e8e0d4;
  padding: 40px 0 80px;
  max-width: 1200px;
  margin: 0 auto;
}

/* ── Breadcrumb ── */
.pd-breadcrumb {
  display: flex; align-items: center; gap: 10px; margin-bottom: 40px;
  font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 500;
  letter-spacing: 0.22em; text-transform: uppercase; color: #b0a090;
}
.pd-bc-sep   { color: #c4a064; font-size: 7px; }
.pd-bc-active { color: #1a1612; }

/* ── Main grid ── */
.pd-grid {
  display: grid;
  grid-template-columns: 88px 1fr 1fr;
  gap: 32px;
  align-items: start;
  margin-bottom: 64px;
  animation: pdFadeUp 0.6s ease both;
}
@keyframes pdFadeUp {
  from { opacity:0; transform:translateY(16px); }
  to   { opacity:1; transform:translateY(0); }
}

/* ── Thumbnails ── */
.pd-thumbs {
  display: flex; flex-direction: column; gap: 10px; padding-top: 4px;
}
.pd-thumb {
  position: relative; width: 80px; height: 80px; overflow: hidden;
  background: #f5f2ee; border: 1px solid #e8e0d4; cursor: pointer; padding: 0;
  transition: border-color 0.25s, transform 0.25s;
  flex-shrink: 0;
}
.pd-thumb:hover { border-color: #c4a064; transform: translateX(3px); }
.pd-thumb--active {
  border-color: #c4a064 !important;
  box-shadow: -3px 0 0 0 #c4a064;
}
.pd-thumb img { width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease; }
.pd-thumb:hover img { transform: scale(1.08); }
.pd-thumb-overlay {
  position:absolute; inset:0;
  background: rgba(196,160,100,0);
  transition: background 0.25s;
  pointer-events: none;
}
.pd-thumb--active .pd-thumb-overlay { background: rgba(196,160,100,0.06); }

/* ── Main image ── */
.pd-main-img-wrap {
  position: relative;
}
.pd-main-img-frame {
  position: relative; background: #f8f5f1; overflow: hidden;
  aspect-ratio: 4/5;
}
.pd-main-img {
  width: 100%; height: 100%; object-fit: cover;
  animation: pdImgReveal 0.5s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes pdImgReveal {
  from { opacity:0; transform:scale(1.04); }
  to   { opacity:1; transform:scale(1); }
}

/* Corner marks */
.pd-corner {
  position: absolute; width: 18px; height: 18px;
  pointer-events: none; z-index: 2;
}
.pd-corner--tl { top:12px; left:12px;  border-top:1.5px solid #c4a064; border-left:1.5px solid #c4a064; }
.pd-corner--tr { top:12px; right:12px; border-top:1.5px solid #c4a064; border-right:1.5px solid #c4a064; }
.pd-corner--bl { bottom:12px; left:12px;  border-bottom:1.5px solid #c4a064; border-left:1.5px solid #c4a064; }
.pd-corner--br { bottom:12px; right:12px; border-bottom:1.5px solid #c4a064; border-right:1.5px solid #c4a064; }

/* Floating tag */
.pd-category-tag {
  position: absolute; bottom: -1px; left: 20px;
  background: #1a1612; color: #f5f0e8;
  font-family: 'Montserrat', sans-serif; font-size: 8px; font-weight: 600;
  letter-spacing: 0.25em; text-transform: uppercase;
  padding: 7px 16px;
}

/* ── Details panel ── */
.pd-details {
  padding: 4px 0 0 16px;
  display: flex; flex-direction: column; gap: 0;
}

/* Name */
.pd-name-block { margin-bottom: 18px; }
.pd-name-rule  {
  width: 32px; height: 2px; background: #c4a064; margin-bottom: 14px;
}
.pd-name {
  font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 300;
  color: #1a1612; margin: 0; line-height: 1.1;
}

/* Stars */
.pd-stars {
  display: flex; align-items: center; gap: 4px; margin-bottom: 20px;
}
.pd-star {
  width: 13px; height: 13px;
}
.pd-star--full { fill: #c4a064; }
.pd-star--half .pd-star-fill { fill: #c4a064; }
.pd-star--half .pd-star-empty { fill: #e8e0d4; }
.pd-star--sm { width: 10px; height: 10px; }
.pd-rating-count {
  font-family: 'Montserrat', sans-serif; font-size: 9.5px; color: #a09080;
  letter-spacing: 0.08em; margin-left: 6px;
}

/* Price */
.pd-price-block {
  display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
}
.pd-price {
  font-family: 'Cormorant Garamond', serif; font-size: 42px; font-weight: 300;
  color: #1a1612; line-height: 1;
}
.pd-price-line {
  flex: 1; height: 1px;
  background: linear-gradient(to right, #d4c8b8, transparent);
}

/* Desc */
.pd-desc {
  font-family: 'Montserrat', sans-serif; font-size: 11.5px; line-height: 1.85;
  color: #8b7f72; margin: 0 0 28px; font-weight: 300; letter-spacing: 0.03em;
}

/* Size */
.pd-size-block { margin-bottom: 28px; }
.pd-size-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
}
.pd-size-label {
  font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 600;
  letter-spacing: 0.25em; text-transform: uppercase; color: #1a1612;
}
.pd-size-chosen {
  font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 400;
  letter-spacing: 0.12em; color: #c4a064;
}
.pd-sizes { display: flex; gap: 8px; flex-wrap: wrap; }
.pd-size-btn {
  font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 500;
  letter-spacing: 0.12em; color: #6b5f50;
  width: 46px; height: 46px; border: 1px solid #e0d8ce; background: #fdfcfa;
  cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center;
}
.pd-size-btn:hover {
  border-color: #c4a064; color: #1a1612; background: rgba(196,160,100,0.06);
}
.pd-size-btn--active {
  border-color: #1a1612 !important; background: #1a1612 !important; color: #f5f0e8 !important;
}

/* Cart button */
.pd-cart-btn {
  width: 100%; border: none; cursor: pointer; padding: 0; margin-bottom: 28px;
  background: #1a1612; overflow: hidden; position: relative;
  transition: background 0.3s ease;
}
.pd-cart-btn--added { background: #6B8F71; }
.pd-cart-btn-inner {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 16px 32px;
  font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600;
  letter-spacing: 0.28em; text-transform: uppercase; color: #f5f0e8;
  transition: letter-spacing 0.3s ease;
}
.pd-cart-btn:hover:not(.pd-cart-btn--added) .pd-cart-btn-inner {
  letter-spacing: 0.35em;
}
.pd-cart-btn::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, transparent 40%, rgba(196,160,100,0.15) 100%);
  pointer-events: none;
}

/* Trust */
.pd-trust { display: flex; flex-direction: column; gap: 8px; }
.pd-trust-item {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 0; border-bottom: 1px solid #f0ebe3;
}
.pd-trust-item:last-child { border-bottom: none; }
.pd-trust-icon {
  font-size: 11px; color: #c4a064; flex-shrink: 0; width: 16px; text-align: center;
}
.pd-trust-text {
  font-family: 'Montserrat', sans-serif; font-size: 10px; color: #8b7f72;
  letter-spacing: 0.06em;
}

/* ── Tabs ── */
.pd-tabs-section { margin-bottom: 60px; }
.pd-tabs {
  display: flex; align-items: flex-end; border-bottom: 1px solid #e8e0d4; margin-bottom: 0;
}
.pd-tab {
  font-family: 'Montserrat', sans-serif; font-size: 9.5px; font-weight: 600;
  letter-spacing: 0.2em; text-transform: uppercase; color: #b0a090;
  background: none; border: none; border-bottom: 2px solid transparent;
  padding: 12px 24px 12px; cursor: pointer; margin-bottom: -1px;
  transition: color 0.2s, border-color 0.2s;
}
.pd-tab:hover { color: #1a1612; }
.pd-tab--active { color: #1a1612; border-bottom-color: #c4a064; }
.pd-tabs-fill { flex: 1; }

.pd-tab-body {
  border: 1px solid #e8e0d4; border-top: none; padding: 32px 36px;
  background: #fdfcfa;
}
.pd-tab-content {
  display: flex; flex-direction: column; gap: 16px;
}
.pd-tab-content p {
  font-family: 'Montserrat', sans-serif; font-size: 11.5px; line-height: 1.9;
  color: #8b7f72; font-weight: 300; margin: 0; letter-spacing: 0.03em;
}

/* Reviews */
.pd-reviews { gap: 0 !important; }
.pd-review-item {
  padding: 20px 0; border-bottom: 1px solid #f0ebe3;
}
.pd-review-item:first-child { padding-top: 0; }
.pd-review-item:last-child  { border-bottom: none; padding-bottom: 0; }
.pd-review-top {
  display: flex; align-items: center; gap: 12px; margin-bottom: 8px;
}
.pd-reviewer {
  font-family: 'Cormorant Garamond', serif; font-size: 15px; color: #1a1612;
}
.pd-review-stars { display: flex; gap: 3px; }
.pd-review-text {
  font-family: 'Montserrat', sans-serif; font-size: 11px; line-height: 1.8;
  color: #8b7f72; margin: 0; font-weight: 300;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .pd-grid {
    grid-template-columns: 70px 1fr;
    grid-template-rows: auto auto;
  }
  .pd-details {
    grid-column: 1 / -1;
    padding: 0;
  }
}
@media (max-width: 640px) {
  .pd-root { padding: 24px 16px 60px; }
  .pd-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .pd-thumbs {
    flex-direction: row; overflow-x: auto;
    padding-top: 0; gap: 8px;
  }
  .pd-thumb { width: 64px; height: 64px; flex-shrink: 0; }
  .pd-thumb:hover { transform: none; }
  .pd-details { padding: 0; }
  .pd-name { font-size: 28px; }
  .pd-price { font-size: 32px; }
  .pd-tab-body { padding: 20px; }
}
`;

export default Product;
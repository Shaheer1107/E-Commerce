import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity } = useContext(ShopContext);
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <>
      <style>{STYLES}</style>

      <div className="ct-root">

        {/* ── Header ── */}
        <div className="ct-header">
          <div className="ct-header-left">
            <span className="ct-eyebrow">
              <span className="ct-eyebrow-rule" />
              Selection
              <span className="ct-eyebrow-rule" />
            </span>
            <h1 className="ct-title">Your <em>Cart</em></h1>
          </div>
          <div className="ct-item-count">
            {cartData.length} {cartData.length === 1 ? 'item' : 'items'}
          </div>
        </div>

        {cartData.length === 0 ? (

          /* ── Empty state ── */
          <div className="ct-empty">
            <div className="ct-empty-glyph">✦</div>
            <p className="ct-empty-title">Your cart is empty</p>
            <p className="ct-empty-sub">Discover pieces crafted for you.</p>
            <button className="ct-empty-btn" onClick={() => navigate('/collection')}>
              Browse Collection
            </button>
          </div>

        ) : (

          <div className="ct-body">

            {/* ── Items column ── */}
            <div className="ct-items">

              {/* Column headers */}
              <div className="ct-col-headers">
                <span>Product</span>
                <span>Quantity</span>
                <span style={{ textAlign: 'right' }}>Subtotal</span>
              </div>

              {cartData.map((item, index) => {
                const productData = products.find((product) => product._id === item._id);
                const lineTotal = productData.price * item.quantity;

                return (
                  <div
                    key={index}
                    className="ct-item"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >

                    {/* Image */}
                    <div className="ct-item-img-wrap">
                      <img
                        src={productData.images[0]}
                        className="ct-item-img"
                        alt={productData.name}
                      />
                      <div className="ct-item-img-shade" />
                    </div>

                    {/* Info */}
                    <div className="ct-item-info">
                      <p className="ct-item-name">{productData.name}</p>
                      <div className="ct-item-meta">
                        <span className="ct-item-price">{currency}{productData.price}</span>
                        <span className="ct-item-sep">·</span>
                        <span className="ct-item-size">{item.size}</span>
                      </div>
                    </div>

                    {/* Quantity stepper */}
                    <div className="ct-qty">
                      <button
                        className="ct-qty-btn"
                        onClick={() => item.quantity > 1 && updateQuantity(item._id, item.size, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <input
                        className="ct-qty-input"
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val > 0) updateQuantity(item._id, item.size, val);
                        }}
                      />
                      <button
                        className="ct-qty-btn"
                        onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="ct-item-total">
                      {currency}{lineTotal.toFixed(2)}
                    </div>

                    {/* Remove */}
                    <button
                      className="ct-remove"
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                      aria-label="Remove item"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 3.5h10M5.5 3.5V2.5a1 1 0 011-1h1a1 1 0 011 1v1M5.5 6v5M8.5 6v5M3 3.5l.7 8a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                  </div>
                );
              })}

            </div>

            {/* ── Summary panel ── */}
            <div className="ct-summary">

              <div className="ct-summary-header">
                <span className="ct-summary-eyebrow">
                  <span className="ct-eyebrow-rule" />
                  Overview
                  <span className="ct-eyebrow-rule" />
                </span>
                <h2 className="ct-summary-title">Order <em>Summary</em></h2>
              </div>

              <div className="ct-summary-body">
                <CartTotal />
              </div>

              <button
                onClick={() => navigate('/place-order')}
                className="ct-checkout-btn"
              >
                <span className="ct-checkout-label">Proceed to Checkout</span>
                <svg className="ct-checkout-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className="ct-summary-trust">
                {[
                  { icon: '◈', text: 'Cash on delivery available' },
                  { icon: '↺', text: 'Free returns within 7 days' },
                  { icon: '✦', text: 'Secure checkout' },
                ].map((b, i) => (
                  <div key={i} className="ct-trust-item">
                    <span className="ct-trust-icon">{b.icon}</span>
                    <span className="ct-trust-text">{b.text}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>

        )}

      </div>
    </>
  );
};

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

/* ── Root ── */
.ct-root {
  border-top: 1px solid #e8e0d4;
  padding: 48px 0 80px;
  max-width: 1160px;
  margin: 0 auto;
}

/* ── Header ── */
.ct-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 48px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e8e0d4;
}
.ct-header-left { display: flex; flex-direction: column; gap: 6px; }
.ct-eyebrow {
  display: flex; align-items: center; gap: 10px;
  font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 500;
  letter-spacing: 0.3em; text-transform: uppercase; color: #c4a064;
}
.ct-eyebrow-rule { display: inline-block; width: 28px; height: 1px; background: #c4a064; }
.ct-title {
  font-family: 'Cormorant Garamond', serif; font-size: 48px; font-weight: 300;
  color: #1a1612; margin: 0; line-height: 1;
}
.ct-title em { font-style: italic; color: #c4a064; }
.ct-item-count {
  font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 500;
  letter-spacing: 0.2em; text-transform: uppercase; color: #b0a090;
  padding-bottom: 6px;
}

/* ── Empty ── */
.ct-empty {
  text-align: center; padding: 80px 20px;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.ct-empty-glyph { font-size: 28px; color: #c4a064; opacity: 0.35; margin-bottom: 8px; }
.ct-empty-title {
  font-family: 'Cormorant Garamond', serif; font-size: 24px;
  font-weight: 400; color: #1a1612; margin: 0;
}
.ct-empty-sub {
  font-family: 'Montserrat', sans-serif; font-size: 11px;
  color: #a09080; letter-spacing: 0.05em; margin: 0;
}
.ct-empty-btn {
  margin-top: 16px;
  font-family: 'Montserrat', sans-serif; font-size: 9.5px; font-weight: 600;
  letter-spacing: 0.25em; text-transform: uppercase;
  background: #1a1612; color: #f5f0e8; border: none;
  padding: 14px 32px; cursor: pointer;
  transition: background 0.2s;
}
.ct-empty-btn:hover { background: #c4a064; color: #1a1612; }

/* ── Body layout ── */
.ct-body {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 48px;
  align-items: start;
}

/* ── Column headers ── */
.ct-col-headers {
  display: grid;
  grid-template-columns: 1fr 140px 100px 24px;
  gap: 16px;
  padding: 0 16px 12px;
  font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 600;
  letter-spacing: 0.22em; text-transform: uppercase; color: #b0a090;
  border-bottom: 1px solid #e8e0d4;
}
.ct-col-headers span:last-child { display: none; }

/* ── Cart item ── */
.ct-item {
  display: grid;
  grid-template-columns: 88px 1fr 140px 100px 24px;
  gap: 16px;
  align-items: center;
  padding: 20px 16px;
  border-bottom: 1px solid #f0ebe3;
  opacity: 0;
  animation: ctItemIn 0.45s ease forwards;
  transition: background 0.2s;
}
.ct-item:hover { background: #fdfcfa; }
@keyframes ctItemIn {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* Image */
.ct-item-img-wrap {
  position: relative; width: 88px; height: 108px;
  overflow: hidden; background: #f5f2ee; flex-shrink: 0;
}
.ct-item-img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
}
.ct-item:hover .ct-item-img { transform: scale(1.06); }
.ct-item-img-shade {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(26,22,18,0.12), transparent);
  pointer-events: none;
}

/* Info */
.ct-item-info { min-width: 0; }
.ct-item-name {
  font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 400;
  color: #1a1612; margin: 0 0 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.ct-item-meta { display: flex; align-items: center; gap: 8px; }
.ct-item-price {
  font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 600;
  color: #1a1612; letter-spacing: 0.04em;
}
.ct-item-sep { color: #c4a064; font-size: 13px; }
.ct-item-size {
  font-family: 'Montserrat', sans-serif; font-size: 9.5px; font-weight: 500;
  letter-spacing: 0.15em; text-transform: uppercase; color: #8b7f72;
  background: rgba(196,160,100,0.1); border: 1px solid rgba(196,160,100,0.3);
  padding: 3px 9px;
}

/* Quantity stepper */
.ct-qty {
  display: flex; align-items: center; gap: 0;
  border: 1px solid #e0d8ce; background: #fdfcfa;
  width: fit-content;
}
.ct-qty-btn {
  width: 32px; height: 36px; background: none; border: none;
  font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 300;
  color: #6b5f50; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.15s, color 0.15s;
  line-height: 1;
}
.ct-qty-btn:hover:not(:disabled) { background: #c4a064; color: #1a1612; }
.ct-qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.ct-qty-input {
  width: 40px; height: 36px; border: none; border-left: 1px solid #e0d8ce; border-right: 1px solid #e0d8ce;
  text-align: center; background: #fff;
  font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 500;
  color: #1a1612; outline: none;
  -moz-appearance: textfield;
}
.ct-qty-input::-webkit-inner-spin-button,
.ct-qty-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }

/* Line total */
.ct-item-total {
  font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 400;
  color: #1a1612; text-align: right; white-space: nowrap;
}

/* Remove button */
.ct-remove {
  background: none; border: none; cursor: pointer; padding: 6px;
  color: #c4b8a8; display: flex; align-items: center; justify-content: center;
  transition: color 0.2s, transform 0.2s;
}
.ct-remove:hover { color: #A06060; transform: scale(1.15); }

/* ── Summary panel ── */
.ct-summary {
  position: sticky; top: 24px;
  border: 1px solid #e8e0d4; background: #fdfcfa;
  padding: 32px 28px;
}
.ct-summary-header {
  display: flex; flex-direction: column; gap: 6px; margin-bottom: 28px;
  padding-bottom: 20px; border-bottom: 1px solid #e8e0d4;
}
.ct-summary-eyebrow {
  display: flex; align-items: center; gap: 10px;
  font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 500;
  letter-spacing: 0.3em; text-transform: uppercase; color: #c4a064;
}
.ct-summary-title {
  font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 300;
  color: #1a1612; margin: 0; line-height: 1;
}
.ct-summary-title em { font-style: italic; color: #c4a064; }

.ct-summary-body { margin-bottom: 24px; }

/* Checkout button */
.ct-checkout-btn {
  width: 100%; background: #1a1612; border: none;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 16px 24px; cursor: pointer; margin-bottom: 24px;
  transition: background 0.25s;
  position: relative; overflow: hidden;
}
.ct-checkout-btn::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, transparent 40%, rgba(196,160,100,0.12) 100%);
  pointer-events: none;
}
.ct-checkout-btn:hover { background: #c4a064; }
.ct-checkout-btn:hover .ct-checkout-label { letter-spacing: 0.3em; }
.ct-checkout-btn:hover .ct-checkout-arrow { transform: translateX(4px); }
.ct-checkout-label {
  font-family: 'Montserrat', sans-serif; font-size: 9.5px; font-weight: 600;
  letter-spacing: 0.24em; text-transform: uppercase; color: #f5f0e8;
  transition: letter-spacing 0.3s;
}
.ct-checkout-btn:hover .ct-checkout-label { color: #1a1612; }
.ct-checkout-arrow {
  color: #f5f0e8; flex-shrink: 0;
  transition: transform 0.25s;
}
.ct-checkout-btn:hover .ct-checkout-arrow { color: #1a1612; }

/* Trust items in summary */
.ct-summary-trust { display: flex; flex-direction: column; gap: 0; }
.ct-trust-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 0; border-top: 1px solid #f0ebe3;
}
.ct-trust-icon {
  font-size: 10px; color: #c4a064; flex-shrink: 0; width: 14px; text-align: center;
}
.ct-trust-text {
  font-family: 'Montserrat', sans-serif; font-size: 9.5px;
  color: #a09080; letter-spacing: 0.05em;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .ct-body { grid-template-columns: 1fr; gap: 32px; }
  .ct-summary { position: static; }
}
@media (max-width: 640px) {
  .ct-root    { padding: 32px 16px 60px; }
  .ct-title   { font-size: 36px; }
  .ct-item    { grid-template-columns: 72px 1fr 24px; grid-template-rows: auto auto; gap: 12px; }
  .ct-item-img-wrap { width: 72px; height: 88px; }
  .ct-qty     { grid-column: 2; }
  .ct-item-total { display: none; }
  .ct-col-headers { display: none; }
}
`;

export default Cart;
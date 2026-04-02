import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  const [hovered, setHovered] = useState(false);

  const productImage = Array.isArray(image) && image.length > 0 ? image[0] : 'placeholder.jpg';
  const hoverImage = Array.isArray(image) && image.length > 1 ? image[1] : productImage;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@300;400;500;600&display=swap');

        .product-card-link {
          text-decoration: none;
          display: block;
          cursor: pointer;
        }

        .product-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* Image wrapper */
        .product-img-wrap {
          position: relative;
          overflow: hidden;
          background: #f5f2ee;
          aspect-ratio: 3 / 4;
        }

        .product-img,
        .product-img-hover {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.55s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1);
        }

        .product-img {
          opacity: 1;
          transform: scale(1);
        }
        .product-img.faded {
          opacity: 0;
        }

        .product-img-hover {
          opacity: 0;
          transform: scale(1.06);
        }
        .product-img-hover.visible {
          opacity: 1;
          transform: scale(1);
        }

        /* Overlay on hover */
        .product-overlay {
          position: absolute;
          inset: 0;
          background: rgba(14, 12, 10, 0);
          transition: background 0.4s ease;
          z-index: 2;
          pointer-events: none;
        }
        .product-card:hover .product-overlay {
          background: rgba(14, 12, 10, 0.06);
        }

        /* Quick view pill */
        .product-quick-view {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%) translateY(8px);
          background: rgba(14,12,10,0.82);
          color: #f5f0e8;
          font-family: 'Montserrat', sans-serif;
          font-size: 8.5px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 8px 20px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.3s ease 0.05s, transform 0.35s cubic-bezier(0.16,1,0.3,1) 0.05s;
          z-index: 3;
          pointer-events: none;
          backdrop-filter: blur(4px);
        }
        .product-card:hover .product-quick-view {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        /* New badge */
        .product-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 4;
          background: #c4a064;
          color: #0e0c0a;
          font-family: 'Montserrat', sans-serif;
          font-size: 7.5px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 4px 8px;
        }

        /* Product info */
        .product-info {
          padding: 14px 2px 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .product-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
          font-weight: 400;
          color: #1a1612;
          line-height: 1.3;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.2s ease;
        }
        .product-card-link:hover .product-name {
          color: #c4a064;
        }

        .product-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .product-price {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: #6b5f50;
        }

        /* Thin underline reveal on hover */
        .product-underline {
          height: 1px;
          background: #c4a064;
          margin-top: 10px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .product-card:hover .product-underline {
          transform: scaleX(1);
        }
      `}</style>

      <Link
        className="product-card-link"
        to={id ? `/product/${id}` : '#'}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="product-card">
          {/* Image */}
          <div className="product-img-wrap">
            <div className="product-badge">New</div>
            <img
              className={`product-img ${hovered ? 'faded' : ''}`}
              src={productImage}
              alt={name || 'Product'}
            />
            <img
              className={`product-img-hover ${hovered ? 'visible' : ''}`}
              src={hoverImage}
              alt={name || 'Product'}
            />
            <div className="product-overlay" />
            <div className="product-quick-view">View Piece</div>
          </div>

          {/* Info */}
          <div className="product-info">
            <p className="product-name">{name || 'No Name'}</p>
            <div className="product-price-row">
              <span className="product-price">
                {currency ? `${currency}${price}` : 'Price Not Available'}
              </span>
            </div>
            <div className="product-underline" />
          </div>
        </div>
      </Link>
    </>
  );
};

export default ProductItem;
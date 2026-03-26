import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);
      setRelated(productsCopy.slice(0, 5));
    }
  }, [products, category, subCategory]);

  if (related.length === 0) return null;

  return (
    <>
      <style>{`
        .rp-root { margin: 80px 0 40px; }
        .rp-header {
          display: flex; align-items: center; gap: 24px; margin-bottom: 40px;
        }
        .rp-header-rule {
          flex: 1; height: 1px;
          background: linear-gradient(to right, transparent, #d4c8b8, transparent);
        }
        .rp-title-block {
          display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0;
        }
        .rp-eyebrow {
          font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 500;
          letter-spacing: 0.3em; text-transform: uppercase; color: #c4a064;
        }
        .rp-title {
          font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 300;
          color: #1a1612; margin: 0; line-height: 1; white-space: nowrap;
        }
        .rp-title em { font-style: italic; color: #c4a064; }
        .rp-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }
        @media (max-width: 1024px) { .rp-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 768px)  { .rp-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 480px)  { .rp-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <div className="rp-root">
        <div className="rp-header">
          <div className="rp-header-rule" />
          <div className="rp-title-block">
            <span className="rp-eyebrow">You May Also Like</span>
            <h2 className="rp-title">Related <em>Pieces</em></h2>
          </div>
          <div className="rp-header-rule" />
        </div>

        <div className="rp-grid">
          {related.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.images}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default RelatedProducts;
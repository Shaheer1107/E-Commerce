import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const subtotal = getCartAmount();
  const total    = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <>
      <style>{`
        .ct-totals { width: 100%; display: flex; flex-direction: column; gap: 0; }
        .ct-totals-row {
          display: flex; justify-content: space-between; align-items: baseline;
          padding: 12px 0; border-bottom: 1px solid #f0ebe3;
        }
        .ct-totals-row:first-child { border-top: 1px solid #f0ebe3; }
        .ct-totals-label {
          font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 400;
          letter-spacing: 0.14em; text-transform: uppercase; color: #8b7f72;
        }
        .ct-totals-value {
          font-family: 'Cormorant Garamond', serif; font-size: 17px;
          font-weight: 400; color: #1a1612;
        }
        .ct-totals-row--total .ct-totals-label {
          font-weight: 600; color: #1a1612;
        }
        .ct-totals-row--total .ct-totals-value {
          font-size: 22px; color: #1a1612;
        }
        .ct-totals-row--total { border-bottom: none; padding-top: 14px; }
      `}</style>

      <div className="ct-totals">
        <div className="ct-totals-row">
          <span className="ct-totals-label">Subtotal</span>
          <span className="ct-totals-value">{currency}{subtotal}.00</span>
        </div>
        <div className="ct-totals-row">
          <span className="ct-totals-label">Shipping</span>
          <span className="ct-totals-value">{currency}{delivery_fee}</span>
        </div>
        <div className="ct-totals-row ct-totals-row--total">
          <span className="ct-totals-label">Total</span>
          <span className="ct-totals-value">{currency}{total}</span>
        </div>
      </div>
    </>
  )
}

export default CartTotal
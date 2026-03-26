import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const STATUS_STEPS = ['Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered'];

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success('Order status updated');
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <>
      <style>{STYLES}</style>

      <div className="op-root">

        {/* Header */}
        <div className="op-header">
          <div className="op-header-left">
            <span className="op-eyebrow">
              <span className="op-eyebrow-rule" />
              Fulfilment
              <span className="op-eyebrow-rule" />
            </span>
            <h1 className="op-title">Order <em>Management</em></h1>
          </div>
          <div className="op-header-right">
            <span className="op-count">
              <span className="op-count-num">{orders.length}</span>
              <span className="op-count-label">orders</span>
            </span>
          </div>
        </div>

        {/* Orders */}
        <div className="op-list">
          {orders.length === 0 ? (
            <div className="op-empty">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="8" width="24" height="20" rx="1" stroke="#c4a064" strokeWidth="1.2" strokeDasharray="3 2"/>
                <path d="M10 8V6a6 6 0 0112 0v2" stroke="#c4a064" strokeWidth="1.2"/>
                <path d="M11 17h10M11 21h6" stroke="#c4a064" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span className="op-empty-text">No orders yet</span>
            </div>
          ) : (
            orders.map((order, index) => (
              <div
                key={index}
                className="op-card"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {/* Left accent */}
                <div className="op-card-accent" />

                {/* Parcel icon + order index */}
                <div className="op-icon-col">
                  <div className="op-parcel-wrap">
                    <img className="op-parcel" src={assets.parcel_icon} alt="Order" />
                  </div>
                  <span className="op-order-num">#{orders.length - index}</span>
                </div>

                {/* Items + Address */}
                <div className="op-main-col">
                  <div className="op-items">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="op-item">
                        {item.name}
                        <span className="op-item-qty">×{item.quantity}</span>
                        <span className="op-item-size">{item.size}</span>
                        {idx < order.items.length - 1 && <span className="op-item-sep">·</span>}
                      </span>
                    ))}
                  </div>

                  <div className="op-divider-inline" />

                  <div className="op-address">
                    <span className="op-customer">
                      {order.address.firstName} {order.address.lastName}
                    </span>
                    <span className="op-addr-line">{order.address.street},</span>
                    <span className="op-addr-line">
                      {order.address.city}, {order.address.state}, {order.address.country} — {order.address.zipcode}
                    </span>
                    <span className="op-phone">{order.address.phone}</span>
                  </div>
                </div>

                {/* Meta */}
                <div className="op-meta-col">
                  <div className="op-meta-row">
                    <span className="op-meta-key">Items</span>
                    <span className="op-meta-val">{order.items.length}</span>
                  </div>
                  <div className="op-meta-row">
                    <span className="op-meta-key">Method</span>
                    <span className="op-meta-val">{order.paymentMethod}</span>
                  </div>
                  <div className="op-meta-row">
                    <span className="op-meta-key">Payment</span>
                    <span className={`op-payment-badge ${order.payment ? 'op-payment-badge--done' : 'op-payment-badge--pending'}`}>
                      {order.payment ? 'Done' : 'Pending'}
                    </span>
                  </div>
                  <div className="op-meta-row">
                    <span className="op-meta-key">Date</span>
                    <span className="op-meta-val">{new Date(order.date).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="op-amount-col">
                  <span className="op-amount">{currency}{order.amount}</span>
                </div>

                {/* Status */}
                <div className="op-status-col">
                  <div className="op-select-wrap">
                    <select
                      className="op-select"
                      onChange={(e) => statusHandler(e, order._id)}
                      value={order.status}
                    >
                      {STATUS_STEPS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <svg className="op-select-arrow" width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {/* Progress dots */}
                  <div className="op-progress">
                    {STATUS_STEPS.map((s, i) => {
                      const currentIdx = STATUS_STEPS.indexOf(order.status);
                      return (
                        <div
                          key={s}
                          className={`op-dot ${i <= currentIdx ? 'op-dot--active' : ''}`}
                          title={s}
                        />
                      );
                    })}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
};

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

.op-root {
  flex: 1;
  background: #f8f5f1;
  min-height: calc(100vh - 60px);
  padding: 40px 48px 60px;
}

/* ── Header ── */
.op-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: 36px;
}
.op-header-left { display: flex; flex-direction: column; gap: 4px; }

.op-eyebrow {
  display: flex; align-items: center; gap: 10px;
  font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 500;
  letter-spacing: 0.3em; text-transform: uppercase; color: #c4a064;
}
.op-eyebrow-rule { display: inline-block; width: 22px; height: 1px; background: #c4a064; }

.op-title {
  font-family: 'Cormorant Garamond', serif; font-size: 34px; font-weight: 300;
  color: #1a1612; margin: 0; line-height: 1;
}
.op-title em { font-style: italic; color: #c4a064; }

.op-count { display: flex; flex-direction: column; align-items: flex-end; gap: 1px; padding-bottom: 4px; }
.op-count-num {
  font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300;
  color: #c4a064; line-height: 1;
}
.op-count-label {
  font-family: 'Montserrat', sans-serif; font-size: 8px; font-weight: 500;
  letter-spacing: 0.22em; text-transform: uppercase; color: #a09080;
}

/* ── List ── */
.op-list { display: flex; flex-direction: column; gap: 10px; }

/* ── Card ── */
.op-card {
  background: #fff;
  border: 1px solid #e0d8ce;
  display: grid;
  grid-template-columns: 56px 1fr 180px 100px 200px;
  gap: 0;
  align-items: center;
  position: relative;
  overflow: hidden;
  animation: opFadeIn 0.35s ease both;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.op-card:hover {
  border-color: rgba(196,160,100,0.4);
  box-shadow: 0 2px 16px rgba(196,160,100,0.07);
}

@keyframes opFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Left gold accent */
.op-card-accent {
  position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
  background: #c4a064;
  transform: scaleY(0);
  transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
  transform-origin: center;
}
.op-card:hover .op-card-accent { transform: scaleY(1); }

/* ── Icon col ── */
.op-icon-col {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 6px; padding: 20px 8px; border-right: 1px solid #f0ebe4;
  align-self: stretch;
}
.op-parcel-wrap {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  background: #fdfaf7; border: 1px solid #e8e0d4;
}
.op-parcel { width: 18px; height: 18px; object-fit: contain; opacity: 0.7; }
.op-order-num {
  font-family: 'Montserrat', sans-serif; font-size: 7.5px; font-weight: 600;
  letter-spacing: 0.1em; color: #b0a090;
}

/* ── Main col ── */
.op-main-col { padding: 18px 20px; display: flex; flex-direction: column; gap: 12px; }

.op-items { display: flex; flex-wrap: wrap; gap: 4px 0; align-items: baseline; }
.op-item {
  font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 500;
  color: #1a1612; letter-spacing: 0.02em;
  display: inline-flex; align-items: baseline; gap: 4px;
}
.op-item-qty {
  font-family: 'Montserrat', sans-serif; font-size: 9.5px; font-weight: 400;
  color: #a09080;
}
.op-item-size {
  font-family: 'Montserrat', sans-serif; font-size: 8px; font-weight: 600;
  letter-spacing: 0.1em; color: #6b5f50;
  background: #f5f0e8; padding: 1px 5px;
}
.op-item-sep { color: #c4a064; margin: 0 4px; font-size: 10px; }

.op-divider-inline { height: 1px; background: #f0ebe4; }

.op-address { display: flex; flex-direction: column; gap: 2px; }
.op-customer {
  font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 600;
  color: #1a1612; letter-spacing: 0.04em;
}
.op-addr-line, .op-phone {
  font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 400;
  color: #7a6e65; letter-spacing: 0.02em;
}
.op-phone { color: #a09080; margin-top: 2px; }

/* ── Meta col ── */
.op-meta-col {
  padding: 18px 16px; display: flex; flex-direction: column; gap: 8px;
  border-left: 1px solid #f0ebe4; align-self: stretch; justify-content: center;
}
.op-meta-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.op-meta-key {
  font-family: 'Montserrat', sans-serif; font-size: 7.5px; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase; color: #b0a090;
}
.op-meta-val {
  font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 500;
  color: #3a3228; letter-spacing: 0.02em;
}
.op-payment-badge {
  font-family: 'Montserrat', sans-serif; font-size: 7.5px; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  padding: 2px 8px;
}
.op-payment-badge--done { background: rgba(196,160,100,0.15); color: #8b6e30; }
.op-payment-badge--pending { background: rgba(160,144,128,0.12); color: #7a6e65; }

/* ── Amount col ── */
.op-amount-col {
  padding: 18px 16px; display: flex; align-items: center; justify-content: center;
  border-left: 1px solid #f0ebe4; align-self: stretch;
}
.op-amount {
  font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400;
  color: #1a1612; letter-spacing: 0.02em;
}

/* ── Status col ── */
.op-status-col {
  padding: 18px 16px; display: flex; flex-direction: column; gap: 12px;
  border-left: 1px solid #f0ebe4; align-self: stretch; justify-content: center;
}
.op-select-wrap { position: relative; }
.op-select {
  width: 100%; appearance: none; background: #fdfcfa; border: 1px solid #e0d8ce;
  padding: 9px 30px 9px 12px; outline: none;
  font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 500;
  color: #1a1612; letter-spacing: 0.04em; cursor: pointer;
  transition: border-color 0.2s;
}
.op-select:focus { border-color: #c4a064; }
.op-select-arrow {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  color: #8b7f72; pointer-events: none;
}

/* Progress dots */
.op-progress { display: flex; align-items: center; gap: 4px; }
.op-dot {
  flex: 1; height: 2px; background: #e0d8ce;
  transition: background 0.3s;
}
.op-dot--active { background: #c4a064; }

/* ── Empty ── */
.op-empty {
  background: #fff; border: 1px solid #e0d8ce;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 14px; padding: 64px 24px;
}
.op-empty-text {
  font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 500;
  letter-spacing: 0.2em; text-transform: uppercase; color: #b0a090;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .op-root { padding: 28px 20px 48px; }
  .op-card {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  .op-icon-col {
    flex-direction: row; justify-content: flex-start;
    padding: 14px 16px; border-right: none; border-bottom: 1px solid #f0ebe4;
    align-self: auto;
  }
  .op-meta-col,
  .op-amount-col,
  .op-status-col {
    border-left: none; border-top: 1px solid #f0ebe4;
    align-self: auto; padding: 14px 16px;
  }
  .op-meta-col { flex-direction: row; flex-wrap: wrap; gap: 12px 24px; }
  .op-meta-row { flex-direction: column; align-items: flex-start; gap: 2px; }
  .op-amount-col { justify-content: flex-start; }
  .op-header { flex-direction: column; align-items: flex-start; gap: 8px; }
  .op-count { align-items: flex-start; }
}
`;

export default Orders;
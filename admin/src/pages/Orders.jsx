import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const STATUS_STEPS = ['Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered'];
const ALL_STATUSES = [...STATUS_STEPS, 'Cancelled'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const fmtTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const toDateInputVal = (date) => date.toISOString().slice(0, 10);

// ─── Component ────────────────────────────────────────────────────────────────
const Orders = ({ token }) => {
  const [orders,      setOrders]      = useState([]);
  const [tab,         setTab]         = useState('active');   // 'active' | 'history'
  const [statusFilter,setStatusFilter]= useState('All');
  const [methodFilter,setMethodFilter]= useState('All');
  const [payFilter,   setPayFilter]   = useState('All');      // 'All' | 'Paid' | 'Pending'
  const [dateFrom,    setDateFrom]    = useState('');
  const [dateTo,      setDateTo]      = useState('');
  const [search,      setSearch]      = useState('');

  // ─── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        // Sort newest first (backend already does this, but be safe)
        const sorted = [...response.data.orders].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setOrders(sorted);
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

  useEffect(() => { fetchAllOrders(); }, [token]);

  // ─── Derived lists ──────────────────────────────────────────────────────────
  // "active" = not Delivered and not Cancelled
  // "history" = Delivered OR Cancelled
  const activeOrders  = useMemo(() => orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled'), [orders]);
  const historyOrders = useMemo(() => orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled'), [orders]);

  const baseList = tab === 'active' ? activeOrders : historyOrders;

  // ─── Apply filters ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return baseList.filter(order => {
      // Status filter
      if (statusFilter !== 'All' && order.status !== statusFilter) return false;

      // Payment method filter
      if (methodFilter !== 'All' && order.paymentMethod !== methodFilter) return false;

      // Paid / Pending filter
      if (payFilter === 'Paid'    && !order.payment)  return false;
      if (payFilter === 'Pending' &&  order.payment)  return false;

      // Date range filter
      if (dateFrom) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        if (new Date(order.date) < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (new Date(order.date) > to) return false;
      }

      // Search: customer name or order id
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const name = `${order.address?.firstName ?? ''} ${order.address?.lastName ?? ''}`.toLowerCase();
        const id   = (order._id ?? '').toLowerCase();
        if (!name.includes(q) && !id.includes(q)) return false;
      }

      return true;
    });
  }, [baseList, statusFilter, methodFilter, payFilter, dateFrom, dateTo, search]);

  // Available statuses for the active status filter dropdown (context-aware)
  const statusOptions = tab === 'active'
    ? ['All', ...STATUS_STEPS]
    : ['All', 'Delivered', 'Cancelled'];

  const resetFilters = () => {
    setStatusFilter('All');
    setMethodFilter('All');
    setPayFilter('All');
    setDateFrom('');
    setDateTo('');
    setSearch('');
  };

  const hasFilters = statusFilter !== 'All' || methodFilter !== 'All' || payFilter !== 'All' || dateFrom || dateTo || search;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES}</style>

      <div className="op-root">

        {/* ── Header ── */}
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
            <div className="op-count-group">
              <div className="op-count">
                <span className="op-count-num">{activeOrders.length}</span>
                <span className="op-count-label">active</span>
              </div>
              <div className="op-count-sep" />
              <div className="op-count">
                <span className="op-count-num">{historyOrders.length}</span>
                <span className="op-count-label">completed</span>
              </div>
            </div>
            <button className="op-refresh-btn" onClick={fetchAllOrders} title="Refresh">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M1 7a6 6 0 1 0 1.2-3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M1 3.4V7h3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="op-tabs">
          <button
            className={`op-tab ${tab === 'active' ? 'op-tab--active' : ''}`}
            onClick={() => { setTab('active'); setStatusFilter('All'); }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M6 3.5v3l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Active Orders
            <span className="op-tab-badge">{activeOrders.length}</span>
          </button>
          <button
            className={`op-tab ${tab === 'history' ? 'op-tab--active' : ''}`}
            onClick={() => { setTab('history'); setStatusFilter('All'); }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 10V4l4-2 4 2v6l-4 2-4-2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              <path d="M6 2v10M2 6h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Order History
            <span className="op-tab-badge op-tab-badge--history">{historyOrders.length}</span>
          </button>
        </div>

        {/* ── Filter Bar ── */}
        <div className="op-filter-bar">

          {/* Search */}
          <div className="op-search-wrap">
            <svg className="op-search-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M8 8l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input
              className="op-search"
              type="text"
              placeholder="Search customer or order ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Status */}
          <div className="op-filter-select-wrap">
            <select
              className="op-filter-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(s => <option key={s}>{s}</option>)}
            </select>
            <svg className="op-filter-arrow" width="9" height="9" viewBox="0 0 10 10" fill="none">
              <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Payment method */}
          <div className="op-filter-select-wrap">
            <select
              className="op-filter-select"
              value={methodFilter}
              onChange={e => setMethodFilter(e.target.value)}
            >
              {['All', 'COD', 'Stripe'].map(m => <option key={m}>{m}</option>)}
            </select>
            <svg className="op-filter-arrow" width="9" height="9" viewBox="0 0 10 10" fill="none">
              <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Payment status */}
          <div className="op-filter-select-wrap">
            <select
              className="op-filter-select"
              value={payFilter}
              onChange={e => setPayFilter(e.target.value)}
            >
              {['All', 'Paid', 'Pending'].map(p => <option key={p}>{p}</option>)}
            </select>
            <svg className="op-filter-arrow" width="9" height="9" viewBox="0 0 10 10" fill="none">
              <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Date range */}
          <div className="op-date-range">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="2.5" width="10" height="8.5" rx="0.8" stroke="currentColor" strokeWidth="1.1"/>
              <path d="M1 5.5h10M4 1v3M8 1v3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
            </svg>
            <input
              className="op-date-input"
              type="date"
              value={dateFrom}
              max={dateTo || toDateInputVal(new Date())}
              onChange={e => setDateFrom(e.target.value)}
              title="From date"
            />
            <span className="op-date-sep">→</span>
            <input
              className="op-date-input"
              type="date"
              value={dateTo}
              min={dateFrom}
              max={toDateInputVal(new Date())}
              onChange={e => setDateTo(e.target.value)}
              title="To date"
            />
          </div>

          {/* Clear */}
          {hasFilters && (
            <button className="op-clear-btn" onClick={resetFilters}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* Results summary */}
        <div className="op-results-bar">
          <span className="op-results-txt">
            Showing <strong>{filtered.length}</strong> of <strong>{baseList.length}</strong> {tab === 'active' ? 'active' : 'completed'} orders
          </span>
        </div>

        {/* ── Order List ── */}
        <div className="op-list">
          {filtered.length === 0 ? (
            <div className="op-empty">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="8" width="24" height="20" rx="1" stroke="#c4a064" strokeWidth="1.2" strokeDasharray="3 2"/>
                <path d="M10 8V6a6 6 0 0112 0v2" stroke="#c4a064" strokeWidth="1.2"/>
                <path d="M11 17h10M11 21h6" stroke="#c4a064" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span className="op-empty-text">
                {hasFilters ? 'No orders match your filters' : 'No orders here yet'}
              </span>
            </div>
          ) : (
            filtered.map((order, index) => (
              <OrderCard
                key={order._id}
                order={order}
                index={index}
                token={token}
                onStatusChange={statusHandler}
                tab={tab}
              />
            ))
          )}
        </div>

      </div>
    </>
  );
};

// ─── Order Card ───────────────────────────────────────────────────────────────
const OrderCard = ({ order, index, onStatusChange, tab }) => {
  const [expanded, setExpanded] = useState(false);

  const displayAmount = typeof order.amount === 'number'
    ? order.amount.toFixed(2)
    : parseFloat(order.amount || 0).toFixed(2);

  const paymentLabel = order.payment
    ? 'Paid'
    : order.paymentMethod === 'COD'
      ? 'Pay on Delivery'
      : 'Pending';

  const paymentClass = order.payment
    ? 'op-payment-badge--done'
    : order.paymentMethod === 'COD'
      ? 'op-payment-badge--cod'
      : 'op-payment-badge--pending';

  const isHistory = tab === 'history';

  // Summary line: "Product A ×2 (M), Product B ×1 (L)"
  const itemSummary = order.items
    .map(it => `${it.name} ×${it.quantity}${it.size ? ` (${it.size})` : ''}`)
    .join(' · ');

  return (
    <div
      className={`op-card ${isHistory && order.status === 'Cancelled' ? 'op-card--cancelled' : ''} ${isHistory && order.status === 'Delivered' ? 'op-card--delivered' : ''} ${expanded ? 'op-card--expanded' : ''}`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Left accent */}
      <div className="op-card-accent" />

      {/* ── Collapsed / summary row ── */}
      <div className="op-summary-row">

        {/* Parcel icon + order id */}
        <div className="op-icon-col">
          <div className="op-parcel-wrap">
            <img className="op-parcel" src={assets.parcel_icon} alt="Order" />
          </div>
          <span className="op-order-id">#{order._id?.slice(-6)?.toUpperCase()}</span>
        </div>

        {/* Items summary + Address */}
        <div className="op-main-col">
          {/* Item summary line */}
          <div className="op-items-summary">
            <span className="op-items-summary-txt">{itemSummary}</span>
            <span className="op-items-count-badge">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
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
            <span className="op-meta-key">Method</span>
            <span className="op-meta-val">{order.paymentMethod}</span>
          </div>
          <div className="op-meta-row">
            <span className="op-meta-key">Payment</span>
            <span className={`op-payment-badge ${paymentClass}`}>
              {paymentLabel}
            </span>
          </div>
          <div className="op-meta-row">
            <span className="op-meta-key">Date</span>
            <span className="op-meta-val op-meta-val--date">
              <span>{fmt(order.date)}</span>
              <span className="op-meta-time">{fmtTime(order.date)}</span>
            </span>
          </div>
        </div>

        {/* Amount */}
        <div className="op-amount-col">
          <span className="op-amount">{currency}{displayAmount}</span>
        </div>

        {/* Status + expand */}
        <div className="op-status-col">
          <div className="op-select-wrap">
            <select
              className="op-select"
              onChange={(e) => onStatusChange(e, order._id)}
              value={order.status}
              onClick={e => e.stopPropagation()}
            >
              {ALL_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <svg className="op-select-arrow" width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {order.status === 'Cancelled' ? (
            <div className="op-cancelled-badge">✕ Cancelled</div>
          ) : (
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
          )}

          {/* Expand toggle */}
          <button
            className="op-expand-btn"
            onClick={() => setExpanded(v => !v)}
            title={expanded ? 'Hide items' : 'View items'}
          >
            <svg
              width="10" height="10" viewBox="0 0 10 10" fill="none"
              style={{ transition: 'transform 0.25s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {expanded ? 'Hide Items' : `View ${order.items.length} Item${order.items.length !== 1 ? 's' : ''}`}
          </button>
        </div>

      </div>

      {/* ── Expanded: item breakdown ── */}
      {expanded && (
        <div className="op-items-detail">
          <div className="op-items-detail-header">
            <span className="op-items-detail-title">Order Items</span>
            <span className="op-items-detail-sub">{order.items.length} product{order.items.length !== 1 ? 's' : ''} · {order.items.reduce((s, it) => s + (it.quantity || 1), 0)} units total</span>
          </div>
          <div className="op-items-detail-list">
            {order.items.map((item, idx) => (
              <div key={idx} className="op-item-row">
                <div className="op-item-index">{idx + 1}</div>
                <div className="op-item-info">
                  <span className="op-item-name">{item.name}</span>
                  <div className="op-item-chips">
                    <span className="op-item-chip">Size: {item.size}</span>
                    <span className="op-item-chip">Qty: {item.quantity}</span>
                    <span className="op-item-chip op-item-chip--price">{currency}{item.price} each</span>
                  </div>
                </div>
                <div className="op-item-subtotal">
                  {currency}{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="op-items-detail-footer">
            <span className="op-items-footer-label">Order Total</span>
            <span className="op-items-footer-total">{currency}{displayAmount}</span>
          </div>
        </div>
      )}

    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
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
  margin-bottom: 28px;
}
.op-header-left  { display: flex; flex-direction: column; gap: 4px; }
.op-header-right { display: flex; align-items: center; gap: 16px; }

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

.op-count-group { display: flex; align-items: center; gap: 0; }
.op-count { display: flex; flex-direction: column; align-items: center; gap: 1px; padding: 0 14px; }
.op-count-num {
  font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 300;
  color: #c4a064; line-height: 1;
}
.op-count-label {
  font-family: 'Montserrat', sans-serif; font-size: 7.5px; font-weight: 500;
  letter-spacing: 0.2em; text-transform: uppercase; color: #a09080;
}
.op-count-sep { width: 1px; height: 28px; background: #e0d8ce; }

.op-refresh-btn {
  display: flex; align-items: center; gap: 6px;
  font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase;
  background: none; border: 1px solid #c4a064; color: #c4a064;
  padding: 7px 14px; cursor: pointer; transition: background 0.2s, color 0.2s;
}
.op-refresh-btn:hover { background: #c4a064; color: #fff; }

/* ── Tabs ── */
.op-tabs {
  display: flex; gap: 0; margin-bottom: 20px;
  border-bottom: 1px solid #e0d8ce;
}
.op-tab {
  display: flex; align-items: center; gap: 8px;
  font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 600;
  letter-spacing: 0.2em; text-transform: uppercase; color: #a09080;
  background: none; border: none; border-bottom: 2px solid transparent;
  padding: 12px 20px; cursor: pointer; margin-bottom: -1px;
  transition: color 0.2s, border-color 0.2s;
}
.op-tab:hover { color: #c4a064; }
.op-tab--active { color: #1a1612; border-bottom-color: #c4a064; }

.op-tab-badge {
  font-family: 'Montserrat', sans-serif; font-size: 8px; font-weight: 700;
  background: rgba(196,160,100,0.15); color: #8b6e30;
  padding: 2px 7px; border-radius: 20px;
}
.op-tab-badge--history {
  background: rgba(107,143,113,0.12); color: #4a7550;
}

/* ── Filter Bar ── */
.op-filter-bar {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  background: #fff; border: 1px solid #e0d8ce;
  padding: 14px 18px; margin-bottom: 10px;
}

.op-search-wrap {
  position: relative; flex: 1; min-width: 180px;
}
.op-search-icon {
  position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
  color: #b0a090; pointer-events: none;
}
.op-search {
  width: 100%; padding: 8px 12px 8px 30px;
  border: 1px solid #e0d8ce; background: #fdfcfa; outline: none;
  font-family: 'Montserrat', sans-serif; font-size: 10px; color: #1a1612;
  transition: border-color 0.2s;
}
.op-search::placeholder { color: #b0a090; }
.op-search:focus { border-color: #c4a064; }

.op-filter-select-wrap { position: relative; flex-shrink: 0; }
.op-filter-select {
  appearance: none; background: #fdfcfa; border: 1px solid #e0d8ce;
  padding: 8px 26px 8px 11px; outline: none;
  font-family: 'Montserrat', sans-serif; font-size: 9.5px; font-weight: 500;
  color: #1a1612; letter-spacing: 0.03em; cursor: pointer;
  transition: border-color 0.2s;
}
.op-filter-select:focus { border-color: #c4a064; }
.op-filter-arrow {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  color: #8b7f72; pointer-events: none;
}

/* Date range */
.op-date-range {
  display: flex; align-items: center; gap: 8px;
  background: #fdfcfa; border: 1px solid #e0d8ce; padding: 6px 12px;
  color: #b0a090; flex-shrink: 0;
}
.op-date-input {
  border: none; background: transparent; outline: none;
  font-family: 'Montserrat', sans-serif; font-size: 9.5px; color: #1a1612;
  cursor: pointer; width: 110px;
}
.op-date-sep {
  font-family: 'Montserrat', sans-serif; font-size: 10px; color: #c4a064;
}

.op-clear-btn {
  font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 600;
  letter-spacing: 0.15em; text-transform: uppercase;
  background: rgba(160,96,96,0.08); border: 1px solid rgba(160,96,96,0.25);
  color: #a06060; padding: 7px 12px; cursor: pointer;
  transition: background 0.2s;
}
.op-clear-btn:hover { background: rgba(160,96,96,0.15); }

/* Results bar */
.op-results-bar {
  display: flex; align-items: center; padding: 0 2px; margin-bottom: 12px;
}
.op-results-txt {
  font-family: 'Montserrat', sans-serif; font-size: 9px; color: #a09080;
  letter-spacing: 0.05em;
}
.op-results-txt strong { color: #3a3228; font-weight: 600; }

/* ── List ── */
.op-list { display: flex; flex-direction: column; gap: 10px; }

/* ── Card ── */
.op-card {
  background: #fff;
  border: 1px solid #e0d8ce;
  position: relative;
  overflow: hidden;
  animation: opFadeIn 0.35s ease both;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.op-card:hover {
  border-color: rgba(196,160,100,0.4);
  box-shadow: 0 2px 16px rgba(196,160,100,0.07);
}
.op-card--delivered { border-left: 2px solid #6B8F71; }
.op-card--cancelled { border-left: 2px solid #A06060; opacity: 0.82; }
.op-card--expanded  { border-color: rgba(196,160,100,0.5); }

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
.op-card--delivered .op-card-accent { background: #6B8F71; transform: scaleY(1); }
.op-card--cancelled .op-card-accent { background: #A06060; transform: scaleY(1); }
.op-card:hover .op-card-accent,
.op-card--expanded .op-card-accent  { transform: scaleY(1); }

/* ── Summary row (the main collapsed view) ── */
.op-summary-row {
  display: grid;
  grid-template-columns: 68px 1fr 190px 110px 210px;
  gap: 0;
  align-items: center;
}

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
.op-order-id {
  font-family: 'Montserrat', sans-serif; font-size: 7px; font-weight: 600;
  letter-spacing: 0.08em; color: #b0a090; text-align: center;
}

/* ── Main col ── */
.op-main-col { padding: 18px 20px; display: flex; flex-direction: column; gap: 10px; }

/* Items summary line */
.op-items-summary {
  display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;
}
.op-items-summary-txt {
  font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 500;
  color: #1a1612; letter-spacing: 0.02em;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  max-width: 340px;
}
.op-items-count-badge {
  font-family: 'Montserrat', sans-serif; font-size: 8px; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase;
  background: rgba(196,160,100,0.12); color: #8b6e30;
  padding: 2px 8px; flex-shrink: 0;
}

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
.op-meta-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.op-meta-key {
  font-family: 'Montserrat', sans-serif; font-size: 7.5px; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase; color: #b0a090; white-space: nowrap;
}
.op-meta-val {
  font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 500;
  color: #3a3228; letter-spacing: 0.02em; text-align: right;
}
.op-meta-val--date { display: flex; flex-direction: column; align-items: flex-end; gap: 1px; }
.op-meta-time {
  font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 400; color: #a09080;
}

/* Payment badge */
.op-payment-badge {
  font-family: 'Montserrat', sans-serif; font-size: 7.5px; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  padding: 2px 8px; white-space: nowrap;
}
.op-payment-badge--done    { background: rgba(107,143,113,0.15); color: #4a7550; }
.op-payment-badge--pending { background: rgba(196,160,100,0.15); color: #8b6e30; }
.op-payment-badge--cod     { background: rgba(160,144,128,0.12); color: #7a6e65; }

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
  padding: 18px 16px; display: flex; flex-direction: column; gap: 10px;
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
.op-dot { flex: 1; height: 2px; background: #e0d8ce; transition: background 0.3s; }
.op-dot--active { background: #c4a064; }

.op-cancelled-badge {
  font-family: 'Montserrat', sans-serif; font-size: 8px; font-weight: 600;
  letter-spacing: 0.15em; text-transform: uppercase;
  color: #a06060; background: rgba(160,96,96,0.08);
  padding: 4px 8px; text-align: center;
}

/* Expand button */
.op-expand-btn {
  display: flex; align-items: center; justify-content: center; gap: 5px;
  font-family: 'Montserrat', sans-serif; font-size: 8px; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  background: none; border: 1px solid #e0d8ce; color: #8b7f72;
  padding: 6px 10px; cursor: pointer; width: 100%;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}
.op-expand-btn:hover {
  border-color: #c4a064; color: #c4a064; background: rgba(196,160,100,0.04);
}

/* ── Items detail (expanded section) ── */
.op-items-detail {
  border-top: 1px solid #f0ebe4;
  background: #fdfaf7;
  padding: 16px 20px 20px;
  animation: opItemsIn 0.25s ease;
}
@keyframes opItemsIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.op-items-detail-header {
  display: flex; align-items: baseline; justify-content: space-between;
  margin-bottom: 12px;
}
.op-items-detail-title {
  font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 600;
  letter-spacing: 0.25em; text-transform: uppercase; color: #a09080;
}
.op-items-detail-sub {
  font-family: 'Montserrat', sans-serif; font-size: 8px; color: #b0a090;
  letter-spacing: 0.08em;
}

.op-items-detail-list {
  display: flex; flex-direction: column; gap: 6px;
}

.op-item-row {
  display: flex; align-items: center; gap: 14px;
  background: #fff; border: 1px solid #ede5d8;
  padding: 10px 14px;
}

.op-item-index {
  width: 20px; height: 20px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 600;
  color: #c4a064; background: rgba(196,160,100,0.1);
  border: 1px solid rgba(196,160,100,0.2);
}

.op-item-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.op-item-name {
  font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 500;
  color: #1a1612; letter-spacing: 0.02em;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.op-item-chips { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.op-item-chip {
  font-family: 'Montserrat', sans-serif; font-size: 8px; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  background: #f5f0e8; color: #6b5f50;
  padding: 2px 7px;
}
.op-item-chip--price {
  background: rgba(26,22,18,0.06); color: #3a3228;
}

.op-item-subtotal {
  font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 600;
  color: #1a1612; letter-spacing: 0.04em; flex-shrink: 0;
}

.op-items-detail-footer {
  display: flex; justify-content: flex-end; align-items: center; gap: 16px;
  margin-top: 12px; padding-top: 12px; border-top: 1px solid #e8e0d4;
}
.op-items-footer-label {
  font-family: 'Montserrat', sans-serif; font-size: 8px; font-weight: 600;
  letter-spacing: 0.22em; text-transform: uppercase; color: #b0a090;
}
.op-items-footer-total {
  font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400; color: #1a1612;
}

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
@media (max-width: 1000px) {
  .op-root { padding: 28px 20px 48px; }
  .op-summary-row { grid-template-columns: 1fr; }
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
  .op-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .op-filter-bar { gap: 8px; }
  .op-date-range { flex-wrap: wrap; }
  .op-items-summary-txt { max-width: 100%; }
}

@media (max-width: 640px) {
  .op-tabs { overflow-x: auto; }
  .op-search-wrap { min-width: 100%; }
  .op-filter-select { font-size: 9px; }
}
`;

export default Orders;
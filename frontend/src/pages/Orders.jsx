import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const STATUS_CONFIG = {
  'Order Placed':     { color: '#7BA7BC', bg: 'rgba(123,167,188,0.12)', step: 1 },
  'Packing':          { color: '#C4A064', bg: 'rgba(196,160,100,0.12)', step: 2 },
  'Shipped':          { color: '#B07D62', bg: 'rgba(176,125,98,0.12)',  step: 3 },
  'Out for Delivery': { color: '#8B7355', bg: 'rgba(139,115,85,0.12)',  step: 4 },
  'Delivered':        { color: '#6B8F71', bg: 'rgba(107,143,113,0.12)', step: 5 },
  'Cancelled':        { color: '#A06060', bg: 'rgba(160,96,96,0.12)',   step: 0 },
}

const STEPS = ['Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered']

// An order can be cancelled only when:
//   1. Payment method is COD
//   2. Status is not already Shipped / Out for Delivery / Delivered / Cancelled
const canCancel = (order) =>
  order.paymentMethod === 'COD' &&
  !['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(order.status)

const Orders = () => {
  const { backendUrl, token, currency, products } = useContext(ShopContext)

  // orderData is now an array of ORDER objects (not flattened items)
  const [orderData,   setOrderData]   = useState([])
  const [loading,     setLoading]     = useState(true)
  const [refreshing,  setRefreshing]  = useState(false)
  const [expanded,    setExpanded]    = useState(null)      // order._id
  const [cancelling,  setCancelling]  = useState(null)      // orderId being cancelled
  const [confirmId,   setConfirmId]   = useState(null)      // orderId awaiting confirm dialog

  // ─── Load orders ────────────────────────────────────────────────────────────
  const loadOrderData = async ({ silent = false } = {}) => {
    try {
      if (!token) return
      silent ? setRefreshing(true) : setLoading(true)

      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      )

      if (response.data.success) {
        // Keep orders as-is — sorted newest first (backend does this)
        setOrderData(response.data.orders)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { loadOrderData() }, [token])

  // ─── Cancel order ────────────────────────────────────────────────────────────
  const handleCancelOrder = async (orderId) => {
    try {
      setCancelling(orderId)
      const response = await axios.post(
        backendUrl + '/api/order/cancel',
        { orderId },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('Order cancelled successfully')
        await loadOrderData({ silent: true })
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setCancelling(null)
      setConfirmId(null)
    }
  }

  // ─── Image resolver ──────────────────────────────────────────────────────────
  const resolveImage = (item) => {
    let img = ''
    if (Array.isArray(item.image)  && item.image.length > 0)  img = item.image[0]
    else if (Array.isArray(item.images) && item.images.length > 0) img = item.images[0]
    else if (typeof item.image === 'string' && item.image)         img = item.image

    if (!img) {
      const matched = products.find((p) => p.name === item.name)
      if (matched) img = Array.isArray(matched.image) ? matched.image[0] : matched.image
    }

    if (!img) return ''
    if (img.startsWith('http') || img.startsWith('data:')) return img
    return `${backendUrl}/${img.replace(/^\//, '')}`
  }

  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
          .o-loading { min-height:60vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; border-top:1px solid #e8e0d4; }
          .o-spinner  { width:32px; height:32px; border:2px solid #e8e0d4; border-top-color:#c4a064; border-radius:50%; animation:ospin 0.9s linear infinite; }
          .o-loading-txt { font-family:'Montserrat',sans-serif; font-size:10px; letter-spacing:0.25em; color:#a09080; text-transform:uppercase; }
          @keyframes ospin { to { transform:rotate(360deg); } }
        `}</style>
        <div className="o-loading">
          <div className="o-spinner" />
          <p className="o-loading-txt">Retrieving your orders…</p>
        </div>
      </>
    )
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES}</style>

      {/* Cancel Confirmation Modal */}
      {confirmId && (
        <div className="or-modal-overlay" onClick={() => setConfirmId(null)}>
          <div className="or-modal" onClick={e => e.stopPropagation()}>
            <div className="or-modal-icon">✕</div>
            <h2 className="or-modal-title">Cancel Order?</h2>
            <p className="or-modal-body">
              This action cannot be undone. The order will be marked as cancelled.
            </p>
            <div className="or-modal-actions">
              <button
                className="or-modal-btn or-modal-btn--cancel"
                onClick={() => setConfirmId(null)}
              >
                Keep Order
              </button>
              <button
                className="or-modal-btn or-modal-btn--confirm"
                onClick={() => handleCancelOrder(confirmId)}
                disabled={cancelling === confirmId}
              >
                {cancelling === confirmId
                  ? <><span className="or-track-spin" /> Cancelling…</>
                  : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="or-root">

        {/* Header */}
        <div className="or-header">
          <div className="or-rule" />
          <div className="or-title-block">
            <span className="or-eyebrow">Your Account</span>
            <h1 className="or-title">Order <em>History</em></h1>
          </div>
          <div className="or-rule" />
        </div>

        {orderData.length === 0 ? (

          <div className="or-empty">
            <div className="or-empty-glyph">✦</div>
            <p className="or-empty-title">No orders yet</p>
            <p className="or-empty-sub">Your future purchases will appear here.</p>
          </div>

        ) : (

          <div className="or-list">
            {orderData.map((order, index) => {
              const cfg      = STATUS_CONFIG[order.status] || STATUS_CONFIG['Order Placed']
              const isOpen   = expanded === order._id
              const showCancel = canCancel(order)
              // Use the first item's image as the order thumbnail
              const firstItem = order.items[0]
              const imgSrc   = firstItem ? resolveImage(firstItem) : ''
              const totalQty = order.items.reduce((sum, it) => sum + (it.quantity || 1), 0)

              return (
                <div
                  key={order._id}
                  className={`or-card ${isOpen ? 'or-card--open' : ''}`}
                  style={{
                    '--sc': cfg.color,
                    '--sb': cfg.bg,
                    animationDelay: `${index * 55}ms`,
                  }}
                >

                  {/* Main row */}
                  <div className="or-main" onClick={() => setExpanded(isOpen ? null : order._id)}>

                    {/* Thumbnail: first item image with item count badge */}
                    <div className="or-img-wrap">
                      {imgSrc
                        ? <img className="or-img" src={imgSrc} alt={firstItem?.name} />
                        : <div className="or-img-empty">✦</div>
                      }
                      <div className="or-img-shade" />
                      {order.items.length > 1 && (
                        <div className="or-img-count">+{order.items.length - 1}</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="or-info">
                      {/* Show first item name, then "& N more" if multiple */}
                      <p className="or-name">
                        {firstItem?.name}
                        {order.items.length > 1 && (
                          <span className="or-name-more"> &amp; {order.items.length - 1} more</span>
                        )}
                      </p>
                      <div className="or-meta">
                        <span className="or-price">{currency}{order.amount?.toFixed(2)}</span>
                        <span className="or-sep">·</span>
                        <span className="or-chip">{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</span>
                        <span className="or-sep">·</span>
                        <span className="or-chip">Qty {totalQty}</span>
                      </div>
                      <p className="or-date">
                        {new Date(order.date).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                      <p className="or-ref">Ref: #{order._id?.slice(-8)?.toUpperCase()}</p>
                    </div>

                    {/* Right */}
                    <div className="or-right">
                      <div className="or-badge">
                        <span className="or-badge-dot" />
                        <span className="or-badge-txt">{order.status}</span>
                      </div>

                      {/* Track / Refresh button */}
                      <button
                        className="or-track"
                        onClick={(e) => { e.stopPropagation(); loadOrderData({ silent: true }) }}
                        disabled={refreshing}
                      >
                        {refreshing && <span className="or-track-spin" />}
                        Track
                      </button>

                      {/* Cancel button — only for eligible COD orders */}
                      {showCancel && (
                        <button
                          className="or-cancel-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            setConfirmId(order._id)
                          }}
                          disabled={cancelling === order._id}
                          title="Cancel this order"
                        >
                          {cancelling === order._id
                            ? <><span className="or-track-spin or-track-spin--red" /> Cancelling…</>
                            : 'Cancel Order'}
                        </button>
                      )}

                      <div className={`or-chevron ${isOpen ? 'or-chevron--up' : ''}`}>
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>

                  </div>

                  {/* Expandable detail */}
                  <div className={`or-expand ${isOpen ? 'or-expand--open' : ''}`}>
                    <div className="or-expand-body">

                      {/* ── Items list ── */}
                      <div className="or-items-section">
                        <p className="or-items-heading">Order Items</p>
                        <div className="or-items-list">
                          {order.items.map((item, idx) => {
                            const iSrc = resolveImage(item)
                            return (
                              <div key={idx} className="or-item-row">
                                <div className="or-item-img-wrap">
                                  {iSrc
                                    ? <img className="or-item-img" src={iSrc} alt={item.name} />
                                    : <div className="or-item-img-empty">✦</div>
                                  }
                                </div>
                                <div className="or-item-info">
                                  <span className="or-item-name">{item.name}</span>
                                  <div className="or-item-meta">
                                    <span className="or-item-size">Size: {item.size}</span>
                                    <span className="or-item-dot">·</span>
                                    <span className="or-item-qty">Qty: {item.quantity}</span>
                                    <span className="or-item-dot">·</span>
                                    <span className="or-item-price">{currency}{item.price}</span>
                                  </div>
                                </div>
                                <div className="or-item-subtotal">
                                  {currency}{(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="or-expand-divider" />

                      {/* ── Progress tracker ── */}
                      {order.status === 'Cancelled' ? (
                        <div className="or-cancelled">
                          <span>✕</span> This order has been cancelled.
                        </div>
                      ) : (
                        <div className="or-progress">
                          {STEPS.map((step, si) => {
                            const done    = cfg.step >= si + 1
                            const current = cfg.step === si + 1
                            return (
                              <React.Fragment key={step}>
                                <div className={`or-step ${done ? 'or-step--done' : ''} ${current ? 'or-step--now' : ''}`}>
                                  <div className="or-step-dot">
                                    {done && <div className="or-step-fill" />}
                                  </div>
                                  <span className="or-step-lbl">{step}</span>
                                </div>
                                {si < STEPS.length - 1 && (
                                  <div className={`or-step-line ${cfg.step >= si + 2 ? 'or-step-line--done' : ''}`} />
                                )}
                              </React.Fragment>
                            )
                          })}
                        </div>
                      )}

                      <div className="or-expand-divider" />

                      {/* ── Payment info ── */}
                      <div className="or-pay-row">
                        <div className="or-pay-cell">
                          <span className="or-pay-lbl">Payment Method</span>
                          <span className="or-pay-val">{order.paymentMethod}</span>
                        </div>
                        <div className="or-pay-sep" />
                        <div className="or-pay-cell">
                          <span className="or-pay-lbl">Payment Status</span>
                          <span className={`or-pay-val ${order.payment ? 'or-pay-val--ok' : ''}`}>
                            {order.payment
                              ? '✓ Confirmed'
                              : order.paymentMethod === 'COD'
                                ? 'Pay on Delivery'
                                : 'Pending'}
                          </span>
                        </div>
                        <div className="or-pay-sep" />
                        <div className="or-pay-cell">
                          <span className="or-pay-lbl">Order Total</span>
                          <span className="or-pay-val">{currency}{order.amount?.toFixed(2)}</span>
                        </div>
                        <div className="or-pay-sep" />
                        <div className="or-pay-cell">
                          <span className="or-pay-lbl">Order Ref</span>
                          <span className="or-pay-val or-pay-val--mono">
                            #{order._id?.slice(-8)?.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Cancel note for eligible orders */}
                      {showCancel && (
                        <div className="or-cancel-note">
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="5" stroke="#c4a064" strokeWidth="1.2"/>
                            <path d="M6 5v3M6 4V3" stroke="#c4a064" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                          COD orders can be cancelled before shipment. Click <strong>Cancel Order</strong> above to proceed.
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              )
            })}
          </div>

        )}
      </div>
    </>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

.or-root {
  border-top: 1px solid #e8e0d4;
  padding: 56px 0 80px;
  max-width: 860px;
  margin: 0 auto;
}

/* Header */
.or-header { display:flex; align-items:center; gap:28px; margin-bottom:52px; }
.or-rule   { flex:1; height:1px; background:linear-gradient(to right,transparent,#d4c8b8,transparent); }
.or-title-block { display:flex; flex-direction:column; align-items:center; gap:4px; flex-shrink:0; }
.or-eyebrow { font-family:'Montserrat',sans-serif; font-size:9px; font-weight:500; letter-spacing:0.3em; text-transform:uppercase; color:#c4a064; }
.or-title   { font-family:'Cormorant Garamond',serif; font-size:34px; font-weight:300; color:#1a1612; margin:0; line-height:1; white-space:nowrap; }
.or-title em { font-style:italic; color:#c4a064; }

/* Empty */
.or-empty { text-align:center; padding:80px 20px; display:flex; flex-direction:column; align-items:center; gap:12px; }
.or-empty-glyph { font-size:30px; color:#c4a064; opacity:0.35; margin-bottom:8px; }
.or-empty-title { font-family:'Cormorant Garamond',serif; font-size:22px; color:#1a1612; margin:0; }
.or-empty-sub   { font-family:'Montserrat',sans-serif; font-size:11px; color:#a09080; letter-spacing:0.05em; margin:0; }

/* List */
.or-list { display:flex; flex-direction:column; gap:14px; }

/* Card */
.or-card {
  border:1px solid #ede5d8;
  background:#fdfcfa;
  position:relative;
  overflow:hidden;
  opacity:0;
  animation:orCardIn 0.45s ease forwards;
  transition:border-color 0.3s,box-shadow 0.3s;
}
.or-card::before {
  content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
  background:var(--sc); opacity:0; transition:opacity 0.3s;
}
.or-card:hover::before,
.or-card--open::before { opacity:1; }
.or-card:hover  { border-color:#d4c0a8; box-shadow:0 4px 20px rgba(26,22,18,0.07); }
.or-card--open  { border-color:#c4a064; box-shadow:0 8px 28px rgba(196,160,100,0.12); }
@keyframes orCardIn {
  from { opacity:0; transform:translateY(10px); }
  to   { opacity:1; transform:translateY(0); }
}

/* Main row */
.or-main {
  display:flex; align-items:center; gap:20px;
  padding:20px 24px; cursor:pointer; user-select:none;
}

/* Image */
.or-img-wrap { position:relative; flex-shrink:0; width:68px; height:86px; overflow:hidden; background:#f5f2ee; }
.or-img      { width:100%; height:100%; object-fit:cover; transition:transform 0.5s cubic-bezier(0.16,1,0.3,1); }
.or-card:hover .or-img { transform:scale(1.07); }
.or-img-shade { position:absolute; inset:0; background:linear-gradient(to top,rgba(26,22,18,0.14),transparent); pointer-events:none; }
.or-img-empty { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:18px; color:#c4a064; opacity:0.25; }
.or-img-count {
  position:absolute; bottom:5px; right:5px;
  background:rgba(26,22,18,0.72); color:#f5f0e8;
  font-family:'Montserrat',sans-serif; font-size:8px; font-weight:600;
  padding:2px 5px; letter-spacing:0.05em;
}

/* Info */
.or-info  { flex:1; min-width:0; }
.or-name  { font-family:'Cormorant Garamond',serif; font-size:17px; font-weight:400; color:#1a1612; margin:0 0 6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.or-name-more { font-size:13px; color:#a09080; font-style:italic; }
.or-meta  { display:flex; align-items:center; gap:7px; margin-bottom:5px; flex-wrap:wrap; }
.or-price { font-family:'Montserrat',sans-serif; font-size:12px; font-weight:600; color:#1a1612; letter-spacing:0.04em; }
.or-sep   { color:#c4a064; font-size:14px; line-height:1; }
.or-chip  { font-family:'Montserrat',sans-serif; font-size:9.5px; color:#8b7f72; letter-spacing:0.1em; text-transform:uppercase; }
.or-date  { font-family:'Montserrat',sans-serif; font-size:10px; color:#b0a090; letter-spacing:0.05em; margin:0 0 3px; }
.or-ref   { font-family:'Montserrat',sans-serif; font-size:9px; color:#c4b090; letter-spacing:0.08em; margin:0; }

/* Right */
.or-right   { flex-shrink:0; display:flex; flex-direction:column; align-items:flex-end; gap:10px; }
.or-badge   { display:flex; align-items:center; gap:7px; background:var(--sb); border:1px solid var(--sc); padding:5px 11px; }
.or-badge-dot { width:6px; height:6px; border-radius:50%; background:var(--sc); flex-shrink:0; animation:orPulse 2.2s ease-in-out infinite; }
@keyframes orPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.55;transform:scale(0.82)} }
.or-badge-txt { font-family:'Montserrat',sans-serif; font-size:8.5px; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:var(--sc); white-space:nowrap; }

/* Track button */
.or-track {
  font-family:'Montserrat',sans-serif; font-size:8.5px; font-weight:600;
  letter-spacing:0.2em; text-transform:uppercase;
  background:#1a1612; color:#f5f0e8; border:none; padding:8px 16px;
  cursor:pointer; display:flex; align-items:center; gap:6px;
  transition:background 0.2s,color 0.2s;
}
.or-track:hover:not(:disabled) { background:#c4a064; color:#1a1612; }
.or-track:disabled { opacity:0.5; cursor:not-allowed; }

/* Cancel button */
.or-cancel-btn {
  font-family:'Montserrat',sans-serif; font-size:8px; font-weight:600;
  letter-spacing:0.18em; text-transform:uppercase;
  background:transparent; color:#a06060;
  border:1px solid rgba(160,96,96,0.4);
  padding:6px 14px; cursor:pointer;
  display:flex; align-items:center; gap:6px;
  transition:background 0.2s,border-color 0.2s,color 0.2s;
}
.or-cancel-btn:hover:not(:disabled) {
  background:rgba(160,96,96,0.08); border-color:#a06060;
}
.or-cancel-btn:disabled { opacity:0.5; cursor:not-allowed; }

/* Shared spinner */
.or-track-spin {
  width:9px; height:9px;
  border:1.5px solid rgba(245,240,232,0.35);
  border-top-color:#f5f0e8;
  border-radius:50%; animation:orSpin 0.8s linear infinite;
}
.or-track-spin--red {
  border-color:rgba(160,96,96,0.25);
  border-top-color:#a06060;
}
@keyframes orSpin { to{transform:rotate(360deg)} }

.or-chevron     { color:#b0a090; transition:transform 0.3s,color 0.3s; }
.or-chevron--up { transform:rotate(180deg); color:#c4a064; }

/* Expand */
.or-expand       { max-height:0; overflow:hidden; transition:max-height 0.5s cubic-bezier(0.16,1,0.3,1); }
.or-expand--open { max-height:700px; }
.or-expand-body  { padding:20px 24px 24px; border-top:1px solid #f0ebe3; }
.or-expand-divider { height:1px; background:#f0ebe3; margin:18px 0; }

/* Items section */
.or-items-section { margin-bottom:0; }
.or-items-heading {
  font-family:'Montserrat',sans-serif; font-size:8.5px; font-weight:600;
  letter-spacing:0.25em; text-transform:uppercase; color:#a09080; margin:0 0 12px;
}
.or-items-list { display:flex; flex-direction:column; gap:10px; }

.or-item-row {
  display:flex; align-items:center; gap:14px;
  padding:10px 12px; background:#f8f5f0; border:1px solid #ede5d8;
}
.or-item-img-wrap { width:44px; height:56px; flex-shrink:0; overflow:hidden; background:#f0ebe4; }
.or-item-img      { width:100%; height:100%; object-fit:cover; }
.or-item-img-empty{ width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:14px; color:#c4a064; opacity:0.3; }
.or-item-info { flex:1; min-width:0; }
.or-item-name {
  font-family:'Cormorant Garamond',serif; font-size:15px; font-weight:400; color:#1a1612;
  display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:4px;
}
.or-item-meta { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.or-item-size, .or-item-qty {
  font-family:'Montserrat',sans-serif; font-size:9px; color:#8b7f72; letter-spacing:0.08em;
}
.or-item-dot { color:#c4a064; font-size:10px; }
.or-item-price {
  font-family:'Montserrat',sans-serif; font-size:9.5px; font-weight:600; color:#3a3228; letter-spacing:0.04em;
}
.or-item-subtotal {
  font-family:'Montserrat',sans-serif; font-size:11px; font-weight:600; color:#1a1612;
  letter-spacing:0.04em; flex-shrink:0;
}

/* Progress */
.or-progress { display:flex; align-items:flex-start; margin-bottom:0; overflow-x:auto; padding-bottom:2px; }
.or-step     { display:flex; flex-direction:column; align-items:center; gap:8px; flex-shrink:0; }
.or-step-dot {
  width:12px; height:12px; border-radius:50%;
  border:1.5px solid #d4c8b8; background:#fdfcfa;
  display:flex; align-items:center; justify-content:center; transition:border-color 0.3s;
}
.or-step--done .or-step-dot { border-color:var(--sc); }
.or-step--now  .or-step-dot { border-color:var(--sc); box-shadow:0 0 0 3px var(--sb); }
.or-step-fill  { width:6px; height:6px; border-radius:50%; background:var(--sc); }
.or-step-lbl   { font-family:'Montserrat',sans-serif; font-size:7.5px; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:#b0a090; text-align:center; white-space:nowrap; }
.or-step--done .or-step-lbl { color:var(--sc); }
.or-step-line      { flex:1; height:1px; background:#e8e0d4; margin-top:6px; min-width:32px; transition:background 0.3s; }
.or-step-line--done { background:var(--sc); }

/* Cancelled */
.or-cancelled {
  font-family:'Montserrat',sans-serif; font-size:9.5px; font-weight:500;
  letter-spacing:0.15em; text-transform:uppercase;
  color:#A06060; background:rgba(160,96,96,0.07); border:1px solid rgba(160,96,96,0.2);
  padding:10px 16px; display:flex; align-items:center; gap:8px;
}

/* Payment row */
.or-pay-row  { display:flex; align-items:center; flex-wrap:wrap; gap:0; }
.or-pay-cell { display:flex; flex-direction:column; gap:4px; padding-right:20px; }
.or-pay-lbl  { font-family:'Montserrat',sans-serif; font-size:8px; font-weight:500; letter-spacing:0.22em; text-transform:uppercase; color:#b0a090; }
.or-pay-val  { font-family:'Cormorant Garamond',serif; font-size:15px; font-weight:400; color:#1a1612; }
.or-pay-val--ok   { color:#6B8F71; }
.or-pay-val--mono { font-family:'Montserrat',sans-serif; font-size:11px; font-weight:600; letter-spacing:0.14em; color:#8b7f72; }
.or-pay-sep  { width:1px; height:34px; background:#e8e0d4; margin-right:20px; flex-shrink:0; }

/* Cancel note */
.or-cancel-note {
  display:flex; align-items:center; gap:7px;
  font-family:'Montserrat',sans-serif; font-size:9px; color:#8b7f72;
  background:rgba(196,160,100,0.06); border:1px solid rgba(196,160,100,0.2);
  padding:9px 14px; margin-top:14px; letter-spacing:0.03em;
}
.or-cancel-note strong { color:#c4a064; }

/* ── Cancel Confirmation Modal ── */
.or-modal-overlay {
  position:fixed; inset:0; background:rgba(26,22,18,0.55);
  display:flex; align-items:center; justify-content:center;
  z-index:9999; animation:orFadeOverlay 0.2s ease;
  backdrop-filter:blur(2px);
}
@keyframes orFadeOverlay { from{opacity:0} to{opacity:1} }

.or-modal {
  background:#fdfcfa; border:1px solid #e0d8ce;
  padding:36px 40px; max-width:380px; width:90%;
  text-align:center; animation:orModalIn 0.25s ease;
}
@keyframes orModalIn {
  from{opacity:0;transform:translateY(14px) scale(0.97)}
  to{opacity:1;transform:translateY(0) scale(1)}
}

.or-modal-icon {
  font-size:24px; color:#a06060;
  background:rgba(160,96,96,0.1); width:48px; height:48px;
  display:flex; align-items:center; justify-content:center;
  margin:0 auto 16px; border:1px solid rgba(160,96,96,0.2);
}
.or-modal-title {
  font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:300;
  color:#1a1612; margin:0 0 10px;
}
.or-modal-body {
  font-family:'Montserrat',sans-serif; font-size:11px; color:#7a6e65;
  letter-spacing:0.03em; line-height:1.7; margin:0 0 24px;
}
.or-modal-actions { display:flex; gap:10px; }
.or-modal-btn {
  flex:1; font-family:'Montserrat',sans-serif; font-size:9px; font-weight:600;
  letter-spacing:0.2em; text-transform:uppercase; border:none;
  padding:12px 16px; cursor:pointer; transition:background 0.2s,color 0.2s;
}
.or-modal-btn--cancel  { background:#f0ebe3; color:#3a3228; }
.or-modal-btn--cancel:hover  { background:#e0d8ce; }
.or-modal-btn--confirm { background:#a06060; color:#fff; display:flex; align-items:center; justify-content:center; gap:7px; }
.or-modal-btn--confirm:hover:not(:disabled) { background:#884848; }
.or-modal-btn--confirm:disabled { opacity:0.6; cursor:not-allowed; }

/* Responsive */
@media (max-width:640px) {
  .or-root     { padding:40px 16px 60px; }
  .or-main     { padding:16px; gap:14px; }
  .or-img-wrap { width:56px; height:70px; }
  .or-title    { font-size:26px; }
  .or-name     { font-size:15px; }
  .or-right    { gap:8px; }
  .or-expand-body { padding:16px; }
  .or-expand--open { max-height:900px; }
  .or-pay-row  { flex-direction:column; gap:12px; }
  .or-pay-sep  { display:none; }
  .or-pay-cell { padding-right:0; }
  .or-modal    { padding:28px 20px; }
  .or-item-row { gap:10px; }
  .or-item-img-wrap { width:36px; height:46px; }
}
`

export default Orders
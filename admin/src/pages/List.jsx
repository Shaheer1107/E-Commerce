import axios from 'axios'
import React from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'

const List = () => {
  const [list, setList] = useState([])

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  console.log("Fetched Products:", list)

  const removeProduct = async (id) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Authentication token not found')
        return
      }

      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return (
    <>
      <style>{STYLES}</style>

      <div className="lp-root">

        {/* Page header */}
        <div className="lp-header">
          <div className="lp-header-left">
            <span className="lp-eyebrow">
              <span className="lp-eyebrow-rule" />
              Catalogue
              <span className="lp-eyebrow-rule" />
            </span>
            <h1 className="lp-title">Product <em>List</em></h1>
          </div>
          <div className="lp-header-right">
            <span className="lp-count">
              <span className="lp-count-num">{list.length}</span>
              <span className="lp-count-label">items</span>
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="lp-table-wrap">

          {/* Column headers */}
          <div className="lp-thead">
            <div className="lp-th lp-col-img" />
            <div className="lp-th lp-col-name">Product</div>
            <div className="lp-th lp-col-cat">Category</div>
            <div className="lp-th lp-col-price">Price</div>
            <div className="lp-th lp-col-action">Action</div>
          </div>

          {/* Rows */}
          <div className="lp-tbody">
            {list.length === 0 ? (
              <div className="lp-empty">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="6" y="4" width="20" height="24" rx="1" stroke="#c4a064" strokeWidth="1.2" strokeDasharray="3 2"/>
                  <path d="M11 12h10M11 16h7" stroke="#c4a064" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <span className="lp-empty-text">No products in catalogue</span>
              </div>
            ) : (
              list.map((item, index) => (
                <div
                  className="lp-row"
                  key={index}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  {/* Image */}
                  <div className="lp-col-img lp-cell">
                    <div className="lp-img-wrap">
                      <img
                        className="lp-img"
                        src={item.images?.[0] || 'default-image-url'}
                        alt={item.name}
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div className="lp-col-name lp-cell">
                    <span className="lp-name">{item.name}</span>
                    {item.bestseller && (
                      <span className="lp-badge">Bestseller</span>
                    )}
                  </div>

                  {/* Category */}
                  <div className="lp-col-cat lp-cell">
                    <span className="lp-category">{item.category}</span>
                    {item.subCategory && (
                      <span className="lp-subcategory">{item.subCategory}</span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="lp-col-price lp-cell">
                    <span className="lp-price">{currency}{item.price}</span>
                  </div>

                  {/* Remove */}
                  <div className="lp-col-action lp-cell">
                    <button
                      className="lp-remove-btn"
                      onClick={() => removeProduct(item._id)}
                      title="Remove product"
                    >
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M1.5 1.5l8 8M9.5 1.5l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                      <span>Remove</span>
                    </button>
                  </div>

                  {/* Row accent line */}
                  <div className="lp-row-line" />
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </>
  )
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

.lp-root {
  flex: 1;
  background: #f8f5f1;
  min-height: calc(100vh - 60px);
  padding: 40px 48px 60px;
}

/* ── Header ── */
.lp-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 36px;
}
.lp-header-left { display: flex; flex-direction: column; gap: 4px; }

.lp-eyebrow {
  display: flex; align-items: center; gap: 10px;
  font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 500;
  letter-spacing: 0.3em; text-transform: uppercase; color: #c4a064;
}
.lp-eyebrow-rule { display: inline-block; width: 22px; height: 1px; background: #c4a064; }

.lp-title {
  font-family: 'Cormorant Garamond', serif; font-size: 34px; font-weight: 300;
  color: #1a1612; margin: 0; line-height: 1;
}
.lp-title em { font-style: italic; color: #c4a064; }

.lp-count {
  display: flex; flex-direction: column; align-items: flex-end; gap: 1px;
  padding-bottom: 4px;
}
.lp-count-num {
  font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300;
  color: #c4a064; line-height: 1;
}
.lp-count-label {
  font-family: 'Montserrat', sans-serif; font-size: 8px; font-weight: 500;
  letter-spacing: 0.22em; text-transform: uppercase; color: #a09080;
}

/* ── Table wrap ── */
.lp-table-wrap {
  background: #fff;
  border: 1px solid #e0d8ce;
  overflow: hidden;
}

/* ── Head ── */
.lp-thead {
  display: grid;
  grid-template-columns: 72px 1fr 140px 110px 110px;
  border-bottom: 1px solid #e0d8ce;
  background: #fdfcfa;
}
.lp-th {
  font-family: 'Montserrat', sans-serif; font-size: 8px; font-weight: 600;
  letter-spacing: 0.24em; text-transform: uppercase; color: #6b5f50;
  padding: 14px 16px;
}

/* ── Body ── */
.lp-tbody { display: flex; flex-direction: column; }

.lp-row {
  display: grid;
  grid-template-columns: 72px 1fr 140px 110px 110px;
  align-items: center;
  position: relative;
  border-bottom: 1px solid #f0ebe4;
  transition: background 0.2s;
  animation: lpFadeIn 0.35s ease both;
}
.lp-row:last-child { border-bottom: none; }
.lp-row:hover { background: #fdfaf7; }

/* Accent left bar on hover */
.lp-row-line {
  position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
  background: #c4a064;
  transform: scaleY(0);
  transition: transform 0.25s cubic-bezier(0.16,1,0.3,1);
  transform-origin: center;
}
.lp-row:hover .lp-row-line { transform: scaleY(1); }

@keyframes lpFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Cells ── */
.lp-cell { padding: 14px 16px; }

/* Image */
.lp-col-img { padding: 10px 10px 10px 14px; }
.lp-img-wrap {
  width: 44px; height: 56px;
  border: 1px solid #e8e0d4;
  overflow: hidden; flex-shrink: 0;
}
.lp-img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform 0.4s ease;
}
.lp-row:hover .lp-img { transform: scale(1.06); }

/* Name */
.lp-col-name {
  display: flex; flex-direction: column; gap: 5px;
}
.lp-name {
  font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 500;
  color: #1a1612; letter-spacing: 0.02em;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.lp-badge {
  display: inline-block;
  font-family: 'Montserrat', sans-serif; font-size: 7px; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: #1a1612; background: #c4a064;
  padding: 2px 7px;
  width: fit-content;
}

/* Category */
.lp-col-cat {
  display: flex; flex-direction: column; gap: 3px;
}
.lp-category {
  font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 400;
  color: #3a3228; letter-spacing: 0.03em;
}
.lp-subcategory {
  font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 400;
  color: #a09080; letter-spacing: 0.04em;
}

/* Price */
.lp-price {
  font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 400;
  color: #1a1612; letter-spacing: 0.02em;
}

/* Remove button */
.lp-col-action { display: flex; justify-content: flex-end; }
.lp-remove-btn {
  display: flex; align-items: center; gap: 6px;
  background: none; border: 1px solid #e0d8ce; cursor: pointer;
  padding: 6px 12px;
  font-family: 'Montserrat', sans-serif; font-size: 8px; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase; color: #a09080;
  transition: all 0.2s ease;
}
.lp-remove-btn:hover {
  background: #1a1612; border-color: #1a1612; color: #f5f0e8;
}

/* Empty state */
.lp-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 14px; padding: 64px 24px;
}
.lp-empty-text {
  font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 500;
  letter-spacing: 0.2em; text-transform: uppercase; color: #b0a090;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .lp-root { padding: 28px 20px 48px; }

  .lp-thead {
    grid-template-columns: 56px 1fr 80px;
  }
  .lp-th.lp-col-cat,
  .lp-th.lp-col-price { display: none; }

  .lp-row {
    grid-template-columns: 56px 1fr 80px;
  }
  .lp-col-cat,
  .lp-col-price { display: none; }

  .lp-col-action { justify-content: center; }
  .lp-remove-btn span { display: none; }
  .lp-remove-btn { padding: 8px 10px; }

  .lp-header { flex-direction: column; align-items: flex-start; gap: 8px; }
  .lp-count { align-items: flex-start; }
}
`

export default List
import React, { useContext, useEffect, useState, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('collection') && showSearch) {
      setVisible(true);
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setVisible(false);
    }
  }, [location, showSearch]);

  return showSearch && visible ? (
    <>
      <style>{`
        .sb-root {
          border-top: 1px solid #e8e0d4;
          border-bottom: 1px solid #e8e0d4;
          background: #fdfcfa;
          padding: 20px 0;
          animation: sbSlideDown 0.35s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes sbSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sb-inner {
          max-width: 560px; margin: 0 auto;
          display: flex; align-items: center; gap: 12px;
          padding: 0 20px;
        }
        .sb-field {
          flex: 1; display: flex; align-items: center; gap: 12px;
          border-bottom: 1.5px solid #c8bfb4;
          padding-bottom: 8px;
          transition: border-color 0.25s;
        }
        .sb-field:focus-within { border-bottom-color: #c4a064; }
        .sb-icon { width: 14px; height: 14px; opacity: 0.5; flex-shrink: 0; }
        .sb-field:focus-within .sb-icon { opacity: 1; }
        .sb-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 400;
          color: #1a1612; letter-spacing: 0.06em;
        }
        .sb-input::placeholder {
          font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 400;
          letter-spacing: 0.2em; text-transform: uppercase; color: #a09080;
        }
        .sb-close {
          background: none; border: none; cursor: pointer; padding: 4px;
          display: flex; align-items: center; justify-content: center;
          color: #a09080; flex-shrink: 0;
          transition: color 0.2s, transform 0.2s;
        }
        .sb-close:hover { color: #1a1612; transform: rotate(90deg); }
      `}</style>

      <div className="sb-root">
        <div className="sb-inner">
          <div className="sb-field">
            <img className="sb-icon" src={assets.search_icon} alt="Search" />
            <input
              ref={inputRef}
              className="sb-input"
              type="text"
              placeholder="Search pieces…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="sb-close" onClick={() => setShowSearch(false)} aria-label="Close search">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  ) : null;
};

export default SearchBar;
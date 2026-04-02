import React, { useState } from 'react'
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App'
import { toast } from 'react-toastify';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName]             = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice]           = useState('');
  const [category, setCategory]     = useState('Men');
  const [subCategory, setSubCategoy] = useState('Topwear');
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes]           = useState([]);
  const [loading, setLoading]       = useState(false);

  const toggleSize = (s) =>
    setSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);
      formData.append('sizes', JSON.stringify(sizes));
      image1 && formData.append('image1', image1);
      image2 && formData.append('image2', image2);
      image3 && formData.append('image3', image3);
      image4 && formData.append('image4', image4);

      const response = await axios.post(backendUrl + '/api/product/add', formData, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        setName(''); setDescription(''); setPrice('');
        setImage1(false); setImage2(false); setImage3(false); setImage4(false);
        setSizes([]); setBestseller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const images = [
    [image1, setImage1],
    [image2, setImage2],
    [image3, setImage3],
    [image4, setImage4],
  ];

  return (
    <>
      <style>{STYLES}</style>

      <div className="ap-root">

        {/* Page header */}
        <div className="ap-header">
          <div className="ap-header-left">
            <span className="ap-eyebrow">
              <span className="ap-eyebrow-rule" />
              Catalogue
              <span className="ap-eyebrow-rule" />
            </span>
            <h1 className="ap-title">Add <em>Product</em></h1>
          </div>
        </div>

        <form onSubmit={onSubmitHandler} className="ap-form">

          {/* ── Image upload ── */}
          <div className="ap-section">
            <div className="ap-section-header">
              <span className="ap-section-label">Product Images</span>
              <span className="ap-section-hint">First image will be used as cover · Max 4</span>
            </div>
            <div className="ap-images">
              {images.map(([img, setImg], i) => (
                <label key={i} htmlFor={`image${i + 1}`} className={`ap-img-slot ${img ? 'ap-img-slot--filled' : ''}`}>
                  {img ? (
                    <>
                      <img className="ap-img-preview" src={URL.createObjectURL(img)} alt={`Image ${i + 1}`} />
                      <div className="ap-img-overlay">
                        <span className="ap-img-change">Change</span>
                      </div>
                    </>
                  ) : (
                    <div className="ap-img-empty">
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path d="M4 16l4-4 3 3 3-4 4 5H4z" stroke="#c4a064" strokeWidth="1.2" strokeLinejoin="round"/>
                        <circle cx="8" cy="8" r="2" stroke="#c4a064" strokeWidth="1.2"/>
                        <rect x="1.5" y="1.5" width="19" height="19" rx="0.5" stroke="#d4c8b8" strokeWidth="1" strokeDasharray="3 2"/>
                      </svg>
                      <span className="ap-img-empty-text">Upload</span>
                      {i === 0 && <span className="ap-img-badge">Cover</span>}
                    </div>
                  )}
                  <input
                    type="file" id={`image${i + 1}`}
                    className="ap-file-input"
                    onChange={(e) => setImg(e.target.files[0])}
                    accept="image/*"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="ap-divider" />

          {/* ── Product details ── */}
          <div className="ap-section">
            <span className="ap-section-label">Product Details</span>

            <div className="ap-fields">

              {/* Name */}
              <div className="ap-field ap-field--full">
                <label className="ap-label">Product Name</label>
                <div className="ap-input-wrap">
                  <input
                    className="ap-input"
                    type="text"
                    placeholder="e.g. Merino Wool Crewneck"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <div className="ap-input-line" />
                </div>
              </div>

              {/* Description */}
              <div className="ap-field ap-field--full">
                <label className="ap-label">Description</label>
                <div className="ap-input-wrap">
                  <textarea
                    className="ap-input ap-textarea"
                    placeholder="Describe the product material, fit, and features…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={3}
                  />
                  <div className="ap-input-line" />
                </div>
              </div>

              {/* Category, SubCategory, Price row */}
              <div className="ap-field-row">

                <div className="ap-field">
                  <label className="ap-label">Category</label>
                  <div className="ap-select-wrap">
                    <select
                      className="ap-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>
                    <svg className="ap-select-arrow" width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                <div className="ap-field">
                  <label className="ap-label">Sub Category</label>
                  <div className="ap-select-wrap">
                    <select
                      className="ap-select"
                      value={subCategory}
                      onChange={(e) => setSubCategoy(e.target.value)}
                    >
                      <option value="Topwear">Topwear</option>
                      <option value="Bottomwear">Bottomwear</option>
                      <option value="Winterwear">Winterwear</option>
                    </select>
                    <svg className="ap-select-arrow" width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                <div className="ap-field">
                  <label className="ap-label">Price (USD)</label>
                  <div className="ap-input-wrap ap-price-wrap">
                    <span className="ap-price-symbol">$</span>
                    <input
                      className="ap-input ap-price-input"
                      type="number"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      min="0"
                    />
                    <div className="ap-input-line" />
                  </div>
                </div>

              </div>

            </div>
          </div>

          <div className="ap-divider" />

          {/* ── Sizes ── */}
          <div className="ap-section">
            <div className="ap-section-header">
              <span className="ap-section-label">Available Sizes</span>
              <span className="ap-section-hint">{sizes.length > 0 ? sizes.join(', ') + ' selected' : 'Select all that apply'}</span>
            </div>
            <div className="ap-sizes">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`ap-size-btn ${sizes.includes(s) ? 'ap-size-btn--on' : ''}`}
                  onClick={() => toggleSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="ap-divider" />

          {/* ── Bestseller + Submit ── */}
          <div className="ap-bottom">
            <label className="ap-checkbox-label" htmlFor="bestseller">
              <input
                type="checkbox"
                id="bestseller"
                className="ap-checkbox-input"
                checked={bestseller}
                onChange={() => setBestseller(prev => !prev)}
              />
              <span className="ap-checkbox-box">
                {bestseller && (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 4.5l2.5 2.5 3.5-4" stroke="#f5f0e8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <div className="ap-checkbox-text">
                <span className="ap-checkbox-main">Mark as Bestseller</span>
                <span className="ap-checkbox-sub">Featured on the homepage collection</span>
              </div>
            </label>

            <button type="submit" className="ap-submit" disabled={loading}>
              <span className="ap-submit-label">
                {loading ? <span className="ap-submit-spinner" /> : (
                  <>
                    Add Product
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </span>
            </button>
          </div>

        </form>
      </div>
    </>
  );
};

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

.ap-root {
  flex: 1; background: #f8f5f1; min-height: calc(100vh - 60px);
  padding: 40px 48px 60px;
}

/* Header */
.ap-header { margin-bottom: 36px; }
.ap-header-left { display: flex; flex-direction: column; gap: 4px; }
.ap-eyebrow {
  display: flex; align-items: center; gap: 10px;
  font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 500;
  letter-spacing: 0.3em; text-transform: uppercase; color: #c4a064;
}
.ap-eyebrow-rule { display: inline-block; width: 22px; height: 1px; background: #c4a064; }
.ap-title {
  font-family: 'Cormorant Garamond', serif; font-size: 34px; font-weight: 300;
  color: #1a1612; margin: 0; line-height: 1;
}
.ap-title em { font-style: italic; color: #c4a064; }

/* Form */
.ap-form { display: flex; flex-direction: column; gap: 28px; max-width: 760px; }

/* Section */
.ap-section { display: flex; flex-direction: column; gap: 16px; }
.ap-section-header { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.ap-section-label {
  font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 600;
  letter-spacing: 0.25em; text-transform: uppercase; color: #1a1612;
}
.ap-section-hint {
  font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 400;
  letter-spacing: 0.06em; color: #a09080;
}

/* Divider */
.ap-divider { height: 1px; background: linear-gradient(to right, #e0d8ce, transparent); }

/* Image upload */
.ap-images { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.ap-img-slot {
  aspect-ratio: 3/4; border: 1px dashed #d4c8b8; background: #fdfcfa;
  cursor: pointer; position: relative; overflow: hidden;
  transition: border-color 0.25s, background 0.25s;
  display: flex; align-items: center; justify-content: center;
}
.ap-img-slot:hover { border-color: #c4a064; background: rgba(196,160,100,0.04); }
.ap-img-slot--filled { border-style: solid; border-color: #c4a064; }
.ap-img-preview { width: 100%; height: 100%; object-fit: cover; display: block; }
.ap-img-overlay {
  position: absolute; inset: 0; background: rgba(26,22,18,0.5);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.25s;
}
.ap-img-slot:hover .ap-img-overlay { opacity: 1; }
.ap-img-change {
  font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 600;
  letter-spacing: 0.2em; text-transform: uppercase; color: #f5f0e8;
}
.ap-img-empty {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.ap-img-empty-text {
  font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 500;
  letter-spacing: 0.2em; text-transform: uppercase; color: #b0a090;
}
.ap-img-badge {
  position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%);
  background: #c4a064; color: #1a1612;
  font-family: 'Montserrat', sans-serif; font-size: 7px; font-weight: 600;
  letter-spacing: 0.2em; text-transform: uppercase; padding: 3px 8px;
}
.ap-file-input { display: none; }

/* Fields */
.ap-fields { display: flex; flex-direction: column; gap: 20px; }
.ap-field-row { display: flex; gap: 24px; flex-wrap: wrap; }
.ap-field { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 140px; }
.ap-field--full { width: 100%; }

.ap-label {
  font-family: 'Montserrat', sans-serif; font-size: 8px; font-weight: 600;
  letter-spacing: 0.22em; text-transform: uppercase; color: #4a3f35;
}
.ap-input-wrap { position: relative; }
.ap-input {
  width: 100%; background: #fff; border: 1px solid #e0d8ce;
  padding: 10px 14px; outline: none;
  font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 400;
  color: #1a1612; letter-spacing: 0.03em;
  transition: border-color 0.2s;
  resize: none;
}
.ap-input::placeholder { color: #b0a090; }
.ap-input:focus { border-color: #c4a064; }
.ap-textarea { min-height: 80px; }
.ap-input-line { display: none; }

/* Price */
.ap-price-wrap { display: flex; align-items: center; }
.ap-price-symbol {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 500;
  color: #8b7f72; pointer-events: none;
}
.ap-price-input { padding-left: 28px !important; }

/* Select */
.ap-select-wrap { position: relative; }
.ap-select {
  width: 100%; appearance: none; background: #fff; border: 1px solid #e0d8ce;
  padding: 10px 32px 10px 14px; outline: none;
  font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 400;
  color: #1a1612; letter-spacing: 0.03em; cursor: pointer;
  transition: border-color 0.2s;
}
.ap-select:focus { border-color: #c4a064; }
.ap-select-arrow {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  color: #8b7f72; pointer-events: none;
}

/* Sizes */
.ap-sizes { display: flex; gap: 8px; }
.ap-size-btn {
  width: 48px; height: 48px; border: 1px solid #e0d8ce; background: #fdfcfa;
  font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600;
  letter-spacing: 0.1em; color: #6b5f50; cursor: pointer;
  transition: all 0.2s ease;
}
.ap-size-btn:hover { border-color: #c4a064; color: #1a1612; background: rgba(196,160,100,0.06); }
.ap-size-btn--on { background: #1a1612 !important; border-color: #1a1612 !important; color: #f5f0e8 !important; }

/* Bottom row */
.ap-bottom { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }

/* Checkbox */
.ap-checkbox-label { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.ap-checkbox-input { display: none; }
.ap-checkbox-box {
  width: 18px; height: 18px; border: 1.5px solid #c4a064; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: #fdfcfa; transition: background 0.2s;
}
.ap-checkbox-input:checked + .ap-checkbox-box { background: #1a1612; border-color: #1a1612; }
.ap-checkbox-text { display: flex; flex-direction: column; gap: 2px; }
.ap-checkbox-main {
  font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 500;
  color: #1a1612; letter-spacing: 0.05em;
}
.ap-checkbox-sub {
  font-family: 'Montserrat', sans-serif; font-size: 9.5px; font-weight: 400;
  color: #a09080; letter-spacing: 0.04em;
}

/* Submit */
.ap-submit {
  background: #1a1612; border: none; cursor: pointer; padding: 0;
  transition: background 0.25s; flex-shrink: 0;
}
.ap-submit:hover:not(:disabled) { background: #c4a064; }
.ap-submit:disabled { opacity: 0.55; cursor: not-allowed; }
.ap-submit-label {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 32px;
  font-family: 'Montserrat', sans-serif; font-size: 9.5px; font-weight: 600;
  letter-spacing: 0.24em; text-transform: uppercase; color: #f5f0e8;
  transition: color 0.25s, letter-spacing 0.3s;
}
.ap-submit:hover:not(:disabled) .ap-submit-label { color: #1a1612; letter-spacing: 0.3em; }
.ap-submit-spinner {
  width: 13px; height: 13px; border: 1.5px solid rgba(245,240,232,0.3);
  border-top-color: #f5f0e8; border-radius: 50%;
  animation: apSpin 0.8s linear infinite;
}
@keyframes apSpin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .ap-root { padding: 28px 20px 48px; }
  .ap-images { grid-template-columns: repeat(2, 1fr); }
  .ap-field-row { flex-direction: column; }
  .ap-bottom { flex-direction: column; align-items: flex-start; }
  .ap-submit { width: 100%; }
  .ap-submit-label { justify-content: center; }
}
`;

export default Add;
import React, { useState, useEffect, useContext, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, stroke = 'currentColor', fill = 'none', strokeWidth = 1.4 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const TABS = [
  { id: 'profile',   label: 'Profile',   icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { id: 'addresses', label: 'Addresses', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z' },
  { id: 'security',  label: 'Security',  icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
];

const ADDRESS_LABELS = ['Home', 'Work', 'Other'];

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyAddresses = ({ onAdd }) => (
  <div className="pr-empty">
    <div className="pr-empty-glyph">◈</div>
    <p className="pr-empty-title">No saved addresses</p>
    <p className="pr-empty-sub">Add an address to speed up checkout.</p>
    <button className="pr-btn pr-btn--dark" onClick={onAdd}>Add Address</button>
  </div>
);

// ─── Address Card ─────────────────────────────────────────────────────────────
const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => (
  <div className={`pr-addr-card ${address.isDefault ? 'pr-addr-card--default' : ''}`}>
    {address.isDefault && <span className="pr-addr-default-badge">Default</span>}
    <div className="pr-addr-label-row">
      <span className="pr-addr-label">{address.label}</span>
    </div>
    <p className="pr-addr-name">{address.firstName} {address.lastName}</p>
    <p className="pr-addr-line">{address.street}</p>
    <p className="pr-addr-line">{address.city}, {address.state} {address.zipcode}</p>
    <p className="pr-addr-line">{address.country}</p>
    <p className="pr-addr-phone">{address.phone}</p>
    <div className="pr-addr-actions">
      {!address.isDefault && (
        <button className="pr-addr-btn" onClick={() => onSetDefault(address._id)}>Set Default</button>
      )}
      <button className="pr-addr-btn" onClick={() => onEdit(address)}>Edit</button>
      <button className="pr-addr-btn pr-addr-btn--del" onClick={() => onDelete(address._id)}>Remove</button>
    </div>
  </div>
);

// ─── Address Form Modal ───────────────────────────────────────────────────────
const AddressModal = ({ initial, onSave, onClose, loading }) => {
  const empty = { label: 'Home', firstName: '', lastName: '', street: '', city: '', state: '', zipcode: '', country: '', phone: '', isDefault: false };
  const [form, setForm] = useState(initial || empty);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="pr-modal-overlay" onClick={onClose}>
      <div className="pr-modal" onClick={e => e.stopPropagation()}>
        <div className="pr-modal-header">
          <div className="pr-modal-title-block">
            <span className="pr-eyebrow"><span className="pr-rule" />Address<span className="pr-rule" /></span>
            <h3 className="pr-modal-title">{initial ? 'Edit' : 'Add'} <em>Address</em></h3>
          </div>
          <button className="pr-modal-close" onClick={onClose}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="pr-modal-body">
          {/* Label */}
          <div className="pr-field-row">
            {ADDRESS_LABELS.map(l => (
              <button key={l} className={`pr-label-chip ${form.label === l ? 'pr-label-chip--active' : ''}`} onClick={() => set('label', l)}>{l}</button>
            ))}
          </div>

          {/* Name */}
          <div className="pr-form-grid pr-form-grid--2">
            <div className="pr-field">
              <label className="pr-field-label">First Name</label>
              <input className="pr-field-input" value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="John" />
              <div className="pr-field-line" />
            </div>
            <div className="pr-field">
              <label className="pr-field-label">Last Name</label>
              <input className="pr-field-input" value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Doe" />
              <div className="pr-field-line" />
            </div>
          </div>

          {/* Street */}
          <div className="pr-field">
            <label className="pr-field-label">Street Address</label>
            <input className="pr-field-input" value={form.street} onChange={e => set('street', e.target.value)} placeholder="123 Main Street" />
            <div className="pr-field-line" />
          </div>

          {/* City / State */}
          <div className="pr-form-grid pr-form-grid--2">
            <div className="pr-field">
              <label className="pr-field-label">City</label>
              <input className="pr-field-input" value={form.city} onChange={e => set('city', e.target.value)} placeholder="New York" />
              <div className="pr-field-line" />
            </div>
            <div className="pr-field">
              <label className="pr-field-label">State</label>
              <input className="pr-field-input" value={form.state} onChange={e => set('state', e.target.value)} placeholder="NY" />
              <div className="pr-field-line" />
            </div>
          </div>

          {/* Zip / Country */}
          <div className="pr-form-grid pr-form-grid--2">
            <div className="pr-field">
              <label className="pr-field-label">Zip Code</label>
              <input className="pr-field-input" value={form.zipcode} onChange={e => set('zipcode', e.target.value)} placeholder="10001" />
              <div className="pr-field-line" />
            </div>
            <div className="pr-field">
              <label className="pr-field-label">Country</label>
              <input className="pr-field-input" value={form.country} onChange={e => set('country', e.target.value)} placeholder="United States" />
              <div className="pr-field-line" />
            </div>
          </div>

          {/* Phone */}
          <div className="pr-field">
            <label className="pr-field-label">Phone</label>
            <input className="pr-field-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
            <div className="pr-field-line" />
          </div>

          {/* Default toggle */}
          <label className="pr-checkbox-row">
            <input type="checkbox" checked={form.isDefault} onChange={e => set('isDefault', e.target.checked)} className="pr-checkbox" />
            <span className="pr-checkbox-label">Set as default address</span>
          </label>
        </div>

        <div className="pr-modal-footer">
          <button className="pr-btn pr-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="pr-btn pr-btn--dark" onClick={() => onSave(form)} disabled={loading}>
            {loading ? <span className="pr-spinner" /> : (initial ? 'Save Changes' : 'Add Address')}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Profile = () => {
  const { token, backendUrl, setToken } = useContext(ShopContext);
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [addrModal, setAddrModal] = useState(null); // null | 'new' | address object

  // Profile form state
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });

  // Password form state
  const [pwForm, setPwForm]   = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwVisible, setPwVisible] = useState({ current: false, new: false, confirm: false });

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate('/login');
  }, [token]);

  // Fetch profile
  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/profile`, { headers: { token } });
        if (data.success) {
          setProfile(data.user);
          setProfileForm({ name: data.user.name || '', phone: data.user.phone || '' });
        }
      } catch (e) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      const form = new FormData();
      form.append('avatar', file);
      const { data } = await axios.post(`${backendUrl}/api/user/profile/avatar`, form, { headers: { token } });
      if (data.success) {
        setProfile(p => ({ ...p, avatar: data.avatar }));
        toast.success('Profile picture updated');
      }
    } catch (e) {
      toast.error('Failed to upload image');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put(`${backendUrl}/api/user/profile`, profileForm, { headers: { token } });
      if (data.success) {
        setProfile(p => ({ ...p, ...profileForm }));
        toast.success('Profile updated');
      } else toast.error(data.message);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setSaving(true);
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/user/profile/password`,
        { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword },
        { headers: { token } }
      );
      if (data.success) {
        toast.success('Password changed');
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else toast.error(data.message);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSave = async (form) => {
    setSaving(true);
    try {
      const isEdit = addrModal && typeof addrModal === 'object' && addrModal._id;
      const url    = isEdit
        ? `${backendUrl}/api/user/profile/address/${addrModal._id}`
        : `${backendUrl}/api/user/profile/address`;
      const method = isEdit ? 'put' : 'post';
      const { data } = await axios[method](url, form, { headers: { token } });
      if (data.success) {
        setProfile(p => ({ ...p, addresses: data.addresses }));
        setAddrModal(null);
        toast.success(isEdit ? 'Address updated' : 'Address added');
      } else toast.error(data.message);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddressDelete = async (addressId) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/user/profile/address/${addressId}`, { headers: { token } });
      if (data.success) {
        setProfile(p => ({ ...p, addresses: data.addresses }));
        toast.success('Address removed');
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleSetDefault = async (addressId) => {
    const addr = profile.addresses.find(a => a._id === addressId);
    if (!addr) return;
    await handleAddressSave({ ...addr, isDefault: true });
    setAddrModal(null);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <>
      <style>{STYLES}</style>
      <div className="pr-loading">
        <div className="pr-spinner pr-spinner--lg" />
        <p className="pr-loading-txt">Loading your profile…</p>
      </div>
    </>
  );

  const initials = profile?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
  const memberYear = profile?.stats?.memberSince ? new Date(profile.stats.memberSince).getFullYear() : '—';

  return (
    <>
      <style>{STYLES}</style>

      {addrModal !== null && (
        <AddressModal
          initial={typeof addrModal === 'object' ? addrModal : null}
          onSave={handleAddressSave}
          onClose={() => setAddrModal(null)}
          loading={saving}
        />
      )}

      <div className="pr-root">

        {/* ── Hero Banner ── */}
        <div className="pr-hero">
          <div className="pr-hero-bg" />
          <div className="pr-hero-grain" />
          <div className="pr-hero-corner pr-hero-corner--tl" />
          <div className="pr-hero-corner pr-hero-corner--tr" />
          <div className="pr-hero-corner pr-hero-corner--bl" />
          <div className="pr-hero-corner pr-hero-corner--br" />

          <div className="pr-hero-content">
            {/* Avatar */}
            <div className="pr-avatar-wrap">
              <div className="pr-avatar" onClick={() => fileRef.current?.click()}>
                {avatarLoading ? (
                  <div className="pr-avatar-overlay"><span className="pr-spinner" /></div>
                ) : profile?.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="pr-avatar-img" />
                ) : (
                  <span className="pr-avatar-initials">{initials}</span>
                )}
                <div className="pr-avatar-edit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="pr-hidden" onChange={handleAvatarChange} />
            </div>

            {/* Identity */}
            <div className="pr-hero-identity">
              <span className="pr-hero-eyebrow">
                <span className="pr-rule" />My Account<span className="pr-rule" />
              </span>
              <h1 className="pr-hero-name">{profile?.name}</h1>
              <p className="pr-hero-email">{profile?.email}</p>
            </div>

            {/* Stats */}
            <div className="pr-hero-stats">
              <div className="pr-stat">
                <span className="pr-stat-num">{profile?.stats?.totalOrders ?? 0}</span>
                <span className="pr-stat-label">Orders</span>
              </div>
              <div className="pr-stat-divider" />
              <div className="pr-stat">
                <span className="pr-stat-num">${(profile?.stats?.totalSpent ?? 0).toFixed(0)}</span>
                <span className="pr-stat-label">Total Spent</span>
              </div>
              <div className="pr-stat-divider" />
              <div className="pr-stat">
                <span className="pr-stat-num">{profile?.addresses?.length ?? 0}</span>
                <span className="pr-stat-label">Addresses</span>
              </div>
              <div className="pr-stat-divider" />
              <div className="pr-stat">
                <span className="pr-stat-num">{memberYear}</span>
                <span className="pr-stat-label">Member Since</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="pr-body">

          {/* Sidebar Tabs */}
          <aside className="pr-sidebar">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`pr-tab ${activeTab === tab.id ? 'pr-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon d={tab.icon} size={15} />
                <span>{tab.label}</span>
                <svg className="pr-tab-chevron" width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}

            {/* Quick links */}
            <div className="pr-sidebar-divider" />
            <button className="pr-tab pr-tab--ghost" onClick={() => navigate('/orders')}>
              <Icon d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" size={15} />
              <span>My Orders</span>
              <svg className="pr-tab-chevron" width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </aside>

          {/* Panel */}
          <main className="pr-panel">

            {/* ── Profile Tab ── */}
            {activeTab === 'profile' && (
              <div className="pr-section">
                <div className="pr-section-header">
                  <span className="pr-eyebrow"><span className="pr-rule" />Personal<span className="pr-rule" /></span>
                  <h2 className="pr-section-title">Profile <em>Details</em></h2>
                </div>

                <div className="pr-form">
                  <div className="pr-form-grid pr-form-grid--2">
                    <div className="pr-field">
                      <label className="pr-field-label">Full Name</label>
                      <input
                        className="pr-field-input"
                        value={profileForm.name}
                        onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your name"
                      />
                      <div className="pr-field-line" />
                    </div>
                    <div className="pr-field">
                      <label className="pr-field-label">Phone Number</label>
                      <input
                        className="pr-field-input"
                        value={profileForm.phone}
                        onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+1 (555) 000-0000"
                      />
                      <div className="pr-field-line" />
                    </div>
                  </div>

                  {/* Email — read only */}
                  <div className="pr-field">
                    <label className="pr-field-label">Email Address <span className="pr-field-badge">Read only</span></label>
                    <input className="pr-field-input pr-field-input--readonly" value={profile?.email || ''} readOnly />
                    <div className="pr-field-line" />
                  </div>

                  {/* Member since */}
                  <div className="pr-info-strip">
                    {[
                      { label: 'Member Since', value: profile?.stats?.memberSince ? new Date(profile.stats.memberSince).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
                      { label: 'Account Status', value: 'Active' },
                    ].map(({ label, value }) => (
                      <div key={label} className="pr-info-item">
                        <span className="pr-info-label">{label}</span>
                        <span className="pr-info-value">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pr-form-actions">
                    <button className="pr-btn pr-btn--dark" onClick={handleProfileSave} disabled={saving}>
                      {saving ? <><span className="pr-spinner pr-spinner--sm" /> Saving…</> : 'Save Changes'}
                      {!saving && (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Addresses Tab ── */}
            {activeTab === 'addresses' && (
              <div className="pr-section">
                <div className="pr-section-header pr-section-header--row">
                  <div>
                    <span className="pr-eyebrow"><span className="pr-rule" />Saved<span className="pr-rule" /></span>
                    <h2 className="pr-section-title">My <em>Addresses</em></h2>
                  </div>
                  <button className="pr-btn pr-btn--outline" onClick={() => setAddrModal('new')}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    Add New
                  </button>
                </div>

                {!profile?.addresses?.length ? (
                  <EmptyAddresses onAdd={() => setAddrModal('new')} />
                ) : (
                  <div className="pr-addr-grid">
                    {profile.addresses.map(addr => (
                      <AddressCard
                        key={addr._id}
                        address={addr}
                        onEdit={a => setAddrModal(a)}
                        onDelete={handleAddressDelete}
                        onSetDefault={handleSetDefault}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Security Tab ── */}
            {activeTab === 'security' && (
              <div className="pr-section">
                <div className="pr-section-header">
                  <span className="pr-eyebrow"><span className="pr-rule" />Security<span className="pr-rule" /></span>
                  <h2 className="pr-section-title">Change <em>Password</em></h2>
                </div>

                <div className="pr-form">
                  {[
                    { key: 'currentPassword', label: 'Current Password',  vis: 'current' },
                    { key: 'newPassword',      label: 'New Password',      vis: 'new' },
                    { key: 'confirmPassword',  label: 'Confirm Password',  vis: 'confirm' },
                  ].map(({ key, label, vis }) => (
                    <div className="pr-field pr-field--pw" key={key}>
                      <label className="pr-field-label">{label}</label>
                      <div className="pr-pw-wrap">
                        <input
                          className="pr-field-input"
                          type={pwVisible[vis] ? 'text' : 'password'}
                          value={pwForm[key]}
                          onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                          placeholder="••••••••"
                        />
                        <button className="pr-pw-toggle" type="button" onClick={() => setPwVisible(v => ({ ...v, [vis]: !v[vis] }))}>
                          {pwVisible[vis] ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          )}
                        </button>
                      </div>
                      <div className="pr-field-line" />
                    </div>
                  ))}

                  {/* Password rules */}
                  <div className="pr-pw-rules">
                    {[
                      { text: 'At least 8 characters',         ok: pwForm.newPassword.length >= 8 },
                      { text: 'Contains letters and numbers',   ok: /(?=.*[a-zA-Z])(?=.*[0-9])/.test(pwForm.newPassword) },
                      { text: 'Passwords match',                ok: pwForm.newPassword && pwForm.newPassword === pwForm.confirmPassword },
                    ].map(({ text, ok }) => (
                      <div key={text} className={`pr-pw-rule ${ok ? 'pr-pw-rule--ok' : ''}`}>
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <circle cx="6" cy="6" r="5" stroke={ok ? '#6B8F71' : '#c4b8a8'} strokeWidth="1.2"/>
                          {ok && <path d="M3.5 6l1.5 1.5L8.5 4" stroke="#6B8F71" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>}
                        </svg>
                        {text}
                      </div>
                    ))}
                  </div>

                  <div className="pr-form-actions">
                    <button className="pr-btn pr-btn--dark" onClick={handlePasswordChange} disabled={saving}>
                      {saving ? <><span className="pr-spinner pr-spinner--sm" /> Updating…</> : 'Update Password'}
                      {!saving && (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Danger zone */}
                <div className="pr-danger-zone">
                  <div className="pr-danger-header">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a06060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>
                    </svg>
                    <span>Danger Zone</span>
                  </div>
                  <p className="pr-danger-desc">Once you log out all devices, you will need to sign in again everywhere.</p>
                  <button className="pr-btn pr-btn--danger" onClick={() => { setToken(''); localStorage.removeItem('token'); navigate('/login'); }}>
                    Log Out All Devices
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

/* ── Root ── */
.pr-root {
  border-top: 1px solid #e8e0d4;
  min-height: 80vh;
  background: #faf8f5;
  padding-bottom: 80px;
  animation: prFadeIn 0.5s ease both;
}
@keyframes prFadeIn { from { opacity: 0 } to { opacity: 1 } }

/* ── Loading ── */
.pr-loading {
  min-height: 60vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 16px;
  border-top: 1px solid #e8e0d4;
}
.pr-loading-txt {
  font-family: 'Montserrat', sans-serif; font-size: 10px; letter-spacing: 0.25em;
  color: #a09080; text-transform: uppercase;
}

/* ── Hero ── */
.pr-hero {
  position: relative; overflow: hidden;
  background: #0f0e0c; padding: 56px 64px 48px;
  margin-bottom: 0;
}
.pr-hero-bg {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 30% 50%, rgba(196,160,100,0.09) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(196,160,100,0.05) 0%, transparent 50%);
  pointer-events: none;
}
.pr-hero-grain {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  opacity: 0.4; pointer-events: none;
}
.pr-hero-corner {
  position: absolute; width: 32px; height: 32px; z-index: 1;
}
.pr-hero-corner--tl { top: 16px; left: 16px; border-top: 1px solid rgba(196,160,100,0.2); border-left: 1px solid rgba(196,160,100,0.2); }
.pr-hero-corner--tr { top: 16px; right: 16px; border-top: 1px solid rgba(196,160,100,0.2); border-right: 1px solid rgba(196,160,100,0.2); }
.pr-hero-corner--bl { bottom: 16px; left: 16px; border-bottom: 1px solid rgba(196,160,100,0.2); border-left: 1px solid rgba(196,160,100,0.2); }
.pr-hero-corner--br { bottom: 16px; right: 16px; border-bottom: 1px solid rgba(196,160,100,0.2); border-right: 1px solid rgba(196,160,100,0.2); }

.pr-hero-content {
  position: relative; z-index: 2; max-width: 1100px; margin: 0 auto;
  display: flex; align-items: center; gap: 40px; flex-wrap: wrap;
}

/* Avatar */
.pr-avatar-wrap { flex-shrink: 0; }
.pr-avatar {
  position: relative; width: 96px; height: 96px;
  border-radius: 50%; overflow: hidden; cursor: pointer;
  border: 2px solid rgba(196,160,100,0.3);
  background: #1c1916;
  transition: border-color 0.3s;
}
.pr-avatar:hover { border-color: rgba(196,160,100,0.7); }
.pr-avatar-img { width: 100%; height: 100%; object-fit: cover; }
.pr-avatar-initials {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300;
  color: #c4a064; letter-spacing: 0.05em;
}
.pr-avatar-overlay {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  background: rgba(15,14,12,0.6); z-index: 2;
}
.pr-avatar-edit {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: rgba(15,14,12,0.72); padding: 6px 0;
  display: flex; align-items: center; justify-content: center;
  color: #c4a064; opacity: 0; transition: opacity 0.25s;
}
.pr-avatar:hover .pr-avatar-edit { opacity: 1; }

/* Identity */
.pr-hero-identity { flex: 1; min-width: 180px; }
.pr-hero-name {
  font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 300;
  color: #f5f0e8; margin: 6px 0 4px; line-height: 1;
}
.pr-hero-email {
  font-family: 'Montserrat', sans-serif; font-size: 10.5px; font-weight: 300;
  color: #6b6054; letter-spacing: 0.06em;
}

/* Stats */
.pr-hero-stats {
  display: flex; align-items: center; gap: 0;
  border: 1px solid rgba(196,160,100,0.15);
  background: rgba(255,255,255,0.02);
  flex-wrap: wrap;
}
.pr-stat {
  padding: 16px 28px; display: flex; flex-direction: column; gap: 4px; text-align: center;
}
.pr-stat-num {
  font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300;
  color: #f5f0e8; line-height: 1;
}
.pr-stat-label {
  font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 500;
  letter-spacing: 0.2em; text-transform: uppercase; color: #6b6054;
}
.pr-stat-divider { width: 1px; height: 44px; background: rgba(196,160,100,0.15); align-self: center; }

/* ── Body layout ── */
.pr-body {
  max-width: 1100px; margin: 0 auto;
  display: grid; grid-template-columns: 220px 1fr;
  gap: 32px; padding: 40px 64px 0;
  align-items: start;
}

/* ── Sidebar ── */
.pr-sidebar {
  display: flex; flex-direction: column; gap: 2px;
  position: sticky; top: 80px;
  background: #fff; border: 1px solid #e8e0d4; padding: 8px;
}
.pr-tab {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; background: none; border: none; cursor: pointer;
  text-align: left; width: 100%;
  font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 500;
  letter-spacing: 0.14em; text-transform: uppercase; color: #8b7f72;
  transition: background 0.2s, color 0.2s; position: relative;
}
.pr-tab:hover { background: #faf8f5; color: #1a1612; }
.pr-tab--active {
  background: #1a1612 !important; color: #f5f0e8 !important;
}
.pr-tab--ghost { color: #a09080; }
.pr-tab-chevron { margin-left: auto; opacity: 0.4; flex-shrink: 0; }
.pr-tab--active .pr-tab-chevron { opacity: 0.6; }
.pr-sidebar-divider { height: 1px; background: #f0ebe3; margin: 6px 8px; }

/* ── Panel ── */
.pr-panel { min-width: 0; }
.pr-section {
  background: #fff; border: 1px solid #e8e0d4;
  animation: prSlideIn 0.35s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes prSlideIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.pr-section-header {
  padding: 28px 36px 24px; border-bottom: 1px solid #f0ebe3;
  display: flex; flex-direction: column; gap: 6px;
}
.pr-section-header--row {
  flex-direction: row; align-items: center; justify-content: space-between;
}
.pr-section-title {
  font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 300;
  color: #1a1612; margin: 0; line-height: 1;
}
.pr-section-title em { font-style: italic; color: #c4a064; }

/* ── Form ── */
.pr-form { padding: 28px 36px; display: flex; flex-direction: column; gap: 22px; }
.pr-form-grid { display: grid; gap: 22px; }
.pr-form-grid--2 { grid-template-columns: 1fr 1fr; }

/* Field */
.pr-field { display: flex; flex-direction: column; gap: 6px; position: relative; }
.pr-field--pw { gap: 6px; }
.pr-field-label {
  font-family: 'Montserrat', sans-serif; font-size: 8px; font-weight: 600;
  letter-spacing: 0.25em; text-transform: uppercase; color: #4a3f35;
  display: flex; align-items: center; gap: 8px;
}
.pr-field-badge {
  font-size: 7.5px; letter-spacing: 0.1em; color: #b0a090;
  background: #f0ebe3; padding: 2px 7px; font-weight: 400;
}
.pr-field-input {
  font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 400;
  color: #1a1612; background: transparent; border: none;
  border-bottom: 1px solid #c8bfb4; padding: 8px 0; outline: none; width: 100%;
  transition: border-color 0.2s; letter-spacing: 0.04em;
}
.pr-field-input::placeholder { color: #8b7f72; }
.pr-field-input:focus { border-bottom-color: transparent; }
.pr-field-input--readonly { color: #a09080; cursor: not-allowed; }
.pr-field-line {
  position: absolute; bottom: 0; left: 0; right: 0; height: 1.5px;
  background: #c4a064; transform: scaleX(0); transform-origin: left;
  transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); pointer-events: none;
}
.pr-field:focus-within .pr-field-line { transform: scaleX(1); }
.pr-field--pw .pr-field-line { bottom: 0; }

/* Password toggle */
.pr-pw-wrap { position: relative; }
.pr-pw-wrap .pr-field-input { padding-right: 36px; }
.pr-pw-toggle {
  position: absolute; right: 0; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; padding: 6px;
  color: #b0a090; transition: color 0.2s;
}
.pr-pw-toggle:hover { color: #1a1612; }

/* Password rules */
.pr-pw-rules {
  display: flex; flex-direction: column; gap: 6px;
  background: #faf8f5; border: 1px solid #f0ebe3; padding: 14px 16px;
}
.pr-pw-rule {
  display: flex; align-items: center; gap: 7px;
  font-family: 'Montserrat', sans-serif; font-size: 9.5px; font-weight: 400;
  letter-spacing: 0.05em; color: #b0a090; transition: color 0.25s;
}
.pr-pw-rule--ok { color: #6B8F71; }

/* Info strip */
.pr-info-strip {
  display: flex; gap: 0; border: 1px solid #f0ebe3; background: #fdfcfa;
}
.pr-info-item {
  flex: 1; padding: 14px 20px; display: flex; flex-direction: column; gap: 4px;
  border-right: 1px solid #f0ebe3;
}
.pr-info-item:last-child { border-right: none; }
.pr-info-label {
  font-family: 'Montserrat', sans-serif; font-size: 8px; font-weight: 500;
  letter-spacing: 0.22em; text-transform: uppercase; color: #b0a090;
}
.pr-info-value {
  font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 400; color: #1a1612;
}

/* Form actions */
.pr-form-actions { display: flex; justify-content: flex-end; padding-top: 4px; }

/* ── Buttons ── */
.pr-btn {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'Montserrat', sans-serif; font-size: 9.5px; font-weight: 600;
  letter-spacing: 0.22em; text-transform: uppercase; border: none;
  padding: 13px 28px; cursor: pointer; transition: all 0.25s;
}
.pr-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.pr-btn--dark {
  background: #1a1612; color: #f5f0e8;
}
.pr-btn--dark:hover:not(:disabled) { background: #c4a064; color: #1a1612; }
.pr-btn--ghost {
  background: #f0ebe3; color: #3a3228;
}
.pr-btn--ghost:hover { background: #e0d8ce; }
.pr-btn--outline {
  background: transparent; color: #1a1612; border: 1px solid #e0d8ce;
}
.pr-btn--outline:hover { border-color: #1a1612; }
.pr-btn--danger {
  background: transparent; color: #a06060; border: 1px solid rgba(160,96,96,0.35);
}
.pr-btn--danger:hover { background: rgba(160,96,96,0.08); border-color: #a06060; }

/* ── Addresses ── */
.pr-addr-grid { padding: 28px 36px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.pr-addr-card {
  position: relative; padding: 22px 24px; border: 1px solid #e8e0d4;
  background: #fdfcfa; transition: border-color 0.25s, box-shadow 0.25s;
}
.pr-addr-card:hover { border-color: #c4b090; box-shadow: 0 4px 18px rgba(196,160,100,0.09); }
.pr-addr-card--default { border-color: #c4a064; }
.pr-addr-default-badge {
  position: absolute; top: 12px; right: 12px;
  font-family: 'Montserrat', sans-serif; font-size: 7.5px; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase; color: #c4a064;
  background: rgba(196,160,100,0.1); border: 1px solid rgba(196,160,100,0.25);
  padding: 3px 8px;
}
.pr-addr-label-row { margin-bottom: 10px; }
.pr-addr-label {
  font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 600;
  letter-spacing: 0.2em; text-transform: uppercase; color: #1a1612;
  background: #f0ebe3; padding: 3px 10px;
}
.pr-addr-name {
  font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 400;
  color: #1a1612; margin: 0 0 8px;
}
.pr-addr-line {
  font-family: 'Montserrat', sans-serif; font-size: 10.5px; font-weight: 300;
  color: #8b7f72; letter-spacing: 0.04em; margin: 0 0 2px;
}
.pr-addr-phone {
  font-family: 'Montserrat', sans-serif; font-size: 10.5px;
  color: #a09080; margin: 8px 0 0; letter-spacing: 0.04em;
}
.pr-addr-actions {
  display: flex; gap: 8px; margin-top: 16px; padding-top: 12px;
  border-top: 1px solid #f0ebe3; flex-wrap: wrap;
}
.pr-addr-btn {
  font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 600;
  letter-spacing: 0.15em; text-transform: uppercase; color: #6b5f50;
  background: none; border: 1px solid #e0d8ce; padding: 6px 12px; cursor: pointer;
  transition: all 0.2s;
}
.pr-addr-btn:hover { border-color: #1a1612; color: #1a1612; }
.pr-addr-btn--del { color: #a06060; border-color: rgba(160,96,96,0.25); }
.pr-addr-btn--del:hover { border-color: #a06060; background: rgba(160,96,96,0.05); }

/* Empty state */
.pr-empty {
  padding: 56px 36px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.pr-empty-glyph { font-size: 28px; color: #c4a064; opacity: 0.3; margin-bottom: 4px; }
.pr-empty-title {
  font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; color: #1a1612;
}
.pr-empty-sub {
  font-family: 'Montserrat', sans-serif; font-size: 10px; color: #a09080;
  letter-spacing: 0.05em; margin-bottom: 8px;
}

/* ── Danger zone ── */
.pr-danger-zone {
  margin: 0 36px 28px; padding: 20px 24px;
  border: 1px solid rgba(160,96,96,0.2); background: rgba(160,96,96,0.03);
}
.pr-danger-header {
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
  font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 600;
  letter-spacing: 0.2em; text-transform: uppercase; color: #a06060;
}
.pr-danger-desc {
  font-family: 'Montserrat', sans-serif; font-size: 10.5px; font-weight: 300;
  color: #8b7f72; letter-spacing: 0.03em; margin: 0 0 16px; line-height: 1.7;
}

/* ── Shared ── */
.pr-eyebrow {
  display: flex; align-items: center; gap: 10px;
  font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 500;
  letter-spacing: 0.3em; text-transform: uppercase; color: #c4a064;
}
.pr-rule { display: inline-block; width: 24px; height: 1px; background: #c4a064; }
.pr-hidden { display: none; }
.pr-spinner {
  display: inline-block; width: 14px; height: 14px;
  border: 1.5px solid rgba(245,240,232,0.3); border-top-color: #f5f0e8;
  border-radius: 50%; animation: prSpin 0.8s linear infinite;
}
.pr-spinner--sm { width: 11px; height: 11px; }
.pr-spinner--lg {
  width: 32px; height: 32px;
  border: 2px solid #e8e0d4; border-top-color: #c4a064;
  border-radius: 50%; animation: prSpin 0.9s linear infinite;
}
@keyframes prSpin { to { transform: rotate(360deg); } }

/* ── Modal ── */
.pr-modal-overlay {
  position: fixed; inset: 0; background: rgba(26,22,18,0.55);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; backdrop-filter: blur(2px);
  animation: prFadeOverlay 0.2s ease;
  padding: 20px;
}
@keyframes prFadeOverlay { from { opacity: 0 } to { opacity: 1 } }
.pr-modal {
  background: #fdfcfa; border: 1px solid #e0d8ce;
  width: 100%; max-width: 540px; max-height: 90vh;
  overflow-y: auto; animation: prModalIn 0.3s cubic-bezier(0.16,1,0.3,1);
  position: relative;
}
.pr-modal::before, .pr-modal::after {
  content: ''; position: absolute; width: 16px; height: 16px; pointer-events: none;
}
.pr-modal::before { top: 10px; left: 10px; border-top: 1.5px solid #c4a064; border-left: 1.5px solid #c4a064; }
.pr-modal::after  { bottom: 10px; right: 10px; border-bottom: 1.5px solid #c4a064; border-right: 1.5px solid #c4a064; }
@keyframes prModalIn {
  from { opacity: 0; transform: translateY(16px) scale(0.97) }
  to   { opacity: 1; transform: translateY(0) scale(1) }
}
.pr-modal-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 28px 32px 20px; border-bottom: 1px solid #f0ebe3;
}
.pr-modal-title-block { display: flex; flex-direction: column; gap: 5px; }
.pr-modal-title {
  font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 300;
  color: #1a1612; margin: 0; line-height: 1;
}
.pr-modal-title em { font-style: italic; color: #c4a064; }
.pr-modal-close {
  background: none; border: none; cursor: pointer; padding: 6px;
  color: #b0a090; transition: color 0.2s, transform 0.2s;
}
.pr-modal-close:hover { color: #1a1612; transform: rotate(90deg); }
.pr-modal-body { padding: 24px 32px; display: flex; flex-direction: column; gap: 18px; }
.pr-modal-footer {
  padding: 20px 32px 28px; border-top: 1px solid #f0ebe3;
  display: flex; justify-content: flex-end; gap: 10px;
}

/* Label chips */
.pr-field-row { display: flex; gap: 8px; }
.pr-label-chip {
  font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase; color: #8b7f72;
  border: 1px solid #e0d8ce; background: transparent; padding: 7px 16px;
  cursor: pointer; transition: all 0.2s;
}
.pr-label-chip:hover { border-color: #1a1612; color: #1a1612; }
.pr-label-chip--active { background: #1a1612; border-color: #1a1612; color: #f5f0e8; }

/* Checkbox */
.pr-checkbox-row {
  display: flex; align-items: center; gap: 10px; cursor: pointer;
}
.pr-checkbox {
  width: 14px; height: 14px; accent-color: #1a1612; cursor: pointer;
}
.pr-checkbox-label {
  font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 400;
  color: #6b5f50; letter-spacing: 0.06em;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .pr-hero { padding: 40px 24px 36px; }
  .pr-body { grid-template-columns: 1fr; padding: 24px 24px 0; gap: 16px; }
  .pr-sidebar { position: static; flex-direction: row; flex-wrap: wrap; }
  .pr-tab { flex: 1; justify-content: center; }
  .pr-tab-chevron { display: none; }
  .pr-sidebar-divider { display: none; }
  .pr-hero-stats { width: 100%; }
}
@media (max-width: 640px) {
  .pr-hero-content { flex-direction: column; align-items: flex-start; gap: 24px; }
  .pr-hero-name { font-size: 28px; }
  .pr-section-header, .pr-form { padding: 20px; }
  .pr-form-grid--2 { grid-template-columns: 1fr; }
  .pr-addr-grid { grid-template-columns: 1fr; padding: 20px; }
  .pr-stat { padding: 12px 18px; }
  .pr-modal-body, .pr-modal-header { padding: 20px; }
  .pr-modal-footer { padding: 16px 20px 24px; }
  .pr-danger-zone { margin: 0 20px 20px; }
}
`;

export default Profile;
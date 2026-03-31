import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Loader, LogOut, Mail, MapPin, Package, Phone, Save, Sparkles, UserRound, ShoppingBag, Settings, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import LoadingQuote from '../components/LoadingQuote'
import api from '../utils/api'

const STATUS_COLORS = {
  pending:    { bg: '#FEF9C3', color: '#854D0E' },
  confirmed:  { bg: '#DBEAFE', color: '#1E40AF' },
  processing: { bg: '#F3E8FF', color: '#6B21A8' },
  shipped:    { bg: '#E0E7FF', color: '#3730A3' },
  delivered:  { bg: '#DCFCE7', color: '#14532D' },
  cancelled:  { bg: '#FEE2E2', color: '#991B1B' },
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: Sparkles },
  { id: 'orders',   label: 'My Orders', icon: Package },
  { id: 'settings', label: 'Settings',  icon: Settings },
]

export default function Profile() {
  const { customerUser, updateCustomerProfile, customerLogout } = useAuth()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [form, setForm] = useState({
    fullName: '', phone: '', avatar: '',
    defaultAddress: { address: '', city: '', state: '', zipCode: '' },
  })
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!customerUser) return
    setForm({
      fullName: customerUser.fullName || '',
      phone: customerUser.phone || '',
      avatar: customerUser.avatar || '',
      defaultAddress: {
        address: customerUser.defaultAddress?.address || '',
        city: customerUser.defaultAddress?.city || '',
        state: customerUser.defaultAddress?.state || '',
        zipCode: customerUser.defaultAddress?.zipCode || '',
      },
    })
  }, [customerUser])

  useEffect(() => {
    let active = true
    api.get('/users/me/orders')
      .then(res => { if (active) setOrders(res.data) })
      .catch(() => { if (active) addToast('Could not load orders', 'error') })
      .finally(() => { if (active) setLoadingOrders(false) })
    return () => { active = false }
  }, [addToast])

  const totalSpent = useMemo(() => orders.reduce((s, o) => s + (o.total || 0), 0), [orders])
  const delivered  = useMemo(() => orders.filter(o => o.status === 'delivered').length, [orders])

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setAddr  = (k, v) => setForm(f => ({ ...f, defaultAddress: { ...f.defaultAddress, [k]: v } }))

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try { await updateCustomerProfile(form); addToast('Profile updated ✨', 'success') }
    catch (err) { addToast(err.response?.data?.message || 'Could not update profile', 'error') }
    finally { setSaving(false) }
  }

  const initials = customerUser?.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: 'linear-gradient(160deg, #fff5f8 0%, #fffaf5 60%, #fff 100%)' }}>
      {/* Hero banner */}
      <div style={{ background: 'linear-gradient(135deg, #C44569 0%, #E8607B 55%, #D4956B 100%)', padding: '40px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-30px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }} className="profile-hero-row">
            {/* Avatar */}
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {form.avatar
                ? <img src={form.avatar} alt={customerUser?.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>{initials}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', marginBottom: '6px' }}>My Account</div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 900, color: '#fff', marginBottom: '6px', lineHeight: 1.1 }}>{customerUser?.fullName || 'Welcome!'}</h1>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Mail size={13} />{customerUser?.email}</span>
                {customerUser?.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Phone size={13} />{customerUser.phone}</span>}
              </div>
            </div>
            <button onClick={customerLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '50px', background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.35)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', backdropFilter: 'blur(8px)' }}>
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Stat cards — pulled up over the banner */}
      <div className="page-container" style={{ marginTop: '-40px', position: 'relative', zIndex: 2 }}>
        <div className="profile-stat-grid">
          {[
            { icon: Package,  label: 'Total Orders',   value: orders.length },
            { icon: Heart,    label: 'Total Spent',    value: `₹${totalSpent.toLocaleString('en-IN')}` },
            { icon: ShoppingBag, label: 'Delivered',   value: delivered },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ background: '#fff', borderRadius: '20px', padding: '18px 20px', boxShadow: '0 8px 28px rgba(196,69,105,0.1)', border: '1px solid rgba(196,69,105,0.08)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '12px', background: 'linear-gradient(135deg,#FDE8F0,#FFF6EC)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <Icon size={17} color="#C44569" />
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1A0A05' }}>{loadingOrders ? '—' : value}</div>
              <div style={{ fontSize: '0.75rem', color: '#9E7B6C', fontWeight: 500, marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="profile-tab-btn"
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg,#C44569,#E8607B)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#9E7B6C',
                boxShadow: activeTab === tab.id ? '0 4px 14px rgba(196,69,105,0.3)' : 'none',
              }}
            >
              <tab.icon size={15} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                {/* Recent orders */}
                <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid rgba(196,69,105,0.08)', boxShadow: '0 4px 20px rgba(122,92,78,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontWeight: 800, color: '#1A0A05', fontSize: '1rem' }}>Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')} style={{ fontSize: '0.75rem', color: '#C44569', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
                  </div>
                  {loadingOrders ? (
                    <><LoadingQuote style={{ marginBottom: '10px' }} /><div className="skeleton" style={{ height: '80px', borderRadius: '12px' }} /></>
                  ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: '#9E7B6C' }}>
                      <Package size={36} color="#F8C8DC" style={{ margin: '0 auto 8px', display: 'block' }} />
                      <p style={{ fontSize: '0.85rem' }}>No orders yet — go treat yourself! 🛍️</p>
                      <Link to="/products"><button className="btn-primary" style={{ marginTop: '12px', fontSize: '0.8rem', padding: '8px 18px' }}>Shop Now</button></Link>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {orders.slice(0, 3).map(order => (
                        <div key={order._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: '14px', background: '#FFF9F5', border: '1px solid rgba(238,214,196,0.4)' }}>
                          <div>
                            <div style={{ fontWeight: 700, color: '#1A0A05', fontSize: '0.85rem' }}>#{order.orderId}</div>
                            <div style={{ fontSize: '0.72rem', color: '#9E7B6C', marginTop: '2px' }}>{formatDate(order.createdAt)}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ padding: '4px 10px', borderRadius: '50px', background: STATUS_COLORS[order.status]?.bg || '#FDE8F0', color: STATUS_COLORS[order.status]?.color || '#C44569', fontSize: '0.68rem', fontWeight: 800, textTransform: 'capitalize', display: 'block', marginBottom: '4px' }}>{order.status}</span>
                            <div style={{ fontWeight: 800, color: '#C44569', fontSize: '0.85rem' }}>₹{order.total?.toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick actions */}
                <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid rgba(196,69,105,0.08)', boxShadow: '0 4px 20px rgba(122,92,78,0.05)' }}>
                  <h3 style={{ fontWeight: 800, color: '#1A0A05', fontSize: '1rem', marginBottom: '16px' }}>Quick Actions</h3>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {[
                      { to: '/products', icon: ShoppingBag, label: 'Continue Shopping', sub: 'Browse new arrivals' },
                      { to: '/wishlist',  icon: Heart,       label: 'My Wishlist',        sub: 'Items you saved' },
                      { to: '/orders',   icon: Clock,       label: 'Track Orders',       sub: 'Full order history' },
                    ].map(({ to, icon: Icon, label, sub }) => (
                      <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '14px', border: '1.5px solid rgba(196,69,105,0.1)', background: '#FFFBF8', transition: 'all 0.2s', cursor: 'pointer' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#E8A0B8'; e.currentTarget.style.background = '#FFF0F4' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(196,69,105,0.1)'; e.currentTarget.style.background = '#FFFBF8' }}
                        >
                          <div style={{ width: 38, height: 38, borderRadius: '12px', background: 'linear-gradient(135deg,#FDE8F0,#FFF6EC)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={17} color="#C44569" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#1A0A05', fontSize: '0.875rem' }}>{label}</div>
                            <div style={{ fontSize: '0.72rem', color: '#9E7B6C' }}>{sub}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid rgba(196,69,105,0.08)', boxShadow: '0 4px 20px rgba(122,92,78,0.05)' }}>
                <h3 style={{ fontWeight: 800, color: '#1A0A05', fontSize: '1.1rem', marginBottom: '20px' }}>Order History</h3>
                {loadingOrders ? (
                  <><LoadingQuote style={{ marginBottom: '16px' }} /><div style={{ display: 'grid', gap: '12px' }}>{[1,2].map(i => <div key={i} className="skeleton" style={{ height: '96px', borderRadius: '16px' }} />)}</div></>
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#9E7B6C' }}>
                    <Package size={48} color="#F8C8DC" style={{ margin: '0 auto 12px', display: 'block' }} />
                    <p>No orders yet. Time to shop! 🛍️</p>
                    <Link to="/products"><button className="btn-primary" style={{ marginTop: '16px' }}>Shop Now</button></Link>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '14px' }}>
                    {orders.map(order => (
                      <div key={order._id} style={{ borderRadius: '18px', border: '1px solid rgba(238,214,196,0.5)', padding: '18px', background: '#FFFDFC' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }} className="profile-order-meta">
                          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <Meta label="Order" value={`#${order.orderId}`} />
                            <Meta label="Date" value={formatDate(order.createdAt)} />
                            <Meta label="Items" value={order.items?.length || 0} />
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ padding: '5px 12px', borderRadius: '50px', background: STATUS_COLORS[order.status]?.bg || '#FDE8F0', color: STATUS_COLORS[order.status]?.color || '#C44569', fontSize: '0.72rem', fontWeight: 800, textTransform: 'capitalize', display: 'inline-block', marginBottom: '4px' }}>{order.status}</span>
                            <div style={{ fontWeight: 900, color: '#C44569' }}>₹{order.total?.toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {order.items?.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(238,214,196,0.35)' }}>
                              <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', background: '#FFF6EC', flexShrink: 0 }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, color: '#1A0A05', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                                <div style={{ color: '#9E7B6C', fontSize: '0.75rem' }}>Qty {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</div>
                              </div>
                              <div style={{ fontWeight: 800, color: '#7A5C4E', fontSize: '0.875rem' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <div style={{ background: '#fff', borderRadius: '24px', padding: '28px', border: '1px solid rgba(196,69,105,0.08)', boxShadow: '0 4px 20px rgba(122,92,78,0.05)' }} className="profile-settings-box">
                <h3 style={{ fontWeight: 800, color: '#1A0A05', fontSize: '1.1rem', marginBottom: '6px' }}>Account Settings</h3>
                <p style={{ color: '#9E7B6C', fontSize: '0.875rem', marginBottom: '24px', lineHeight: 1.6 }}>Keep your details up to date for faster checkout.</p>
                <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px' }}>
                  <Field label="Full Name" value={form.fullName} onChange={v => setField('fullName', v)} />
                  <Field label="Email Address" value={customerUser?.email || ''} onChange={() => {}} disabled />
                  <Field label="Phone Number" value={form.phone} onChange={v => setField('phone', v)} />
                  <Field label="Avatar Image URL" value={form.avatar} onChange={v => setField('avatar', v)} placeholder="https://..." />
                  <div style={{ borderTop: '1px solid rgba(238,214,196,0.5)', paddingTop: '16px', marginTop: '4px' }}>
                    <div style={{ fontWeight: 700, color: '#1A0A05', fontSize: '0.9rem', marginBottom: '14px' }}>Default Delivery Address</div>
                    <div className="profile-address-grid">
                      <div style={{ gridColumn: '1/-1' }}><Field label="Street Address" value={form.defaultAddress.address} onChange={v => setAddr('address', v)} /></div>
                      <Field label="City"     value={form.defaultAddress.city}    onChange={v => setAddr('city', v)} />
                      <Field label="State"    value={form.defaultAddress.state}   onChange={v => setAddr('state', v)} />
                      <Field label="PIN Code" value={form.defaultAddress.zipCode} onChange={v => setAddr('zipCode', v)} />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary" disabled={saving} style={{ justifyContent: 'center', marginTop: '4px' }}>
                    {saving ? <><Loader size={15} className="animate-spin-slow" /> Saving...</> : <><Save size={15} /> Save Changes</>}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ height: '60px' }} />

      <style>{`
        .profile-stat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 28px; }
        .profile-tabs { display: flex; gap: 6px; background: #fff; border-radius: 16px; padding: 6px; border: 1px solid rgba(196,69,105,0.1); margin-bottom: 24px; width: 100%; }
        .profile-tab-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px; padding: 10px 12px; border-radius: 12px; border: none; cursor: pointer; font-weight: 700; font-size: 0.82rem; transition: all 0.2s; white-space: nowrap; }
        .profile-hero-row { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .profile-address-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 600px) {
          .profile-stat-grid { grid-template-columns: repeat(3,1fr); gap: 8px; }
          .profile-stat-grid > div { padding: 12px 10px !important; border-radius: 14px !important; }
          .profile-stat-grid > div > div:first-child { width: 28px !important; height: 28px !important; margin-bottom: 6px !important; }
          .profile-stat-grid > div > div:nth-child(2) { font-size: 1rem !important; }
          .profile-stat-grid > div > div:nth-child(3) { font-size: 0.65rem !important; }
          .profile-tabs { gap: 4px; padding: 4px; }
          .profile-tab-btn { padding: 8px 6px !important; font-size: 0.72rem !important; gap: 4px !important; }
          .profile-hero-row { flex-direction: column; align-items: flex-start; gap: 12px; }
          .profile-address-grid { grid-template-columns: 1fr !important; }
          .profile-settings-box { padding: 18px !important; max-width: 100% !important; }
          .profile-order-meta { flex-direction: column !important; gap: 8px !important; }
          .profile-order-meta > div:last-child { text-align: left !important; }
        }
      `}</style>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, disabled = false }) {
  return (
    <label style={{ display: 'grid', gap: '6px' }}>
      <span style={{ color: '#7A5C4E', fontWeight: 700, fontSize: '0.8rem' }}>{label}</span>
      <input value={value} onChange={e => onChange(e.target.value)} className="form-input" placeholder={placeholder} disabled={disabled}
        style={disabled ? { opacity: 0.7, cursor: 'not-allowed' } : {}} />
    </label>
  )
}

function Meta({ label, value }) {
  return (
    <div>
      <div style={{ color: '#9E7B6C', fontSize: '0.7rem' }}>{label}</div>
      <div style={{ color: '#1A0A05', fontWeight: 800, fontSize: '0.875rem' }}>{value}</div>
    </div>
  )
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
}

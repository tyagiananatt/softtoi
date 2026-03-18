import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Loader, LogOut, Mail, MapPin, Package, Phone, Save, Sparkles, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import api from '../utils/api'

const STATUS_COLORS = {
  pending: '#D97706',
  confirmed: '#2563EB',
  processing: '#7C3AED',
  shipped: '#0F766E',
  delivered: '#16A34A',
  cancelled: '#DC2626',
}

export default function Profile() {
  const { customerUser, updateCustomerProfile, customerLogout } = useAuth()
  const { addToast } = useToast()
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    avatar: '',
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
      .then(res => {
        if (active) setOrders(res.data)
      })
      .catch(() => {
        if (active) addToast('Could not load your orders right now', 'error')
      })
      .finally(() => {
        if (active) setLoadingOrders(false)
      })
    return () => { active = false }
  }, [addToast])

  const totalSpent = useMemo(() => orders.reduce((sum, order) => sum + (order.total || 0), 0), [orders])
  const latestOrder = orders[0]

  const setField = (key, value) => setForm(current => ({ ...current, [key]: value }))
  const setAddressField = (key, value) => setForm(current => ({
    ...current,
    defaultAddress: { ...current.defaultAddress, [key]: value },
  }))

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await updateCustomerProfile(form)
      addToast('Profile updated', 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not update your profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: 'linear-gradient(180deg, #FFF6EC 0%, #FFF9F5 52%, #fff 100%)' }}>
      <div className="page-container" style={{ padding: '40px 1.5rem 64px' }}>
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.96), rgba(253,232,240,0.72))', borderRadius: '30px', border: '1px solid rgba(248,200,220,0.32)', boxShadow: '0 18px 60px rgba(122,92,78,0.08)', padding: '30px', marginBottom: '24px' }}>
          <div className="profile-hero" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '84px', height: '84px', borderRadius: '28px', background: 'linear-gradient(135deg, #F8C8DC, #EED6C4)', display: 'grid', placeItems: 'center', overflow: 'hidden', boxShadow: '0 12px 28px rgba(196,69,105,0.18)' }}>
              {form.avatar ? <img src={form.avatar} alt={customerUser?.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserRound size={34} color="#7A5C4E" />}
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.82)', borderRadius: '999px', padding: '7px 12px', color: '#C44569', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '12px' }}>
                <Sparkles size={14} /> My Softtoi profile
              </div>
              <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', color: '#7A5C4E', fontWeight: 900, marginBottom: '6px' }}>{customerUser?.fullName}</h1>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', color: '#9E7B6C', fontSize: '0.9375rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Mail size={15} /> {customerUser?.email}</span>
                {customerUser?.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Phone size={15} /> {customerUser.phone}</span>}
              </div>
            </div>
            <button onClick={customerLogout} className="btn-secondary" style={{ justifyContent: 'center' }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          <div className="profile-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px', marginTop: '24px' }}>
            <StatCard label="Orders placed" value={String(orders.length)} icon={Package} />
            <StatCard label="Total spent" value={`₹${totalSpent.toLocaleString('en-IN')}`} icon={Heart} />
            <StatCard label="Latest status" value={latestOrder ? titleCase(latestOrder.status) : 'No orders'} icon={MapPin} />
          </div>
        </motion.section>

        <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '24px', alignItems: 'start' }}>
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} style={{ background: '#fff', borderRadius: '26px', padding: '28px', border: '1px solid rgba(248,200,220,0.28)', boxShadow: '0 14px 44px rgba(122,92,78,0.06)' }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#7A5C4E', marginBottom: '6px' }}>Account details</h2>
              <p style={{ color: '#9E7B6C', lineHeight: 1.7 }}>Keep your delivery details ready so checkout feels instant next time.</p>
            </div>

            <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px' }}>
              <Field label="Full Name" value={form.fullName} onChange={value => setField('fullName', value)} />
              <Field label="Email Address" value={customerUser?.email || ''} onChange={() => {}} disabled />
              <Field label="Phone Number" value={form.phone} onChange={value => setField('phone', value)} />
              <Field label="Avatar Image URL" value={form.avatar} onChange={value => setField('avatar', value)} placeholder="https://..." />

              <div style={{ marginTop: '10px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#7A5C4E', marginBottom: '12px' }}>Default delivery address</h3>
                <div className="profile-address-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Street Address" value={form.defaultAddress.address} onChange={value => setAddressField('address', value)} />
                  </div>
                  <Field label="City" value={form.defaultAddress.city} onChange={value => setAddressField('city', value)} />
                  <Field label="State" value={form.defaultAddress.state} onChange={value => setAddressField('state', value)} />
                  <Field label="PIN Code" value={form.defaultAddress.zipCode} onChange={value => setAddressField('zipCode', value)} />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={saving} style={{ justifyContent: 'center', marginTop: '6px' }}>
                {saving ? <><Loader size={16} className="animate-spin-slow" /> Saving...</> : <><Save size={16} /> Save changes</>}
              </button>
            </form>
          </motion.section>

          <motion.aside initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} style={{ display: 'grid', gap: '18px' }}>
            <div style={{ background: '#fff', borderRadius: '26px', padding: '24px', border: '1px solid rgba(248,200,220,0.28)', boxShadow: '0 14px 44px rgba(122,92,78,0.06)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#7A5C4E', marginBottom: '12px' }}>Quick actions</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                <Link to="/products" className="btn-secondary" style={{ justifyContent: 'center' }}>Continue Shopping</Link>
                <Link to="/orders" className="btn-secondary" style={{ justifyContent: 'center' }}>Open Orders Page</Link>
                <Link to="/wishlist" className="btn-secondary" style={{ justifyContent: 'center' }}>See Wishlist</Link>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '26px', padding: '24px', border: '1px solid rgba(248,200,220,0.28)', boxShadow: '0 14px 44px rgba(122,92,78,0.06)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#7A5C4E', marginBottom: '10px' }}>Recent orders</h3>
              {loadingOrders ? (
                <div className="skeleton" style={{ height: '120px', borderRadius: '16px' }} />
              ) : orders.length === 0 ? (
                <p style={{ color: '#9E7B6C', lineHeight: 1.7 }}>No orders yet. Once you place one, it will show up here automatically.</p>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {orders.slice(0, 3).map(order => (
                    <div key={order._id} style={{ borderRadius: '18px', background: '#FFF9F5', padding: '14px', border: '1px solid rgba(248,200,220,0.24)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 800, color: '#7A5C4E', fontSize: '0.95rem' }}>#{order.orderId}</div>
                          <div style={{ color: '#9E7B6C', fontSize: '0.8rem' }}>{formatDate(order.createdAt)}</div>
                        </div>
                        <span style={{ padding: '6px 10px', borderRadius: '999px', background: `${STATUS_COLORS[order.status] || '#C44569'}14`, color: STATUS_COLORS[order.status] || '#C44569', fontSize: '0.75rem', fontWeight: 800, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                          {order.status}
                        </span>
                      </div>
                      <div style={{ color: '#7A5C4E', fontWeight: 700 }}>₹{order.total?.toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        </div>

        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} style={{ background: '#fff', borderRadius: '26px', padding: '28px', border: '1px solid rgba(248,200,220,0.28)', boxShadow: '0 14px 44px rgba(122,92,78,0.06)', marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#7A5C4E', marginBottom: '6px' }}>Order history</h2>
              <p style={{ color: '#9E7B6C' }}>All your Softtoi orders in one place.</p>
            </div>
            <Link to="/orders" className="btn-secondary">Open full tracking page</Link>
          </div>

          {loadingOrders ? (
            <div style={{ display: 'grid', gap: '14px' }}>
              <div className="skeleton" style={{ height: '96px', borderRadius: '16px' }} />
              <div className="skeleton" style={{ height: '96px', borderRadius: '16px' }} />
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px 0', color: '#9E7B6C' }}>
              <Package size={44} color="#E8A0B8" style={{ margin: '0 auto 12px', display: 'block' }} />
              Your order list is empty for now.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '14px' }}>
              {orders.map(order => (
                <div key={order._id} style={{ borderRadius: '20px', border: '1px solid rgba(248,200,220,0.26)', padding: '18px', background: '#FFFDFC' }}>
                  <div className="profile-order-head" style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
                      <Meta label="Order" value={`#${order.orderId}`} />
                      <Meta label="Placed" value={formatDate(order.createdAt)} />
                      <Meta label="Items" value={`${order.items?.length || 0}`} />
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#9E7B6C', fontSize: '0.75rem' }}>Total</div>
                      <div style={{ color: '#7A5C4E', fontWeight: 900, fontSize: '1.05rem' }}>₹{order.total?.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <span style={{ padding: '7px 12px', borderRadius: '999px', background: `${STATUS_COLORS[order.status] || '#C44569'}14`, color: STATUS_COLORS[order.status] || '#C44569', fontSize: '0.78rem', fontWeight: 800, textTransform: 'capitalize' }}>
                      {order.status}
                    </span>
                    <span style={{ color: '#9E7B6C', fontSize: '0.875rem' }}>{order.shipping?.address}, {order.shipping?.city}</span>
                  </div>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {order.items?.map(item => (
                      <div key={`${order._id}-${item._id || item.name}`} style={{ display: 'flex', gap: '12px', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(238,214,196,0.44)' }}>
                        <img src={item.image} alt={item.name} style={{ width: '54px', height: '54px', borderRadius: '14px', objectFit: 'cover', background: '#FFF6EC' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: '#7A5C4E', fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</div>
                          <div style={{ color: '#9E7B6C', fontSize: '0.8rem' }}>Qty {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</div>
                        </div>
                        <div style={{ color: '#7A5C4E', fontWeight: 800 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.section>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .profile-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .profile-hero { grid-template-columns: 1fr !important; }
          .profile-stats { grid-template-columns: 1fr !important; }
          .profile-address-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, disabled = false }) {
  return (
    <label style={{ display: 'grid', gap: '8px' }}>
      <span style={{ color: '#7A5C4E', fontWeight: 700, fontSize: '0.8125rem' }}>{label}</span>
      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        className="form-input"
        placeholder={placeholder}
        disabled={disabled}
        style={disabled ? { opacity: 0.8, cursor: 'not-allowed' } : {}}
      />
    </label>
  )
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div style={{ background: '#fff', borderRadius: '20px', padding: '16px', border: '1px solid rgba(248,200,220,0.24)' }}>
      <div style={{ display: 'inline-grid', placeItems: 'center', width: '38px', height: '38px', borderRadius: '14px', background: '#FFF6EC', marginBottom: '12px' }}>
        <Icon size={18} color="#C44569" />
      </div>
      <div style={{ color: '#9E7B6C', fontSize: '0.8rem', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: '#7A5C4E', fontSize: '1.1rem', fontWeight: 900 }}>{value}</div>
    </div>
  )
}

function Meta({ label, value }) {
  return (
    <div>
      <div style={{ color: '#9E7B6C', fontSize: '0.75rem' }}>{label}</div>
      <div style={{ color: '#7A5C4E', fontWeight: 800, fontSize: '0.92rem' }}>{value}</div>
    </div>
  )
}

function titleCase(value) {
  return value.replace(/\b\w/g, char => char.toUpperCase())
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
}

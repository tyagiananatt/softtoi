import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, ChevronRight, Package } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import api from '../utils/api'

const STEPS = ['Shipping', 'Review', 'Payment']
const INDIAN_STATES = ['Andhra Pradesh','Assam','Bihar','Delhi','Goa','Gujarat','Haryana','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal']

const empty = { firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '', notes: '' }

export default function Checkout() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [placing, setPlacing] = useState(false)
  const [order, setOrder] = useState(null)
  const { items, subtotal, shippingCost, total, clearCart } = useCart()
  const { addToast } = useToast()
  const navigate = useNavigate()

  if (items.length === 0 && !order) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#FFF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Package size={56} color="#F8C8DC" style={{ margin: '0 auto 16px', display: 'block' }} />
          <h2 style={{ color: '#7A5C4E', marginBottom: '16px' }}>Your cart is empty</h2>
          <Link to="/products"><button className="btn-primary">Shop Now</button></Link>
        </div>
      </div>
    )
  }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) e.phone = '10-digit phone required'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.state) e.state = 'Required'
    if (!form.zipCode.trim() || !/^\d{6}$/.test(form.zipCode)) e.zipCode = '6-digit PIN required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (step === 0 && !validate()) return
    setStep(s => s + 1)
  }

  const handlePlace = async () => {
    setPlacing(true)
    try {
      const payload = {
        items: items.map(i => ({ product: i._id, name: i.name, image: i.imageUrl || i.image, price: i.price, quantity: i.quantity })),
        shipping: form, subtotal, shippingCost, total, paymentMethod: 'COD',
      }
      const res = await api.post('/orders', payload)
      setOrder(res.data)
      clearCart()
      setStep(3)
    } catch {
      addToast('Failed to place order. Please try again.', 'error')
    } finally {
      setPlacing(false)
    }
  }

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#FFF6EC' }}>
      <div className="page-container" style={{ padding: '40px 1.5rem 64px' }}>

        {/* Success */}
        {step === 3 ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', maxWidth: '480px', margin: '40px auto', background: '#fff', borderRadius: '24px', padding: '48px 32px', boxShadow: '0 4px 24px rgba(122,92,78,0.08)' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
              <CheckCircle size={72} color="#16a34a" style={{ margin: '0 auto 24px', display: 'block' }} />
            </motion.div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#7A5C4E', marginBottom: '8px' }}>Order Placed Successfully!</h2>
            <p style={{ color: '#9E7B6C', marginBottom: '16px' }}>Thank you for shopping with Softtoi ❤️</p>
            <div style={{ background: '#FFF6EC', borderRadius: '12px', padding: '16px', marginBottom: '28px' }}>
              <div style={{ fontSize: '0.8125rem', color: '#9E7B6C' }}>Order ID</div>
              <div style={{ fontWeight: 800, color: '#7A5C4E', fontSize: '1.1rem', marginBottom: '8px' }}>{order?.orderId}</div>
              <div style={{ fontWeight: 700, color: '#7A5C4E', fontSize: '1.25rem' }}>₹{order?.total?.toLocaleString('en-IN')}</div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/orders"><button className="btn-primary">View Orders</button></Link>
              <Link to="/products"><button className="btn-secondary">Continue Shopping</button></Link>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Steps */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.875rem',
                      background: i <= step ? 'linear-gradient(135deg, #F8C8DC, #EED6C4)' : '#EED6C4',
                      color: '#7A5C4E',
                    }}>{i < step ? <CheckCircle size={16} /> : i + 1}</div>
                    <span style={{ fontSize: '0.875rem', fontWeight: i === step ? 700 : 500, color: i <= step ? '#7A5C4E' : '#C4A696' }}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && <ChevronRight size={16} color="#C4A696" />}
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '28px', alignItems: 'start' }}>

              {/* Main */}
              <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid rgba(248,200,220,0.2)' }}>
                {step === 0 && (
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7A5C4E', marginBottom: '24px' }}>Shipping Information</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <F label="First Name" v={form.firstName} onChange={v => set('firstName', v)} err={errors.firstName} />
                      <F label="Last Name" v={form.lastName} onChange={v => set('lastName', v)} err={errors.lastName} />
                      <F label="Email" type="email" v={form.email} onChange={v => set('email', v)} err={errors.email} />
                      <F label="Phone" type="tel" v={form.phone} onChange={v => set('phone', v)} err={errors.phone} />
                      <div style={{ gridColumn: '1/-1' }}>
                        <F label="Address" v={form.address} onChange={v => set('address', v)} err={errors.address} />
                      </div>
                      <F label="City" v={form.city} onChange={v => set('city', v)} err={errors.city} />
                      <div>
                        <label className="form-label">State</label>
                        <select value={form.state} onChange={e => set('state', e.target.value)} className="form-input" style={{ appearance: 'auto' }}>
                          <option value="">Select State</option>
                          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {errors.state && <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>{errors.state}</span>}
                      </div>
                      <F label="PIN Code" v={form.zipCode} onChange={v => set('zipCode', v)} err={errors.zipCode} />
                      <div style={{ gridColumn: '1/-1' }}>
                        <label className="form-label">Order Notes (Optional)</label>
                        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} className="form-input" rows={3} placeholder="Any special instructions..." style={{ resize: 'vertical' }} />
                      </div>
                    </div>
                    <button onClick={handleNext} className="btn-primary" style={{ marginTop: '24px', minWidth: '160px' }}>Next: Review</button>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7A5C4E', marginBottom: '24px' }}>Review Your Order</h2>
                    <div style={{ background: '#FFF6EC', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                      <div style={{ fontWeight: 700, color: '#7A5C4E', marginBottom: '10px', fontSize: '0.9375rem' }}>Shipping to</div>
                      <div style={{ fontSize: '0.875rem', color: '#9E7B6C', lineHeight: 1.8 }}>
                        {form.firstName} {form.lastName}<br />
                        {form.address}, {form.city}, {form.state} - {form.zipCode}<br />
                        {form.email} | {form.phone}
                      </div>
                    </div>
                    {items.map(item => (
                      <div key={item._id} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(238,214,196,0.4)' }}>
                        <img src={item.imageUrl || item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: '#7A5C4E', fontSize: '0.875rem' }}>{item.name}</div>
                          <div style={{ color: '#9E7B6C', fontSize: '0.75rem' }}>Qty: {item.quantity}</div>
                        </div>
                        <div style={{ fontWeight: 700, color: '#7A5C4E' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                      <button onClick={() => setStep(0)} className="btn-secondary">← Back</button>
                      <button onClick={() => setStep(2)} className="btn-primary">Place Order →</button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7A5C4E', marginBottom: '24px' }}>Payment Method</h2>
                    <label style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#FFF6EC', borderRadius: '16px', padding: '20px', border: '2px solid #F8C8DC', cursor: 'pointer' }}>
                      <input type="radio" checked readOnly style={{ marginTop: '2px' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: '#7A5C4E', marginBottom: '4px' }}>Cash on Delivery (COD)</div>
                        <div style={{ fontSize: '0.8125rem', color: '#9E7B6C', lineHeight: 1.6 }}>
                          Pay in cash when your order arrives at your doorstep. No online payment required. Safe and convenient.
                        </div>
                      </div>
                    </label>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                      <button onClick={() => setStep(1)} className="btn-secondary">← Back</button>
                      <button onClick={handlePlace} disabled={placing} className="btn-primary">
                        {placing ? <><span className="animate-spin-slow" style={{ display: 'inline-block', marginRight: '4px' }}>⟳</span> Placing...</> : '✓ Confirm & Place Order'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid rgba(248,200,220,0.2)', position: 'sticky', top: '90px' }}>
                <h3 style={{ fontWeight: 800, color: '#7A5C4E', marginBottom: '16px' }}>Your Order</h3>
                {items.map(item => (
                  <div key={item._id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                    <img src={item.imageUrl || item.image} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#7A5C4E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9E7B6C' }}>× {item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#7A5C4E' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                  </div>
                ))}
                <div style={{ borderTop: '1px dashed rgba(238,214,196,0.8)', paddingTop: '12px', marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.875rem', color: '#9E7B6C' }}>
                    <span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.875rem', color: '#9E7B6C' }}>
                    <span>Shipping</span><span style={{ color: shippingCost === 0 ? '#16a34a' : '#7A5C4E' }}>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#7A5C4E', fontSize: '1.05rem' }}>
                    <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <style>{`@media(max-width:768px){div[style*="grid-template-columns: minmax"]{grid-template-columns:1fr !important;} div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr !important;}}`}</style>
    </div>
  )
}

function F({ label, v, onChange, err, type = 'text' }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <input type={type} value={v} onChange={e => onChange(e.target.value)} className="form-input" style={err ? { borderColor: '#fca5a5' } : {}} />
      {err && <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>{err}</span>}
    </div>
  )
}

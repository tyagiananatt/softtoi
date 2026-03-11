import { useState, useEffect } from 'react'
import { Package, ChevronDown, ChevronUp } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import api from '../utils/api'

const STATUS_COLORS = {
  pending: 'status-pending',
  confirmed: 'status-confirmed',
  processing: 'status-processing',
  shipped: 'status-shipped',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [searched, setSearched] = useState(false)
  const [expanded, setExpanded] = useState(null)

  const fetchOrders = (e) => {
    e?.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    api.get(`/orders?email=${encodeURIComponent(email.trim())}`)
      .then(res => { setOrders(res.data); setSearched(true) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const fmt = (d) => new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d))

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#FFF6EC' }}>
      <div className="page-container" style={{ padding: '48px 1.5rem 64px', maxWidth: '960px' }}>
        <AnimatedSection>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <Package size={28} color="#E8A0B8" />
            <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 900, color: '#7A5C4E' }}>My Orders</h1>
          </div>
        </AnimatedSection>

        {/* Email search */}
        <AnimatedSection>
          <form onSubmit={fetchOrders} style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '28px', border: '1px solid rgba(248,200,220,0.2)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email to find your orders..."
              className="form-input" style={{ flex: '1 1 260px' }}
              required
            />
            <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }}>
              <Package size={16} /> Find Orders
            </button>
          </form>
        </AnimatedSection>

        {!searched ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9E7B6C' }}>
            <Package size={56} color="#E8A0B8" style={{ margin: '0 auto 16px', display: 'block' }} />
            <p style={{ fontSize: '1rem' }}>Enter your email above to track your orders</p>
          </div>
        ) : loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '16px' }} />)}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9E7B6C' }}>
            <Package size={56} color="#E8A0B8" style={{ margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ fontWeight: 700, color: '#7A5C4E', marginBottom: '8px' }}>No orders found</h3>
            <p>We couldn't find any orders for this email address.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order, i) => (
              <AnimatedSection key={order._id} delay={i * 0.07}>
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(248,200,220,0.2)', overflow: 'hidden' }}>
                  {/* Header */}
                  <div
                    onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                    style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}
                  >
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#9E7B6C' }}>Order ID</div>
                        <div style={{ fontWeight: 800, color: '#7A5C4E', fontSize: '0.9375rem' }}>{order.orderId}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#9E7B6C' }}>Date</div>
                        <div style={{ fontWeight: 600, color: '#7A5C4E', fontSize: '0.875rem' }}>{fmt(order.createdAt)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#9E7B6C' }}>Total</div>
                        <div style={{ fontWeight: 800, color: '#7A5C4E' }}>₹{order.total?.toLocaleString('en-IN')}</div>
                      </div>
                      <div>
                        <span className={`badge ${STATUS_COLORS[order.status]}`} style={{ textTransform: 'capitalize', fontWeight: 700, fontSize: '0.75rem' }}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div style={{ color: '#9E7B6C' }}>
                      {expanded === order._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {/* Expanded */}
                  {expanded === order._id && (
                    <div style={{ padding: '0 24px 24px', borderTop: '1px solid rgba(238,214,196,0.4)' }}>
                      {/* Items */}
                      <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                        {order.items?.map((item, j) => (
                          <div key={j} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(238,214,196,0.3)' }}>
                            <img src={item.imageUrl || item.image} alt={item.name} style={{ width: '52px', height: '52px', borderRadius: '10px', objectFit: 'cover' }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, color: '#7A5C4E', fontSize: '0.875rem' }}>{item.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#9E7B6C' }}>Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</div>
                            </div>
                            <div style={{ fontWeight: 700, color: '#7A5C4E', fontSize: '0.875rem' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                          </div>
                        ))}
                      </div>
                      {/* Shipping */}
                      {order.shipping && (
                        <div style={{ background: '#FFF6EC', borderRadius: '12px', padding: '12px 16px', fontSize: '0.8125rem', color: '#9E7B6C' }}>
                          <div style={{ fontWeight: 700, color: '#7A5C4E', marginBottom: '4px' }}>Delivering to:</div>
                          {order.shipping.firstName} {order.shipping.lastName}, {order.shipping.address}, {order.shipping.city}, {order.shipping.state} - {order.shipping.zipCode}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

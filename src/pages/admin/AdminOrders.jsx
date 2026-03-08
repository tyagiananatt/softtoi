import { useState, useEffect } from 'react'
import { Search, Eye, X, ChevronDown } from 'lucide-react'
import { AdminLayout } from './Dashboard'
import { useToast } from '../../context/ToastContext'
import api from '../../utils/api'

const STATUS_COLORS = { pending: 'status-pending', confirmed: 'status-confirmed', processing: 'status-processing', shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled' }
const ALL_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const { addToast } = useToast()

  const fetchOrders = () => {
    setLoading(true)
    const p = new URLSearchParams({ all: 'true' })
    if (search) p.set('search', search)
    if (statusFilter !== 'all') p.set('status', statusFilter)
    api.get(`/orders?${p}`).then(r => setOrders(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [search, statusFilter])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status })
      addToast('Status updated', 'success')
      fetchOrders()
      if (selected?._id === id) setSelected(o => ({ ...o, status }))
    } catch { addToast('Update failed', 'error') }
  }

  const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <AdminLayout title="Orders">
      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={15} color="#C4A696" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID, name, email…" className="form-input" style={{ paddingLeft: '36px' }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-input" style={{ width: 'auto', textTransform: 'capitalize' }}>
          <option value="all">All Statuses</option>
          {ALL_STATUSES.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(248,200,220,0.2)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FFF6EC', borderBottom: '1px solid rgba(238,214,196,0.5)' }}>
                {['Order', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#9E7B6C', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={7} style={{ padding: '12px 16px' }}><div className="skeleton" style={{ height: '40px', borderRadius: '8px' }} /></td></tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#9E7B6C' }}>No orders found</td></tr>
              ) : orders.map(o => (
                <tr key={o._id} style={{ borderBottom: '1px solid rgba(238,214,196,0.3)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FFFBF8'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#7A5C4E', fontSize: '0.8rem', fontFamily: 'monospace' }}>#{o.orderId}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#7A5C4E', fontSize: '0.875rem' }}>{o.shipping?.firstName} {o.shipping?.lastName}</div>
                    <div style={{ color: '#9E7B6C', fontSize: '0.75rem' }}>{o.shipping?.email}</div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#9E7B6C', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{fmt(o.createdAt)}</td>
                  <td style={{ padding: '12px 16px', color: '#7A5C4E', fontSize: '0.875rem', fontWeight: 600 }}>{o.items?.length}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#7A5C4E', fontSize: '0.875rem' }}>₹{o.total?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <StatusSelect value={o.status} onChange={s => updateStatus(o._id, s)} />
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => setSelected(o)} style={{ width: '34px', height: '34px', border: '1.5px solid #EED6C4', borderRadius: '8px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9E7B6C' }}><Eye size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(122,92,78,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={e => e.target === e.currentTarget && setSelected(null)}
        >
          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontWeight: 800, color: '#7A5C4E' }}>Order #{selected.orderId}</h2>
                <p style={{ color: '#9E7B6C', fontSize: '0.8rem' }}>{fmt(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9E7B6C' }}><X size={20} /></button>
            </div>

            {/* Status update */}
            <div style={{ background: '#FFF6EC', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9E7B6C', textTransform: 'uppercase', marginBottom: '8px' }}>Status</div>
              <StatusSelect value={selected.status} onChange={s => updateStatus(selected._id, s)} />
            </div>

            {/* Items */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9E7B6C', textTransform: 'uppercase', marginBottom: '12px' }}>Items</div>
              {selected.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #FDE8F0' }}>
                  <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', background: '#FFF6EC' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#7A5C4E', fontSize: '0.875rem' }}>{item.name}</div>
                    <div style={{ color: '#9E7B6C', fontSize: '0.75rem' }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#7A5C4E' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>

            {/* Shipping */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9E7B6C', textTransform: 'uppercase', marginBottom: '12px' }}>Shipping Address</div>
              <div style={{ background: '#FFF6EC', borderRadius: '12px', padding: '16px', fontSize: '0.875rem', color: '#7A5C4E', lineHeight: 1.7 }}>
                <div style={{ fontWeight: 700 }}>{selected.shipping?.firstName} {selected.shipping?.lastName}</div>
                <div>{selected.shipping?.phone}</div>
                <div>{selected.shipping?.address}</div>
                <div>{selected.shipping?.city}, {selected.shipping?.state} {selected.shipping?.zipCode}</div>
              </div>
            </div>

            {/* Totals */}
            <div style={{ background: 'linear-gradient(135deg, #FDE8F0, #FFF6EC)', borderRadius: '12px', padding: '16px' }}>
              <Row k="Subtotal" v={`₹${selected.subtotal?.toLocaleString('en-IN')}`} />
              <Row k="Shipping" v={selected.shippingCost === 0 ? 'Free' : `₹${selected.shippingCost}`} />
              <div style={{ borderTop: '1px solid #F8C8DC', marginTop: '8px', paddingTop: '8px' }}>
                <Row k="Total" v={`₹${selected.total?.toLocaleString('en-IN')}`} bold />
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

function StatusSelect({ value, onChange }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={STATUS_COLORS[value]}
      style={{ border: 'none', borderRadius: '50px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize' }}
    >
      {ALL_STATUSES.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
    </select>
  )
}

function Row({ k, v, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: bold ? '#7A5C4E' : '#9E7B6C', fontWeight: bold ? 800 : 500, fontSize: bold ? '1rem' : '0.875rem' }}>
      <span>{k}</span><span>{v}</span>
    </div>
  )
}

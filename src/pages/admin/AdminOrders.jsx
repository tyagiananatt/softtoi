import { useState, useEffect } from 'react'
import { Search, Eye, X, Trash2 } from 'lucide-react'
import { AdminLayout } from './Dashboard'
import { useToast } from '../../context/ToastContext'
import api, { adminRequestConfig } from '../../utils/api'

const STATUS_COLORS = { pending: 'status-pending', confirmed: 'status-confirmed', processing: 'status-processing', shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled' }
const ALL_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const { addToast } = useToast()

  const fetchOrders = () => {
    setLoading(true)
    const p = new URLSearchParams({ all: 'true' })
    if (search) p.set('search', search)
    if (statusFilter !== 'all') p.set('status', statusFilter)
    api.get(`/orders?${p}`, adminRequestConfig).then(r => setOrders(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [search, statusFilter])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status }, adminRequestConfig)
      addToast('Status updated', 'success')
      fetchOrders()
      if (selected?._id === id) setSelected(o => ({ ...o, status }))
    } catch { addToast('Update failed', 'error') }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/orders/${deleteId}`, adminRequestConfig)
      addToast('Order deleted', 'info')
      setDeleteId(null)
      if (selected?._id === deleteId) setSelected(null)
      fetchOrders()
    } catch { addToast('Failed to delete order', 'error') }
  }

  const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <AdminLayout title="Orders">
      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 160px', minWidth: 0 }}>
          <Search size={15} color="#C4A696" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="form-input" style={{ paddingLeft: '36px' }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-input" style={{ width: 'auto', textTransform: 'capitalize', flex: '0 0 auto' }}>
          <option value="all">All</option>
          {ALL_STATUSES.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Desktop Table */}
      <div className="admin-desktop-only" style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(248,200,220,0.2)', overflow: 'hidden' }}>
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
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => setSelected(o)} style={{ width: '34px', height: '34px', border: '1.5px solid #EED6C4', borderRadius: '8px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9E7B6C' }}><Eye size={14} /></button>
                      <button onClick={() => setDeleteId(o._id)} style={{ width: '34px', height: '34px', border: '1.5px solid #fca5a5', borderRadius: '8px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="admin-mobile-only" style={{ display: 'none', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '90px', borderRadius: '14px' }} />)
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9E7B6C', background: '#fff', borderRadius: '14px' }}>No orders found</div>
        ) : orders.map(o => (
          <div key={o._id} style={{ background: '#fff', borderRadius: '14px', padding: '14px', border: '1px solid rgba(248,200,220,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: '#7A5C4E', fontSize: '0.8rem', fontFamily: 'monospace' }}>#{o.orderId}</div>
                <div style={{ fontWeight: 600, color: '#7A5C4E', fontSize: '0.8125rem', marginTop: '2px' }}>{o.shipping?.firstName} {o.shipping?.lastName}</div>
                <div style={{ color: '#9E7B6C', fontSize: '0.72rem' }}>{fmt(o.createdAt)} · {o.items?.length} item(s)</div>
              </div>
              <div style={{ fontWeight: 800, color: '#7A5C4E', fontSize: '1rem', flexShrink: 0 }}>₹{o.total?.toLocaleString('en-IN')}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <StatusSelect value={o.status} onChange={s => updateStatus(o._id, s)} />
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => setSelected(o)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', border: '1.5px solid #EED6C4', borderRadius: '8px', background: 'none', cursor: 'pointer', color: '#9E7B6C', fontSize: '0.75rem', fontWeight: 600 }}><Eye size={13} /> View</button>
                <button onClick={() => setDeleteId(o._id)} style={{ width: '34px', height: '34px', border: '1.5px solid #fca5a5', borderRadius: '8px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(122,92,78,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}
          onClick={e => e.target === e.currentTarget && setSelected(null)}
        >
          <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
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
                  <img src={item.imageUrl || item.image} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', background: '#FFF6EC' }} />
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
      {/* Delete confirmation */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(122,92,78,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', maxWidth: '360px', width: '100%', textAlign: 'center' }}>
            <Trash2 size={40} color="#dc2626" style={{ margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ fontWeight: 800, color: '#7A5C4E', marginBottom: '8px' }}>Delete Order?</h3>
            <p style={{ color: '#9E7B6C', marginBottom: '6px', fontSize: '0.875rem' }}>This will permanently remove the order and all its data.</p>
            <p style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.8rem', marginBottom: '24px' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleDelete} style={{ background: '#dc2626', color: '#fff', padding: '12px 24px', borderRadius: '50px', fontWeight: 600, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>Yes, Delete</button>
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

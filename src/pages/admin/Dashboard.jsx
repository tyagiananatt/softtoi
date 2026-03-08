import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IndianRupee, ShoppingBag, Package, Clock, LogOut, LayoutDashboard, List, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

const STATUS_COLORS = { pending: 'status-pending', confirmed: 'status-confirmed', processing: 'status-processing', shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled' }

function AdminLayout({ children, title }) {
  const { logout, adminUser } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/admin/login') }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF6EC', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <header style={{ background: '#fff', borderBottom: '1px solid rgba(248,200,220,0.3)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 10px rgba(122,92,78,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#F8C8DC,#EED6C4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#7A5C4E', fontSize: '0.875rem' }}>S</div>
            <span style={{ fontWeight: 800, color: '#7A5C4E' }}>SOFT<span style={{ color: '#E8A0B8' }}>toi</span> <span style={{ color: '#9E7B6C', fontWeight: 500, fontSize: '0.875rem' }}>Admin</span></span>
          </Link>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[{ label: 'Dashboard', to: '/admin', icon: LayoutDashboard }, { label: 'Products', to: '/admin/products', icon: Package }, { label: 'Orders', to: '/admin/orders', icon: List }].map(n => (
              <Link key={n.to} to={n.to} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '10px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, color: '#7A5C4E', background: window.location.pathname === n.to ? 'rgba(248,200,220,0.25)' : 'transparent', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,200,220,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = window.location.pathname === n.to ? 'rgba(248,200,220,0.25)' : 'transparent'}
              >
                <n.icon size={15} /> {n.label}
              </Link>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.8125rem', color: '#9E7B6C' }}>Hi, {adminUser?.username || 'Admin'}</span>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', background: 'none', border: '1.5px solid #EED6C4', color: '#9E7B6C', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>
      <main style={{ flex: 1, padding: '32px 24px' }}>
        {title && <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#7A5C4E', marginBottom: '28px' }}>{title}</h1>}
        {children}
      </main>
    </div>
  )
}

export { AdminLayout }

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const fmt = (d) => new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(d))

  const STAT_CARDS = stats ? [
    { icon: IndianRupee, label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, color: '#F8C8DC' },
    { icon: ShoppingBag, label: 'Total Orders', value: stats.totalOrders, color: '#EED6C4' },
    { icon: Package, label: 'Products', value: stats.totalProducts, color: '#FDE8F0' },
    { icon: Clock, label: 'Pending Orders', value: stats.pendingOrders, color: '#F0E8DC' },
  ] : []

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '16px' }} />)}
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {STAT_CARDS.map(s => (
              <div key={s.label} style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid rgba(248,200,220,0.2)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '13px', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <s.icon size={22} color="#7A5C4E" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9E7B6C', marginBottom: '4px' }}>{s.label}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.375rem', color: '#7A5C4E' }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Recent orders */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid rgba(248,200,220,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontWeight: 800, color: '#7A5C4E', fontSize: '1rem' }}>Recent Orders</h2>
                <Link to="/admin/orders" style={{ fontSize: '0.8125rem', color: '#E8A0B8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>View all <ChevronRight size={14} /></Link>
              </div>
              {stats?.recentOrders?.map(o => (
                <div key={o._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(238,214,196,0.4)', gap: '12px' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: '#7A5C4E', fontSize: '0.8125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.orderId}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9E7B6C' }}>{fmt(o.createdAt)} · {o.items?.length} item(s)</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span style={{ fontWeight: 700, color: '#7A5C4E', fontSize: '0.875rem' }}>₹{o.total?.toLocaleString('en-IN')}</span>
                    <span className={`badge ${STATUS_COLORS[o.status]}`} style={{ fontSize: '0.65rem', textTransform: 'capitalize' }}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick stats */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid rgba(248,200,220,0.2)' }}>
              <h2 style={{ fontWeight: 800, color: '#7A5C4E', fontSize: '1rem', marginBottom: '20px' }}>Quick Overview</h2>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: 700, color: '#7A5C4E', fontSize: '0.875rem', marginBottom: '12px' }}>Orders by Status</div>
                {stats?.statusBreakdown && Object.entries(stats.statusBreakdown).map(([status, count]) => (
                  <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.8125rem' }}>
                    <span className={`badge ${STATUS_COLORS[status]}`} style={{ textTransform: 'capitalize', fontSize: '0.7rem' }}>{status}</span>
                    <span style={{ fontWeight: 700, color: '#7A5C4E' }}>{count}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#7A5C4E', fontSize: '0.875rem', marginBottom: '12px' }}>Products by Category</div>
                {stats?.categoryBreakdown && Object.entries(stats.categoryBreakdown).map(([cat, count]) => (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px', color: '#9E7B6C' }}>
                    <span style={{ textTransform: 'capitalize' }}>{cat.replace('-', ' ')}</span>
                    <span style={{ fontWeight: 700, color: '#7A5C4E' }}>{count}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(248,200,220,0.15)', textDecoration: 'none', color: '#7A5C4E', fontSize: '0.8125rem', fontWeight: 600 }}>
                  <Package size={14} /> Manage Products
                </Link>
                <Link to="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(248,200,220,0.1)', textDecoration: 'none', color: '#7A5C4E', fontSize: '0.8125rem', fontWeight: 600 }}>
                  <List size={14} /> View All Orders
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}

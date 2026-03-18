import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'Keychains', to: '/products?category=keychains' },
  { label: 'Soft Toys', to: '/products?category=soft-toys' },
  { label: 'Flowers', to: '/products?category=flowers' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const { itemCount } = useCart()
  const { items: wishItems } = useWishlist()
  const { isCustomerAuth } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const fullPath = location.pathname + location.search
  const accountPath = isCustomerAuth ? '/profile' : '/login'

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/'
    if (to.includes('?')) return fullPath === to || fullPath.startsWith(to)
    return location.pathname === to
  }

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname, location.search])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQ.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQ.trim())}`)
      setSearchOpen(false)
      setSearchQ('')
    }
  }

  return (
    <>
      <nav className="navbar-shell" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        transition: 'background 0.35s, box-shadow 0.35s, border-color 0.35s',
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        boxShadow: scrolled ? '0 1px 0 rgba(196,69,105,0.1), 0 4px 24px rgba(26,10,5,0.06)' : 'none',
      }}>
        <div className="page-container navbar-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', gap: '12px', width: '100%', minWidth: 0 }}>

          {/* Logo */}
          <Link to="/" className="navbar-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <span
              className="navbar-logo-circle"
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'inline-block',
                border: '2px solid rgba(248,200,220,0.55)',
                boxShadow: '0 8px 20px rgba(196,69,105,0.14)',
                background: '#fff',
              }}
            >
              <img
                src="/logo.jpeg"
                alt="SoftToi"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </span>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }} className="hide-mobile">
            {LINKS.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding: '8px 14px', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 500,
                color: isActive(l.to) ? '#C44569' : '#4A2E20',
                textDecoration: 'none', transition: 'all 0.2s',
                background: isActive(l.to) ? 'rgba(196,69,105,0.08)' : 'transparent',
                whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,69,105,0.07)'; e.currentTarget.style.color = '#C44569' }}
                onMouseLeave={e => { e.currentTarget.style.background = isActive(l.to) ? 'rgba(196,69,105,0.08)' : 'transparent'; e.currentTarget.style.color = isActive(l.to) ? '#C44569' : '#4A2E20' }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, minWidth: 0, marginLeft: 'auto' }}>
            <Link to="/" className="show-mobile" style={{ textDecoration: 'none' }}>
              <IconBtn label="Home" as="div">
                <Home size={19} />
              </IconBtn>
            </Link>
            <IconBtn label="Search" onClick={() => setSearchOpen(true)}>
              <Search size={20} />
            </IconBtn>
            <Link to="/wishlist" style={{ position: 'relative', textDecoration: 'none' }}>
              <IconBtn label="Wishlist" as="div">
                <Heart size={20} />
                {wishItems.length > 0 && <Badge count={wishItems.length} />}
              </IconBtn>
            </Link>
            <Link to="/cart" style={{ position: 'relative', textDecoration: 'none' }}>
              <IconBtn label="Cart" as="div">
                <ShoppingBag size={20} />
                {itemCount > 0 && <Badge count={itemCount} animate />}
              </IconBtn>
            </Link>
            <Link to={accountPath} style={{ textDecoration: 'none' }}>
              <IconBtn label="Admin" as="div">
                <User size={20} />
              </IconBtn>
            </Link>
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="show-mobile"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '10px', color: '#7A5C4E',
              }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(16px)',
                borderTop: '1px solid rgba(248,200,220,0.3)',
                padding: '16px',
              }}
              className="navbar-mobile-panel"
            >
              {LINKS.map(l => (
                <Link key={l.to} to={l.to} style={{
                  display: 'block', padding: '12px 16px', borderRadius: '12px',
                  fontSize: '0.9375rem', fontWeight: 500, color: '#7A5C4E',
                  textDecoration: 'none', marginBottom: '4px',
                  background: location.pathname === l.to ? 'rgba(248,200,220,0.2)' : 'transparent',
                }}>
                  {l.label}
                </Link>
              ))}
              <div className="navbar-mobile-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', padding: '8px 0 4px' }}>
                <Link to={accountPath} style={{ minWidth: 0 }}>
                  <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '12px 14px' }}>
                    <User size={16} /> {isCustomerAuth ? 'Profile' : 'Login'}
                  </button>
                </Link>
                <Link to="/wishlist" style={{ minWidth: 0 }}>
                  <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    <Heart size={16} /> Wishlist
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              background: 'rgba(122,92,78,0.4)', backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '20vh',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: -10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -10 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '560px', padding: '0 16px' }}
            >
              <form onSubmit={handleSearch} style={{
                background: '#fff', borderRadius: '16px', padding: '8px',
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 20px 60px rgba(122,92,78,0.2)',
              }}>
                <Search size={20} color="#C4A696" style={{ marginLeft: '12px', flexShrink: 0 }} />
                <input
                  autoFocus
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search keychains, soft toys, flowers..."
                  style={{
                    flex: 1, border: 'none', outline: 'none', fontSize: '1rem',
                    color: '#7A5C4E', background: 'transparent', padding: '10px 0',
                    fontFamily: 'inherit',
                  }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }}>Search</button>
                <button type="button" onClick={() => setSearchOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9E7B6C', padding: '8px', borderRadius: '8px' }}>
                  <X size={20} />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </>
  )
}

function IconBtn({ children, onClick, label, as = 'button' }) {
  const style = {
    width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '10px', color: '#7A5C4E', transition: 'background 0.2s', position: 'relative',
    cursor: 'pointer', background: 'transparent', border: 'none',
  }
  if (as === 'div') return (
    <div className="icon-btn" style={style} aria-label={label}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,200,220,0.2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >{children}</div>
  )
  return (
    <button className="icon-btn" style={style} onClick={onClick} aria-label={label}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,200,220,0.2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >{children}</button>
  )
}

function Badge({ count, animate }) {
  return (
    <motion.div
      key={count}
      initial={animate ? { scale: 1.4 } : {}}
      animate={{ scale: 1 }}
      style={{
        position: 'absolute', top: '-2px', right: '-2px',
        background: 'linear-gradient(135deg, #E8A0B8, #F8C8DC)',
        color: '#fff', borderRadius: '50%',
        width: '18px', height: '18px', fontSize: '0.6rem', fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '2px solid #fff', lineHeight: 1,
      }}
    >
      {count >= 10 ? '9+' : count}
    </motion.div>
  )
}

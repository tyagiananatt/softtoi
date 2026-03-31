import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Trash2, Plus, Minus, Truck, Tag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import AnimatedSection from '../components/AnimatedSection'

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, shippingCost, total } = useCart()
  const { addToast } = useToast()

  const handleRemove = (id, name) => {
    removeFromCart(id)
    addToast(`${name} removed from cart`, 'info')
  }

  if (items.length === 0) return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#FFF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <ShoppingBag size={64} color="#F8C8DC" style={{ margin: '0 auto 20px', display: 'block' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7A5C4E', marginBottom: '8px' }}>Your cart is empty</h2>
        <p style={{ color: '#9E7B6C', marginBottom: '24px' }}>Looks like you haven't added anything yet.</p>
        <Link to="/products"><button className="btn-primary"><ShoppingBag size={16} /> Shop Now</button></Link>
      </div>
    </div>
  )

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#FFF6EC' }}>
      <div className="page-container" style={{ padding: '40px 1.5rem 64px' }}>
        <AnimatedSection>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
            <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 900, color: '#7A5C4E' }}>
              Shopping Cart <span style={{ fontSize: '1rem', fontWeight: 500, color: '#9E7B6C' }}>({items.length} items)</span>
            </h1>
            <button onClick={clearCart} style={{ background: 'none', border: '1.5px solid #EED6C4', borderRadius: '50px', padding: '8px 16px', fontSize: '0.8rem', color: '#9E7B6C', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trash2 size={14} /> Clear Cart
            </button>
          </div>
        </AnimatedSection>

        <div className="cart-grid">

          {/* Items list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AnimatePresence>
              {items.map(item => (
                <motion.div key={item._id}
                  layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="cart-item"
                >
                  <Link to={`/products/${item._id}`} style={{ flexShrink: 0 }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', background: '#FFF6EC' }}>
                      <img src={item.imageUrl || item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/products/${item._id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ fontWeight: 700, color: '#7A5C4E', fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    </Link>
                    <div style={{ fontSize: '0.75rem', color: '#E8A0B8', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>{item.category.replace('-', ' ')}</div>
                    <div style={{ fontWeight: 700, color: '#9E7B6C', fontSize: '0.875rem' }}>₹{item.price.toLocaleString('en-IN')} each</div>
                  </div>
                  <div className="cart-item-controls">
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #EED6C4', borderRadius: '50px' }}>
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ width: '34px', height: '34px', border: 'none', background: 'none', cursor: 'pointer', color: '#7A5C4E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={13} /></button>
                      <span style={{ padding: '0 10px', fontWeight: 700, color: '#7A5C4E', minWidth: '28px', textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ width: '34px', height: '34px', border: 'none', background: 'none', cursor: 'pointer', color: '#7A5C4E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={13} /></button>
                    </div>
                    <div style={{ fontWeight: 800, color: '#7A5C4E', whiteSpace: 'nowrap', minWidth: '64px', textAlign: 'right' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                    <button onClick={() => handleRemove(item._id, item.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4A696', padding: '6px', borderRadius: '8px', display: 'flex', transition: 'color 0.2s', flexShrink: 0 }}
                      onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
                      onMouseLeave={e => e.currentTarget.style.color = '#C4A696'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <AnimatedSection direction="right">
            <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid rgba(248,200,220,0.2)', position: 'sticky', top: '90px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#7A5C4E', marginBottom: '20px' }}>Order Summary</h2>

              {/* Shipping info */}
              {shippingCost > 0 && (
                <div style={{ marginBottom: '20px', background: 'rgba(248,200,220,0.1)', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#9E7B6C', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Truck size={14} color="#E8A0B8" />
                    ₹19 delivery charge applies · <span style={{ color: '#16a34a', fontWeight: 600 }}>Free inside LPU campus</span>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <Row label="Subtotal" value={`₹${subtotal.toLocaleString('en-IN')}`} />
                <Row label="Shipping" value={shippingCost === 0 ? 'FREE 🎉' : `₹${shippingCost}`} highlight={shippingCost === 0} />
                <div style={{ borderTop: '1px solid rgba(238,214,196,0.5)', paddingTop: '12px' }}>
                  <Row label="Total" value={`₹${total.toLocaleString('en-IN')}`} bold />
                </div>
              </div>

              {/* COD */}
              <div style={{ background: '#DCFCE7', borderRadius: '10px', padding: '10px 12px', marginBottom: '16px', fontSize: '0.8125rem', color: '#15803d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={14} /> Cash on Delivery Available
              </div>

              <Link to="/checkout" style={{ display: 'block' }}>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9375rem', padding: '14px' }}>
                  Proceed to Checkout
                </button>
              </Link>
              <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: '12px', fontSize: '0.8125rem', color: '#9E7B6C', textDecoration: 'none' }}>
                ← Continue Shopping
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>

    </div>
  )
}

function Row({ label, value, bold, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.875rem', color: '#9E7B6C' }}>{label}</span>
      <span style={{ fontWeight: bold ? 800 : 600, fontSize: bold ? '1.1rem' : '0.9375rem', color: highlight ? '#16a34a' : '#7A5C4E' }}>{value}</span>
    </div>
  )
}

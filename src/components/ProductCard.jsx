import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart, Eye, Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '1px' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={11} fill={s <= Math.floor(rating) ? '#F59E0B' : 'none'} stroke={s <= Math.floor(rating) ? '#F59E0B' : '#D4B8A0'} />
      ))}
    </div>
  )
}

const CAT_COLORS = {
  keychains: { bg: '#FDE8F0', color: '#C44569' },
  'soft-toys': { bg: '#EDE9FE', color: '#7C3AED' },
  flowers: { bg: '#ECFDF5', color: '#059669' },
}

export default function ProductCard({ product, index = 0 }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const { isCustomerAuth } = useAuth()
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { addToast } = useToast()
  const wishlisted = isWishlisted(product._id)
  const cat = CAT_COLORS[product.category] || { bg: '#FDE8F0', color: '#C44569' }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  const handleBuyNow = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isCustomerAuth) {
      addToast('Please log in first to buy', 'info')
      navigate('/login')
      return
    }
    addToCart(product)
    navigate('/checkout')
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isCustomerAuth) {
      addToast('Please log in first to add items to cart', 'info')
      navigate('/login')
      return
    }
    addToCart(product)
    addToast(`${product.name} added to cart!`, 'success')
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isCustomerAuth) {
      addToast('Please log in first to use your wishlist', 'info')
      navigate('/login')
      return
    }
    toggleWishlist(product)
    addToast(isWishlisted(product._id) ? 'Removed from wishlist' : `${product.name} wishlisted!`, 'info')
  }

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.055 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: '22px',
        border: `1px solid ${hovered ? 'rgba(196,69,105,0.18)' : 'rgba(196,69,105,0.08)'}`,
        overflow: 'hidden',
        transition: 'border-color 0.3s ease',
      }}
    >
      <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', background: '#FFF6EC' }}>
          {!imgLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />}
          <motion.img
            src={product.imageUrl || product.image}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0 }}
          />

          {/* Badge */}
          {product.badge && (
            <div style={{
              position: 'absolute', top: '12px', left: '12px',
              background: 'linear-gradient(135deg, #C44569, #E8607B)',
              color: '#fff', fontSize: '0.62rem', fontWeight: 800,
              letterSpacing: '0.06em', padding: '4px 11px', borderRadius: '50px',
              textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(196,69,105,0.35)',
            }}>
              {product.badge}
            </div>
          )}

          {/* Discount */}
          {discount && (
            <div style={{
              position: 'absolute', top: '12px', right: '12px',
              background: '#1A0A05', color: '#fff',
              fontSize: '0.62rem', fontWeight: 800, padding: '4px 9px', borderRadius: '50px',
            }}>
              -{discount}%
            </div>
          )}

          {/* Hover action buttons */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(26,10,5,0.5) 0%, rgba(26,10,5,0.1) 60%, transparent 100%)',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                  paddingBottom: '16px', gap: '10px',
                }}
              >
                <motion.button
                  onClick={handleAddToCart}
                  initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.04 }}
                  style={{
                    background: '#fff', border: 'none', borderRadius: '50%',
                    width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s, background 0.2s',
                  }}
                  whileHover={{ scale: 1.12, backgroundColor: '#C44569' }}
                  title="Add to cart"
                >
                  <ShoppingBag size={16} color={hovered ? '#7A5C4E' : '#7A5C4E'} />
                </motion.button>

                <motion.button
                  onClick={handleWishlist}
                  initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }}
                  style={{
                    background: wishlisted ? '#C44569' : '#fff', border: 'none', borderRadius: '50%',
                    width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s',
                  }}
                  whileHover={{ scale: 1.12 }}
                  title="Wishlist"
                >
                  <Heart size={16} fill={wishlisted ? '#fff' : 'none'} color={wishlisted ? '#fff' : '#7A5C4E'} />
                </motion.button>

                <motion.div
                  initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12 }}
                >
                  <Link
                    to={`/products/${product._id}`}
                    onClick={e => e.stopPropagation()}
                    style={{
                      background: '#fff', border: 'none', borderRadius: '50%',
                      width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', textDecoration: 'none',
                    }}
                    title="Quick view"
                  >
                    <Eye size={16} color="#7A5C4E" />
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info */}
        <div style={{ padding: '16px 18px 18px' }}>
          {/* Category chip */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{
              fontSize: '0.63rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
              background: cat.bg, color: cat.color, padding: '3px 9px', borderRadius: '50px',
            }}>
              {product.category.replace('-', ' ')}
            </span>
            {!product.inStock && (
              <span style={{ fontSize: '0.63rem', fontWeight: 700, color: '#dc2626', background: '#FEF2F2', padding: '3px 9px', borderRadius: '50px' }}>
                Out of Stock
              </span>
            )}
          </div>

          {/* Name */}
          <div style={{
            fontSize: '0.9375rem', fontWeight: 700, color: '#1A0A05', marginBottom: '8px',
            lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {product.name}
          </div>

          {/* Rating row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '12px' }}>
            <StarRating rating={product.rating} />
            <span style={{ fontSize: '0.7rem', color: '#9E7B6C', fontWeight: 500 }}>({product.reviewCount})</span>
          </div>

          {/* Price row */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px', marginBottom: '10px' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#C44569' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: '0.78rem', color: '#C4A696', textDecoration: 'line-through' }}>
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {/* Buttons — full width row, never crops */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' }}>
            <button
              onClick={handleAddToCart}
              style={{
                background: 'rgba(196,69,105,0.08)', border: '1.5px solid rgba(196,69,105,0.25)',
                borderRadius: '50px', padding: '8px 0', fontSize: '0.75rem', fontWeight: 700,
                color: '#C44569', cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,69,105,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(196,69,105,0.08)' }}
            >
              <ShoppingBag size={12} /> Add
            </button>
            <button
              onClick={handleBuyNow}
              style={{
                background: 'linear-gradient(135deg, #C44569, #E8607B)',
                border: 'none', borderRadius: '50px',
                padding: '8px 0', fontSize: '0.75rem', fontWeight: 700,
                color: '#fff', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(196,69,105,0.28)',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 18px rgba(196,69,105,0.42)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(196,69,105,0.28)' }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

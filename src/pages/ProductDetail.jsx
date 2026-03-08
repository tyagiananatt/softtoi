import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShoppingBag, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Minus, Plus, CheckCircle } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import api from '../utils/api'

function StarRating({ rating, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={size} fill={s <= Math.floor(rating) ? '#F59E0B' : 'none'} stroke="#F59E0B" />
      ))}
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [activeImg, setActiveImg] = useState(0)
  const [slideDir, setSlideDir] = useState(1)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { addToast } = useToast()

  useEffect(() => {
    setLoading(true)
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data)
        setActiveImg(0)
        api.get(`/products?category=${res.data.category}`).then(r => {
          setRelated(r.data.filter(p => p._id !== id).slice(0, 4))
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ paddingTop: '70px', minHeight: '100vh' }}>
      <div className="page-container" style={{ padding: '40px 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
          <div className="skeleton" style={{ aspectRatio: '1/1', borderRadius: '20px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[80, 60, 40, 100, 60, 40].map((w, i) => (
              <div key={i} className="skeleton" style={{ height: '20px', width: `${w}%`, borderRadius: '8px' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div style={{ paddingTop: '70px', textAlign: 'center', padding: '80px 20px', color: '#9E7B6C' }}>
      <h2>Product not found</h2><Link to="/products" className="btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>Back to Shop</Link>
    </div>
  )

  const images = [product.image, ...(product.images || [])]
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null
  const wishlisted = isWishlisted(product._id)

  const goPrev = () => { setSlideDir(-1); setActiveImg(i => (i - 1 + images.length) % images.length) }
  const goNext = () => { setSlideDir(1); setActiveImg(i => (i + 1) % images.length) }

  const handleAddToCart = () => {
    addToCart(product, qty)
    addToast(`${product.name} added to cart!`, 'success')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    addToast('Link copied!', 'info')
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#FFF6EC' }}>
      <div className="page-container" style={{ padding: '32px 1.5rem 64px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '32px', fontSize: '0.8125rem', color: '#9E7B6C' }}>
          <Link to="/" style={{ color: '#9E7B6C', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to={`/products?category=${product.category}`} style={{ color: '#9E7B6C', textDecoration: 'none', textTransform: 'capitalize' }}>
            {product.category.replace('-', ' ')}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: '#7A5C4E', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Main content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'start' }}>

          {/* Images */}
          <AnimatedSection direction="left">
            <div style={{ position: 'sticky', top: '90px' }}>
              {/* Swipe slider */}
              <div style={{ position: 'relative', aspectRatio: '1/1', marginBottom: '12px', borderRadius: '20px', background: '#fff', boxShadow: '0 4px 20px rgba(122,92,78,0.08)', overflow: 'hidden' }}>
                <AnimatePresence initial={false} custom={slideDir}>
                  <motion.img
                    key={activeImg}
                    src={images[activeImg]}
                    alt={product.name}
                    custom={slideDir}
                    variants={{
                      enter: d => ({ x: d > 0 ? '100%' : '-100%', opacity: 0.6 }),
                      center: { x: 0, opacity: 1 },
                      exit: d => ({ x: d > 0 ? '-60%' : '60%', opacity: 0 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                    drag={images.length > 1 ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(_, info) => { if (info.offset.x < -60) goNext(); else if (info.offset.x > 60) goPrev() }}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', cursor: images.length > 1 ? 'grab' : 'default', userSelect: 'none' }}
                    draggable={false}
                  />
                </AnimatePresence>
                {images.length > 1 && (
                  <>
                    <button onClick={goPrev}
                      style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', border: 'none', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(122,92,78,0.15)', transition: 'transform 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.12)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%)'}
                    >
                      <ChevronLeft size={18} color="#7A5C4E" />
                    </button>
                    <button onClick={goNext}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', border: 'none', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(122,92,78,0.15)', transition: 'transform 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.12)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%)'}
                    >
                      <ChevronRight size={18} color="#7A5C4E" />
                    </button>
                    <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '7px', zIndex: 10 }}>
                      {images.map((_, i) => (
                        <motion.button key={i}
                          onClick={() => { setSlideDir(i > activeImg ? 1 : -1); setActiveImg(i) }}
                          animate={{ width: i === activeImg ? '22px' : '7px', background: i === activeImg ? '#E8A0B8' : 'rgba(255,255,255,0.75)' }}
                          style={{ height: '7px', border: 'none', cursor: 'pointer', padding: 0, borderRadius: '4px' }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {images.map((img, i) => (
                    <button key={i} onClick={() => { setSlideDir(i > activeImg ? 1 : -1); setActiveImg(i) }} style={{
                      width: '64px', height: '64px', borderRadius: '10px', overflow: 'hidden',
                      border: i === activeImg ? '2px solid #E8A0B8' : '2px solid transparent',
                      padding: 0, cursor: 'pointer', background: 'none', transition: 'border-color 0.2s',
                    }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Info */}
          <AnimatedSection direction="right">
            <div>
              {product.badge && (
                <div style={{ background: '#E8A0B8', color: '#fff', display: 'inline-flex', border: 'none', borderRadius: '50px', padding: '4px 12px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  {product.badge}
                </div>
              )}
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#7A5C4E', marginBottom: '8px', lineHeight: 1.2 }}>{product.name}</h1>
              <div style={{ fontSize: '0.8125rem', color: '#E8A0B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                {product.category.replace('-', ' ')}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <StarRating rating={product.rating} />
                <span style={{ fontWeight: 700, color: '#7A5C4E', fontSize: '0.9375rem' }}>{product.rating}</span>
                <span style={{ color: '#9E7B6C', fontSize: '0.875rem' }}>({product.reviewCount} reviews)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#7A5C4E' }}>₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice && (
                  <span style={{ fontSize: '1.1rem', color: '#C4A696', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
                )}
                {discount && (
                  <span style={{ background: '#DCFCE7', color: '#15803d', fontSize: '0.8rem', fontWeight: 700, padding: '4px 10px', borderRadius: '50px' }}>
                    Save {discount}%
                  </span>
                )}
              </div>

              <p style={{ color: '#9E7B6C', lineHeight: 1.8, marginBottom: '24px', fontSize: '0.9375rem' }}>{product.description}</p>

              {/* Quantity */}
              <div style={{ marginBottom: '24px' }}>
                <div className="form-label">Quantity</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1.5px solid #EED6C4', borderRadius: '50px', width: 'fit-content' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '42px', height: '42px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '50px 0 0 50px', color: '#7A5C4E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Minus size={16} />
                  </button>
                  <span style={{ padding: '0 20px', fontWeight: 700, color: '#7A5C4E', fontSize: '1.05rem', minWidth: '40px', textAlign: 'center' }}>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} style={{ width: '42px', height: '42px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '0 50px 50px 0', color: '#7A5C4E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button onClick={handleAddToCart} className="btn-primary" style={{ flex: '1 1 200px', justifyContent: 'center' }}>
                  <ShoppingBag size={16} /> Add to Cart
                </button>
                <button onClick={() => { toggleWishlist(product); addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!', 'info') }}
                  style={{
                    width: '48px', height: '48px', border: `2px solid ${wishlisted ? '#E8A0B8' : '#EED6C4'}`,
                    borderRadius: '50%', background: wishlisted ? '#FDE8F0' : 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                  }}>
                  <Heart size={18} fill={wishlisted ? '#E8A0B8' : 'none'} color={wishlisted ? '#E8A0B8' : '#9E7B6C'} />
                </button>
                <button onClick={handleShare}
                  style={{ width: '48px', height: '48px', border: '2px solid #EED6C4', borderRadius: '50%', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Share2 size={18} color="#9E7B6C" />
                </button>
              </div>

              {/* Features */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                {[
                  [Truck, 'Free Shipping', '₹999+'],
                  [Shield, 'Secure Payment', 'Guaranteed'],
                  [RotateCcw, 'Easy Returns', '7 days'],
                ].map(([Icon, title, sub]) => (
                  <div key={title} style={{ textAlign: 'center', background: 'rgba(248,200,220,0.1)', borderRadius: '12px', padding: '14px 8px', border: '1px solid rgba(248,200,220,0.2)' }}>
                    <Icon size={18} color="#E8A0B8" style={{ marginBottom: '6px' }} />
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7A5C4E' }}>{title}</div>
                    <div style={{ fontSize: '0.65rem', color: '#9E7B6C' }}>{sub}</div>
                  </div>
                ))}
              </div>

              {/* Details */}
              {product.details?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontWeight: 700, color: '#7A5C4E', marginBottom: '12px' }}>Product Details</div>
                  {product.details.map((d, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '0.875rem', color: '#9E7B6C' }}>
                      <CheckCircle size={14} color="#E8A0B8" style={{ flexShrink: 0, marginTop: '2px' }} />
                      {d}
                    </div>
                  ))}
                </div>
              )}

              {/* COD badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#DCFCE7', border: '1px solid #86efac', borderRadius: '10px', padding: '10px 16px' }}>
                <CheckCircle size={14} color="#16a34a" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#15803d' }}>Cash on Delivery Available</span>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: '64px' }}>
            <AnimatedSection>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7A5C4E', marginBottom: '32px' }}>You May Also Like</h2>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
              {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

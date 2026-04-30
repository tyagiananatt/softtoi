import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShoppingBag, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Minus, Plus, CheckCircle, MessageSquare, Send } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import ProductCard from '../components/ProductCard'
import LoadingQuote from '../components/LoadingQuote'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import api, { formatCategory } from '../utils/api'

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
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [activeImg, setActiveImg] = useState(0)
  const [slideDir, setSlideDir] = useState(1)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [userOrders, setUserOrders] = useState([])
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', orderId: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [lightboxImg, setLightboxImg] = useState(null)
  const { isCustomerAuth, customerUser } = useAuth()
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
        api.get(`/reviews/product/${id}`).then(r => setReviews(r.data)).catch(() => {})
      })
      .catch(() => {})
      .finally(() => setLoading(false))
    if (isCustomerAuth) {
      api.get('/users/me/orders').then(r => setUserOrders(r.data)).catch(() => {})
    }
  }, [id, isCustomerAuth])

  if (loading) return (
    <div style={{ paddingTop: '70px', minHeight: '100vh' }}>
      <div className="page-container" style={{ padding: '40px 1.5rem' }}>
        <LoadingQuote style={{ marginBottom: '28px' }} />
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
    if (!isCustomerAuth) {
      addToast('Please log in first to add items to cart', 'info')
      navigate('/login')
      return
    }
    addToCart(product, qty)
    addToast(`${product.name} added to cart!`, 'success')
  }

  const handleBuyNow = () => {
    if (!isCustomerAuth) {
      addToast('Please log in first to buy', 'info')
      navigate('/login')
      return
    }
    addToCart(product, qty)
    navigate('/checkout')
  }

  const handleWishlist = () => {
    if (!isCustomerAuth) {
      addToast('Please log in first to use your wishlist', 'info')
      navigate('/login')
      return
    }
    toggleWishlist(product)
    addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!', 'info')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    addToast('Link copied!', 'info')
  }

  const eligibleOrder = userOrders.find(o =>
    o.items?.some(item => String(item.product) === id || String(item.product?._id) === id) &&
    ['delivered','shipped','confirmed','processing'].includes(o.status)
  )
  const alreadyReviewed = reviews.some(r => String(r.user) === String(customerUser?._id))

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!reviewForm.comment.trim()) return addToast('Please write a comment', 'info')
    setSubmittingReview(true)
    try {
      const res = await api.post('/reviews', { productId: id, orderId: eligibleOrder._id, rating: reviewForm.rating, comment: reviewForm.comment })
      setReviews(prev => [res.data, ...prev])
      setReviewForm({ rating: 5, comment: '', orderId: '' })
      addToast('Review submitted! 🎉', 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit review', 'error')
    } finally { setSubmittingReview(false) }
  }

  return (
    <>
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#FFF6EC' }}>
      <div className="page-container" style={{ padding: '32px 1.5rem 64px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '32px', fontSize: '0.8125rem', color: '#9E7B6C' }}>
          <Link to="/" style={{ color: '#9E7B6C', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to={`/products?category=${product.category}`} style={{ color: '#9E7B6C', textDecoration: 'none', textTransform: 'capitalize' }}>
            {formatCategory(product.category)}
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
                {formatCategory(product.category)}
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

              <div style={{ color: '#9E7B6C', lineHeight: 1.8, marginBottom: '24px', fontSize: '0.9375rem' }}>
                {product.description.split('\n').map((line, i) =>
                  line.startsWith('• ')
                    ? <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}><span style={{ color: '#C44569', flexShrink: 0 }}>•</span><span>{line.slice(2)}</span></div>
                    : <p key={i} style={{ margin: line === '' ? '8px 0' : '0 0 4px 0' }}>{line}</p>
                )}
              </div>

              {/* Variants */}
              {product.variants?.length > 1 && (
                <div style={{ marginBottom: '24px' }}>
                  <div className="form-label">Available Variants</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {product.variants.map(v => {
                      const isCurrent = v._id === product._id
                      return (
                        <Link key={v._id} to={`/products/${v._id}`} style={{ textDecoration: 'none' }}>
                          <motion.div
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.96 }}
                            style={{
                              width: 64, height: 64,
                              borderRadius: '12px',
                              overflow: 'hidden',
                              border: `2.5px solid ${isCurrent ? '#C44569' : 'rgba(196,69,105,0.15)'}`,
                              boxShadow: isCurrent ? '0 4px 14px rgba(196,69,105,0.25)' : '0 2px 6px rgba(122,92,78,0.08)',
                              position: 'relative',
                              flexShrink: 0,
                              opacity: v.inStock ? 1 : 0.5,
                            }}
                          >
                            <img src={v.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            {isCurrent && (
                              <div style={{ position: 'absolute', top: 3, right: 3, width: 16, height: 16, borderRadius: '50%', background: '#C44569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: 900 }}>✓</div>
                            )}
                          </motion.div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

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
                <button onClick={handleAddToCart} className="btn-secondary" style={{ flex: '1 1 140px', justifyContent: 'center' }}>
                  <ShoppingBag size={16} /> Add to Cart
                </button>
                <button onClick={handleBuyNow} className="btn-primary" style={{ flex: '1 1 140px', justifyContent: 'center' }}>
                  Buy Now
                </button>
                <button onClick={handleWishlist}
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
                  [Truck, 'LPU Campus', 'Free delivery'],
                  [Shield, 'Secure Payment', 'Guaranteed'],
                  [RotateCcw, 'Delivery in 48 Hours', 'in & out LPU campus'],
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

        {/* Reviews Section */}
        <div style={{ marginTop: '64px' }}>
          <AnimatedSection>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
              <MessageSquare size={22} color="#C44569" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7A5C4E' }}>Customer Reviews</h2>
              <span style={{ background: '#FDE8F0', color: '#C44569', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '50px' }}>{reviews.length}</span>
            </div>
          </AnimatedSection>

          {/* Write review — only for buyers */}
          {isCustomerAuth && eligibleOrder && !alreadyReviewed && (
            <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid rgba(196,69,105,0.12)', marginBottom: '28px', boxShadow: '0 4px 16px rgba(122,92,78,0.06)' }}>
              <h3 style={{ fontWeight: 700, color: '#7A5C4E', marginBottom: '16px', fontSize: '1rem' }}>Write a Review</h3>
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#7A5C4E', marginBottom: '8px' }}>Your Rating</div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[1,2,3,4,5].map(s => (
                      <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                        <Star size={28} fill={s <= reviewForm.rating ? '#F59E0B' : 'none'} stroke="#F59E0B" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#7A5C4E', marginBottom: '6px' }}>Your Review</div>
                  <textarea value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    rows={3} className="form-input" placeholder="Share your experience with this product..." style={{ resize: 'vertical' }} required />
                </div>
                <button type="submit" disabled={submittingReview} className="btn-primary" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={15} /> {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}

          {!isCustomerAuth && (
            <div style={{ background: '#FFF6EC', borderRadius: '16px', padding: '20px', marginBottom: '24px', textAlign: 'center', border: '1px solid rgba(238,214,196,0.5)' }}>
              <p style={{ color: '#9E7B6C', marginBottom: '12px' }}>Login and purchase this product to leave a review</p>
              <Link to="/login"><button className="btn-secondary" style={{ fontSize: '0.875rem' }}>Login to Review</button></Link>
            </div>
          )}

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9E7B6C', background: '#fff', borderRadius: '16px', border: '1px solid rgba(238,214,196,0.3)' }}>
              <Star size={36} color="#F8C8DC" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {reviews.map(r => (
                <div key={r._id} style={{
                  background: 'linear-gradient(145deg, #fff 0%, #fff9f5 100%)',
                  borderRadius: '22px', padding: '22px',
                  border: '1px solid rgba(196,69,105,0.1)',
                  boxShadow: '0 4px 24px rgba(196,69,105,0.08), 0 1px 4px rgba(122,92,78,0.06)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative', overflow: 'hidden',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(196,69,105,0.14)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(196,69,105,0.08)' }}
                >
                  {/* Decorative top accent */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #C44569, #E8607B, #D4956B)' }} />

                  {/* Stars row */}
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '14px', marginTop: '4px' }}>
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={16}
                        fill={s <= r.rating ? '#F59E0B' : 'rgba(245,158,11,0.15)'}
                        stroke={s <= r.rating ? '#F59E0B' : 'rgba(245,158,11,0.3)'}
                      />
                    ))}
                    <span style={{ marginLeft: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#F59E0B' }}>{r.rating}.0</span>
                  </div>

                  {/* Comment */}
                  <p style={{ color: '#4A2E20', lineHeight: 1.75, fontSize: '0.9rem', margin: '0 0 16px 0', fontStyle: 'italic' }}>
                    "{r.comment}"
                  </p>

                  {/* Images */}
                  {r.images?.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {r.images.map((img, i) => (
                        <img key={i} src={img} alt="" onClick={() => setLightboxImg(img)}
                          style={{ width: '68px', height: '68px', borderRadius: '10px', objectFit: 'cover', border: '2px solid rgba(196,69,105,0.15)', cursor: 'zoom-in', transition: 'transform 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                      ))}
                    </div>
                  )}

                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '14px', borderTop: '1px solid rgba(238,214,196,0.5)' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #C44569, #E8607B)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 900, color: '#fff', fontSize: '0.9rem',
                      boxShadow: '0 4px 10px rgba(196,69,105,0.3)',
                    }}>
                      {(r.userName || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1A0A05', fontSize: '0.85rem' }}>{r.userName || 'Customer'}</div>
                      <div style={{ fontSize: '0.68rem', color: '#9E7B6C' }}>{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', background: '#FDE8F0', borderRadius: '50px', padding: '3px 10px', fontSize: '0.65rem', fontWeight: 800, color: '#C44569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Verified
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

    {/* Lightbox */}
    <AnimatePresence>
      {lightboxImg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLightboxImg(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', cursor: 'zoom-out' }}
        >
          <motion.img
            src={lightboxImg}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '88vh', borderRadius: '16px', objectFit: 'contain', boxShadow: '0 24px 80px rgba(0,0,0,0.5)', cursor: 'default' }}
          />
          <button onClick={() => setLightboxImg(null)}
            style={{ position: 'fixed', top: '20px', right: '20px', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}

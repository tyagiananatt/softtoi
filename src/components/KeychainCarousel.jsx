import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

// ── Single keychain card (matches HTML structure exactly) ─────────────────
function KeychainCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false)
  const { addToCart } = useCart()
  const { isCustomerAuth } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isCustomerAuth) { addToast('Please log in first', 'info'); navigate('/login'); return }
    addToCart(product)
    addToast(`${product.name} added to cart! 🛍️`, 'success')
  }

  const handleBuy = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isCustomerAuth) { addToast('Please log in first', 'info'); navigate('/login'); return }
    addToCart(product)
    navigate('/checkout')
  }

  return (
    <div className="keychain-card">
      <div className="keychain-ring"></div>
      <div className="keychain-chain"></div>
      <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div className="keychain-body">
          <span className="floating-heart">💕</span>
          <span className="floating-heart">💖</span>
          <span className="floating-heart">💗</span>

          <div className="keychain-image">
            {product.badge && (
              <span className="keychain-badge" style={product.badgeColor ? { background: product.badgeColor } : undefined}>
                {product.badge}
              </span>
            )}
            <button
              className="keychain-heart"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(v => !v) }}
              style={wishlisted ? { background: '#E8A0B8' } : undefined}
            >
              <svg className="heart-icon" width="14" height="14" viewBox="0 0 24 24"
                fill={wishlisted ? 'white' : 'none'}
                stroke={wishlisted ? 'white' : 'currentColor'}
                strokeWidth="2.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            {/* Real product image */}
            <img
              src={product.imageUrl || product.image}
              alt={product.name}
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div className="keychain-content">
            <div className="keychain-tag">Handmade · Keychain</div>
            <h3 className="keychain-name">{product.name}</h3>
            <div className="keychain-footer">
              <span className="keychain-price"><span className="currency">₹</span>{product.price}</span>
              <div style={{ display: 'flex', gap: 5 }}>
                <button className="keychain-cart" onClick={handleCart}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                </button>
                <button className="keychain-buy" onClick={handleBuy}>Buy</button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

// ── Main carousel ──────────────────────────────────────────────────────────
export default function KeychainCarousel({ products = [] }) {
  const trackRef = useRef(null)
  const [perView, setPerView] = useState(() => {
    if (typeof window === 'undefined') return 4
    const w = window.innerWidth
    if (w <= 768) return 2
    if (w <= 1024) return 3
    return 4
  })

  const currentIndexRef = useRef(perView)
  const isAnimatingRef = useRef(false)
  const total = products.length

  const getPerView = () => {
    const w = window.innerWidth
    if (w <= 768) return 2
    if (w <= 1024) return 3
    return 4
  }

  // Build looped items: [last N clones] + [real] + [first N clones]
  const buildItems = useCallback(() => {
    if (total === 0) return []
    const cloneStart = products.slice(-perView)
    const cloneEnd = products.slice(0, perView)
    return [...cloneStart, ...products, ...cloneEnd]
  }, [products, perView, total])

  const items = buildItems()

  const jumpTo = useCallback((index, withTransition = true) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('.keychain-card')
    if (!card) return

    if (!withTransition) track.classList.add('no-transition')
    else track.classList.remove('no-transition')

    const cardWidth = card.getBoundingClientRect().width
    const gapStr = getComputedStyle(track).gap || '24px'
    const gap = parseFloat(gapStr)
    const offset = (cardWidth + gap) * index

    track.style.transform = `translate3d(-${offset}px, 0, 0)`

    if (!withTransition) {
      // force reflow before re-enabling transitions
      void track.offsetWidth
      track.classList.remove('no-transition')
    }

    currentIndexRef.current = index
  }, [])

  const next = () => {
    if (isAnimatingRef.current || total === 0) return
    isAnimatingRef.current = true
    jumpTo(currentIndexRef.current + perView, true)
  }

  const prev = () => {
    if (isAnimatingRef.current || total === 0) return
    isAnimatingRef.current = true
    jumpTo(currentIndexRef.current - perView, true)
  }

  const onTransitionEnd = (e) => {
    if (e.target !== trackRef.current) return
    if (e.propertyName !== 'transform') return

    isAnimatingRef.current = false
    const cur = currentIndexRef.current

    if (cur >= total + perView) {
      jumpTo(perView, false)
    } else if (cur < perView) {
      jumpTo(total, false)
    }
  }

  // Initial position whenever items rebuild
  useEffect(() => {
    if (total === 0) return
    currentIndexRef.current = perView
    const t = setTimeout(() => jumpTo(perView, false), 50)
    return () => clearTimeout(t)
  }, [perView, total, jumpTo])

  // Resize handler
  useEffect(() => {
    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        const newPerView = getPerView()
        if (newPerView !== perView) {
          setPerView(newPerView)
        } else {
          jumpTo(currentIndexRef.current, false)
        }
      }, 150)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
    }
  }, [perView, jumpTo])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  })

  if (total === 0) return null

  return (
    <>
      {/* Inline CSS — exact copy of your working HTML styles */}
      <style>{`
        .keychain-section {
          max-width: 1300px;
          margin: 0 auto;
          position: relative;
          padding: 60px 20px 80px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-tag {
          display: inline-block;
          background: linear-gradient(135deg, #F8C8DC, #EED6C4);
          color: #7A5C4E;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 8px 18px;
          border-radius: 50px;
          margin-bottom: 16px;
        }
        .section-tag::before { content: '🔑 '; }

        .section-title {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 800;
          color: #7A5C4E;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }
        .section-title .accent {
          background: linear-gradient(135deg, #E8A0B8, #F8C8DC);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-subtitle {
          color: #9E7B6C;
          font-size: 1rem;
          max-width: 540px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .carousel-wrapper {
          position: relative;
          padding: 0 60px;
        }

        .carousel-wrapper::before {
          content: '';
          position: absolute;
          top: 70px;
          left: 70px;
          right: 70px;
          height: 2px;
          background: repeating-linear-gradient(
            90deg,
            #D4B5A5 0,
            #D4B5A5 4px,
            transparent 4px,
            transparent 8px
          );
          border-radius: 2px;
          opacity: 0.5;
          z-index: 1;
        }

        .carousel-viewport {
          overflow: hidden;
          position: relative;
          padding-top: 50px;
        }

        .carousel-track {
          display: flex;
          gap: 24px;
          transition: transform 0.7s cubic-bezier(0.65, 0, 0.35, 1);
          will-change: transform;
          padding-bottom: 20px;
        }

        .carousel-track.no-transition {
          transition: none;
        }

        .keychain-card {
          flex: 0 0 calc((100% - 24px * 3) / 4);
          position: relative;
          padding-top: 35px;
          cursor: pointer;
          animation: gentle-swing 4s ease-in-out infinite;
          transform-origin: top center;
          transition: filter 0.3s;
        }

        @media (max-width: 1024px) {
          .keychain-card {
            flex: 0 0 calc((100% - 20px * 2) / 3);
          }
          .carousel-track { gap: 20px; }
        }

        @media (max-width: 768px) {
          .keychain-card {
            flex: 0 0 calc((100% - 16px) / 2);
          }
          .carousel-track { gap: 16px; }
          .carousel-wrapper { padding: 0 44px; }
        }

        @media (max-width: 480px) {
          .keychain-card {
            flex: 0 0 calc((100% - 12px) / 2);
            padding-top: 28px;
          }
          .carousel-track { gap: 12px; }
          .carousel-wrapper { padding: 0 36px; }
          .carousel-wrapper::before { left: 50px; right: 50px; top: 56px; }

          .keychain-ring { width: 22px; height: 22px; border-width: 3px; }
          .keychain-chain { top: 22px; height: 14px; }
          .keychain-body { padding: 14px 10px 14px; border-radius: 22px; }
          .keychain-image { border-radius: 16px; margin-bottom: 12px; }
          .keychain-badge { font-size: 0.55rem; padding: 3px 7px; top: 8px; left: 8px; }
          .keychain-heart { width: 26px; height: 26px; top: 8px; right: 8px; }
          .keychain-heart svg { width: 11px; height: 11px; }
          .keychain-tag { font-size: 0.6rem; margin-bottom: 6px; }
          .keychain-name { font-size: 0.85rem; margin-bottom: 4px; }
          .keychain-price { font-size: 0.95rem; }
          .keychain-price .currency { font-size: 0.7rem; }
          .keychain-cart { width: 28px; height: 28px; }
          .keychain-cart svg { width: 11px; height: 11px; }
          .keychain-buy { display: none; }
          .keychain-footer { padding-top: 8px; }
        }

        .keychain-card:nth-child(odd)  { animation-delay: 0s; }
        .keychain-card:nth-child(even) { animation-delay: 0.5s; animation-duration: 4.5s; }

        @keyframes gentle-swing {
          0%, 100% { transform: rotate(-1.5deg); }
          50%      { transform: rotate(1.5deg); }
        }

        .keychain-card:hover {
          animation-play-state: paused;
          filter: drop-shadow(0 12px 24px rgba(232, 160, 184, 0.35));
        }

        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #ffffff, #FFF6EC);
          color: #E8A0B8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 6px 18px rgba(232, 160, 184, 0.25),
            0 0 0 1px rgba(248, 200, 220, 0.4);
          transition: background 0.3s, color 0.3s, box-shadow 0.3s;
          z-index: 10;
          padding: 0;
        }

        .carousel-arrow:hover {
          background: linear-gradient(135deg, #E8A0B8, #F8C8DC);
          color: white;
          box-shadow: 0 10px 24px rgba(232, 160, 184, 0.5);
        }

        .carousel-arrow.left  { left: 0; }
        .carousel-arrow.right { right: 0; }

        @media (max-width: 768px) {
          .carousel-arrow { width: 40px; height: 40px; }
        }
        @media (max-width: 480px) {
          .carousel-arrow { width: 36px; height: 36px; }
          .carousel-arrow svg { width: 16px; height: 16px; }
        }

        .keychain-ring {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 4px solid #C9A77D;
          background: linear-gradient(135deg, #E8C9A0, #C9A77D);
          z-index: 3;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15), inset 0 -2px 4px rgba(0,0,0,0.1);
        }
        .keychain-ring::after {
          content: '';
          position: absolute;
          top: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 4px;
          background: #C9A77D;
          border-radius: 2px;
        }

        .keychain-chain {
          position: absolute;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 18px;
          background: linear-gradient(180deg, #C9A77D, #B89970);
          z-index: 2;
        }

        .keychain-body {
          position: relative;
          background: linear-gradient(145deg, #ffffff, #FFF8FB);
          border-radius: 28px;
          padding: 24px 18px 22px;
          box-shadow:
            0 8px 24px rgba(232, 160, 184, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            0 0 0 1px rgba(248, 200, 220, 0.3);
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .keychain-card:hover .keychain-body {
          transform: scale(1.04) translateY(-4px);
        }

        .keychain-body::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(248,200,220,0.25) 1px, transparent 1px);
          background-size: 14px 14px;
          opacity: 0.6;
          pointer-events: none;
        }

        .keychain-image {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 20px;
          background: linear-gradient(135deg, #FFE4EC 0%, #FFF0E5 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          overflow: hidden;
          z-index: 1;
        }

        .keychain-image img { transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .keychain-card:hover .keychain-image img { transform: scale(1.12) rotate(-3deg); }

        .keychain-heart {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(4px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          z-index: 2;
          border: none;
        }
        .keychain-heart:hover { background: #E8A0B8; transform: scale(1.15); }
        .keychain-heart:hover .heart-icon { color: white; }
        .heart-icon { color: #E8A0B8; transition: all 0.3s; }

        .keychain-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: linear-gradient(135deg, #E8A0B8, #F8C8DC);
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
          z-index: 2;
          box-shadow: 0 2px 6px rgba(232, 160, 184, 0.4);
        }

        .floating-heart {
          position: absolute;
          color: #E8A0B8;
          pointer-events: none;
          opacity: 0;
          font-size: 14px;
          z-index: 4;
          bottom: 30%;
        }
        .keychain-card:hover .floating-heart { animation: float-up 1.5s ease-out forwards; }
        .keychain-card:hover .floating-heart:nth-child(1) { left: 20%; animation-delay: 0s; }
        .keychain-card:hover .floating-heart:nth-child(2) { left: 50%; animation-delay: 0.2s; }
        .keychain-card:hover .floating-heart:nth-child(3) { left: 75%; animation-delay: 0.4s; }

        @keyframes float-up {
          0%   { transform: translateY(0) scale(0.5); opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translateY(-80px) scale(1.2); opacity: 0; }
        }

        .keychain-content { position: relative; z-index: 1; text-align: center; }
        .keychain-name {
          font-size: 1rem;
          font-weight: 700;
          color: #7A5C4E;
          margin-bottom: 6px;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .keychain-tag {
          font-size: 0.7rem;
          color: #B89980;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .keychain-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px dashed rgba(232, 160, 184, 0.3);
          gap: 6px;
        }

        .keychain-price { font-size: 1.15rem; font-weight: 800; color: #E8A0B8; white-space: nowrap; }
        .keychain-price .currency { font-size: 0.85rem; margin-right: 1px; }

        .keychain-cart {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #F8C8DC, #E8A0B8);
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          box-shadow: 0 4px 10px rgba(232, 160, 184, 0.35);
          flex-shrink: 0;
        }
        .keychain-cart:hover { transform: rotate(-15deg) scale(1.15); box-shadow: 0 6px 14px rgba(232, 160, 184, 0.5); }

        .keychain-buy {
          padding: 0 12px;
          height: 34px;
          border-radius: 50px;
          background: linear-gradient(135deg, #C44569, #E8607B);
          border: none;
          color: white;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          box-shadow: 0 4px 10px rgba(196,69,105,0.3);
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }
        .keychain-buy:hover { transform: scale(1.08); }
        .keychain-buy:active { transform: scale(0.95); }

        .view-all-wrap {
          text-align: center;
          margin-top: 50px;
          position: relative;
        }

        .view-all-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #E8A0B8 0%, #F8C8DC 100%);
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.04em;
          padding: 16px 36px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(232, 160, 184, 0.4);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
          z-index: 2;
          text-decoration: none;
        }
        .view-all-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255,255,255,0.25);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .view-all-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 14px 32px rgba(232, 160, 184, 0.55);
        }
        .view-all-btn:hover::before { width: 300px; height: 300px; }
        .view-all-btn .arrow { transition: transform 0.3s; }
        .view-all-btn:hover .arrow { transform: translateX(6px); }

        .section-bg {
          padding: 60px 0;
          background: linear-gradient(180deg, #FFF6EC 0%, #FFEFF5 100%);
        }
      `}</style>

      <section className="section-bg">
        <div className="keychain-section">

          {/* Header */}
          <div className="section-header">
            <span className="section-tag">Our Bestsellers</span>
            <h2 className="section-title">
              Adorable <span className="accent">Keychains</span>
            </h2>
            <p className="section-subtitle">
              Handcrafted with love — tiny treasures that bring big smiles. Each keychain tells its own little story.
            </p>
          </div>

          {/* Carousel */}
          <div className="carousel-wrapper">
            <button className="carousel-arrow left" onClick={prev} aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>

            <button className="carousel-arrow right" onClick={next} aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>

            <div className="carousel-viewport">
              <div
                className="carousel-track"
                ref={trackRef}
                onTransitionEnd={onTransitionEnd}
              >
                {items.map((p, i) => (
                  <KeychainCard key={`${p._id}-${i}`} product={p} />
                ))}
              </div>
            </div>
          </div>

          {/* View all */}
          <div className="view-all-wrap">
            <Link to="/products?category=keychains" className="view-all-btn">
              <span>Explore All Keychains</span>
              <svg className="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
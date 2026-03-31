import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { Sparkles, ShoppingBag, BookOpen, Gift, Truck, Shield, Star, Quote, ArrowRight, Heart, Zap } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import ProductCard from '../components/ProductCard'
import CategoryCard from '../components/CategoryCard'
import api from '../utils/api'

// Curated Unsplash images for hero
const HERO_IMG_1 = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&w=460&h=580&q=90'
const HERO_IMG_2 = 'https://images.unsplash.com/photo-1490750967868-88df5691cc43?auto=format&fit=crop&w=380&h=380&q=90'
const HERO_IMG_3 = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=300&h=300&q=90'

const FEATURES = [
  {
    icon: Gift, title: 'Handmade with Love', desc: 'Every piece crafted by skilled artisans with passion and care.',
    color: '#FDE8F0', iconColor: '#C44569',
  },
  {
    icon: Truck, title: 'Free Delivery on Campus', desc: 'Inside LPU campus delivery is free. Outside campus: ₹19 flat charge.',
    color: '#FFF6EC', iconColor: '#D4956B',
  },
  {
    icon: Shield, title: 'Quality Assured', desc: 'Each product passes our strict quality standards.',
    color: '#F0F0FF', iconColor: '#6B5CF6',
  },
  {
    icon: Zap, title: '4.8★ Rated Store', desc: 'Trusted by hundreds of happy customers across India.',
    color: '#FFFBEB', iconColor: '#D97706',
  },
]

const TESTIMONIALS = [
  {
    text: 'The rose keychain I ordered was absolutely stunning. The craftsmanship is beyond what I expected. It arrived perfectly packaged — looked like a luxury gift!',
    name: 'Priya Sharma', role: 'Verified Customer', stars: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
  },
  {
    text: 'My daughter absolutely loves the teddy bear. The quality is incredible and it\'s so soft! Will definitely be ordering again for every occasion.',
    name: 'Neha Gupta', role: 'Verified Customer', stars: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
  },
  {
    text: 'Ordered the cherry blossom branch for my office and everyone keeps asking where I got it. So unique and beautifully made. Totally worth every rupee!',
    name: 'Anjali Patel', role: 'Verified Customer', stars: 5,
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=80&h=80&q=80',
  },
]

// Particle data — generated once
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: 4 + Math.random() * 10,
  x: Math.random() * 500,
  y: Math.random() * 500,
  dur: 3 + Math.random() * 5,
  delay: Math.random() * 3,
  color: ['#F8C8DC', '#C44569', '#E8A0B8', '#EED6C4', '#FDDDE6'][i % 5],
  orbitRadius: 140 + Math.random() * 120,
  orbitSpeed: (2 + Math.random() * 4) * (Math.random() > 0.5 ? 1 : -1),
  orbitOffset: (Math.PI * 2 * i) / 18,
}))

function LogoShowcase() {
  const containerRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [hovered, setHovered] = useState(false)
  const [ripples, setRipples] = useState([])

  // Smooth springs for mouse tracking
  const springX = useSpring(mouseX, { stiffness: 60, damping: 18 })
  const springY = useSpring(mouseY, { stiffness: 60, damping: 18 })

  // Derived transforms for 3D tilt
  const rotateX = useTransform(springY, [-200, 200], [18, -18])
  const rotateY = useTransform(springX, [-200, 200], [-18, 18])
  const glowX = useTransform(springX, [-200, 200], [30, 70])
  const glowY = useTransform(springY, [-200, 200], [30, 70])

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    mouseX.set(e.clientX - cx)
    mouseY.set(e.clientY - cy)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
    setHovered(false)
  }, [mouseX, mouseY])

  const handleClick = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const id = Date.now()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setRipples(r => [...r, { id, x, y }])
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 900)
  }, [])

  return (
    <motion.div
      ref={containerRef}
      className="hide-mobile"
      initial={{ opacity: 0, scale: 0.88, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ position: 'relative', height: '540px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', perspective: '800px' }}
    >
      {/* ── Ambient background pulse ── */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(248,200,220,0.5) 0%, rgba(196,69,105,0.12) 45%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      {/* Secondary slower pulse */}
      <motion.div
        animate={{ scale: [1.05, 0.95, 1.05], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '420px', height: '420px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(238,214,196,0.4) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Rotating dashed ring 1 ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '440px', height: '440px', borderRadius: '50%',
          border: '1.5px dashed rgba(196,69,105,0.22)',
          pointerEvents: 'none',
        }}
      />
      {/* Rotating ring 2 — opposite */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '360px', height: '360px', borderRadius: '50%',
          border: '1px dashed rgba(248,200,220,0.45)',
          pointerEvents: 'none',
        }}
      />
      {/* Outer slow ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '520px', height: '520px', borderRadius: '50%',
          border: '1px dashed rgba(196,69,105,0.1)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Orbiting sparkle dots ── */}
      {PARTICLES.slice(0, 8).map((p, i) => (
        <motion.div
          key={p.id}
          animate={{ rotate: 360 }}
          transition={{ duration: Math.abs(p.orbitSpeed) * 4, repeat: Infinity, ease: 'linear', direction: p.orbitSpeed > 0 ? 'normal' : 'reverse' }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: `${p.orbitRadius * 2}px`, height: `${p.orbitRadius * 2}px`,
            marginTop: `-${p.orbitRadius}px`, marginLeft: `-${p.orbitRadius}px`,
            borderRadius: '50%', pointerEvents: 'none', zIndex: 2,
          }}
        >
          <motion.div
            animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }}
            style={{
              position: 'absolute',
              top: `${50 + 49 * Math.sin(p.orbitOffset)}%`,
              left: `${50 + 49 * Math.cos(p.orbitOffset)}%`,
              width: p.size, height: p.size, borderRadius: '50%',
              background: `radial-gradient(circle, ${p.color}, rgba(196,69,105,0.3))`,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </motion.div>
      ))}

      {/* ── Floating free-roam particles ── */}
      {PARTICLES.slice(8).map(p => (
        <motion.div
          key={p.id}
          animate={{
            x: [0, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 60, 0],
            y: [0, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 60, 0],
            scale: [1, 1.6, 0.8, 1],
            opacity: [0.2, 0.9, 0.4, 0.2],
          }}
          transition={{ duration: p.dur * 1.4, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          style={{
            position: 'absolute',
            left: p.x, top: p.y,
            width: p.size * 0.7, height: p.size * 0.7, borderRadius: '50%',
            background: p.color,
            pointerEvents: 'none', zIndex: 1,
          }}
        />
      ))}

      {/* ── Mouse-reactive glow that follows cursor ── */}
      <motion.div
        style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(248,180,210,0.55) 0%, transparent 70%)`
          ),
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none', zIndex: 3,
        }}
      />

      {/* ── Main logo with 3-D tilt ── */}
      <motion.div
        style={{
          position: 'relative', zIndex: 5,
          rotateX, rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {/* Halo glow behind logo */}
        <motion.div
          animate={{ opacity: hovered ? [0.7, 1, 0.7] : [0.4, 0.65, 0.4], scale: hovered ? [1, 1.08, 1] : [1, 1.04, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: '-24px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(248,180,210,0.6) 0%, rgba(196,69,105,0.18) 55%, transparent 75%)',
            filter: 'blur(18px)',
            pointerEvents: 'none',
          }}
        />
        <motion.img
          src="/logo.jpeg"
          alt="SoftToi"
          animate={hovered
            ? { filter: ['brightness(1) saturate(1.1)', 'brightness(1.08) saturate(1.3)', 'brightness(1) saturate(1.1)'] }
            : { filter: 'brightness(1) saturate(1)' }
          }
          transition={{ duration: 1.8, repeat: hovered ? Infinity : 0 }}
          style={{
            width: '380px', height: '380px', objectFit: 'contain', borderRadius: '50%',
            boxShadow: '0 32px 80px rgba(196,69,105,0.28), 0 12px 32px rgba(61,35,20,0.14), 0 0 0 2px rgba(248,200,220,0.4)',
            display: 'block',
          }}
        />
      </motion.div>

      {/* ── Click ripple waves ── */}
      <AnimatePresence>
        {ripples.map(rp => (
          <motion.div
            key={rp.id}
            initial={{ width: 0, height: 0, opacity: 0.7, x: rp.x, y: rp.y }}
            animate={{ width: 320, height: 320, opacity: 0, x: rp.x - 160, y: rp.y - 160 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            style={{
              position: 'absolute', borderRadius: '50%',
              border: '2px solid rgba(196,69,105,0.5)',
              pointerEvents: 'none', zIndex: 20,
            }}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── New Arrivals Slider ───────────────────────────────────────────────────
const SLIDE_WIDTH = 280
const SLIDE_GAP = 20

function NewArrivalsSlider({ products }) {
  const [current, setCurrent] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [dragDelta, setDragDelta] = useState(0)
  const timerRef = useRef(null)
  const total = products.length

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % total), 3200)
  }, [total])

  useEffect(() => {
    if (total > 0) resetTimer()
    return () => clearInterval(timerRef.current)
  }, [total, resetTimer])

  const goTo = (idx) => { setCurrent((idx + total) % total); resetTimer() }

  const onDragStart = (clientX) => { setDragging(true); setDragStart(clientX); setDragDelta(0) }
  const onDragMove = (clientX) => { if (dragging) setDragDelta(clientX - dragStart) }
  const onDragEnd = () => {
    if (Math.abs(dragDelta) > 60) goTo(dragDelta < 0 ? current + 1 : current - 1)
    setDragging(false); setDragDelta(0)
  }

  if (!total) return null

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Slider track */}
      <div
        style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '460px', cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none' }}
        onMouseDown={e => onDragStart(e.clientX)}
        onMouseMove={e => onDragMove(e.clientX)}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={e => onDragStart(e.touches[0].clientX)}
        onTouchMove={e => onDragMove(e.touches[0].clientX)}
        onTouchEnd={onDragEnd}
      >
        {products.map((product, idx) => {
          const offset = ((idx - current + total) % total)
          const pos = offset <= total / 2 ? offset : offset - total
          const isCenter = pos === 0
          const isAdjacent = Math.abs(pos) === 1
          const isVisible = Math.abs(pos) <= 2
          if (!isVisible) return null
          const x = pos * (SLIDE_WIDTH + SLIDE_GAP) + dragDelta
          const scale = isCenter ? 1 : isAdjacent ? 0.88 : 0.76
          const zIndex = isCenter ? 10 : isAdjacent ? 5 : 1
          const opacity = isCenter ? 1 : isAdjacent ? 0.75 : 0.4

          return (
            <motion.div
              key={product._id}
              animate={{ x, scale, opacity, y: isCenter ? -8 : 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              style={{
                position: 'absolute', width: SLIDE_WIDTH, zIndex,
                borderRadius: '24px', overflow: 'hidden', background: '#fff',
                boxShadow: isCenter ? '0 24px 64px rgba(196,69,105,0.22), 0 8px 24px rgba(61,35,20,0.1)' : '0 8px 24px rgba(61,35,20,0.08)',
                border: isCenter ? '2px solid rgba(196,69,105,0.18)' : '1.5px solid rgba(196,69,105,0.07)',
                cursor: isCenter ? 'default' : 'pointer',
              }}
              onClick={() => !isCenter && goTo(idx)}
            >
              <div style={{ position: 'relative', height: '240px', overflow: 'hidden', background: '#fff5f8' }}>
                <motion.img
                  src={product.imageUrl || product.images?.[0] || product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  whileHover={isCenter ? { scale: 1.06 } : {}}
                  transition={{ duration: 0.4 }}
                />
                <motion.div
                  animate={{ opacity: isCenter ? 1 : 0, scale: isCenter ? 1 : 0.7 }}
                  style={{ position: 'absolute', top: 14, left: 14, background: 'linear-gradient(135deg, #C44569, #E8607B)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: '50px', boxShadow: '0 4px 12px rgba(196,69,105,0.4)' }}
                >
                  ✦ New
                </motion.div>
                <motion.div
                  animate={{ opacity: isCenter ? 1 : 0 }}
                  style={{ position: 'absolute', top: 14, right: 14, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(61,35,20,0.12)' }}
                >
                  <Heart size={16} color="#C44569" />
                </motion.div>
              </div>
              <div style={{ padding: '18px 20px 20px' }}>
                <div style={{ fontSize: '0.72rem', color: '#C44569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  {product.category?.name || 'Handmade'}
                </div>
                <div style={{ fontWeight: 700, color: '#1A0A05', fontSize: '1rem', marginBottom: '8px', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {product.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 900, background: 'linear-gradient(135deg, #C44569, #D4956B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    ₹{product.price}
                  </span>
                  <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
                    <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                      <button style={{ background: 'linear-gradient(135deg, #C44569, #E8607B)', color: '#fff', border: 'none', borderRadius: '50px', padding: '8px 18px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 4px 14px rgba(196,69,105,0.35)' }}>
                        <ShoppingBag size={13} /> View
                      </button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '28px' }}>
        {products.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => goTo(idx)}
            animate={{ width: idx === current ? 28 : 8, background: idx === current ? '#C44569' : 'rgba(196,69,105,0.25)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            style={{ height: 8, borderRadius: 50, border: 'none', cursor: 'pointer', padding: 0 }}
          />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
        {[['←', -1], ['→', 1]].map(([arrow, dir]) => (
          <motion.button
            key={arrow}
            whileHover={{ scale: 1.1, background: 'linear-gradient(135deg, #C44569, #E8607B)', color: '#fff' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => goTo(current + dir)}
            style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid rgba(196,69,105,0.3)', background: '#fff', color: '#C44569', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(196,69,105,0.1)' }}
          >
            {arrow}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/products?featured=true'),
      api.get('/categories'),
      api.get('/products?sort=newest&limit=8'),
    ]).then(([p, c, n]) => {
      setFeatured(p.data)
      setCategories(c.data)
      setNewArrivals(n.data)
      setApiError(null)
    }).catch(err => setApiError(err.response?.data?.message || err.message || 'Failed to load data')).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(150deg, #fff 0%, #fff5f8 40%, #fffaf5 100%)',
        position: 'relative', overflow: 'hidden', paddingTop: '80px',
        display: 'flex', alignItems: 'center',
      }}>
        {/* dot pattern */}
        <div className="dot-pattern" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        {/* glow blobs */}
        <div style={{ position: 'absolute', top: '-8%', right: '-8%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,69,105,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-8%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(238,214,196,0.28) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="page-container" style={{ width: '100%', padding: '48px 1.5rem' }}>
          <div className="hero-grid">

            {/* LEFT — copy */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '8px 18px', borderRadius: '50px', marginBottom: '28px',
                  background: 'linear-gradient(135deg, rgba(196,69,105,0.1), rgba(238,214,196,0.2))',
                  border: '1px solid rgba(196,69,105,0.2)',
                }}>
                  <Sparkles size={13} color="#C44569" />
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C44569' }}>
                    Handmade with Love
                  </span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', fontWeight: 900, lineHeight: 1.06, marginBottom: '22px', letterSpacing: '-0.032em', color: '#1A0A05' }}
              >
                Discover{' '}
                <span style={{ background: 'linear-gradient(135deg, #C44569 10%, #E8607B 60%, #D4956B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Unique
                </span>
                <br />
                Handmade{' '}
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  Treasures
                  <svg style={{ position: 'absolute', bottom: '-4px', left: 0, width: '100%' }} viewBox="0 0 200 8" fill="none">
                    <path d="M2 6 C50 2, 150 2, 198 6" stroke="#E8A0B8" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                style={{ fontSize: '1.075rem', color: '#6B4533', lineHeight: 1.78, marginBottom: '36px', maxWidth: '430px', fontWeight: 400 }}
              >
                From charming keychains to cuddly soft toys and beautiful floral arrangements — every piece is crafted with heart by our talented artisans.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '48px' }}
              >
                <Link to="/products" style={{ textDecoration: 'none' }}>
                  <button className="btn-primary" style={{ padding: '15px 32px', fontSize: '0.9375rem' }}>
                    <ShoppingBag size={17} /> Shop Now
                  </button>
                </Link>
                <Link to="/about" style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary" style={{ padding: '15px 28px', fontSize: '0.9375rem' }}>
                    <BookOpen size={17} /> Our Story
                  </button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                style={{ display: 'flex', paddingTop: '24px', borderTop: '1px solid rgba(196,69,105,0.12)' }}
              >
                {[['500+', 'Happy Customers'], ['200+', 'Unique Products'], ['100%', 'Handmade']].map(([n, l], idx) => (
                  <div key={l} style={{
                    flex: 1, paddingRight: '20px', marginRight: '20px',
                    borderRight: idx < 2 ? '1px solid rgba(196,69,105,0.12)' : 'none',
                  }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, background: 'linear-gradient(135deg, #C44569, #D4956B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.03em' }}>{n}</div>
                    <div style={{ fontSize: '0.78rem', color: '#9E7B6C', fontWeight: 500, marginTop: '3px' }}>{l}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — Logo showcase (desktop) */}
            <LogoShowcase />

            {/* Mobile logo — simple floating version */}
            <motion.div
              className="show-mobile"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              style={{ justifyContent: 'center', padding: '8px 0 4px' }}
            >
              <motion.div
                animate={{ y: [0, -14, 0], scale: [1, 1.03, 1] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'relative', filter: 'drop-shadow(0 18px 40px rgba(196,69,105,0.28))' }}
              >
                <div style={{ position: 'absolute', inset: '-18px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(248,180,210,0.5) 0%, transparent 65%)', filter: 'blur(14px)', pointerEvents: 'none' }} />
                <img src="/logo.jpeg" alt="SoftToi" style={{ width: '240px', height: '240px', objectFit: 'contain', borderRadius: '50%', display: 'block', position: 'relative', zIndex: 2, boxShadow: '0 12px 36px rgba(196,69,105,0.22)' }} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ BRAND STRIP — logo marquee ═══ */}
      <section style={{
        background: '#fff8f9',
        borderTop: '1px solid rgba(196,69,105,0.1)',
        borderBottom: '1px solid rgba(196,69,105,0.1)',
        padding: '20px 0',
      }}>
        <div className="marquee-outer">
          <div className="marquee-track">
            {[...Array(4)].map((_, dupIdx) => (
              <div key={dupIdx} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {[
                  '/strip_logos/handmade.png',
                  '/strip_logos/gift.png',
                  '/strip_logos/eco.png',
                  '/strip_logos/fast.png',
                  '/strip_logos/sustainable.png',
                  '/strip_logos/image.png',
                ].map((src) => (
                  <div
                    key={src + dupIdx}
                    style={{ padding: '0 44px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  >
                    <img
                      src={src}
                      alt=""
                      style={{ height: 70, width: 'auto', objectFit: 'contain', display: 'block' }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}

      {/* ═══ FEATURED PRODUCTS ═══ */}
      <section style={{ background: '#fff', padding: '96px 0 48px', overflow: 'hidden' }}>
        <div className="page-container">
          <AnimatedSection>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '56px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div className="section-label">Curated Selection</div>
                <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, color: '#1A0A05', letterSpacing: '-0.025em' }}>
                  Featured Products
                </h2>
              </div>
              <Link to="/products" style={{ textDecoration: 'none' }}>
                <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  View All <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
        {loading ? (
          <div className="page-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '340px', borderRadius: '20px' }} />)}
          </div>
        ) : apiError ? (
          <p style={{ color: '#C44569', textAlign: 'center', padding: '40px 0' }}>{apiError}</p>
        ) : (
          <NewArrivalsSlider products={newArrivals.length > 0 ? newArrivals : featured} />
        )}
      </section>
      
      {/* ═══ CATEGORIES ═══ */}
      <section style={{ background: 'linear-gradient(180deg, #fff5f8 0%, #fffaf5 100%)', padding: '96px 0' }}>
        <div className="page-container">
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div className="section-label">Browse Collection</div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, color: '#1A0A05', letterSpacing: '-0.025em' }}>
                Shop by Category
              </h2>
              <p style={{ color: '#8B6655', marginTop: '14px', fontSize: '1rem', maxWidth: '440px', margin: '14px auto 0', lineHeight: 1.7 }}>
                Three unique collections, each handcrafted with finest materials and heartfelt care.
              </p>
            </div>
          </AnimatedSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
            {loading
              ? [0, 1, 2].map(i => <div key={i} className="skeleton" style={{ aspectRatio: '4/5', borderRadius: '24px' }} />)
              : apiError
                ? <p style={{ color: '#C44569', gridColumn: '1/-1', textAlign: 'center', padding: '40px 0' }}>{apiError}</p>
                : categories.map((cat, i) => <CategoryCard key={cat._id} category={cat} index={i} />)
            }
          </div>
        </div>
      </section>
            {/* ═══ FEATURE STRIP ═══ */}
      <section style={{ background: '#fff', borderTop: '1px solid rgba(196,69,105,0.08)', borderBottom: '1px solid rgba(196,69,105,0.08)', padding: '0' }}>
        <div className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0' }}>
            {FEATURES.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.08}>
                <div style={{
                  display: 'flex', gap: '16px', alignItems: 'flex-start',
                  padding: '32px 24px',
                  borderRight: i < FEATURES.length - 1 ? '1px solid rgba(196,69,105,0.08)' : 'none',
                }}>
                  <div style={{
                    width: '50px', height: '50px', borderRadius: '14px',
                    background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <f.icon size={22} color={f.iconColor} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1A0A05', marginBottom: '4px', fontSize: '0.9375rem' }}>{f.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#8B6655', lineHeight: 1.6 }}>{f.desc}</div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

    

      {/* ═══ TESTIMONIALS ═══ */}
      <section style={{ padding: '96px 0', background: 'linear-gradient(180deg, #fffaf5 0%, #fff5f8 100%)' }}>
        <div className="page-container">
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div className="section-label">Loved by Customers</div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, color: '#1A0A05', letterSpacing: '-0.025em' }}>
                Real Stories, Real Love
              </h2>
            </div>
          </AnimatedSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {TESTIMONIALS.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.12}>
                <div style={{
                  background: '#fff', borderRadius: '24px', padding: '32px 28px',
                  border: '1px solid rgba(196,69,105,0.1)',
                  boxShadow: '0 4px 24px rgba(61,35,20,0.06)',
                  transition: 'all 0.3s ease', cursor: 'default',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(196,69,105,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(61,35,20,0.06)' }}
                >
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '20px' }}>
                    {[...Array(t.stars)].map((_, j) => <Star key={j} size={14} fill="#F59E0B" color="#F59E0B" />)}
                  </div>
                  {/* Quote */}
                  <p style={{ fontSize: '0.9375rem', color: '#4A2E20', lineHeight: 1.75, marginBottom: '24px', fontStyle: 'italic', fontWeight: 400 }}>
                    "{t.text}"
                  </p>
                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={t.avatar} alt={t.name}
                      style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(196,69,105,0.2)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: '#1A0A05', fontSize: '0.9375rem' }}>{t.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#C44569', fontWeight: 600 }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section style={{ padding: '96px 0', background: '#fff' }}>
        <div className="page-container">
          <AnimatedSection>
            <div style={{
              borderRadius: '32px',
              background: 'linear-gradient(135deg, #1A0A05 0%, #3D1A25 40%, #2D1010 100%)',
              padding: 'clamp(48px, 7vw, 80px)', textAlign: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* decorative circles */}
              <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(196,69,105,0.12)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '-80px', left: '-40px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(248,200,220,0.07)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: '30px', left: '20%', width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(248,200,220,0.5)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '40px', right: '25%', width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(196,69,105,0.6)', pointerEvents: 'none' }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#E8A0B8', marginBottom: '16px' }}>Start Your Journey</div>
                <h2 style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
                  Every Piece Has<br />a Story to Tell
                </h2>
                <p style={{ color: 'rgba(248,200,220,0.75)', fontSize: '1.0625rem', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.75 }}>
                  Join thousands of happy customers who have found their perfect handmade treasure. Crafted with love, delivered with care.
                </p>
                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/products" style={{ textDecoration: 'none' }}>
                    <button style={{
                      background: 'linear-gradient(135deg, #C44569, #E8607B)',
                      color: '#fff', padding: '15px 36px', borderRadius: '50px',
                      fontWeight: 700, fontSize: '0.9375rem', border: 'none', cursor: 'pointer',
                      boxShadow: '0 8px 28px rgba(196,69,105,0.45)',
                      transition: 'all 0.25s', display: 'inline-flex', alignItems: 'center', gap: '8px',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(196,69,105,0.55)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(196,69,105,0.45)' }}
                    >
                      <ShoppingBag size={17} /> Shop Now
                    </button>
                  </Link>
                  <Link to="/contact" style={{ textDecoration: 'none' }}>
                    <button style={{
                      background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)',
                      padding: '15px 32px', borderRadius: '50px',
                      fontWeight: 600, fontSize: '0.9375rem', border: '1.5px solid rgba(255,255,255,0.25)',
                      cursor: 'pointer', transition: 'all 0.25s',
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
                    >
                      Custom Order
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

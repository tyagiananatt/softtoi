import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

// ── CSS injected once ──────────────────────────────────────────────────────
const STYLES = `
  @keyframes bouquetFall {
    0%   { transform: translateY(-50px) rotate(0deg); opacity: 0; }
    10%  { opacity: 0.7; }
    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
  }
  @keyframes circleSlideCW {
    0%   { opacity:1; clip-path: circle(0% at 100% 50%); }
    100% { opacity:1; clip-path: circle(150% at 100% 50%); }
  }
  @keyframes circleSlideCC {
    0%   { opacity:1; clip-path: circle(0% at 0% 50%); }
    100% { opacity:1; clip-path: circle(150% at 0% 50%); }
  }
  @keyframes navRipple {
    0%   { opacity:1; transform:scale(1); }
    100% { opacity:0; transform:scale(1.8); }
  }

  .bq-orbit-img {
    position: absolute;
    inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.6s ease;
    z-index: 1;
  }
  .bq-orbit-img.bq-active  { opacity: 1; z-index: 2; }
  .bq-orbit-img.bq-leaving { opacity: 0; z-index: 1; }
  .bq-orbit-img.bq-enter-cw {
    opacity: 0;
    clip-path: circle(0% at 100% 50%);
    animation: circleSlideCW 0.65s cubic-bezier(0.4,0,0.2,1) forwards;
    z-index: 3;
  }
  .bq-orbit-img.bq-enter-ccw {
    opacity: 0;
    clip-path: circle(0% at 0% 50%);
    animation: circleSlideCC 0.65s cubic-bezier(0.4,0,0.2,1) forwards;
    z-index: 3;
  }

  .bq-orbit-card { position:absolute; border-radius:50%; overflow:hidden; z-index:6; background:#FFE4EC; box-shadow:0 12px 30px rgba(232,160,184,0.3),0 0 0 4px rgba(255,255,255,0.8); cursor:pointer; }
  .bq-orbit-card:hover { box-shadow:0 20px 40px rgba(232,160,184,0.5),0 0 0 4px #F8C8DC; }
  .bq-orbit-label { position:absolute; bottom:0; left:0; right:0; background:linear-gradient(0deg,rgba(0,0,0,0.65),transparent); color:#fff; padding:18px 6px 7px; font-size:0.68rem; font-weight:700; text-align:center; opacity:0; transition:opacity 0.3s; pointer-events:none; z-index:10; }
  .bq-orbit-card:hover .bq-orbit-label { opacity:1; }

  .bq-nav-btn { position:absolute; border-radius:50%; border:2.5px solid rgba(196,69,105,0.3); background:rgba(255,255,255,0.92); backdrop-filter:blur(12px); display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:30; outline:none; user-select:none; transition:background 0.3s,border-color 0.3s,box-shadow 0.3s,transform 0.35s cubic-bezier(0.34,1.56,0.64,1); box-shadow:0 6px 24px rgba(196,69,105,0.18),0 2px 8px rgba(0,0,0,0.06),inset 0 1px 0 rgba(255,255,255,0.9); overflow:hidden; }
  .bq-nav-btn:hover { background:linear-gradient(135deg,#FFE4EC,#fff) !important; border-color:rgba(196,69,105,0.6) !important; box-shadow:0 10px 32px rgba(196,69,105,0.3) !important; }
  .bq-nav-btn:active { transform:translateY(-50%) scale(0.92) !important; }
  .bq-nav-btn::before { content:''; position:absolute; inset:-4px; border-radius:50%; border:2px solid rgba(196,69,105,0.4); opacity:0; transform:scale(1); pointer-events:none; }
  .bq-nav-btn.bq-ripple::before { animation:navRipple 0.55s ease-out forwards; }

  .bq-center-card { position:absolute; border-radius:36px; overflow:hidden; cursor:pointer; }
  .bq-center-card:hover .bq-center-img { transform:scale(1.08) !important; }
  .bq-buy-btn:hover { transform:translateY(-2px) scale(1.05) !important; }

  /* ── Responsive ── */
  @media (max-width:900px) {
    .bq-stage { height:720px !important; max-width:760px !important; }
    .bq-wreath { top:370px !important; width:540px !important; height:540px !important; }
    .bq-wreath-r1 { width:415px !important; height:415px !important; }
    .bq-wreath-r2 { width:290px !important; height:290px !important; }
    .bq-center-card { top:160px !important; width:290px !important; height:440px !important; }
    .bq-orbit-card { width:110px !important; height:110px !important; }
    .bq-pos-1 { top:45px !important; }
    .bq-pos-2 { top:180px !important; left:calc(50% + 179px) !important; }
    .bq-pos-3 { top:450px !important; left:calc(50% + 179px) !important; }
    .bq-pos-7 { top:450px !important; left:calc(50% - 289px) !important; }
    .bq-pos-8 { top:180px !important; left:calc(50% - 289px) !important; }
    .bq-nav-btn { top:370px !important; width:44px !important; height:44px !important; }
    .bq-nav-prev { left:calc(50% - 320px) !important; }
    .bq-nav-next { left:calc(50% + 270px) !important; }
  }
  @media (max-width:600px) {
    .bq-section { padding:50px 16px 70px !important; }
    .bq-stage { height:620px !important; max-width:100% !important; padding-top:80px !important; }
    .bq-wreath { top:390px !important; width:350px !important; height:350px !important; }
    .bq-wreath-r1 { width:265px !important; height:265px !important; }
    .bq-wreath-r2 { width:185px !important; height:185px !important; }
    .bq-center-card { top:240px !important; width:195px !important; height:275px !important; border-radius:22px !important; }
    .bq-orbit-card { width:80px !important; height:80px !important; }
    .bq-pos-1 { top:95px !important; }
    .bq-pos-2 { top:183px !important; left:calc(50% + 111px) !important; }
    .bq-pos-3 { top:357px !important; left:calc(50% + 111px) !important; }
    .bq-pos-7 { top:357px !important; left:calc(50% - 191px) !important; }
    .bq-pos-8 { top:183px !important; left:calc(50% - 191px) !important; }
    .bq-nav-btn { top:390px !important; width:36px !important; height:36px !important; }
    .bq-nav-prev { left:4px !important; }
    .bq-nav-next { left:auto !important; right:4px !important; }
  }
  @media (max-width:380px) {
    .bq-stage { height:600px !important; }
    .bq-wreath { top:380px !important; width:310px !important; height:310px !important; }
    .bq-wreath-r1 { width:235px !important; height:235px !important; }
    .bq-wreath-r2 { width:165px !important; height:165px !important; }
    .bq-center-card { top:235px !important; width:175px !important; height:255px !important; border-radius:20px !important; }
    .bq-orbit-card { width:68px !important; height:68px !important; }
    .bq-pos-1 { top:90px !important; }
    .bq-pos-2 { top:175px !important; left:calc(50% + 95px) !important; }
    .bq-pos-3 { top:338px !important; left:calc(50% + 95px) !important; }
    .bq-pos-7 { top:338px !important; left:calc(50% - 163px) !important; }
    .bq-pos-8 { top:175px !important; left:calc(50% - 163px) !important; }
    .bq-nav-btn { top:370px !important; }
  }
`

// ── Inject styles once ─────────────────────────────────────────────────────
let stylesInjected = false
function injectStyles() {
  if (stylesInjected) return
  const tag = document.createElement('style')
  tag.textContent = STYLES
  document.head.appendChild(tag)
  stylesInjected = true
}

// ── OrbitCircle — exact port of HTML/JS wipe animation ────────────────────
function OrbitCircle({ products, currentIdx, posClass, animDirection }) {
  // refs to all img DOM nodes inside this circle
  const imgRefs   = useRef([])   // array of img elements
  const prevIdxRef = useRef(currentIdx)
  const isFirstRender = useRef(true)

  const ANIM_DURATION = 650

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      // On mount: just show the active image, no animation
      imgRefs.current.forEach((img, i) => {
        if (!img) return
        img.className = 'bq-orbit-img' + (i === currentIdx ? ' bq-active' : '')
        img.style.opacity = i === currentIdx ? '1' : ''
      })
      prevIdxRef.current = currentIdx
      return
    }

    const prevIdx = prevIdxRef.current
    if (prevIdx === currentIdx) return

    const curImg  = imgRefs.current[prevIdx]
    const nextImg = imgRefs.current[currentIdx]
    const animClass = animDirection === 1 ? 'bq-enter-cw' : 'bq-enter-ccw'

    // 1. outgoing — mark as leaving
    if (curImg) {
      curImg.className = 'bq-orbit-img bq-leaving'
    }

    // 2. incoming — reset, force reflow, then animate
    if (nextImg) {
      nextImg.className = 'bq-orbit-img'
      nextImg.style.opacity = ''
      // force reflow so animation restarts cleanly
      void nextImg.offsetWidth
      nextImg.className = `bq-orbit-img ${animClass}`
    }

    // 3. cleanup after animation
    const timer = setTimeout(() => {
      if (nextImg) {
        nextImg.className = 'bq-orbit-img bq-active'
      }
      if (curImg) {
        curImg.className = 'bq-orbit-img'
        curImg.style.opacity = ''
      }
    }, ANIM_DURATION + 50)

    prevIdxRef.current = currentIdx
    return () => clearTimeout(timer)
  }, [currentIdx, animDirection])

  if (!products || products.length === 0) return null

  const posStyles = {
    'pos-1': { top: 35, left: '50%', transform: 'translateX(-50%)' },
    'pos-2': { top: 195, left: 'calc(50% + 212px)' },
    'pos-3': { top: 515, left: 'calc(50% + 212px)' },
    'pos-7': { top: 515, left: 'calc(50% - 342px)' },
    'pos-8': { top: 195, left: 'calc(50% - 342px)' },
  }

  const posClassMap = {
    'pos-1': 'bq-pos-1',
    'pos-2': 'bq-pos-2',
    'pos-3': 'bq-pos-3',
    'pos-7': 'bq-pos-7',
    'pos-8': 'bq-pos-8',
  }

  return (
    <div
      className={`bq-orbit-card ${posClassMap[posClass]}`}
      onClick={() => { const p = products[currentIdx]; if (p?._id) window.location.href = `/products/${p._id}` }}
      style={{
        width: 130, height: 130,
        cursor: 'pointer',
        ...posStyles[posClass],
      }}
    >
      {/* All images stacked — only active one visible */}
      {products.map((p, i) => (
        <img
          key={i}
          ref={el => { imgRefs.current[i] = el }}
          src={p.imageUrl || p.image || ''}
          alt={p.name || ''}
          className={'bq-orbit-img' + (i === currentIdx ? ' bq-active' : '')}
          style={{ opacity: i === currentIdx ? 1 : 0 }}
        />
      ))}
      {/* Label */}
      <div className="bq-orbit-label">
        {products[currentIdx]?.name || ''}
      </div>
    </div>
  )
}

// ── CenterCard ─────────────────────────────────────────────────────────────
function CenterCard({ products }) {
  const [idx, setIdx]         = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [backSrc, setBackSrc]   = useState('')
  const timerRef  = useRef(null)
  const navigate  = useNavigate()
  const { addToCart }      = useCart()
  const { isCustomerAuth } = useAuth()
  const { addToast }       = useToast()

  const go = useCallback((nextIdx) => {
    if (flipping || products.length === 0) return
    setFlipping(true)
    setBackSrc(products[nextIdx]?.imageUrl || products[nextIdx]?.image || '')
    setTimeout(() => {
      setIdx(nextIdx)
      setFlipping(false)
    }, 820)
  }, [flipping, products])

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setIdx(i => {
        const next = (i + 1) % products.length
        // use functional update to avoid stale closure
        setFlipping(f => {
          if (!f) {
            setBackSrc(products[next]?.imageUrl || products[next]?.image || '')
            setTimeout(() => { setIdx(next); setFlipping(false) }, 820)
          }
          return f
        })
        return i
      })
    }, 4500)
  }, [products])

  useEffect(() => {
    if (products.length === 0) return
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [products])

  if (products.length === 0) return null
  const p        = products[idx]
  const imgSrc   = p.imageUrl || p.image || ''
  const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : null

  const handleBuy = (e) => {
    e.stopPropagation()
    if (!isCustomerAuth) { addToast('Please log in first', 'info'); navigate('/login'); return }
    addToCart(p)
    navigate('/checkout')
  }

  return (
    <div
      className="bq-center-card"
      style={{
        top: 180, left: '50%', width: 320, height: 480,
        transform: 'translateX(-50%)',
        boxShadow: '0 25px 60px rgba(232,160,184,0.4),0 0 0 6px rgba(255,255,255,0.6),0 0 0 8px rgba(248,200,220,0.3)',
        zIndex: 10,
      }}
      onMouseEnter={() => clearInterval(timerRef.current)}
      onMouseLeave={startTimer}
      onClick={() => { if (p?._id) window.location.href = `/products/${p._id}` }}
    >
      {/* Flip container */}
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transformStyle: 'preserve-3d',
        transition: flipping ? 'transform 0.8s cubic-bezier(0.65,0,0.35,1)' : 'none',
        transform: flipping ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        {/* ── FRONT ── */}
        <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden', display:'flex', flexDirection:'column', background:'linear-gradient(180deg,#fff 0%,#FFF8FB 100%)' }}>
          {/* Ribbon */}
          <div style={{ position:'absolute', top:20, left:-8, background:'linear-gradient(135deg,#C44569,#E8607B)', color:'#fff', padding:'8px 18px 8px 14px', fontSize:'0.7rem', fontWeight:800, letterSpacing:'0.15em', boxShadow:'0 4px 14px rgba(196,69,105,0.4)', zIndex:3, clipPath:'polygon(0 0,100% 0,92% 50%,100% 100%,0 100%)' }}>FEATURED</div>
          {/* Discount */}
          {discount && (
            <div style={{ position:'absolute', top:20, right:20, width:60, height:60, background:'linear-gradient(135deg,#FBD47A,#F4B860)', borderRadius:'50%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontWeight:900, boxShadow:'0 6px 18px rgba(244,184,96,0.5)', zIndex:3 }}>
              <span style={{ fontSize:'1.1rem', lineHeight:1, color:'#7A5C4E' }}>{discount}%</span>
              <span style={{ fontSize:'0.55rem', letterSpacing:'0.1em', color:'#7A5C4E' }}>OFF</span>
            </div>
          )}
          {/* Image */}
          <div style={{ position:'relative', width:'100%', height:'62%', overflow:'hidden', background:'linear-gradient(135deg,#FFE4EC,#FFF0E5)' }}>
            <img className="bq-center-img" src={imgSrc} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.8s ease' }} />
          </div>
          {/* Info */}
          <div style={{ padding:'20px 24px', flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:'0.65rem', color:'#B89980', textTransform:'uppercase', letterSpacing:'0.18em', marginBottom:4, fontWeight:700 }}>{p.category?.replace(/-/g,' ') || 'Flowers'}</div>
              <h3 style={{ fontSize:'1.3rem', fontWeight:800, color:'#7A5C4E', marginBottom:8, lineHeight:1.2 }}>{p.name}</h3>
              <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:12, color:'#FBD47A', fontSize:'0.9rem' }}>
                ★★★★<span style={{ opacity:0.4 }}>★</span>
                <span style={{ color:'#9E7B6C', fontSize:'0.78rem', marginLeft:4 }}>({p.reviewCount || 0} reviews)</span>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                <span style={{ fontSize:'1.55rem', fontWeight:800, color:'#C44569' }}><span style={{ fontSize:'1rem' }}>₹</span>{p.price}</span>
                {p.originalPrice && <span style={{ fontSize:'0.95rem', color:'#B89980', textDecoration:'line-through' }}>₹{p.originalPrice}</span>}
              </div>
              <button
                className="bq-buy-btn"
                onClick={handleBuy}
                style={{ background:'linear-gradient(135deg,#C44569,#E8607B)', color:'#fff', border:'none', padding:'10px 20px', borderRadius:50, fontWeight:800, fontSize:'0.82rem', cursor:'pointer', boxShadow:'0 6px 16px rgba(196,69,105,0.4)', display:'flex', alignItems:'center', gap:6, transition:'all 0.3s' }}
              >
                Buy Now
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
        {/* ── BACK ── */}
        <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden', transform:'rotateY(180deg)', background:'#FFE4EC' }}>
          <img src={backSrc} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        </div>
      </div>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
export default function BouquetGarden({ products = [] }) {
  // orbitOffset: shared index offset for all circles
  // animDir: +1 = CW (right arrow), -1 = CCW (left arrow)
  const [orbitOffset, setOrbitOffset] = useState(0)
  const [animDir,     setAnimDir]     = useState(1)
  const [petals,      setPetals]      = useState([])
  const autoRef   = useRef(null)
  const isAnimRef = useRef(false)  // debounce rapid clicks

  const TOTAL       = products.length
  const NUM_CIRCLES = 5
  const POS         = ['pos-1', 'pos-2', 'pos-3', 'pos-7', 'pos-8']

  // Inject CSS once
  useEffect(() => { injectStyles() }, [])

  // ── Navigate orbit ──
  const navigate_orbit = useCallback((dir) => {
    if (isAnimRef.current) return
    isAnimRef.current = true
    setAnimDir(dir)
    setOrbitOffset(o => o + dir)
    setTimeout(() => { isAnimRef.current = false }, 750)
  }, [])

  // ── Auto-rotate orbit ──
  useEffect(() => {
    if (TOTAL === 0) return
    autoRef.current = setInterval(() => navigate_orbit(1), 3500)
    return () => clearInterval(autoRef.current)
  }, [TOTAL, navigate_orbit])

  // ── Falling petals ──
  useEffect(() => {
    const colors = [
      'linear-gradient(135deg,#F8C8DC,#E8A0B8)',
      'linear-gradient(135deg,#FBD47A,#F4B860)',
      'linear-gradient(135deg,#EED6C4,#D4B5A5)',
      'linear-gradient(135deg,#E8A0B8,#C44569)',
    ]
    setPetals(Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${8 + Math.random() * 8}s`,
      delay: `${Math.random() * 5}s`,
      size: `${12 + Math.random() * 14}px`,
      bg: colors[Math.floor(Math.random() * colors.length)],
    })))
    const iv = setInterval(() => {
      setPetals(prev => [...prev.slice(-20), {
        id: Date.now(),
        left: `${Math.random() * 100}%`,
        duration: `${8 + Math.random() * 8}s`,
        delay: '0s',
        size: `${12 + Math.random() * 14}px`,
        bg: colors[Math.floor(Math.random() * colors.length)],
      }])
    }, 600)
    return () => clearInterval(iv)
  }, [])

  if (TOTAL === 0) return null

  return (
    <section
      className="bq-section"
      style={{ position:'relative', padding:'100px 20px 120px', overflow:'hidden', background:'linear-gradient(180deg,#FFEFF5 0%,#FFF6EC 50%,#FFEFF5 100%)' }}
      onMouseEnter={() => clearInterval(autoRef.current)}
      onMouseLeave={() => { autoRef.current = setInterval(() => navigate_orbit(1), 3500) }}
    >
      {/* Blobs */}
      <div style={{ position:'absolute', width:500, height:500, background:'radial-gradient(circle,#F8C8DC,transparent)', borderRadius:'50%', filter:'blur(80px)', opacity:0.5, top:-100, left:-100, pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'absolute', width:600, height:600, background:'radial-gradient(circle,#EED6C4,transparent)', borderRadius:'50%', filter:'blur(80px)', opacity:0.5, bottom:-150, right:-150, pointerEvents:'none', zIndex:0 }} />

      {/* Petals */}
      {petals.map(p => (
        <div key={p.id} style={{ position:'absolute', width:p.size, height:p.size, background:p.bg, borderRadius:'0 100% 0 100%', left:p.left, top:-50, opacity:0.7, pointerEvents:'none', zIndex:1, animation:`bouquetFall ${p.duration} ${p.delay} linear forwards` }} />
      ))}

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:60, position:'relative', zIndex:5 }}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:6, background:'linear-gradient(135deg,#FFE4EC,#EED6C4)', color:'#7A5C4E', fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', padding:'10px 22px', borderRadius:50, marginBottom:18, boxShadow:'0 4px 14px rgba(248,200,220,0.4)' }}>
          🌸 Handmade Blooms
        </span>
        <h2 style={{ fontSize:'clamp(2rem,5vw,3.4rem)', fontWeight:800, color:'#7A5C4E', marginBottom:14, letterSpacing:-1, lineHeight:1.1 }}>
          Bouquets That <br />
          <span style={{ background:'linear-gradient(135deg,#E8A0B8,#C44569)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Bloom Forever</span>
        </h2>
        <p style={{ color:'#9E7B6C', fontSize:'1.05rem', maxWidth:580, margin:'0 auto', lineHeight:1.6 }}>
          Crocheted with patience, gifted with love. Our flowers never wilt — they're here to bring joy season after season.
        </p>
      </div>

      {/* Stage */}
      <div
        className="bq-stage"
        style={{ position:'relative', maxWidth:1100, margin:'0 auto', height:800, zIndex:5 }}
      >
        {/* Wreath rings */}
        <div
          className="bq-wreath"
          style={{ position:'absolute', top:420, left:'50%', transform:'translate(-50%,-50%)', width:640, height:640, border:'2px dashed rgba(232,160,184,0.3)', borderRadius:'50%', pointerEvents:'none', zIndex:2 }}
        >
          <div className="bq-wreath-r1" style={{ position:'absolute', width:490, height:490, border:'1px solid rgba(232,160,184,0.18)', borderRadius:'50%', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />
          <div className="bq-wreath-r2" style={{ position:'absolute', width:340, height:340, border:'1px solid rgba(232,160,184,0.12)', borderRadius:'50%', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />
        </div>

        {/* ── LEFT ARROW ── */}
        <button
          className="bq-nav-btn bq-nav-prev"
          onClick={() => navigate_orbit(-1)}
          style={{ top:420, left:'calc(50% - 370px)', transform:'translateY(-50%)', width:52, height:52 }}
          aria-label="Previous"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C44569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        {/* ── RIGHT ARROW ── */}
        <button
          className="bq-nav-btn bq-nav-next"
          onClick={() => navigate_orbit(1)}
          style={{ top:420, left:'calc(50% + 320px)', transform:'translateY(-50%)', width:52, height:52 }}
          aria-label="Next"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C44569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18"/>
          </svg>
        </button>

        {/* ── CENTER CARD (independent) ── */}
        <CenterCard products={products} />

        {/* ── 5 ORBIT CIRCLES ── */}
        {POS.map((pos, i) => {
          // Each circle gets its own index offset from the global offset
          const idx = ((orbitOffset + i) % TOTAL + TOTAL) % TOTAL
          return (
            <OrbitCircle
              key={pos}
              products={products}
              currentIdx={idx}
              posClass={pos}
              animDirection={animDir}
            />
          )
        })}
      </div>

      {/* View All */}
      <div style={{ textAlign:'center', marginTop:60, position:'relative', zIndex:5 }}>
        <Link to="/products?category=flowers" style={{ textDecoration:'none' }}>
          <button
            style={{ display:'inline-flex', alignItems:'center', gap:12, background:'linear-gradient(135deg,#7A5C4E,#5A4438)', color:'#fff', fontWeight:700, fontSize:'1rem', letterSpacing:'0.05em', padding:'18px 44px', borderRadius:50, border:'none', cursor:'pointer', boxShadow:'0 10px 30px rgba(122,92,78,0.4)', transition:'all 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}
            onMouseEnter={e => { e.currentTarget.style.background='linear-gradient(135deg,#E8A0B8,#C44569)'; e.currentTarget.style.transform='translateY(-3px) scale(1.04)' }}
            onMouseLeave={e => { e.currentTarget.style.background='linear-gradient(135deg,#7A5C4E,#5A4438)'; e.currentTarget.style.transform='none' }}
          >
            <span>Discover All Bouquets</span>
            <span style={{ width:26, height:26, background:'rgba(255,255,255,0.2)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </button>
        </Link>
      </div>
    </section>
  )
}
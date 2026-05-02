// import { useState } from 'react'
// import { Link } from 'react-router-dom'
// import { Instagram, MapPin, Phone, Mail, Heart, Send } from 'lucide-react'
// import api from '../utils/api'

// export default function Footer() {
//   const [email, setEmail] = useState('')
//   const [subscribed, setSubscribed] = useState(false)

//   const handleSubscribe = (e) => {
//     e.preventDefault()
//     if (email.trim()) { setSubscribed(true); setEmail('') }
//   }

//   return (
//     <footer style={{ background: '#FFF6EC', borderTop: '1px solid rgba(248,200,220,0.3)', marginTop: 'auto' }}>

//       {/* Newsletter */}
//       <div style={{ background: 'linear-gradient(135deg, #F8C8DC22, #EED6C422)', borderBottom: '1px solid rgba(248,200,220,0.2)', padding: '48px 0' }}>
//         <div className="page-container" style={{ textAlign: 'center' }}>
//           <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E8A0B8', marginBottom: '10px' }}>Newsletter</div>
//           <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#7A5C4E', marginBottom: '8px' }}>Stay in the Loop</h3>
//           <p style={{ color: '#9E7B6C', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
//             Get exclusive offers, new arrivals, and handmade inspiration delivered to your inbox.
//           </p>
//           {subscribed ? (
//             <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F0FDF4', color: '#15803d', padding: '12px 24px', borderRadius: '50px', border: '1px solid #86efac', fontWeight: 600 }}>
//               <Heart size={16} fill="#15803d" /> Thank you for subscribing!
//             </div>
//           ) : (
//             <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', maxWidth: '460px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
//               <input
//                 type="email" required value={email} onChange={e => setEmail(e.target.value)}
//                 placeholder="Your email address"
//                 className="form-input"
//                 style={{ flex: 1, minWidth: '200px' }}
//               />
//               <button type="submit" className="btn-primary" style={{ gap: '6px' }}>
//                 <Send size={14} /> Subscribe
//               </button>
//             </form>
//           )}
//         </div>
//       </div>

//       {/* Main footer */}
//       <div className="page-container" style={{ padding: '56px 1.5rem 40px' }}>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '36px 48px' }}>

//           {/* Brand */}
//           <div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
//               <div style={{
//                 width: '38px', height: '38px', borderRadius: '50%',
//                 background: 'linear-gradient(135deg, #F8C8DC, #EED6C4)',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 fontWeight: 800, fontSize: '1rem', color: '#7A5C4E',
//               }}>S</div>
//               <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#7A5C4E' }}>
//                 <span>SOFT</span><span style={{ color: '#7A5C4E' }}>OI</span>
//               </span>
//             </div>
//             <p style={{ fontSize: '0.875rem', color: '#9E7B6C', lineHeight: 1.7, marginBottom: '20px' }}>
//               Handcrafted with love and care. Every piece tells a story of artistry, passion, and dedication to quality.
//             </p>
//             <div style={{ display: 'flex', gap: '10px' }}>
//               {/* Instagram */}
//               <a href="https://www.instagram.com/softoi.shop/" target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(248,200,220,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9E7B6C', transition: 'background 0.2s', textDecoration: 'none' }}
//                 onMouseEnter={e => { e.currentTarget.style.background = '#F8C8DC' }}
//                 onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,200,220,0.3)' }}
//               >
//                 <Instagram size={16} />
//               </a>
//               {/* WhatsApp */}
//               <a href="https://wa.me/917973458081" target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(248,200,220,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9E7B6C', transition: 'background 0.2s', textDecoration: 'none' }}
//                 onMouseEnter={e => { e.currentTarget.style.background = '#F8C8DC' }}
//                 onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,200,220,0.3)' }}
//               >
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
//               </a>
//             </div>
//           </div>

//           {/* Quick links */}
//           <div>
//             <h4 style={{ fontWeight: 700, color: '#7A5C4E', marginBottom: '16px', fontSize: '0.9375rem' }}>Quick Links</h4>
//             {[['Home', '/'], ['Shop All', '/products'], ['Cart', '/cart'], ['Wishlist', '/wishlist'], ['Orders', '/orders']].map(([l, h]) => (
//               <Link key={h} to={h} style={{ display: 'block', color: '#9E7B6C', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '10px', transition: 'color 0.2s' }}
//                 onMouseEnter={e => e.currentTarget.style.color = '#E8A0B8'}
//                 onMouseLeave={e => e.currentTarget.style.color = '#9E7B6C'}
//               >{l}</Link>
//             ))}
//           </div>

//           {/* Categories */}
//           <div>
//             <h4 style={{ fontWeight: 700, color: '#7A5C4E', marginBottom: '16px', fontSize: '0.9375rem' }}>Categories</h4>
//             {[['Keychains', '/products?category=keychains'], ['Soft Toys', '/products?category=soft-toys'], ['Flowers', '/products?category=flowers'], ['About Us', '/about'], ['Contact', '/contact']].map(([l, h]) => (
//               <Link key={h} to={h} style={{ display: 'block', color: '#9E7B6C', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '10px', transition: 'color 0.2s' }}
//                 onMouseEnter={e => e.currentTarget.style.color = '#E8A0B8'}
//                 onMouseLeave={e => e.currentTarget.style.color = '#9E7B6C'}
//               >{l}</Link>
//             ))}
//           </div>

//           {/* Contact */}
//           <div>
//             <h4 style={{ fontWeight: 700, color: '#7A5C4E', marginBottom: '16px', fontSize: '0.9375rem' }}>Get in Touch</h4>
//             {[
//               [MapPin, 'Jalandhar City, Punjab, India, 144411'],
//               [Phone, '+91 8922090280'],
//               [Mail, 'ilovesoftoi@gmail.com'],
//             ].map(([Icon, text]) => (
//               <div key={text} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
//                 <Icon size={15} color="#E8A0B8" style={{ flexShrink: 0, marginTop: '2px' }} />
//                 <span style={{ fontSize: '0.875rem', color: '#9E7B6C', lineHeight: 1.5 }}>{text}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Bottom bar */}
//       <div style={{ borderTop: '1px solid rgba(248,200,220,0.3)', padding: '20px 0' }}>
//         <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
//           <span style={{ fontSize: '0.8125rem', color: '#9E7B6C' }}>
//             © {new Date().getFullYear()} Softoi. All rights reserved.
//           </span>
//           <span style={{ fontSize: '0.8125rem', color: '#9E7B6C', display: 'flex', alignItems: 'center', gap: '4px' }}>
//             Made with <Heart size={12} fill="#E8A0B8" color="#E8A0B8" /> Softoi.
//           </span>
//         </div>
//       </div>
//     </footer>
//   )
// }


import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, MapPin, Phone, Mail, Heart, Send } from 'lucide-react'
import api from '../utils/api'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [bloomVisible, setBloomVisible] = useState(false)
  const footerRef = useRef(null)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) { setSubscribed(true); setEmail('') }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setBloomVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )
    if (footerRef.current) observer.observe(footerRef.current)
    return () => observer.disconnect()
  }, [])

  // Outline/sketch-style flower
  const Flower = ({ className, petalColor, stemColor = '#9CB37E', petalCount = 5, petalRx = 14, petalRy = 22, centerColor = '#FBD47A' }) => {
    const petals = []
    const angleStep = 360 / petalCount
    for (let i = 0; i < petalCount; i++) {
      petals.push(
        <ellipse
          key={i}
          cx="100" cy="90" rx={petalRx} ry={petalRy}
          fill={petalColor}
          fillOpacity="0.4"
          stroke={petalColor}
          strokeWidth="2.5"
          transform={`rotate(${i * angleStep} 100 110)`}
        />
      )
    }
    return (
      <svg className={`flower ${className}`} viewBox="0 0 200 250" style={{ width: '100%', height: '100%', display: 'block' }}>
        <path className="stem" d="M100,250 Q100,180 100,120" fill="none" stroke={stemColor} strokeWidth="3" strokeLinecap="round" />
        <path className="leaf" d="M100,180 Q70,170 60,150 Q80,160 100,175" fill="none" stroke={stemColor} strokeWidth="2.5" strokeLinecap="round" />
        <g className="bloom-grp">
          {petals}
          <circle className="center-dot" cx="100" cy="110" r="10" fill={centerColor} stroke="#E8A85C" strokeWidth="1.5" />
        </g>
      </svg>
    )
  }

  return (
    <footer
      ref={footerRef}
      className={bloomVisible ? 'site-footer in-view' : 'site-footer'}
      style={{ background: '#FFF6EC', borderTop: '1px solid rgba(248,200,220,0.3)', marginTop: 'auto', position: 'relative' }}
    >

      <style>{`
        .site-footer .flower {
          transform-origin: bottom center;
        }
        .site-footer .flower .stem,
        .site-footer .flower .leaf {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
        }
        .site-footer .flower .leaf {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
        }
        .site-footer .flower .bloom-grp {
          transform-origin: 100px 110px;
          transform: scale(0);
          opacity: 0;
        }

        .site-footer.in-view .flower .stem {
          animation: ft-draw 2s ease-out forwards;
        }
        .site-footer.in-view .flower .leaf {
          animation: ft-draw 1s ease-out forwards;
        }
        .site-footer.in-view .flower .bloom-grp {
          animation: ft-bloom 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .site-footer.in-view .flower .center-dot {
          animation: ft-pulse 2s ease-in-out infinite;
          transform-origin: center;
        }
        .site-footer.in-view .footer-flower-bg {
          animation: ft-sway 4s ease-in-out infinite;
          transform-origin: bottom center;
        }

        /* Stagger delays */
        .site-footer.in-view .flower-1 .stem { animation-delay: 0.1s; }
        .site-footer.in-view .flower-1 .leaf { animation-delay: 1.3s; }
        .site-footer.in-view .flower-1 .bloom-grp { animation-delay: 2.1s; }
        .site-footer.in-view .flower-1 .center-dot { animation-delay: 3.3s; }
        .site-footer.in-view .bg-pos-1 { animation-delay: 3.5s; }

        .site-footer.in-view .flower-2 .stem { animation-delay: 0.4s; }
        .site-footer.in-view .flower-2 .leaf { animation-delay: 1.6s; }
        .site-footer.in-view .flower-2 .bloom-grp { animation-delay: 2.4s; }
        .site-footer.in-view .flower-2 .center-dot { animation-delay: 3.6s; }
        .site-footer.in-view .bg-pos-2 { animation-delay: 3.8s; animation-duration: 4.5s; }

        .site-footer.in-view .flower-3 .stem { animation-delay: 0.7s; }
        .site-footer.in-view .flower-3 .leaf { animation-delay: 1.9s; }
        .site-footer.in-view .flower-3 .bloom-grp { animation-delay: 2.7s; }
        .site-footer.in-view .flower-3 .center-dot { animation-delay: 3.9s; }
        .site-footer.in-view .bg-pos-3 { animation-delay: 4.1s; animation-duration: 3.8s; }

        .site-footer.in-view .flower-4 .stem { animation-delay: 1s; }
        .site-footer.in-view .flower-4 .leaf { animation-delay: 2.2s; }
        .site-footer.in-view .flower-4 .bloom-grp { animation-delay: 3s; }
        .site-footer.in-view .flower-4 .center-dot { animation-delay: 4.2s; }
        .site-footer.in-view .bg-pos-4 { animation-delay: 4.4s; animation-duration: 5s; }

        .site-footer.in-view .flower-5 .stem { animation-delay: 1.3s; }
        .site-footer.in-view .flower-5 .leaf { animation-delay: 2.5s; }
        .site-footer.in-view .flower-5 .bloom-grp { animation-delay: 3.3s; }
        .site-footer.in-view .flower-5 .center-dot { animation-delay: 4.5s; }
        .site-footer.in-view .bg-pos-5 { animation-delay: 4.7s; animation-duration: 4.2s; }

        .site-footer.in-view .flower-6 .stem { animation-delay: 1.6s; }
        .site-footer.in-view .flower-6 .leaf { animation-delay: 2.8s; }
        .site-footer.in-view .flower-6 .bloom-grp { animation-delay: 3.6s; }
        .site-footer.in-view .flower-6 .center-dot { animation-delay: 4.8s; }
        .site-footer.in-view .bg-pos-6 { animation-delay: 5s; animation-duration: 4.6s; }

        /* Butterflies */
        .site-footer .butterfly .wing {
          transform-origin: center;
          animation: ft-flap 0.25s ease-in-out infinite;
        }
        .site-footer.in-view .butterfly-1 {
          animation: ft-fly1 18s ease-in-out infinite;
          animation-delay: 5s;
        }
        .site-footer.in-view .butterfly-2 {
          animation: ft-fly2 20s ease-in-out infinite;
          animation-delay: 7s;
        }

        @keyframes ft-draw { to { stroke-dashoffset: 0; } }

        @keyframes ft-bloom {
          0%   { transform: scale(0) rotate(-30deg); opacity: 0; }
          60%  { transform: scale(1.1) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        @keyframes ft-pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.2); }
        }

        @keyframes ft-sway {
          0%, 100% { transform: rotate(-2deg); }
          50%      { transform: rotate(2deg); }
        }

        @keyframes ft-flap {
          0%, 100% { transform: scaleX(1); }
          50%      { transform: scaleX(0.4); }
        }

        @keyframes ft-fly1 {
          0%   { left: -3%;  top: 70%; opacity: 0; transform: rotate(-10deg); }
          10%  { opacity: 0.8; }
          25%  { left: 22%;  top: 30%; transform: rotate(15deg); }
          50%  { left: 50%;  top: 60%; transform: rotate(-15deg); }
          75%  { left: 78%;  top: 25%; transform: rotate(20deg); }
          95%  { opacity: 0.8; }
          100% { left: 105%; top: 50%; opacity: 0; }
        }

        @keyframes ft-fly2 {
          0%   { left: 105%; top: 50%; opacity: 0; transform: rotate(180deg); }
          10%  { opacity: 0.8; }
          30%  { left: 70%;  top: 75%; transform: rotate(160deg); }
          55%  { left: 35%;  top: 30%; transform: rotate(200deg); }
          80%  { left: 5%;   top: 60%; transform: rotate(170deg); }
          95%  { opacity: 0.8; }
          100% { left: -5%;  top: 40%; opacity: 0; }
        }

        /* Footer columns wrapper - relative for absolute flowers inside */
        .footer-cols-wrapper {
          position: relative;
          overflow: hidden;
        }

        /* Background flowers inside the columns section */
        .footer-flower-bg {
          position: absolute;
          bottom: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.7;
        }
        .footer-flower-bg.bg-pos-1 { left: 1%;   width: 90px;  height: 115px; }
        .footer-flower-bg.bg-pos-2 { left: 22%;  width: 70px;  height: 90px;  bottom: -10px; }
        .footer-flower-bg.bg-pos-3 { left: 38%;  width: 100px; height: 130px; }
        .footer-flower-bg.bg-pos-4 { left: 55%;  width: 75px;  height: 95px;  bottom: -5px; }
        .footer-flower-bg.bg-pos-5 { right: 22%; width: 85px;  height: 110px; }
        .footer-flower-bg.bg-pos-6 { right: 1%;  width: 95px;  height: 120px; }

        @media (max-width: 768px) {
          .footer-flower-bg { display: none; }
          .footer-flower-bg.bg-pos-1,
          .footer-flower-bg.bg-pos-6 { display: block; opacity: 0.4; width: 60px; height: 80px; }
        }

        /* Make all column content sit above flowers */
        .footer-col-content {
          position: relative;
          z-index: 2;
        }
      `}</style>

      {/* Newsletter */}
      <div style={{ background: 'linear-gradient(135deg, #F8C8DC22, #EED6C422)', borderBottom: '1px solid rgba(248,200,220,0.2)', padding: '48px 0' }}>
        <div className="page-container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E8A0B8', marginBottom: '10px' }}>Newsletter</div>
          <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#7A5C4E', marginBottom: '8px' }}>Stay in the Loop</h3>
          <p style={{ color: '#9E7B6C', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
            Get exclusive offers, new arrivals, and handmade inspiration delivered to your inbox.
          </p>
          {subscribed ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F0FDF4', color: '#15803d', padding: '12px 24px', borderRadius: '50px', border: '1px solid #86efac', fontWeight: 600 }}>
              <Heart size={16} fill="#15803d" /> Thank you for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', maxWidth: '460px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="form-input"
                style={{ flex: 1, minWidth: '200px' }}
              />
              <button type="submit" className="btn-primary" style={{ gap: '6px' }}>
                <Send size={14} /> Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ====== MAIN FOOTER COLUMNS - WITH FLOWERS IN BACKGROUND ====== */}
      <div className="footer-cols-wrapper">

        {/* Background flowers - positioned absolutely BEHIND the columns */}
        <div className="footer-flower-bg bg-pos-1">
          <Flower className="flower-1" petalColor="#F8C8DC" />
        </div>
        <div className="footer-flower-bg bg-pos-2">
          <Flower className="flower-2" petalColor="#E8A0B8" petalCount={6} petalRx={13} petalRy={20} />
        </div>
        <div className="footer-flower-bg bg-pos-3">
          <Flower className="flower-3" petalColor="#EED6C4" petalCount={8} petalRx={16} petalRy={25} />
        </div>
        <div className="footer-flower-bg bg-pos-4">
          <Flower className="flower-4" petalColor="#F8C8DC" />
        </div>
        <div className="footer-flower-bg bg-pos-5">
          <Flower className="flower-5" petalColor="#EED6C4" petalCount={6} petalRx={13} petalRy={20} />
        </div>
        <div className="footer-flower-bg bg-pos-6">
          <Flower className="flower-6" petalColor="#E8A0B8" />
        </div>

        {/* Butterflies floating around */}
        <svg className="butterfly butterfly-1" style={{ position: 'absolute', width: '28px', height: '28px', opacity: 0, zIndex: 1, pointerEvents: 'none' }} viewBox="0 0 60 60">
          <g className="wing">
            <ellipse cx="18" cy="22" rx="14" ry="10" fill="#F8C8DC" opacity="0.85" />
            <ellipse cx="20" cy="38" rx="10" ry="8" fill="#EED6C4" opacity="0.85" />
            <ellipse cx="42" cy="22" rx="14" ry="10" fill="#F8C8DC" opacity="0.85" />
            <ellipse cx="40" cy="38" rx="10" ry="8" fill="#EED6C4" opacity="0.85" />
          </g>
          <ellipse cx="30" cy="30" rx="2" ry="12" fill="#7A5C4E" />
        </svg>

        <svg className="butterfly butterfly-2" style={{ position: 'absolute', width: '24px', height: '24px', opacity: 0, zIndex: 1, pointerEvents: 'none' }} viewBox="0 0 60 60">
          <g className="wing">
            <ellipse cx="18" cy="22" rx="14" ry="10" fill="#FBD47A" opacity="0.85" />
            <ellipse cx="20" cy="38" rx="10" ry="8" fill="#F8C8DC" opacity="0.85" />
            <ellipse cx="42" cy="22" rx="14" ry="10" fill="#FBD47A" opacity="0.85" />
            <ellipse cx="40" cy="38" rx="10" ry="8" fill="#F8C8DC" opacity="0.85" />
          </g>
          <ellipse cx="30" cy="30" rx="2" ry="12" fill="#7A5C4E" />
        </svg>

        {/* Actual footer column content */}
        <div className="page-container footer-col-content" style={{ padding: '56px 1.5rem 56px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '36px 48px' }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F8C8DC, #EED6C4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1rem', color: '#7A5C4E',
                }}>S</div>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#7A5C4E' }}>
                  <span>SOFT</span><span style={{ color: '#7A5C4E' }}>OI</span>
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#9E7B6C', lineHeight: 1.7, marginBottom: '20px' }}>
                Handcrafted with love and care. Every piece tells a story of artistry, passion, and dedication to quality.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a href="https://www.instagram.com/softoi.shop/" target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(248,200,220,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9E7B6C', transition: 'background 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F8C8DC' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,200,220,0.3)' }}
                >
                  <Instagram size={16} />
                </a>
                <a href="https://wa.me/917973458081" target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(248,200,220,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9E7B6C', transition: 'background 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F8C8DC' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,200,220,0.3)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 style={{ fontWeight: 700, color: '#7A5C4E', marginBottom: '16px', fontSize: '0.9375rem' }}>Quick Links</h4>
              {[['Home', '/'], ['Shop All', '/products'], ['Cart', '/cart'], ['Wishlist', '/wishlist'], ['Orders', '/orders']].map(([l, h]) => (
                <Link key={h} to={h} style={{ display: 'block', color: '#9E7B6C', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '10px', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#E8A0B8'}
                  onMouseLeave={e => e.currentTarget.style.color = '#9E7B6C'}
                >{l}</Link>
              ))}
            </div>

            {/* Categories */}
            <div>
              <h4 style={{ fontWeight: 700, color: '#7A5C4E', marginBottom: '16px', fontSize: '0.9375rem' }}>Categories</h4>
              {[['Keychains', '/products?category=keychains'], ['Soft Toys', '/products?category=soft-toys'], ['Flowers', '/products?category=flowers'], ['About Us', '/about'], ['Contact', '/contact']].map(([l, h]) => (
                <Link key={h} to={h} style={{ display: 'block', color: '#9E7B6C', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '10px', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#E8A0B8'}
                  onMouseLeave={e => e.currentTarget.style.color = '#9E7B6C'}
                >{l}</Link>
              ))}
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontWeight: 700, color: '#7A5C4E', marginBottom: '16px', fontSize: '0.9375rem' }}>Get in Touch</h4>
              {[
                [MapPin, 'Jalandhar City, Punjab, India, 144411'],
                [Phone, '+91 8922090280'],
                [Mail, 'ilovesoftoi@gmail.com'],
              ].map(([Icon, text]) => (
                <div key={text} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
                  <Icon size={15} color="#E8A0B8" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.875rem', color: '#9E7B6C', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(248,200,220,0.3)', padding: '20px 0', position: 'relative', zIndex: 2, background: '#FFF6EC' }}>
        <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '0.8125rem', color: '#9E7B6C' }}>
            © {new Date().getFullYear()} Softoi. All rights reserved.
          </span>
          <span style={{ fontSize: '0.8125rem', color: '#9E7B6C', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Made with <Heart size={12} fill="#E8A0B8" color="#E8A0B8" /> Softoi.
          </span>
        </div>
      </div>
    </footer>
  )
}

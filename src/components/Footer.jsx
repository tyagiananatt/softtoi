import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, Heart, Send } from 'lucide-react'
import api from '../utils/api'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) { setSubscribed(true); setEmail('') }
  }

  return (
    <footer style={{ background: '#FFF6EC', borderTop: '1px solid rgba(248,200,220,0.3)', marginTop: 'auto' }}>

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

      {/* Main footer */}
      <div className="page-container" style={{ padding: '56px 1.5rem 40px' }}>
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
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="https://www.instagram.com/softoi.shop/" style={{
                  width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(248,200,220,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#9E7B6C', transition: 'background 0.2s', textDecoration: 'none',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F8C8DC'; e.currentTarget.style.color = '#7A5C4E' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,200,220,0.3)'; e.currentTarget.style.color = '#9E7B6C' }}
                >
                  <Icon size={16} />
                </a>
              ))}
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

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(248,200,220,0.3)', padding: '20px 0' }}>
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

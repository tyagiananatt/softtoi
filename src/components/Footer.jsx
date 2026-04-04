import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, MapPin, Phone, Mail, Heart, Send } from 'lucide-react'
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
              {/* Instagram */}
              <a href="https://www.instagram.com/softoi.shop/" target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(248,200,220,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9E7B6C', transition: 'background 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F8C8DC' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,200,220,0.3)' }}
              >
                <Instagram size={16} />
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/917973458081" target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(248,200,220,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9E7B6C', transition: 'background 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F8C8DC' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,200,220,0.3)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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

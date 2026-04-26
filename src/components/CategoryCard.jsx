import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// Local category banner images from public/category_card/
const SLUG_IMAGES = {
  keychains:   '/category_card/keychain.png',
  'soft-toys': '/category_card/softtoy.png',
  flowers:     '/category_card/flowers.png',
  'cute-vault-1775019784062':'/category_card/softtoy.png',
}

export default function CategoryCard({ category, index = 0 }) {
  const slugMap = { keychains: 'keychains', 'soft-toys': 'soft-toys', flowers: 'flowers', 'cute-vault-1775019784062':'cute-vault-1775019784062'  }
  const href = `/products?category=${slugMap[category.slug] || category.slug}`
  const bannerImage = SLUG_IMAGES[category.slug] || category.image

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ borderRadius: '24px', overflow: 'hidden', position: 'relative', aspectRatio: '4/5', cursor: 'pointer' }}
    >
      <Link to={href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          <img
            src={bannerImage}
            alt={category.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(26,10,5,0.88) 0%, rgba(26,10,5,0.25) 50%, transparent 100%)',
            transition: 'opacity 0.4s ease',
          }} />
          {/* Content */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '28px 24px',
          }}>
            <div style={{ fontSize: '0.75rem', color: '#F8C8DC', fontWeight: 600, marginBottom: '6px' }}>
              {category.productCount || 0} Products
            </div>
            <div style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', fontWeight: 800, color: '#fff', marginBottom: '6px', lineHeight: 1.2 }}>
              {category.name}
            </div>
            <div style={{
              fontSize: '0.8125rem', color: 'rgba(255,246,236,0.85)', lineHeight: 1.5, marginBottom: '14px',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {category.description}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#F8C8DC', fontSize: '0.875rem', fontWeight: 700 }}>
              Shop Now <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

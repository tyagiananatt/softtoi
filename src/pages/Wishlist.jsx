import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import ProductCard from '../components/ProductCard'
import { useWishlist } from '../context/WishlistContext'

export default function Wishlist() {
  const { items } = useWishlist()

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#FFF6EC' }}>
      <div className="page-container" style={{ padding: '48px 1.5rem 64px' }}>
        <AnimatedSection>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <Heart size={28} color="#E8A0B8" fill="#E8A0B8" />
            <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 900, color: '#7A5C4E' }}>
              My Wishlist{' '}
              <span style={{ fontSize: '1rem', fontWeight: 500, color: '#9E7B6C' }}>({items.length} items)</span>
            </h1>
          </div>
        </AnimatedSection>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#9E7B6C' }}>
            <Heart size={64} color="#F8C8DC" style={{ margin: '0 auto 20px', display: 'block' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7A5C4E', marginBottom: '8px' }}>Your wishlist is empty</h2>
            <p style={{ marginBottom: '24px' }}>Save items you love by clicking the heart icon on any product.</p>
            <Link to="/products"><button className="btn-primary"><ShoppingBag size={16} /> Start Shopping</button></Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {items.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}

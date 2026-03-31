import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import ProductCard from '../components/ProductCard'
import LoadingQuote from '../components/LoadingQuote'
import api from '../utils/api'

const SORTS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [sort, setSort] = useState('featured')

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {})
  }, [])

  // Sync state whenever URL params change
  useEffect(() => {
    setSearch(searchParams.get('search') || '')
    setCategory(searchParams.get('category') || 'all')
  }, [searchParams.toString()])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (search) params.set('search', search)
    if (sort !== 'featured') params.set('sort', sort)
    api.get(`/products?${params}`)
      .then(res => { setProducts(res.data); setError(null) })
      .catch(err => setError(err.response?.data?.message || err.message || 'Failed to load products'))
      .finally(() => setLoading(false))
  }, [category, search, sort])

  const clearFilters = () => {
    setSearch('')
    setCategory('all')
    setSort('featured')
    setSearchParams({})
  }

  const hasFilters = search || category !== 'all' || sort !== 'featured'

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#FFF6EC' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #F8C8DC22, #EED6C420)', borderBottom: '1px solid rgba(248,200,220,0.2)', padding: '48px 0 40px' }}>
        <div className="page-container">
          <AnimatedSection>
            <div className="section-label">Our Products</div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#7A5C4E', marginBottom: '8px' }}>Our Collection</h1>
            <p style={{ color: '#9E7B6C', fontSize: '1rem' }}>Handcrafted with love — {products.length} products found</p>
          </AnimatedSection>
        </div>
      </div>

      <div className="page-container" style={{ padding: '32px 1.5rem' }}>
        {/* Controls */}
        <AnimatedSection>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '24px', border: '1px solid rgba(248,200,220,0.2)', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <Search size={16} color="#C4A696" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>

            {/* Category pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[{ label: 'All', value: 'all' }, ...categories.map(c => ({ label: c.name, value: c.slug }))].map(c => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  style={{
                    padding: '8px 16px', borderRadius: '50px', fontSize: '0.8125rem', fontWeight: 600,
                    border: category === c.value ? 'none' : '1.5px solid #EED6C4',
                    background: category === c.value ? 'linear-gradient(135deg, #F8C8DC, #EED6C4)' : 'transparent',
                    color: category === c.value ? '#7A5C4E' : '#9E7B6C',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="form-input"
              style={{ width: 'auto', minWidth: '180px', paddingRight: '12px' }}
            >
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </AnimatedSection>

        {/* Active filters */}
        {hasFilters && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: '#9E7B6C', fontWeight: 600 }}>Active filters:</span>
            {search && <FilterTag label={`"${search}"`} onRemove={() => setSearch('')} />}
            {category !== 'all' && <FilterTag label={category} onRemove={() => setCategory('all')} />}
            {sort !== 'featured' && <FilterTag label={SORTS.find(s => s.value === sort)?.label} onRemove={() => setSort('featured')} />}
            <button onClick={clearFilters} style={{ fontSize: '0.8rem', color: '#E8A0B8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Clear all
            </button>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div>
            <LoadingQuote style={{ marginBottom: '20px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
              {[...Array(12)].map((_, i) => <div key={i} className="skeleton" style={{ height: '320px', borderRadius: '20px' }} />)}
            </div>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#9E7B6C' }}>
            <SlidersHorizontal size={48} color="#E8A0B8" style={{ margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#C44569', marginBottom: '8px' }}>Could not load products</h3>
            <p style={{ marginBottom: '20px', fontSize: '0.875rem' }}>{error}</p>
            <button className="btn-primary" onClick={() => { setError(null); setLoading(true); api.get(`/products`).then(r => setProducts(r.data)).catch(e => setError(e.message)).finally(() => setLoading(false)) }}>Try Again</button>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#9E7B6C' }}>
            <SlidersHorizontal size={48} color="#E8A0B8" style={{ margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#7A5C4E', marginBottom: '8px' }}>No products found</h3>
            <p style={{ marginBottom: '20px' }}>Try adjusting your search or filters.</p>
            <button className="btn-primary" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterTag({ label, onRemove }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      background: 'rgba(248,200,220,0.25)', border: '1px solid rgba(232,160,184,0.3)',
      padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem', color: '#9E7B6C', fontWeight: 600,
    }}>
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#E8A0B8', display: 'flex' }}>
        <X size={12} />
      </button>
    </div>
  )
}

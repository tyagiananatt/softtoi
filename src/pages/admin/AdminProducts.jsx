import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, X, Image as Img, Link2, Star, Tag, GitBranch } from 'lucide-react'
import { AdminLayout } from './Dashboard'
import { useToast } from '../../context/ToastContext'
import api, { adminRequestConfig, formatCategory } from '../../utils/api'

const EMPTY = { name: '', description: '', price: '', originalPrice: '', category: '', image: '', images: [], badge: '', inStock: true, featured: false, variantGroup: '', variantLabel: '' }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [customCatName, setCustomCatName] = useState('')
  const [creatingCat, setCreatingCat] = useState(false)
  const { addToast } = useToast()

  const loadCategories = () =>
    api.get('/categories').then(r => {
      setCategories(r.data)
      return r.data
    })

  const fetch = () => {
    setLoading(true)
    setApiError(null)
    const p = new URLSearchParams()
    if (catFilter !== 'all') p.set('category', catFilter)
    if (search) p.set('search', search)
    api.get(`/products?${p}`)
      .then(r => setProducts(r.data))
      .catch(err => setApiError(err.response?.data?.message || err.message || 'Failed to load products'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadCategories() }, [])
  useEffect(() => { fetch() }, [catFilter, search])

  const openAdd = () => {
    setEditing(null)
    setForm({ ...EMPTY, category: categories[0]?.slug || '' })
    setImageUrlInput(''); setCustomCatName(''); setModal(true)
  }

  const openAddVariant = async (p) => {
    // Pre-fill form with parent product's details, same variantGroup, empty label/image
    try {
      const res = await api.get(`/products/${p._id}`)
      const full = res.data
      // Generate a variantGroup if parent doesn't have one yet
      const groupId = full.variantGroup || `${full.slug}-variants`
      // If parent has no variantGroup yet, update it first — use product name as label
      if (!full.variantGroup) {
        await api.put(`/products/${full._id}`, { variantGroup: groupId, variantLabel: full.variantLabel || full.name }, adminRequestConfig)
      }
      setEditing(null)
      setForm({
        name: full.name,
        description: full.description,
        price: full.price,
        originalPrice: full.originalPrice || '',
        category: full.category,
        image: '',
        images: [],
        badge: full.badge || '',
        inStock: true,
        featured: false,
        variantGroup: groupId,
        variantLabel: '',
      })
      setImageUrlInput(''); setCustomCatName(''); setModal(true)
      addToast(`Adding variant for "${full.name}" — set the label & photo`, 'info')
    } catch { addToast('Failed to load product', 'error') }
  }
  const openEdit = async (p) => {
    try {
      const res = await api.get(`/products/${p._id}`)
      const full = res.data
      setEditing(full._id)
      setForm({ name: full.name, description: full.description, price: full.price, originalPrice: full.originalPrice || '', category: full.category, image: full.image, images: full.images || [], badge: full.badge || '', inStock: full.inStock, featured: full.featured, variantGroup: full.variantGroup || '', variantLabel: full.variantLabel || '' })
      setImageUrlInput(''); setCustomCatName(''); setModal(true)
    } catch { addToast('Failed to load product details', 'error') }
  }

  const handleCreateCategory = async () => {
    const name = customCatName.trim()
    if (!name) return
    setCreatingCat(true)
    try {
      const res = await api.post('/categories', { name }, adminRequestConfig)
      await loadCategories()
      // Directly set the new slug so form.category is correct when saving
      setForm(f => ({ ...f, category: res.data.slug }))
      setCustomCatName('')
      addToast(`Category "${name}" created!`, 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create category', 'error')
    } finally { setCreatingCat(false) }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (!form.image) { addToast('Please upload at least one photo', 'error'); setSaving(false); return }
      // Guard: if category is still __custom__ (user didn't finish creating), block save
      if (!form.category || form.category === '__custom__') {
        addToast('Please create or select a valid category first', 'error'); setSaving(false); return
      }
      const data = { ...form, price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined }
      if (editing) await api.put(`/products/${editing}`, data, adminRequestConfig)
      else await api.post('/products', data, adminRequestConfig)
      addToast(editing ? 'Product updated!' : 'Product created!', 'success')
      setModal(false); fetch()
    } catch { addToast('Failed to save product', 'error') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${deleteId}`, adminRequestConfig)
      addToast('Product deleted', 'info')
      setDeleteId(null); fetch()
    } catch { addToast('Failed to delete', 'error') }
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleImageUpload = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => {
        setForm(f => {
          if (!f.image) return { ...f, image: ev.target.result }
          return { ...f, images: [...(f.images || []), ev.target.result] }
        })
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const removeImage = (idx) => {
    setForm(f => {
      const all = [f.image, ...(f.images || [])].filter(Boolean)
      all.splice(idx, 1)
      return { ...f, image: all[0] || '', images: all.slice(1) }
    })
  }

  const addImageUrl = () => {
    const url = imageUrlInput.trim()
    if (!url) return
    try { new URL(url) } catch { addToast('Please enter a valid URL', 'error'); return }
    setForm(f => {
      if (!f.image) return { ...f, image: url }
      return { ...f, images: [...(f.images || []), url] }
    })
    setImageUrlInput('')
  }

  return (
    <AdminLayout title="Products">
      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 160px', minWidth: 0 }}>
          <Search size={15} color="#C4A696" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="form-input" style={{ paddingLeft: '36px' }} />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="form-input" style={{ width: 'auto', flex: '0 0 auto' }}>
          <option value="all">All</option>
          {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <button onClick={openAdd} className="btn-primary" style={{ whiteSpace: 'nowrap', padding: '10px 16px', fontSize: '0.8125rem' }}><Plus size={14} /> Add</button>
      </div>

      {/* Desktop Table */}
      <div className="admin-desktop-only" style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(248,200,220,0.2)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FFF6EC', borderBottom: '1px solid rgba(238,214,196,0.5)' }}>
                {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#9E7B6C', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={6} style={{ padding: '12px 16px' }}><div className="skeleton" style={{ height: '40px', borderRadius: '8px' }} /></td></tr>
                ))
              ) : apiError ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#C44569' }}>
                  <div style={{ marginBottom: '8px', fontWeight: 600 }}>API Error</div>
                  <div style={{ fontSize: '0.875rem', marginBottom: '16px' }}>{apiError}</div>
                  <button className="btn-primary" style={{ fontSize: '0.875rem' }} onClick={fetch}>Retry</button>
                </td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#9E7B6C' }}>No products found</td></tr>
              ) : products.map(p => (
                <tr key={p._id} style={{ borderBottom: '1px solid rgba(238,214,196,0.3)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FFFBF8'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={p.imageUrl || p.image} alt={p.name} style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', background: '#FFF6EC' }} />
                      <div>
                        <div style={{ fontWeight: 600, color: '#7A5C4E', fontSize: '0.875rem' }}>{p.name}</div>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
                          {p.badge && <span style={{ fontSize: '0.65rem', background: '#FDE8F0', color: '#E8A0B8', padding: '2px 6px', borderRadius: '50px', fontWeight: 700 }}>{p.badge}</span>}
                          {p.variantGroup && <span style={{ fontSize: '0.6rem', background: 'rgba(196,69,105,0.1)', color: '#C44569', padding: '2px 7px', borderRadius: '50px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>🎨 {p.variantLabel || 'Variant'}</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}><span style={{ fontSize: '0.8rem', background: 'rgba(248,200,220,0.2)', color: '#9E7B6C', padding: '4px 10px', borderRadius: '50px', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{formatCategory(p.category)}</span></td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#7A5C4E', fontSize: '0.9rem' }}>₹{p.price.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: p.inStock ? '#16a34a' : '#dc2626', marginRight: '6px' }} />
                    <span style={{ fontSize: '0.8rem', color: '#7A5C4E' }}>{p.inStock ? 'In Stock' : 'Out'}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: p.featured ? '#E8A0B8' : '#C4A696', fontWeight: 600 }}>{p.featured ? '★ Yes' : 'No'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => openEdit(p)} title="Edit" style={{ width: '34px', height: '34px', border: '1.5px solid #EED6C4', borderRadius: '8px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9E7B6C' }}><Edit2 size={14} /></button>
                      <button onClick={() => openAddVariant(p)} title="Add Variant" style={{ width: '34px', height: '34px', border: '1.5px solid rgba(196,69,105,0.3)', borderRadius: '8px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C44569' }}><GitBranch size={14} /></button>
                      <button onClick={() => setDeleteId(p._id)} title="Delete" style={{ width: '34px', height: '34px', border: '1.5px solid #fca5a5', borderRadius: '8px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="admin-mobile-only" style={{ display: 'none', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '14px' }} />)
        ) : apiError ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#C44569', background: '#fff', borderRadius: '14px' }}>
            <div style={{ marginBottom: '8px', fontWeight: 600 }}>API Error</div>
            <div style={{ fontSize: '0.875rem', marginBottom: '16px' }}>{apiError}</div>
            <button className="btn-primary" style={{ fontSize: '0.875rem' }} onClick={fetch}>Retry</button>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9E7B6C', background: '#fff', borderRadius: '14px' }}>No products found</div>
        ) : products.map(p => (
          <div key={p._id} style={{ background: '#fff', borderRadius: '14px', padding: '14px', border: '1px solid rgba(248,200,220,0.2)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img src={p.imageUrl || p.image} alt={p.name} style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', background: '#FFF6EC', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: '#7A5C4E', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, color: '#7A5C4E', fontSize: '0.9375rem' }}>₹{p.price.toLocaleString('en-IN')}</span>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(248,200,220,0.2)', color: '#9E7B6C', padding: '2px 8px', borderRadius: '50px', textTransform: 'capitalize' }}>{formatCategory(p.category)}</span>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: p.inStock ? '#16a34a' : '#dc2626' }} />
                  {p.featured && <span style={{ fontSize: '0.65rem', color: '#E8A0B8', fontWeight: 700 }}>★ Featured</span>}
                  {p.variantGroup && <span style={{ fontSize: '0.6rem', background: 'rgba(196,69,105,0.1)', color: '#C44569', padding: '1px 6px', borderRadius: '50px', fontWeight: 700 }}>🎨 {p.variantLabel || 'Variant'}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                <button onClick={() => openEdit(p)} style={{ width: '34px', height: '34px', border: '1.5px solid #EED6C4', borderRadius: '8px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9E7B6C' }}><Edit2 size={14} /></button>
                <button onClick={() => openAddVariant(p)} style={{ width: '34px', height: '34px', border: '1.5px solid rgba(196,69,105,0.3)', borderRadius: '8px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C44569' }}><GitBranch size={14} /></button>
                <button onClick={() => setDeleteId(p._id)} style={{ width: '34px', height: '34px', border: '1.5px solid #fca5a5', borderRadius: '8px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(122,92,78,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={e => e.target === e.currentTarget && setModal(false)}
        >
          <div className="admin-modal-content" style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontWeight: 800, color: '#7A5C4E' }}>
                {editing ? 'Edit Product' : form.variantGroup ? '+ Add Variant' : 'Add Product'}
              </h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9E7B6C' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {!editing && form.variantGroup && (
                <div style={{ background: 'rgba(196,69,105,0.08)', border: '1px solid rgba(196,69,105,0.2)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.8rem', color: '#C44569', fontWeight: 600 }}>
                  🎨 Adding variant to group: <strong>{form.variantGroup}</strong> — set the label (e.g. "Red") and upload the variant photo
                </div>
              )}
              <F label="Name" v={form.name} onChange={v => set('name', v)} required />
              <div>
                <label className="form-label">Description</label>
                <SmartDescriptionEditor value={form.description} onChange={v => set('description', v)} />
              </div>
              <div className="admin-modal-price-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <F label="Price (₹)" type="number" v={form.price} onChange={v => set('price', v)} required />
                <F label="Original Price (₹)" type="number" v={form.originalPrice} onChange={v => set('originalPrice', v)} />
              </div>
              <div>
                <label className="form-label">Category</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} className="form-input" style={{ appearance: 'auto' }}>
                  {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  <option value="__custom__">+ Create custom category…</option>
                </select>
                {form.category === '__custom__' && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Tag size={14} color="#C4A696" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        value={customCatName}
                        onChange={e => setCustomCatName(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCreateCategory() } }}
                        placeholder="e.g. Wall Hangings"
                        className="form-input"
                        style={{ paddingLeft: '36px' }}
                        autoFocus
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={creatingCat || !customCatName.trim()}
                      className="btn-primary"
                      style={{ padding: '10px 16px', whiteSpace: 'nowrap', fontSize: '0.8rem' }}
                    >
                      {creatingCat ? 'Creating…' : 'Create'}
                    </button>
                  </div>
                )}
              </div>
              {/* Featured + In Stock */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <label style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                  padding: '12px 16px', borderRadius: '12px', border: `2px solid ${form.inStock ? '#16a34a' : '#EED6C4'}`,
                  background: form.inStock ? 'rgba(22,163,74,0.06)' : '#FFFBF8', transition: 'all 0.2s',
                }}>
                  <input type="checkbox" checked={form.inStock} onChange={e => set('inStock', e.target.checked)} style={{ accentColor: '#16a34a', width: 16, height: 16 }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7A5C4E' }}>In Stock</div>
                    <div style={{ fontSize: '0.68rem', color: '#9E7B6C' }}>Available to buy</div>
                  </div>
                </label>
                <label style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                  padding: '12px 16px', borderRadius: '12px', border: `2px solid ${form.featured ? '#C44569' : '#EED6C4'}`,
                  background: form.featured ? 'rgba(196,69,105,0.06)' : '#FFFBF8', transition: 'all 0.2s',
                }}>
                  <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ accentColor: '#C44569', width: 16, height: 16 }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7A5C4E', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={12} color="#C44569" fill={form.featured ? '#C44569' : 'none'} /> Featured
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#9E7B6C' }}>Show on homepage</div>
                  </div>
                </label>
              </div>
              {/* Multi-image upload */}
              <div>
                <label className="form-label">Product Photos</label>
                {/* Option 1: Image URL */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Link2 size={15} color="#C4A696" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={e => setImageUrlInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImageUrl() } }}
                      placeholder="Paste image URL (Cloudinary, Imgur, etc.)"
                      className="form-input"
                      style={{ paddingLeft: '36px' }}
                    />
                  </div>
                  <button type="button" onClick={addImageUrl} className="btn-primary" style={{ padding: '10px 18px', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>Add URL</button>
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#C4A696', fontWeight: 600, marginBottom: '10px' }}>— OR —</div>
                {/* Option 2: Upload from device */}
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '14px 16px', border: '1.5px dashed #EED6C4', borderRadius: '12px', background: '#FFFBF8', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#E8A0B8'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#EED6C4'}
                >
                  <Img size={18} color="#E8A0B8" />
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#7A5C4E', fontWeight: 600 }}>Upload Photos from Device</div>
                    <div style={{ fontSize: '0.72rem', color: '#9E7B6C' }}>Select multiple images • First uploaded = main photo</div>
                  </div>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
                {[form.image, ...(form.images || [])].filter(Boolean).length > 0 && (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                    {[form.image, ...(form.images || [])].filter(Boolean).map((img, i) => (
                      <div key={i} style={{ position: 'relative', paddingBottom: i === 0 ? '10px' : '0' }}>
                        <img src={img} alt="" style={{ width: '76px', height: '76px', objectFit: 'cover', borderRadius: '10px', border: i === 0 ? '2.5px solid #E8A0B8' : '2px solid #EED6C4', display: 'block' }} onError={e => e.target.style.opacity = '0.3'} />
                        {i === 0 && <span style={{ position: 'absolute', bottom: '-2px', left: '50%', transform: 'translateX(-50%)', background: '#E8A0B8', color: '#fff', fontSize: '0.5rem', fontWeight: 800, padding: '2px 8px', borderRadius: '50px', whiteSpace: 'nowrap' }}>MAIN</span>}
                        <button type="button" onClick={() => removeImage(i)} style={{ position: 'absolute', top: '-7px', right: '-7px', width: '20px', height: '20px', background: '#dc2626', border: 'none', borderRadius: '50%', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900, lineHeight: 1 }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <F label="Badge (optional)" v={form.badge} onChange={v => set('badge', v)} />
              {/* Variant system */}
              <div style={{ background: '#FFF6EC', borderRadius: '12px', padding: '14px', border: '1px solid rgba(238,214,196,0.5)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7A5C4E', marginBottom: '10px' }}>🎨 Variant Linking (optional)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label className="form-label">Variant Group ID</label>
                    <input value={form.variantGroup} onChange={e => set('variantGroup', e.target.value)} className="form-input" placeholder="e.g. rose-keychain-group" />
                    <div style={{ fontSize: '0.65rem', color: '#C4A696', marginTop: '3px' }}>Same ID links products as variants</div>
                  </div>
                  <div>
                    <label className="form-label">Variant Label</label>
                    <input value={form.variantLabel} onChange={e => set('variantLabel', e.target.value)} className="form-input" placeholder="e.g. Red, Blue, Pink" />
                    <div style={{ fontSize: '0.65rem', color: '#C4A696', marginTop: '3px' }}>Shown as pill on product page</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(122,92,78,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', maxWidth: '360px', width: '100%', textAlign: 'center' }}>
            <Trash2 size={40} color="#dc2626" style={{ margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ fontWeight: 800, color: '#7A5C4E', marginBottom: '8px' }}>Delete Product?</h3>
            <p style={{ color: '#9E7B6C', marginBottom: '24px', fontSize: '0.875rem' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleDelete} style={{ background: '#dc2626', color: '#fff', padding: '12px 24px', borderRadius: '50px', fontWeight: 600, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

function F({ label, v, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <input type={type} value={v} onChange={e => onChange(e.target.value)} className="form-input" required={required} />
    </div>
  )
}

function SmartDescriptionEditor({ value, onChange }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const ta = e.target
      const start = ta.selectionStart
      const lines = value.substring(0, start).split('\n')
      const currentLine = lines[lines.length - 1]
      // If current line starts with bullet, continue bullet on next line
      const isBullet = currentLine.startsWith('• ')
      // If bullet line is empty (just "• "), remove it and go normal
      if (isBullet && currentLine === '• ') {
        const before = value.substring(0, start - 2)
        const after = value.substring(start)
        const newVal = before + '\n' + after
        onChange(newVal)
        setTimeout(() => { ta.selectionStart = ta.selectionEnd = start - 1 }, 0)
      } else {
        const insert = isBullet ? '\n• ' : '\n'
        const newVal = value.substring(0, start) + insert + value.substring(start)
        onChange(newVal)
        setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + insert.length }, 0)
      }
    }
    // Type "- " at start of line → convert to bullet
    if (e.key === ' ') {
      const ta = e.target
      const start = ta.selectionStart
      const lines = value.substring(0, start).split('\n')
      const currentLine = lines[lines.length - 1]
      if (currentLine === '-') {
        e.preventDefault()
        const lineStart = start - 1
        const newVal = value.substring(0, lineStart) + '• ' + value.substring(start)
        onChange(newVal)
        setTimeout(() => { ta.selectionStart = ta.selectionEnd = lineStart + 2 }, 0)
      }
    }
  }

  return (
    <div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={5}
        className="form-input"
        style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.7 }}
        placeholder={'Type normally for paragraphs.\nStart a line with "- " to create a bullet point.\n• Bullets continue automatically on Enter.'}
        required
      />
      <div style={{ fontSize: '0.7rem', color: '#C4A696', marginTop: '4px' }}>
        💡 Type <strong>-</strong> then <strong>Space</strong> to start a bullet point
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Star, Trash2, Edit2, X, Search } from 'lucide-react'
import { AdminLayout } from './Dashboard'
import { useToast } from '../../context/ToastContext'
import api, { adminRequestConfig } from '../../utils/api'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' })
  const [deleteId, setDeleteId] = useState(null)
  const { addToast } = useToast()

  const fetchReviews = () => {
    setLoading(true)
    api.get('/reviews', adminRequestConfig).then(r => setReviews(r.data)).finally(() => setLoading(false))
  }
  useEffect(() => { fetchReviews() }, [])

  const filtered = reviews.filter(r =>
    !search || r.userName?.toLowerCase().includes(search.toLowerCase()) ||
    r.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.comment?.toLowerCase().includes(search.toLowerCase())
  )

  const openEdit = (r) => { setEditing(r); setEditForm({ rating: r.rating, comment: r.comment }) }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/reviews/${editing._id}`, editForm, adminRequestConfig)
      addToast('Review updated', 'success')
      setEditing(null); fetchReviews()
    } catch { addToast('Update failed', 'error') }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/reviews/${deleteId}`, adminRequestConfig)
      addToast('Review deleted', 'info')
      setDeleteId(null); fetchReviews()
    } catch { addToast('Delete failed', 'error') }
  }

  return (
    <AdminLayout title="Reviews">
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} color="#C4A696" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews..." className="form-input" style={{ paddingLeft: '36px' }} />
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(248,200,220,0.2)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9E7B6C' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9E7B6C' }}>No reviews found</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((r, i) => (
              <div key={r._id} style={{ padding: '16px 20px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(238,214,196,0.3)' : 'none', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, color: '#7A5C4E', fontSize: '0.875rem' }}>{r.userName || 'Customer'}</span>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(248,200,220,0.2)', color: '#9E7B6C', padding: '2px 8px', borderRadius: '50px' }}>{r.product?.name || 'Product'}</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= r.rating ? '#F59E0B' : 'none'} stroke="#F59E0B" />)}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#C4A696' }}>{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <p style={{ color: '#4A2E20', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{r.comment}</p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button onClick={() => openEdit(r)} style={{ width: '34px', height: '34px', border: '1.5px solid #EED6C4', borderRadius: '8px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9E7B6C' }}><Edit2 size={14} /></button>
                  <button onClick={() => setDeleteId(r._id)} style={{ width: '34px', height: '34px', border: '1.5px solid #fca5a5', borderRadius: '8px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(122,92,78,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={e => e.target === e.currentTarget && setEditing(null)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: 800, color: '#7A5C4E' }}>Edit Review</h3>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9E7B6C' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#7A5C4E', marginBottom: '8px' }}>Rating</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setEditForm(f => ({ ...f, rating: s }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                      <Star size={24} fill={s <= editForm.rating ? '#F59E0B' : 'none'} stroke="#F59E0B" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#7A5C4E', marginBottom: '6px' }}>Comment</div>
                <textarea value={editForm.comment} onChange={e => setEditForm(f => ({ ...f, comment: e.target.value }))}
                  rows={4} className="form-input" style={{ resize: 'vertical' }} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setEditing(null)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
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
            <h3 style={{ fontWeight: 800, color: '#7A5C4E', marginBottom: '8px' }}>Delete Review?</h3>
            <p style={{ color: '#9E7B6C', marginBottom: '24px', fontSize: '0.875rem' }}>This cannot be undone.</p>
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

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, Loader } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FFF6EC 0%, rgba(248,200,220,0.2) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #F8C8DC, #EED6C4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem', color: '#7A5C4E', margin: '0 auto 12px', boxShadow: '0 4px 16px rgba(248,200,220,0.4)' }}>S</div>
          <div style={{ fontWeight: 800, fontSize: '1.3rem' }}><span style={{ color: '#7A5C4E' }}>SOFT</span><span style={{ color: '#E8A0B8' }}>toi</span></div>
        </div>

        <div style={{ background: '#fff', borderRadius: '24px', padding: '36px 32px', boxShadow: '0 8px 40px rgba(122,92,78,0.1)', border: '1px solid rgba(248,200,220,0.2)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(248,200,220,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Lock size={20} color="#E8A0B8" />
            </div>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#7A5C4E' }}>Admin Panel</h1>
            <p style={{ color: '#9E7B6C', fontSize: '0.875rem', marginTop: '4px' }}>Sign in to manage your store</p>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', color: '#dc2626', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="form-label">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="form-input" placeholder="admin" required autoComplete="username" />
            </div>
            <div>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="form-input" placeholder="••••••••" required autoComplete="current-password" style={{ paddingRight: '44px' }} />
                <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9E7B6C', display: 'flex' }}>
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', gap: '8px', padding: '14px' }}>
              {loading ? <><Loader size={16} className="animate-spin-slow" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/" style={{ color: '#9E7B6C', fontSize: '0.8125rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#E8A0B8'}
              onMouseLeave={e => e.currentTarget.style.color = '#9E7B6C'}
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

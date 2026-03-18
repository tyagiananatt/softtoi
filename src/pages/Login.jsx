import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Loader, LockKeyhole, Mail, Sparkles, User, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '744419888014-0rtl9jedb19mmovos2rur2dm5i4nbt3n.apps.googleusercontent.com'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [googleReady, setGoogleReady] = useState(false)
  const googleButtonRef = useRef(null)
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { isCustomerAuth, customerLogin, customerRegister, customerGoogleLogin, login: adminLogin, isAuth } = useAuth()

  useEffect(() => {
    if (isCustomerAuth) navigate('/profile', { replace: true })
  }, [isCustomerAuth, navigate])

  useEffect(() => {
    if (isAuth) navigate('/admin', { replace: true })
  }, [isAuth, navigate])

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return undefined

    const initGoogle = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) return
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async ({ credential }) => {
          setError('')
          setGoogleLoading(true)
          try {
            await customerGoogleLogin(credential)
            addToast('Signed in with Google', 'success')
            navigate('/profile')
          } catch (err) {
            setError(err.response?.data?.message || 'Google sign-in failed')
          } finally {
            setGoogleLoading(false)
          }
        },
      })
      googleButtonRef.current.innerHTML = ''
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width: Math.min(360, googleButtonRef.current.offsetWidth || 360),
      })
      setGoogleReady(true)
    }

    if (window.google?.accounts?.id) {
      initGoogle()
      return undefined
    }

    const existing = document.querySelector('script[data-google-identity="true"]')
    if (existing) {
      existing.addEventListener('load', initGoogle)
      return () => existing.removeEventListener('load', initGoogle)
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.dataset.googleIdentity = 'true'
    script.addEventListener('load', initGoogle)
    document.body.appendChild(script)
    return () => script.removeEventListener('load', initGoogle)
  }, [addToast, customerGoogleLogin, navigate])

  const update = (key, value) => setForm(current => ({ ...current, [key]: value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const identifier = form.email.trim()
        if (identifier && !identifier.includes('@')) {
          await adminLogin(identifier, form.password)
          addToast('Admin panel unlocked', 'success')
          navigate('/admin')
          return
        }
        await customerLogin(identifier, form.password)
        addToast('Welcome back to Softtoi', 'success')
      } else {
        await customerRegister(form)
        addToast('Your Softtoi account is ready', 'success')
      }
      navigate('/profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to continue right now')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: 'linear-gradient(180deg, #FFF6EC 0%, #FFF9F4 40%, #FDE8F0 100%)', position: 'relative', overflow: 'hidden' }}>
      <DecorativeBlur top="120px" left="-80px" color="rgba(248,200,220,0.45)" />
      <DecorativeBlur top="220px" right="-60px" color="rgba(238,214,196,0.65)" />
      <DecorativeBlur bottom="120px" left="18%" color="rgba(232,160,184,0.24)" />

      <div className="page-container" style={{ padding: '42px 1.5rem 64px' }}>
        <div className="login-shell" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) minmax(320px, 0.95fr)', gap: '28px', alignItems: 'stretch' }}>
          <motion.section
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            style={{
              background: 'linear-gradient(160deg, rgba(255,255,255,0.78), rgba(255,246,236,0.92))',
              border: '1px solid rgba(248,200,220,0.38)',
              borderRadius: '32px',
              padding: '32px',
              boxShadow: '0 24px 70px rgba(122,92,78,0.10)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.72)', color: '#C44569', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '22px' }}>
              <Sparkles size={14} /> Sweet little account corner
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4.2vw, 3.5rem)', lineHeight: 1.02, color: '#7A5C4E', fontWeight: 900, maxWidth: '10ch', marginBottom: '16px' }}>
              Save your favourites and orders in one cute place.
            </h1>
            <p style={{ color: '#9E7B6C', fontSize: '1rem', lineHeight: 1.8, maxWidth: '56ch', marginBottom: '28px' }}>
              Sign in to track orders, save your delivery details, and come back to your wishlist anytime. Everything stays in Softtoi&apos;s soft blush theme.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '26px' }}>
              <FeatureCard icon={Heart} title="Wishlist ready" text="Keep your most-loved picks close." />
              <FeatureCard icon={Mail} title="Order updates" text="See your order status from one profile." />
              <FeatureCard icon={ShieldCheck} title="Quick checkout" text="Reuse saved details the next time you shop." />
            </div>

            <div style={{ borderRadius: '26px', background: 'linear-gradient(145deg, rgba(248,200,220,0.34), rgba(255,255,255,0.9))', border: '1px solid rgba(248,200,220,0.44)', padding: '22px', display: 'grid', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '18px', background: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 12px 24px rgba(196,69,105,0.12)' }}>
                  <Heart size={24} color="#C44569" fill="#F8C8DC" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#7A5C4E', fontSize: '1.05rem' }}>Made for repeat gifting</div>
                  <div style={{ color: '#9E7B6C', fontSize: '0.875rem' }}>Track birthdays, cute finds, and every order you place.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={pillStyle}>Order history</span>
                <span style={pillStyle}>Saved address</span>
                <span style={pillStyle}>Google sign-in</span>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.06 }}
            style={{
              background: 'rgba(255,255,255,0.92)',
              border: '1px solid rgba(248,200,220,0.34)',
              borderRadius: '32px',
              padding: '32px',
              boxShadow: '0 24px 60px rgba(122,92,78,0.10)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', padding: '6px', borderRadius: '999px', background: '#FFF6EC', marginBottom: '24px' }}>
              <TabButton active={mode === 'login'} onClick={() => setMode('login')}>Sign In</TabButton>
              <TabButton active={mode === 'register'} onClick={() => setMode('register')}>Create Account</TabButton>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#7A5C4E', marginBottom: '6px' }}>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
              <p style={{ color: '#9E7B6C', lineHeight: 1.7 }}>
                  {mode === 'login' ? 'Sign in to manage your profile, orders, saved details, or use your admin username to open the dashboard.' : 'Set up your Softtoi account for faster, prettier shopping.'}
              </p>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '14px', padding: '12px 14px', marginBottom: '18px', color: '#B91C1C', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
              {mode === 'register' && <Field icon={User} label="Full Name" value={form.fullName} onChange={value => update('fullName', value)} placeholder="Your name" />}
              <Field icon={Mail} label={mode === 'login' ? 'Email or admin username' : 'Email Address'} type={mode === 'login' ? 'text' : 'email'} value={form.email} onChange={value => update('email', value)} placeholder={mode === 'login' ? 'hello@softtoi.in or admin' : 'hello@softtoi.in'} />
              <Field icon={LockKeyhole} label="Password" type="password" value={form.password} onChange={value => update('password', value)} placeholder="At least 6 characters" />

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', marginTop: '4px' }}>
                {loading ? <><Loader size={16} className="animate-spin-slow" /> Please wait...</> : mode === 'login' ? 'Sign In to Softtoi' : 'Create My Account'}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0 18px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(232,160,184,0.28)' }} />
              <span style={{ color: '#9E7B6C', fontSize: '0.8125rem', fontWeight: 700 }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(232,160,184,0.28)' }} />
            </div>

            {GOOGLE_CLIENT_ID ? (
              <div>
                <div ref={googleButtonRef} style={{ minHeight: '42px' }} />
                {!googleReady && !googleLoading && <p style={{ color: '#9E7B6C', fontSize: '0.8125rem', marginTop: '10px' }}>Loading Google sign-in…</p>}
              </div>
            ) : (
              <div style={{ background: '#FFF6EC', borderRadius: '16px', padding: '14px 16px', color: '#9E7B6C', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Google sign-in is ready in the code. Add <strong>VITE_GOOGLE_CLIENT_ID</strong> on the frontend and <strong>GOOGLE_CLIENT_ID</strong> on the backend to enable it.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginTop: '22px', color: '#9E7B6C', fontSize: '0.875rem' }}>
              <span>{mode === 'login' ? 'New here?' : 'Already have an account?'}</span>
              <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ background: 'none', border: 'none', padding: 0, color: '#C44569', fontWeight: 700, cursor: 'pointer' }}>
                {mode === 'login' ? 'Create account instead' : 'Sign in instead'}
              </button>
            </div>

          </motion.section>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .login-shell { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.72)', borderRadius: '20px', padding: '16px', border: '1px solid rgba(248,200,220,0.26)' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '14px', display: 'grid', placeItems: 'center', background: '#FFF6EC', marginBottom: '12px' }}>
        <Icon size={18} color="#C44569" />
      </div>
      <div style={{ color: '#7A5C4E', fontWeight: 800, marginBottom: '6px' }}>{title}</div>
      <div style={{ color: '#9E7B6C', fontSize: '0.875rem', lineHeight: 1.6 }}>{text}</div>
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        border: 'none',
        borderRadius: '999px',
        padding: '12px 16px',
        background: active ? 'linear-gradient(135deg, #F8C8DC, #EED6C4)' : 'transparent',
        color: '#7A5C4E',
        fontWeight: 800,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function Field({ icon: Icon, label, value, onChange, type = 'text', placeholder }) {
  return (
    <label style={{ display: 'grid', gap: '8px' }}>
      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#7A5C4E' }}>{label}</span>
      <div style={{ position: 'relative' }}>
        <Icon size={16} color="#C4A696" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type={type}
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          className="form-input"
          required
          style={{ paddingLeft: '42px' }}
        />
      </div>
    </label>
  )
}

function DecorativeBlur(props) {
  return <div style={{ position: 'absolute', width: '240px', height: '240px', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none', ...props }} />
}

const pillStyle = {
  padding: '8px 12px',
  borderRadius: '999px',
  background: '#fff',
  color: '#7A5C4E',
  fontWeight: 700,
  fontSize: '0.8125rem',
}

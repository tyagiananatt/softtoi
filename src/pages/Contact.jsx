import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'

const INFO = [
  { icon: Mail, title: 'Email Us', details: 'ilovesoftoi@gmail.com', sub: 'We reply within 24 hours' },
  { icon: Phone, title: 'Call Us', details: '+91 8922090280', sub: 'Mon–Sat, 10AM–7PM' },
  { icon: MapPin, title: 'Visit Us', details: 'Jalandhar City, Punjab, India, 144411' },
  { icon: Clock, title: 'Business Hours', details: 'Mon–Sat: 10AM–7PM', sub: 'Sun: 11AM–5PM' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.subject.trim()) e.subject = 'Required'
    if (!form.message.trim() || form.message.length < 10) e.message = 'At least 10 characters'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSending(true)
    setTimeout(() => { setSent(true); setSending(false) }, 800)
    setTimeout(() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }, 5800)
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#FFF6EC' }}>
      {/* Header */}
      <div style={{ padding: '64px 0 48px', background: 'linear-gradient(160deg, #FFF6EC 0%, rgba(248,200,220,0.12) 100%)', borderBottom: '1px solid rgba(248,200,220,0.2)' }}>
        <div className="page-container" style={{ textAlign: 'center' }}>
          <AnimatedSection>
            <div className="section-label">Get in Touch</div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, color: '#7A5C4E', marginBottom: '12px' }}>Contact Us</h1>
            <p style={{ color: '#9E7B6C', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
              Have a question, custom order request, or just want to say hello? We'd love to hear from you!
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="page-container" style={{ padding: '56px 1.5rem 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'start' }}>

          {/* Info cards */}
          <AnimatedSection direction="left">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {INFO.map((item, i) => (
                <div key={item.title} style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid rgba(248,200,220,0.2)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(248,200,220,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon size={20} color="#E8A0B8" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#7A5C4E', marginBottom: '4px', fontSize: '0.9375rem' }}>{item.title}</div>
                    <div style={{ color: '#7A5C4E', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2px' }}>{item.details}</div>
                    <div style={{ color: '#9E7B6C', fontSize: '0.8rem' }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Contact form */}
          <AnimatedSection direction="right">
            <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', border: '1px solid rgba(248,200,220,0.2)' }}>
              <h2 style={{ fontWeight: 800, color: '#7A5C4E', marginBottom: '24px', fontSize: '1.25rem' }}>Send a Message</h2>

              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <CheckCircle size={56} color="#16a34a" style={{ margin: '0 auto 16px', display: 'block' }} />
                  <h3 style={{ fontWeight: 800, color: '#7A5C4E', marginBottom: '8px' }}>Message Sent!</h3>
                  <p style={{ color: '#9E7B6C' }}>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <F label="Your Name" v={form.name} onChange={v => set('name', v)} err={errors.name} />
                    <F label="Email Address" type="email" v={form.email} onChange={v => set('email', v)} err={errors.email} />
                  </div>
                  <F label="Subject" v={form.subject} onChange={v => set('subject', v)} err={errors.subject} />
                  <div>
                    <label className="form-label">Message</label>
                    <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={5} className="form-input" style={{ resize: 'vertical', ...(errors.message ? { borderColor: '#fca5a5' } : {}) }} placeholder="Tell us how we can help..." />
                    {errors.message && <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>{errors.message}</span>}
                  </div>
                  <button type="submit" disabled={sending} className="btn-primary" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {sending ? 'Sending...' : <><Send size={16} /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
      <style>{`@media(max-width:640px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr !important;}}`}</style>
    </div>
  )
}

function F({ label, v, onChange, err, type = 'text' }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <input type={type} value={v} onChange={e => onChange(e.target.value)} className="form-input" style={err ? { borderColor: '#fca5a5' } : {}} />
      {err && <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>{err}</span>}
    </div>
  )
}

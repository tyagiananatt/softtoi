import { Heart, Palette, Award, Users } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'

const VALUES = [
  { icon: Heart, title: 'Made with Love', desc: 'Every single product is handcrafted with genuine passion and deep care for the craft.' },
  { icon: Palette, title: 'Unique Designs', desc: 'No two pieces are exactly alike. Our artisans bring fresh creativity to every creation.' },
  { icon: Award, title: 'Premium Quality', desc: "We use only the finest materials, ensuring each product stands the test of time." },
  { icon: Users, title: 'Community First', desc: 'We believe in supporting local artisans and building a community that celebrates handcraft.' },
]

const TIMELINE = [
  { year: '2023', title: 'The Beginning', desc: 'Softtoi was born in a small studio, with two friends and a shared love for handmade crafts.' },
  { year: '2024', title: 'Growing', desc: 'We expanded our range to 50+ products and reached our first 100 happy customers.' },
  { year: '2025', title: 'Expanding', desc: 'Launched online shipping across India and welcomed our 500th customer.' },
  { year: '2026', title: 'Today', desc: 'Softtoi now serves thousands of customers with a growing family of passionate artisans.' },
]

export default function About() {
  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#FFF6EC' }}>

      {/* Hero */}
      <div style={{ padding: '80px 0 60px', background: 'linear-gradient(160deg, #FFF6EC 0%, rgba(248,200,220,0.15) 100%)', borderBottom: '1px solid rgba(248,200,220,0.2)' }}>
        <div className="page-container">
          <AnimatedSection>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
              <div className="section-label">Our Story</div>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '16px' }}>
                <span className="gradient-text">Crafted with Heart & Soul</span>
              </h1>
              <p style={{ color: '#9E7B6C', fontSize: '1.05rem', lineHeight: 1.8 }}>
                We believe in the beauty of handmade things — in the imperfections that make each piece unique, in the love that goes into every stitch, fold, and detail.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Story */}
      <div style={{ padding: '80px 0' }}>
        <div className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '56px', alignItems: 'center' }}>
            <AnimatedSection direction="left">
              <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(122,92,78,0.12)', aspectRatio: '4/3' }}>
                <img src="/about.png" alt="Our story" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div className="section-label">Who We Are</div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#7A5C4E', marginBottom: '20px' }}>A Story Woven with Love</h2>
              <p style={{ color: '#9E7B6C', lineHeight: 1.9, marginBottom: '16px', fontSize: '0.9375rem' }}>
                Softoi began with a mother’s forgotten passion and a dream to bring it back to life. My mom has always had incredible creative talent — from crochet and painting to beautiful handmade crafts. But like many women, family responsibilities and life’s demands slowly pushed her creativity into the background.
              </p>
              <p style={{ color: '#9E7B6C', lineHeight: 1.9, marginBottom: '16px', fontSize: '0.9375rem' }}>
                One day, I saw her crocheting again, creating simply for joy, and I was amazed. That moment inspired Softoi — a platform to showcase not only her creativity, but also the hidden talents of many women who have set aside their passions while caring for others.
              </p>
              <p style={{ color: '#9E7B6C', lineHeight: 1.9, marginBottom: '16px', fontSize: '0.9375rem' }}>
                Every keychain, soft toy, flower bouquet, and handmade piece in our store is made with love, patience, and attention to detail. These are more than products — they are little pieces of joy, crafted to hold memories.
              </p>
              <p style={{ color: '#9E7B6C', lineHeight: 1.9, marginBottom: '16px', fontSize: '0.9375rem' }}>
                At Softoi, we celebrate handmade artistry, support women creators, and believe creativity should never be forgotten. When you shop with us, you’re not just buying something beautiful — you’re supporting a dream.
              </p>
              <p style={{ color: '#9E7B6C', lineHeight: 1.9, fontSize: '0.9375rem' }}>
                Our Softoi family welcomes you to discover unique handmade treasures and heartfelt creations made with love. ✨
              </p>
            </AnimatedSection>
          </div>
        </div>
      </div>
      {/* ═══ VIDEO SHOWCASE ═══ */}
<section style={{ padding: '0', background: '#1A0A05', position: 'relative', overflow: 'hidden' }}>
  {/* Video fills full width */}
  <video
    src="https://res.cloudinary.com/dpt4zxb6j/video/upload/v1777208689/crochet_video_ceptwa.mp4"
    autoPlay
    muted
    loop
    playsInline
    style={{
      width: '100%',
      display: 'block',
      maxHeight: '100vh',
      minHeight: '420px',
      objectFit: 'cover',
    }}
  />

  {/* Dark overlay for text legibility */}
  <div style={{
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to bottom, rgba(26,10,5,0.18) 0%, rgba(26,10,5,0.55) 60%, rgba(26,10,5,0.82) 100%)',
    pointerEvents: 'none',
  }} />

  {/* Text overlay */}
  <div style={{
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 'clamp(28px, 6vw, 72px) clamp(20px, 5vw, 80px)',
    zIndex: 2,
  }}>
    <div style={{
      maxWidth: '680px',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '7px',
        padding: '6px 14px', borderRadius: '50px', marginBottom: 'clamp(10px, 2vw, 18px)',
        background: 'rgba(196,69,105,0.28)',
        border: '1px solid rgba(248,200,220,0.3)',
      }}>
        <Sparkles size={12} color="#F8C8DC" />
        <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F8C8DC' }}>
          Behind the Magic
        </span>
      </div>

      <h2 style={{
        fontSize: 'clamp(1.75rem, 5vw, 3.25rem)',
        fontWeight: 900, color: '#fff',
        letterSpacing: '-0.028em', lineHeight: 1.08,
        marginBottom: 'clamp(10px, 2vw, 18px)',
      }}>
        Watch Us{' '}
        <span style={{
          background: 'linear-gradient(135deg, #F8C8DC 10%, #E8607B 60%, #D4956B 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          Create
        </span>
      </h2>

      <p style={{
        fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
        color: 'rgba(248,200,220,0.8)',
        lineHeight: 1.72, maxWidth: '480px',
        marginBottom: 'clamp(18px, 3vw, 32px)',
        fontWeight: 400,
      }}>
        Every product is handcrafted with love — watch the care and detail that goes into each piece we make.
      </p>

      <Link to="/products" style={{ textDecoration: 'none' }}>
        <button
          style={{
            background: 'linear-gradient(135deg, #C44569, #E8607B)',
            color: '#fff', padding: 'clamp(11px, 2vw, 15px) clamp(22px, 3vw, 32px)',
            borderRadius: '50px', fontWeight: 700,
            fontSize: 'clamp(0.8rem, 1.8vw, 0.9375rem)',
            border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 8px 28px rgba(196,69,105,0.5)',
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(196,69,105,0.6)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(196,69,105,0.5)' }}
        >
          <ShoppingBag size={16} /> Shop Handmade
        </button>
      </Link>
    </div>
  </div>
</section>

      {/* Values */}
      <div style={{ padding: '80px 0', background: '#fff' }}>
        <div className="page-container">
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div className="section-label">What We Believe</div>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#7A5C4E' }}>Our Core Values</h2>
            </div>
          </AnimatedSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {VALUES.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.1}>
                <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(248,200,220,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                    <v.icon size={28} color="#E8A0B8" />
                  </div>
                  <h3 style={{ fontWeight: 700, color: '#7A5C4E', marginBottom: '10px', fontSize: '1.05rem' }}>{v.title}</h3>
                  <p style={{ color: '#9E7B6C', fontSize: '0.875rem', lineHeight: 1.7 }}>{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ padding: '80px 0', background: '#FFF6EC' }}>
        <div className="page-container">
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div className="section-label">Our Journey</div>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#7A5C4E' }}>Milestones</h2>
            </div>
          </AnimatedSection>
          <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(180deg, #F8C8DC, #EED6C4)', transform: 'translateX(-50%)' }} />
            {TIMELINE.map((t, i) => (
              <AnimatedSection key={t.year} delay={i * 0.1}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}>
                  <div style={{ flex: 1, padding: i % 2 === 0 ? '0 32px 0 0' : '0 0 0 32px', textAlign: i % 2 === 0 ? 'right' : 'left' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(122,92,78,0.07)', border: '1px solid rgba(248,200,220,0.2)' }}>
                      <div style={{ fontSize: '0.75rem', color: '#E8A0B8', fontWeight: 700, marginBottom: '4px' }}>{t.year}</div>
                      <div style={{ fontWeight: 700, color: '#7A5C4E', marginBottom: '6px' }}>{t.title}</div>
                      <p style={{ fontSize: '0.8125rem', color: '#9E7B6C', lineHeight: 1.6 }}>{t.desc}</p>
                    </div>
                  </div>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'linear-gradient(135deg, #F8C8DC, #EED6C4)', border: '3px solid #fff', boxShadow: '0 0 0 2px #E8A0B8', flexShrink: 0, zIndex: 1 }} />
                  <div style={{ flex: 1 }} />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

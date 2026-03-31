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
                <img src="https://picsum.photos/seed/about1/600/450" alt="Our story" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div className="section-label">Who We Are</div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#7A5C4E', marginBottom: '20px' }}>A Labor of Love</h2>
              <p style={{ color: '#9E7B6C', lineHeight: 1.9, marginBottom: '16px', fontSize: '0.9375rem' }}>
                Softtoi started as a passion project between two best friends who believed that handmade gifts carry a special kind of magic. What began in a tiny studio with basic tools has grown into a beloved brand serving thousands of customers across India.
              </p>
              <p style={{ color: '#9E7B6C', lineHeight: 1.9, marginBottom: '16px', fontSize: '0.9375rem' }}>
                Every keychain, soft toy, and flower arrangement you find in our store is made by hand, with thoughtful attention to detail. We pour our hearts into every creation because we know it's not just a product — it's a gift, a memory, a little piece of joy.
              </p>
              <p style={{ color: '#9E7B6C', lineHeight: 1.9, fontSize: '0.9375rem' }}>
                We are proud to support local artisans and use sustainable, eco-friendly materials wherever possible. When you shop with Softtoi, you're not just buying something beautiful — you're supporting a dream.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </div>

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

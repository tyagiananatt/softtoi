import { useState, useEffect } from "react";
import { Heart, Palette, Award, Users } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

const VALUES = [
{ icon: Heart, title: 'Made with Love', desc: 'Every single product is handcrafted with genuine passion and deep care for the craft.' },
{ icon: Palette, title: 'Unique Designs', desc: 'No two pieces are exactly alike. Our artisans bring fresh creativity to every creation.' },
{ icon: Award, title: 'Premium Quality', desc: "We use only the finest materials, ensuring each product stands the test of time." },
{ icon: Users, title: 'Community First', desc: 'We believe in supporting local artisans and building a community that celebrates handcraft.' },
];

const TIMELINE = [
{ year: '2023', title: 'The Beginning', desc: 'Softtoi was born in a small studio, with two friends and a shared love for handmade crafts.' },
{ year: '2024', title: 'Growing', desc: 'We expanded our range to 50+ products and reached our first 100 happy customers.' },
{ year: '2025', title: 'Expanding', desc: 'Launched online shipping across India and welcomed our 500th customer.' },
{ year: '2026', title: 'Today', desc: 'Softtoi now serves thousands of customers with a growing family of passionate artisans.' },
];

export default function About() {

const [current, setCurrent] = useState(0);

const images = [
"https://picsum.photos/seed/about1/600/450",
"https://picsum.photos/seed/about2/600/450",
"https://picsum.photos/seed/about3/600/450"
];

// Auto slideshow
useEffect(() => {
const interval = setInterval(() => {
setCurrent(prev => (prev + 1) % images.length);
}, 3000);

```
return () => clearInterval(interval);
```

}, []);

return (
<div style={{ paddingTop: '70px', minHeight: '100vh', background: '#FFF6EC' }}>

```
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
            We believe in the beauty of handmade things — in the imperfections that make each piece unique.
          </p>
        </div>
      </AnimatedSection>
    </div>
  </div>

  {/* Story */}
  <div style={{ padding: '80px 0' }}>
    <div className="page-container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '56px', alignItems: 'center' }}>

        {/* Slideshow */}
        <AnimatedSection direction="left">
          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(122,92,78,0.12)', aspectRatio: '4/3', position: 'relative' }}>

            <img
              src={images[current]}
              alt="Our story"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            <button
              onClick={() => setCurrent(prev => (prev - 1 + images.length) % images.length)}
              style={{
                position: 'absolute',
                top: '50%',
                left: '10px',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)',
                color: '#fff',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
            >
              ◀
            </button>

            <button
              onClick={() => setCurrent(prev => (prev + 1) % images.length)}
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)',
                color: '#fff',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
            >
              ▶
            </button>

          </div>
        </AnimatedSection>

        {/* Content */}
        <AnimatedSection direction="right">
          <div className="section-label">Who We Are</div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#7A5C4E', marginBottom: '20px' }}>
            A Labor of Love
          </h2>

          <p style={{ color: '#9E7B6C', lineHeight: 1.9, marginBottom: '16px', fontSize: '0.9375rem' }}>
            Softtoi started as a passion project between two best friends who believed that handmade gifts carry a special kind of magic.
          </p>

          <p style={{ color: '#9E7B6C', lineHeight: 1.9, marginBottom: '16px', fontSize: '0.9375rem' }}>
            Every keychain, soft toy, and flower arrangement you find in our store is made by hand.
          </p>

          <p style={{ color: '#9E7B6C', lineHeight: 1.9, fontSize: '0.9375rem' }}>
            Supporting local artisans and sustainable materials.
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
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#7A5C4E' }}>
            Our Core Values
          </h2>
        </div>
      </AnimatedSection>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {VALUES.map((v, i) => (
          <AnimatedSection key={v.title} delay={i * 0.1}>
            <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(248,200,220,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <v.icon size={28} color="#E8A0B8" />
              </div>
              <h3 style={{ fontWeight: 700, color: '#7A5C4E', marginBottom: '10px' }}>{v.title}</h3>
              <p style={{ color: '#9E7B6C', fontSize: '0.875rem' }}>{v.desc}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </div>

</div>

);
}

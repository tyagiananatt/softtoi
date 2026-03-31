import { useMemo } from 'react'
import { motion } from 'framer-motion'

const QUOTES = [
  { text: 'Good things take time… and so do handmade gifts 🎀', emoji: '🎀' },
  { text: 'Crafted with love, loading with care ✨', emoji: '✨' },
  { text: 'Every stitch tells a story… fetching yours 🧵', emoji: '🧵' },
  { text: 'Sprinkling a little magic on your page 🌸', emoji: '🌸' },
  { text: 'Handmade takes time — so does loading 🐻', emoji: '🐻' },
  { text: 'Wrapping up something cute for you 🎁', emoji: '🎁' },
  { text: 'Almost there… good things are worth the wait 💕', emoji: '💕' },
  { text: 'Our artisans are fast, our server is catching up 🌷', emoji: '🌷' },
  { text: 'Loading cuteness in 3… 2… 1… 🌟', emoji: '🌟' },
  { text: 'Fetching the most adorable things for you 🍓', emoji: '🍓' },
]

export default function LoadingQuote({ style = {} }) {
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{
        textAlign: 'center',
        padding: '16px 0 4px',
        ...style,
      }}
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: '1.6rem', display: 'inline-block', marginBottom: '8px' }}
      >
        {quote.emoji}
      </motion.span>
      <p style={{
        fontSize: '0.82rem', color: '#C44569', fontWeight: 600,
        fontStyle: 'italic', letterSpacing: '0.01em', margin: 0,
      }}>
        {quote.text}
      </p>
    </motion.div>
  )
}

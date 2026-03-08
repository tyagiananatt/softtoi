import { motion } from 'framer-motion'

export default function AnimatedSection({ children, delay = 0, className = '', direction = 'up' }) {
  const variants = {
    up:    { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
    down:  { hidden: { opacity: 0, y: -24 }, visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } },
    fade:  { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  }[direction] || { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

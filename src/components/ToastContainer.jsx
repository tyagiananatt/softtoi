import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { useToast } from '../context/ToastContext'

const icons = {
  success: <CheckCircle size={18} className="shrink-0" style={{ color: '#16a34a' }} />,
  error: <AlertCircle size={18} className="shrink-0" style={{ color: '#dc2626' }} />,
  info: <Info size={18} className="shrink-0" style={{ color: '#2563eb' }} />,
}
const styles = {
  success: { bg: '#f0fdf4', border: '#86efac', text: '#15803d' },
  error: { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626' },
  info: { bg: '#eff6ff', border: '#93c5fd', text: '#1d4ed8' },
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div style={{ position: 'fixed', top: '96px', right: '16px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', width: '320px', maxWidth: 'calc(100vw - 32px)' }}>
      <AnimatePresence>
        {toasts.map(toast => {
          const s = styles[toast.type] || styles.info
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              }}
            >
              {icons[toast.type] || icons.info}
              <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: s.text, lineHeight: 1.4 }}>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.text, opacity: 0.6, padding: '2px', borderRadius: '4px', display: 'flex' }}
              >
                <X size={16} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // 15s — fail fast instead of hanging forever
})

export const adminRequestConfig = { headers: { 'X-Softtoi-Admin': 'true' } }

api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('softtoi_admin_token')
  const userToken = localStorage.getItem('softtoi_user_token')
  const url = config.url || ''
  const isAdminRequest = config.headers?.['X-Softtoi-Admin'] === 'true' || url.startsWith('/admin')
  const isUserRequest = url.startsWith('/users') || url.startsWith('/orders') || url.startsWith('/reviews')

  if (isAdminRequest && adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`
  } else if (isUserRequest && userToken) {
    config.headers.Authorization = `Bearer ${userToken}`
  }
  return config
})

api.interceptors.response.use(
  (res) => {
    // If Vercel routing is misconfigured it returns HTML with status 200.
    // Catch that here so callers always get a real error instead of silent data loss.
    const ct = res.headers['content-type'] || ''
    if (ct.includes('text/html')) {
      return Promise.reject(new Error('API returned HTML instead of JSON — check Vercel routing config'))
    }
    return res
  },
  (err) => {
    if (err.response?.status === 401) {
      const url = err.config?.url || ''
      const isAdminRequest = err.config?.headers?.['X-Softtoi-Admin'] === 'true' || url.startsWith('/admin')
      if (isAdminRequest) localStorage.removeItem('softtoi_admin_token')
      if (!isAdminRequest && (url.startsWith('/users') || url.startsWith('/orders'))) {
        localStorage.removeItem('softtoi_user_token')
      }
    }
    return Promise.reject(err)
  }
)

export default api

// Strip trailing timestamp from category slug and format for display
// e.g. "tshirt-1714000000000" → "Tshirt"
// e.g. "soft-toys" → "Soft Toys"
export function formatCategory(slug) {
  if (!slug) return ''
  // Remove trailing -digits (timestamp)
  const clean = slug.replace(/-\d{10,}$/, '')
  // Replace hyphens with spaces and title-case
  return clean.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

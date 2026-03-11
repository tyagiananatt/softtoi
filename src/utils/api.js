import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('softtoi_admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
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
      localStorage.removeItem('softtoi_admin_token')
    }
    return Promise.reject(err)
  }
)

export default api

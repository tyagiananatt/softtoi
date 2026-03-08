import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('softtoi_admin_token')
    if (token) {
      api.get('/admin/verify')
        .then(res => { setIsAuth(true); setAdminUser(res.data.admin) })
        .catch(() => { localStorage.removeItem('softtoi_admin_token') })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const res = await api.post('/admin/login', { username, password })
    localStorage.setItem('softtoi_admin_token', res.data.token)
    setIsAuth(true)
    setAdminUser({ username: res.data.username })
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('softtoi_admin_token')
    setIsAuth(false)
    setAdminUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuth, adminUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

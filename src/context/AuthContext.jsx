import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isCustomerAuth, setIsCustomerAuth] = useState(false)
  const [customerUser, setCustomerUser] = useState(null)
  const [customerLoading, setCustomerLoading] = useState(true)

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

  useEffect(() => {
    const token = localStorage.getItem('softtoi_user_token')
    if (token) {
      api.get('/users/me')
        .then(res => {
          setIsCustomerAuth(true)
          setCustomerUser(res.data.user)
        })
        .catch(() => {
          localStorage.removeItem('softtoi_user_token')
          setIsCustomerAuth(false)
          setCustomerUser(null)
        })
        .finally(() => setCustomerLoading(false))
    } else {
      setCustomerLoading(false)
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

  const setCustomerSession = (data) => {
    localStorage.setItem('softtoi_user_token', data.token)
    setIsCustomerAuth(true)
    setCustomerUser(data.user)
    return data
  }

  const customerLogin = async (email, password) => {
    const res = await api.post('/users/login', { email, password })
    return setCustomerSession(res.data)
  }

  const customerRegister = async (payload) => {
    const res = await api.post('/users/register', payload)
    return setCustomerSession(res.data)
  }

  const customerGoogleLogin = async (credential) => {
    const res = await api.post('/users/google', { credential })
    return setCustomerSession(res.data)
  }

  const refreshCustomer = async () => {
    const res = await api.get('/users/me')
    setIsCustomerAuth(true)
    setCustomerUser(res.data.user)
    return res.data.user
  }

  const updateCustomerProfile = async (payload) => {
    const res = await api.put('/users/me', payload)
    setCustomerUser(res.data.user)
    return res.data.user
  }

  const customerLogout = () => {
    localStorage.removeItem('softtoi_user_token')
    setIsCustomerAuth(false)
    setCustomerUser(null)
  }

  return (
    <AuthContext.Provider value={{
      isAuth,
      adminUser,
      loading,
      login,
      logout,
      isCustomerAuth,
      customerUser,
      customerLoading,
      customerLogin,
      customerRegister,
      customerGoogleLogin,
      refreshCustomer,
      updateCustomerProfile,
      customerLogout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

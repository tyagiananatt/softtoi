import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ToastContainer from './components/ToastContainer'

import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'
import About from './pages/About'
import Contact from './pages/Contact'

import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'

function ScrollToTop() {
  const { pathname, search } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname, search])
  return null
}

function ProtectedRoute({ children }) {
  const { isAuth, loading } = useAuth()
  if (loading) return null
  return isAuth ? children : <Navigate to="/admin/login" replace />
}

function CustomerProtectedRoute({ children }) {
  const { isCustomerAuth, customerLoading } = useAuth()
  if (customerLoading) return null
  return isCustomerAuth ? children : <Navigate to="/login" replace />
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <>
      <ToastContainer />
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
        <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
        <Route path="/cart" element={<PublicLayout><CustomerProtectedRoute><Cart /></CustomerProtectedRoute></PublicLayout>} />
        <Route path="/checkout" element={<PublicLayout><CustomerProtectedRoute><Checkout /></CustomerProtectedRoute></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/orders" element={<PublicLayout><Orders /></PublicLayout>} />
        <Route path="/profile" element={<PublicLayout><CustomerProtectedRoute><Profile /></CustomerProtectedRoute></PublicLayout>} />
        <Route path="/wishlist" element={<PublicLayout><CustomerProtectedRoute><Wishlist /></CustomerProtectedRoute></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

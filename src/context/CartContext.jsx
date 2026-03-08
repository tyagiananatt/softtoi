import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('softtoi_cart') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('softtoi_cart', JSON.stringify(items))
  }, [items])

  const addToCart = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === product._id)
      if (existing) {
        return prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + qty } : i)
      }
      return [...prev, { ...product, quantity: qty }]
    })
  }

  const removeFromCart = (id) => setItems(prev => prev.filter(i => i._id !== id))

  const updateQuantity = (id, qty) => {
    if (qty < 1) return removeFromCart(id)
    setItems(prev => prev.map(i => i._id === id ? { ...i, quantity: qty } : i))
  }

  const clearCart = () => setItems([])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shippingCost = subtotal >= 999 ? 0 : (subtotal > 0 ? 99 : 0)
  const total = subtotal + shippingCost

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, subtotal, shippingCost, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

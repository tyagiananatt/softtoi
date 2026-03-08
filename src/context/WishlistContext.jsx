import { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('softtoi_wishlist') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('softtoi_wishlist', JSON.stringify(items))
  }, [items])

  const toggleWishlist = (product) => {
    setItems(prev => {
      const exists = prev.find(i => i._id === product._id)
      return exists ? prev.filter(i => i._id !== product._id) : [...prev, product]
    })
  }

  const isWishlisted = (id) => items.some(i => i._id === id)

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)

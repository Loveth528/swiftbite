'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [activeOrder, setActiveOrder] = useState(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('swiftbite_cart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (e) {
        console.error('Error loading cart data', e)
      }
    }
  }, [])

  // Save cart to localStorage when items change
  const saveCart = (items) => {
    setCartItems(items)
    localStorage.setItem('swiftbite_cart', JSON.stringify(items))
  }

  const addToCart = (item) => {
    const existingIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id)
    let newItems = []
    
    if (existingIndex > -1) {
      newItems = [...cartItems]
      newItems[existingIndex].quantity += 1
    } else {
      newItems = [...cartItems, { ...item, quantity: 1 }]
    }
    
    saveCart(newItems)
    setIsCartOpen(true) // Automatically open cart drawer when adding item
  }

  const removeFromCart = (itemId) => {
    const newItems = cartItems.filter((item) => item.id !== itemId)
    saveCart(newItems)
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    const newItems = cartItems.map((item) => 
      item.id === itemId ? { ...item, quantity } : item
    )
    saveCart(newItems)
  }

  const clearCart = () => {
    saveCart([])
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const placeOrder = async (orderDetails) => {
    const deliveryFee = cartItems.length > 0 ? 1000 : 0
    const grandTotal = getCartTotal() + deliveryFee
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          customer: orderDetails,
          total: grandTotal
        })
      })

      if (!response.ok) {
        throw new Error('Failed to record order on server')
      }

      const newOrder = await response.json()
      setActiveOrder(newOrder)
      localStorage.setItem('swiftbite_active_order', JSON.stringify(newOrder))
      clearCart()
      return newOrder.id
    } catch (e) {
      console.error('Error placing order to API:', e)
      throw e
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        activeOrder,
        setActiveOrder,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        getCartTotal,
        getCartCount,
        placeOrder
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

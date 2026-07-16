'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user data from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('swiftbite_token')
      const storedUser = localStorage.getItem('swiftbite_user')

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Error loading auth data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('swiftbite_token', authToken)
    localStorage.setItem('swiftbite_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('swiftbite_token')
    localStorage.removeItem('swiftbite_user')
  }

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

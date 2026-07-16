'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, X, Plus, Minus, Trash2, User, Menu as HamburgerIcon, ArrowRight, Sparkles } from 'lucide-react'

export default function MainLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const { 
    cartItems, 
    isCartOpen, 
    toggleCart, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    getCartCount 
  } = useCart()
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleCheckoutClick = () => {
    toggleCart()
    router.push('/checkout')
  }

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HEADER  */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              S
            </span>
            <span className="text-white text-xl font-black tracking-tight">
              Swift<span className="text-orange-500">Bite</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`text-sm font-semibold transition-colors ${pathname === '/' ? 'text-orange-500' : 
                'text-gray-300 hover:text-white'}`}
            >
              Home
            </Link>
            <Link 
              href="/menu" 
              className={`text-sm font-semibold transition-colors ${pathname === '/menu' ? 
                'text-orange-500' : 'text-gray-300 hover:text-white'}`}
            >
              Menu
            </Link>
            <Link 
              href="/#how-it-works" 
              className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              How it works
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            
            {/* Account Icon */}
            <Link 
              href="/login" 
              className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center
               text-gray-400 hover:text-white hover:border-gray-700 transition-colors"
              title="Account"
            >
              <User size={18} />
            </Link>

            {/* Cart Button */}
            <button 
              onClick={toggleCart}
              className="relative w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 flex items-center justify-center
               text-white transition-colors shadow-lg shadow-orange-500/20"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-orange-500 text-[10px] font-bold w-5 h-5 rounded-full
                
                flex items-center justify-center border-2 border-gray-950">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <HamburgerIcon size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-900 bg-gray-950 px-6 py-4 flex flex-col gap-4">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-bold ${pathname === '/' ? 'text-orange-500' : 'text-gray-300'}`}
            >
              Home
            </Link>
            <Link 
              href="/menu" 
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-bold ${pathname === '/menu' ? 'text-orange-500' : 'text-gray-300'}`}
            >
              Menu
            </Link>
            <Link 
              href="/#how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold text-gray-300"
            >
              How it works
            </Link>
          </div>
        )}
      </header>

      {/* main content */}
      <main className="flex-1 pt-20">
        {children}
      </main>

      {/* footer */}
      <footer className="bg-gray-950 border-t border-gray-900 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-black text-white text-base">
                S
              </span>
              <span className="text-white text-lg font-black tracking-tight">
                Swift<span className="text-orange-500">Bite</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-6">
              Port Harcourt's ultimate digital dining experience. We deliver premium meals from the city's top kitchens directly to you in under 30 minutes.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'Instagram', 'Facebook'].map(social => (
                <a key={social} href="#" className="text-xs text-gray-500 hover:text-orange-500 transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col gap-3">
              <Link href="/menu" className="text-sm text-gray-500 hover:text-white transition-colors">Browse Menu</Link>
              <Link href="/#how-it-works" className="text-sm text-gray-500 hover:text-white transition-colors">How it works</Link>
              <Link href="/login" className="text-sm text-gray-500 hover:text-white transition-colors">My Account</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Legal</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Rider Agreement</a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 border-t border-gray-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} SwiftBite. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[10px] text-gray-600 bg-gray-900/50 rounded-full px-3 py-1 border border-gray-900">
            <Sparkles size={10} className="text-orange-500" />
            <span>Premium Food Tech in PH City</span>
          </div>
        </div>
      </footer>

      {/* ── CART SIDEBAR DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          
          {/* Backdrop */}
          <div 
            onClick={toggleCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-md h-full bg-gray-900 shadow-2xl border-l border-gray-800 flex flex-col animate-slide-over">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-orange-500" />
                <h3 className="text-lg font-black text-white">Your Cart</h3>
              </div>
              <button 
                onClick={toggleCart}
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-gray-500 mb-4">
                    <ShoppingBag size={28} />
                  </div>
                  <h4 className="text-white font-bold mb-1">Your cart is empty</h4>
                  <p className="text-gray-500 text-xs max-w-[200px]">Add delicious meals from our menu to start your order.</p>
                  <Link 
                    href="/menu" 
                    onClick={toggleCart}
                    className="mt-6 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Explore Menu
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 border-b border-gray-800 last:border-0 last:pb-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate mb-1">{item.name}</h4>
                      <p className="text-xs text-orange-500 font-bold mb-3">₦{item.price.toLocaleString()}</p>
                      
                      <div className="flex items-center justify-between">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-gray-800 rounded-lg overflow-hidden bg-gray-950">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2.5 text-gray-500 hover:text-white hover:bg-gray-900 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-xs font-bold text-white min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2.5 text-gray-500 hover:text-white hover:bg-gray-900 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Remove button */}
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-500 hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-800 bg-gray-950/50 backdrop-blur">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-gray-400 font-medium">Subtotal</span>
                  <span className="text-lg font-black text-white">₦{getCartTotal().toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-gray-500 mb-6 leading-normal">
                  Delivery and processing fees will be calculated at checkout. Food is cooked fresh and delivered warm.
                </p>
                <button 
                  onClick={handleCheckoutClick}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all group text-sm"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, ArrowLeft, Truck, ShieldCheck, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default function Checkout() {
  const router = useRouter()
  const { cartItems, getCartTotal, placeOrder } = useCart()

  // Form states
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [instructions, setInstructions] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod') // cod, card, transfer
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const deliveryFee = cartItems.length > 0 ? 1000 : 0
  const orderTotal = getCartTotal() + deliveryFee

  // Redirect if cart is empty and not submitting
  useEffect(() => {
    if (cartItems.length === 0 && !isSubmitting) {
      // Just check if we have any active order to track, else go back to menu
      const savedActiveOrder = localStorage.getItem('swiftbite_active_order')
      if (!savedActiveOrder) {
        router.push('/menu')
      }
    }
  }, [cartItems, isSubmitting])

  const validateForm = () => {
    const tempErrors = {}
    if (!name.trim()) tempErrors.name = 'Full Name is required'
    if (!phone.trim()) {
      tempErrors.phone = 'Phone Number is required'
    } else if (!/^[0-9+ ]{10,15}$/.test(phone.trim())) {
      tempErrors.phone = 'Please enter a valid phone number'
    }
    if (!address.trim()) tempErrors.address = 'Delivery Address is required'
    
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await placeOrder({
        name,
        phone,
        address,
        instructions,
        paymentMethod
      })
      setIsSubmitting(false)
      router.push('/order-status')
    } catch (err) {
      console.error(err)
      setIsSubmitting(false)
      setErrors(prev => ({ ...prev, form: 'Failed to place order. Our servers are currently offline, please try again.' }))
    }
  }

  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-gray-500 mb-4">
            <ShoppingBag size={28} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Checkout Empty</h2>
          <p className="text-gray-400 text-sm max-w-xs mb-6">You have no items in your cart to checkout.</p>
          <Link href="/menu" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors">
            Go to Menu
          </Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="bg-gray-950 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <Link href="/menu" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm font-semibold">
            <ArrowLeft size={16} /> Back to menu
          </Link>

          <h1 className="text-3xl md:text-4xl font-black text-white mb-10">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* ── LEFT: FORM ─────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8 bg-gray-900 rounded-3xl p-6 md:p-8 border border-gray-800">
              {errors.form && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl font-medium">
                  {errors.form}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Truck className="text-orange-500" size={18} />
                  Delivery Details
                </h3>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className={`w-full px-4 py-3 bg-gray-950 text-white placeholder-gray-600 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-800 focus:border-orange-500'} outline-none transition-colors text-sm`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 08012345678"
                      className={`w-full px-4 py-3 bg-gray-950 text-white placeholder-gray-600 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-800 focus:border-orange-500'} outline-none transition-colors text-sm`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Delivery Address</label>
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. House 4, Close B, Peter Odili Road, Port Harcourt"
                      className={`w-full px-4 py-3 bg-gray-950 text-white placeholder-gray-600 rounded-xl border ${errors.address ? 'border-red-500' : 'border-gray-800 focus:border-orange-500'} outline-none transition-colors text-sm resize-none`}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1.5">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Delivery Instructions (Optional)</label>
                    <input
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Call when outside, leave at gate, etc."
                      className="w-full px-4 py-3 bg-gray-950 text-white placeholder-gray-600 rounded-xl border border-gray-800 focus:border-orange-500 outline-none transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <CreditCard className="text-orange-500" size={18} />
                  Payment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'cod', title: 'Cash on Delivery', desc: 'Pay in cash or transfer to rider' },
                    { id: 'card', title: 'Debit Card', desc: 'Secure online payment' },
                    { id: 'transfer', title: 'Bank Transfer', desc: 'Pay to company bank account' }
                  ].map(method => (
                    <div 
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id 
                          ? 'border-orange-500 bg-orange-500/5' 
                          : 'border-gray-800 bg-gray-950/40 hover:border-gray-700'
                      }`}
                    >
                      <p className="text-white font-bold text-xs mb-1">{method.title}</p>
                      <p className="text-[10px] text-gray-500 leading-snug">{method.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-gray-800 pt-6">
                <ShieldCheck size={14} className="text-green-500 shrink-0" />
                <span>Your details are processed securely and only used for your delivery.</span>
              </div>
            </form>

            {/* ── RIGHT: SUMMARY ──────────────────────────────────────────── */}
            <div className="lg:col-span-5 bg-gray-900 rounded-3xl p-6 md:p-8 border border-gray-800 flex flex-col">
              <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>
              
              {/* Items */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-2 scrollbar-thin">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-800">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                        <p className="text-[10px] text-gray-500 font-medium">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-300 whitespace-nowrap">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Pricing Math */}
              <div className="border-t border-b border-gray-850 py-4 mb-6 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-semibold">₦{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Delivery Fee</span>
                  <span className="text-white font-semibold">₦{deliveryFee.toLocaleString()}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-sm font-bold text-white">Grand Total</span>
                <span className="text-xl font-black text-orange-500">₦{orderTotal.toLocaleString()}</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 disabled:cursor-not-allowed text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all text-sm uppercase tracking-wider"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing order...
                  </span>
                ) : (
                  `Place Order (₦${orderTotal.toLocaleString()})`
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </MainLayout>
  )
}

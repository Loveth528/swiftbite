'use client'

import React, { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Check, Clock, ShieldCheck, MapPin, Phone, MessageSquare, Play, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function OrderStatus() {
  const [order, setOrder] = useState(null)
  const [currentStep, setCurrentStep] = useState(0) // 0: Confirmed, 1: Preparing, 2: Transit, 3: Delivered

  // Load active order on mount and fetch fresh server state
  useEffect(() => {
    const savedOrder = localStorage.getItem('swiftbite_active_order')
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder)
        
        async function fetchFreshOrder() {
          try {
            const res = await fetch(`/api/orders?id=${parsed.id}`)
            if (res.ok) {
              const freshData = await res.json()
              setOrder(freshData)
              const statusToStep = { confirmed: 0, preparing: 1, transit: 2, delivered: 3 }
              setCurrentStep(statusToStep[freshData.status] ?? 0)
            } else {
              setOrder(parsed)
            }
          } catch (err) {
            console.error('Server sync failed, using cached data:', err)
            setOrder(parsed)
          }
        }
        
        fetchFreshOrder()
      } catch (e) {
        console.error('Error loading active order', e)
      }
    }
  }, [])

  // Auto-advance simulated delivery steps and update server state
  useEffect(() => {
    if (!order || currentStep >= 3) return

    const timer = setTimeout(async () => {
      const nextStep = currentStep + 1
      const stepToStatus = ['confirmed', 'preparing', 'transit', 'delivered']
      const nextStatus = stepToStatus[nextStep]
      
      try {
        const res = await fetch('/api/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: order.id, status: nextStatus })
        })
        if (res.ok) {
          const updatedOrder = await res.json()
          setOrder(updatedOrder)
          setCurrentStep(nextStep)
          localStorage.setItem('swiftbite_active_order', JSON.stringify(updatedOrder))
        }
      } catch (error) {
        console.error('Auto-advance server sync error:', error)
      }
    }, 25000) // 25 seconds per stage

    return () => clearTimeout(timer)
  }, [order, currentStep])

  const handleNextStep = async () => {
    if (currentStep < 3 && order) {
      const nextStep = currentStep + 1
      const stepToStatus = ['confirmed', 'preparing', 'transit', 'delivered']
      const nextStatus = stepToStatus[nextStep]
      
      try {
        const res = await fetch('/api/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: order.id, status: nextStatus })
        })
        if (res.ok) {
          const updatedOrder = await res.json()
          setOrder(updatedOrder)
          setCurrentStep(nextStep)
          localStorage.setItem('swiftbite_active_order', JSON.stringify(updatedOrder))
        }
      } catch (error) {
        console.error('Manual advance server sync error:', error)
      }
    }
  }

  const steps = [
    { title: 'Order Confirmed', desc: 'We have received your order and sent it to the kitchen' },
    { title: 'Preparing Meal', desc: 'The chefs are cooking your meal fresh' },
    { title: 'Out for Delivery', desc: 'Rider is on the way to your destination' },
    { title: 'Delivered', desc: 'Enjoy your delicious hot meal!' }
  ]

  if (!order) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-gray-500 mb-4 animate-bounce">
            <Clock size={28} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Active Order</h2>
          <p className="text-gray-400 text-sm max-w-xs mb-6">You don't have any orders currently processing.</p>
          <Link href="/menu" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors">
            Order Something
          </Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="bg-gray-950 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-900 pb-8">
            <div>
              <span className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-2 block">TRACK ORDER</span>
              <h1 className="text-3xl font-black text-white mb-1.5">Order {order.id}</h1>
              <p className="text-xs text-gray-500">Placed on {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Payment: {order.customer.paymentMethod.toUpperCase()}</p>
            </div>
            
            {currentStep < 3 ? (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl px-4 py-3 flex items-center gap-3">
                <Clock size={20} className="text-orange-500 animate-spin" />
                <div>
                  <p className="text-white text-xs font-bold">Estimated Delivery</p>
                  <p className="text-orange-500 text-sm font-extrabold">25 - 30 minutes</p>
                </div>
              </div>
            ) : (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl px-4 py-3 flex items-center gap-3">
                <ShieldCheck size={20} className="text-green-500" />
                <div>
                  <p className="text-white text-xs font-bold">Delivered</p>
                  <p className="text-green-500 text-sm font-extrabold">Enjoy your meal!</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* ── LEFT: TIMELINE */}
            <div className="lg:col-span-7 bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
              <h3 className="text-white font-bold text-base mb-8">Delivery Status</h3>
              
              <div className="relative border-l border-gray-800 ml-4 pl-8 space-y-12">
                {steps.map((step, idx) => {
                  const isDone = currentStep >= idx
                  const isActive = currentStep === idx

                  return (
                    <div key={idx} className="relative">
                      {/* Node Bullet */}
                      <span className={`absolute -left-[45px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all ${
                        isDone 
                          ? 'bg-orange-500 border-gray-900 text-white shadow-lg shadow-orange-500/20' 
                          : 'bg-gray-900 border-gray-800 text-gray-600'
                      }`}>
                        {isDone ? (
                          <Check size={12} strokeWidth={3} />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                        )}
                      </span>

                      {/* Content */}
                      <div>
                        <h4 className={`text-sm font-bold transition-colors ${
                          isActive ? 'text-orange-500' : isDone ? 'text-white' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </h4>
                        <p className={`text-xs mt-1.5 transition-colors leading-relaxed ${
                          isActive ? 'text-gray-300' : isDone ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Developer Assist Trigger */}
              {currentStep < 3 && (
                <div className="mt-10 pt-6 border-t border-gray-850 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <Sparkles size={12} className="text-orange-500" />
                    <span>Auto-advances in 25s, or advance instantly:</span>
                  </div>
                  <button 
                    onClick={handleNextStep}
                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/25 border border-orange-500/20 text-orange-500 text-xs font-bold rounded-lg transition-colors"
                  >
                    <Play size={10} className="fill-orange-500" /> Next Stage
                  </button>
                </div>
              )}
            </div>

            {/* ── RIGHT: SUMMARY & RIDER  */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Rider Card */}
              {currentStep >= 2 && (
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Your Dispatch Rider</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white shrink-0 text-lg shadow-lg shadow-orange-500/20">
                      CB
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm">Chinedu Benson</p>
                      <p className="text-gray-500 text-xs">Suzuki Motorcycle • PH-432-AB</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-850">
                    <a href="tel:08012345678" className="flex items-center justify-center gap-2 py-3 bg-gray-950 hover:bg-gray-850 border border-gray-800 rounded-xl text-xs text-gray-300 font-bold transition-all">
                      <Phone size={14} /> Call Chinedu
                    </a>
                    <button className="flex items-center justify-center gap-2 py-3 bg-gray-950 hover:bg-gray-850 border border-gray-800 rounded-xl text-xs text-gray-300 font-bold transition-all">
                      <MessageSquare size={14} /> Chat
                    </button>
                  </div>
                </div>
              )}

              {/* Order Info Summary */}
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Delivery To</h3>
                <div className="flex gap-3 mb-6">
                  <MapPin size={16} className="text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-bold text-xs">{order.customer.name}</p>
                    <p className="text-gray-400 text-xs mt-1 leading-normal">{order.customer.address}</p>
                    <p className="text-gray-500 text-[10px] mt-1">{order.customer.phone}</p>
                  </div>
                </div>

                <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4 pt-6 border-t border-gray-850">Order details</h3>
                <div className="space-y-3 mb-6">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 truncate max-w-[200px]">{item.name} <span className="text-gray-600">x{item.quantity}</span></span>
                      <span className="text-white font-medium">₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-850">
                  <span className="text-xs font-bold text-white">Grand Total</span>
                  <span className="text-sm font-black text-orange-500">₦{order.total.toLocaleString()}</span>
                </div>
              </div>

              {currentStep === 3 && (
                <Link href="/menu" className="block text-center py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 transition-all text-xs uppercase tracking-wider">
                  Order Again
                </Link>
              )}

            </div>

          </div>

        </div>
      </div>
    </MainLayout>
  )
}

'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { useCart } from '@/context/CartContext'
import { ArrowLeft, Star, Clock, ShoppingBag, Plus, Minus, ShieldCheck, ChefHat } from 'lucide-react'
import Link from 'next/link'

function DishDetailsContent() {
  const params = useParams()
  const router = useRouter()
  const id = params.id
  const { addToCart } = useCart()

  const [food, setFood] = useState(null)
  const [relatedFoods, setRelatedFoods] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch food item details
  useEffect(() => {
    async function fetchDishDetails() {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/foods/${id}`)
        if (!res.ok) {
          throw new Error('Dish not found')
        }
        const data = await res.json()
        setFood(data)
        
        // Fetch related foods in same category
        const relatedRes = await fetch(`/api/foods?category=${encodeURIComponent(data.category)}`)
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json()
          setRelatedFoods(relatedData.filter(item => item.id !== id).slice(0, 3))
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchDishDetails()
    }
  }, [id])

  const handleIncrement = () => setQuantity(prev => prev + 1)
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    if (!food) return
    // Add multiple copies according to selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(food)
    }
    // Reset quantity after adding
    setQuantity(1)
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] bg-gray-950 flex flex-col items-center justify-center text-white">
          <svg className="animate-spin h-10 w-10 text-orange-500 mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-400 text-sm">Fetching dish specifications...</p>
        </div>
      </MainLayout>
    )
  }

  if (error || !food) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
          <ChefHat size={48} className="text-gray-600 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Dish not found</h2>
          <p className="text-gray-500 text-sm max-w-xs mb-6">The meal spec you are trying to view is unavailable or deleted.</p>
          <Link href="/menu" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors">
            Back to Menu
          </Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="bg-gray-950 min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          
          {/* Back button */}
          <button 
            onClick={() => router.back()} 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm font-semibold"
          >
            <ArrowLeft size={16} /> Back to previous page
          </button>

          {/* Dish Specs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-10 mb-16">
            
            {/* Left Column: Image banner */}
            <div className="lg:col-span-6 relative h-[300px] md:h-[420px] rounded-2xl overflow-hidden border border-gray-800 shrink-0">
              <img 
                src={food.image} 
                alt={food.name} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-gray-950/80 backdrop-blur rounded-full px-3 py-1.5">
                <Star size={13} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold text-white">{food.rating} ({food.reviews} reviews)</span>
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-gray-950/80 backdrop-blur rounded-full px-3 py-1.5">
                <Clock size={13} className="text-gray-400" />
                <span className="text-xs font-semibold text-gray-300">{food.deliveryTime}</span>
              </div>
            </div>

            {/* Right Column: Information */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                  {food.category}
                </span>
                <h1 className="text-3xl font-black text-white leading-tight mb-2">
                  {food.name}
                </h1>
                <p className="text-2xl font-black text-orange-500">
                  ₦{food.price.toLocaleString()}
                </p>
              </div>

              <div className="border-t border-b border-gray-800 py-6 space-y-4">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider">Description</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {food.description}
                </p>
              </div>

              {/* Ingredients */}
              {food.ingredients && food.ingredients.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider">Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {food.ingredients.map((ingredient, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1.5 bg-gray-950 rounded-xl border border-gray-850 text-gray-400 text-xs font-medium"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Stepper */}
              <div className="pt-4 space-y-4">
                <div className="flex items-center gap-4">
                  {/* Stepper */}
                  <div className="flex items-center border border-gray-800 rounded-xl bg-gray-950 h-14">
                    <button 
                      onClick={handleDecrement}
                      className="h-full px-4 text-gray-400 hover:text-white transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 text-white font-bold text-sm min-w-[40px] text-center select-none">
                      {quantity}
                    </span>
                    <button 
                      onClick={handleIncrement}
                      className="h-full px-4 text-gray-400 hover:text-white transition-colors"
                      title="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Add button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 h-14 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-colors text-sm uppercase tracking-wider"
                  >
                    <ShoppingBag size={18} />
                    Add to Cart • ₦{(food.price * quantity).toLocaleString()}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck size={14} className="text-green-500 shrink-0" />
                  <span>Prepared fresh by professional kitchens upon order confirmation.</span>
                </div>
              </div>

            </div>

          </div>

          {/* ── RELATED DISHES */}
          {relatedFoods.length > 0 && (
            <div>
              <h2 className="text-xl font-black text-white mb-6">Related Cuisines</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedFoods.map(item => (
                  <Link 
                    href={`/menu/${item.id}`}
                    key={item.id}
                    className="bg-gray-900 border border-gray-800 hover:border-orange-500/50 rounded-2xl overflow-hidden transition-all group flex flex-col justify-between"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-white font-bold text-sm truncate mb-1 group-hover:text-orange-500 transition-colors">{item.name}</h4>
                        <p className="text-gray-500 text-xs leading-normal line-clamp-2 mb-3">{item.description}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-850">
                        <span className="text-orange-500 font-extrabold text-sm">₦{item.price.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                          <Star size={10} className="text-yellow-500 fill-yellow-500" /> {item.rating}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  )
}

export default function DishDetails() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        Loading specs...
      </div>
    }>
      <DishDetailsContent />
    </Suspense>
  )
}

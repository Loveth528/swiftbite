'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { categories } from '@/data/mockData'
import { useCart } from '@/context/CartContext'
import { Search, Star, Clock, Sparkles } from 'lucide-react'
import Link from 'next/link'

function MenuContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const { addToCart } = useCart()

  const [foods, setFoods] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All')

  // Load foods from API
  useEffect(() => {
    async function loadMenuFoods() {
      try {
        setIsLoading(true)
        const res = await fetch('/api/foods')
        if (res.ok) {
          const data = await res.json()
          setFoods(data)
        }
      } catch (err) {
        console.error('Error fetching foods for menu:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadMenuFoods()
  }, [])

  // Listen to search params change
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    } else {
      setSelectedCategory('All')
    }
  }, [categoryParam])

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName)
    if (categoryName === 'All') {
      router.push('/menu')
    } else {
      router.push(`/menu?category=${encodeURIComponent(categoryName)}`)
    }
  }

  // Filter food list
  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          food.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <MainLayout>
      {/* ── HEADER HERO*/}
      <section className="bg-gray-950 py-16 border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-semibold mb-4">
            <Sparkles size={12} />
            Port Harcourt's Kitchens
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Browse our full menu
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            From hot traditional pepper soups to fresh fire-grilled burgers, find your craving and order in minutes.
          </p>
        </div>
      </section>

      {/* ── CONTROLS & GRID */}
      <section className="py-12 bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-10 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search for dishes, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-gray-950 text-white placeholder-gray-500 rounded-2xl border border-gray-800 focus:border-orange-500 outline-none transition-colors text-sm"
            />
          </div>

          {/* Categories Horizontal Scrolling */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-10 scrollbar-thin">
            <button
              onClick={() => handleCategorySelect('All')}
              className={`px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${
                selectedCategory === 'All'
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-gray-800 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
              }`}
            >
              All Craveables
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.name)}
                className={`px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors border ${
                  selectedCategory === cat.name
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-gray-800 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Grid list */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <svg className="animate-spin h-8 w-8 text-orange-500 mb-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-gray-500 text-sm">Loading available cuisines...</p>
            </div>
          ) : filteredFoods.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-500 text-sm mb-2">We couldn't find anything matching your search.</p>
              <button 
                onClick={() => { setSearchQuery(''); handleCategorySelect('All') }}
                className="text-orange-500 font-bold text-xs hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFoods.map(food => (
                <div 
                  key={food.id} 
                  className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <Link href={`/menu/${food.id}`} className="relative h-48 overflow-hidden block">
                      <img 
                        src={food.image} 
                        alt={food.name} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-gray-950/80 backdrop-blur rounded-full px-2 py-1">
                        <Star size={11} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-semibold text-white">{food.rating}</span>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-gray-950/80 backdrop-blur rounded-full px-2 py-1">
                        <Clock size={11} className="text-gray-400" />
                        <span className="text-[10px] text-gray-300">{food.deliveryTime}</span>
                      </div>
                    </Link>
                    
                    <div className="p-5">
                      <p className="text-[10px] text-orange-500 font-bold mb-1.5 uppercase tracking-wider">{food.category}</p>
                      <Link href={`/menu/${food.id}`}>
                        <h3 className="font-bold text-white text-base mb-2 group-hover:text-orange-500 transition-colors truncate">{food.name}</h3>
                      </Link>
                      <p className="text-gray-500 text-xs leading-relaxed mb-4">{food.description}</p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-900 mt-auto">
                    <span className="text-orange-500 font-extrabold text-base">₦{food.price.toLocaleString()}</span>
                    <button
                      onClick={() => addToCart(food)}
                      className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-orange-500/10"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </MainLayout>
  )
}

export default function Menu() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        Loading Menu...
      </div>
    }>
      <MenuContent />
    </Suspense>
  )
}

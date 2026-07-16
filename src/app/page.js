'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { categories, testimonials, stats } from '@/data/mockData'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { Star, Clock, ArrowRight, CheckCircle, Truck, ShoppingBag } from 'lucide-react'

export default function Home() {
  const { addToCart } = useCart()
  const [foods, setFoods] = useState([])

  useEffect(() => {
    async function loadFoods() {
      try {
        const res = await fetch('/api/foods')
        if (res.ok) {
          const data = await res.json()
          setFoods(data)
        }
      } catch (e) {
        console.error('Error fetching foods:', e)
      }
    }
    loadFoods()
  }, [])

  return (
    <MainLayout>

      {/* hero section */}
      <section className="bg-gray-950 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block text-orange-500 text-sm font-semibold tracking-widest uppercase mb-6">
              #1 Food Delivery in Port Harcourt
            </span>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
              Cravings,<br />
              <span className="text-orange-500">delivered</span><br />
              in 30 min.
            </h1>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-md">
              Discover Nigerian classics, bold burgers, artisan pizza, rice dishes and desserts from the city's best kitchens — all in one premium marketplace.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/menu" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all text-sm">
                Browse menu →
              </Link>
              <Link href="/register" className="px-8 py-4 border border-gray-700 hover:border-orange-500 text-white font-bold rounded-2xl transition-all text-sm">
                Create account
              </Link>
            </div>
            <div className="flex gap-8">
              {stats.map(stat => (
                <div key={stat.label}>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="relative hidden lg:block">
            <div className="w-full h-[500px] rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
                alt="Delicious food"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating rating card */}
            <div className="absolute bottom-6 left-6 bg-gray-900/90 backdrop-blur rounded-2xl px-4 py-3 flex items-center gap-3 border border-gray-800">
              <Star size={18} className="text-yellow-500 fill-yellow-500" />
              <div>
                <p className="text-white font-bold text-sm">4.9 / 5.0</p>
                <p className="text-gray-400 text-xs">from 50,000+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES  */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">BROWSE</p>
          <h2 className="text-3xl font-black text-white mb-10">Pick your craving</h2>
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/menu?category=${cat.name}`}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-orange-500 transition-all group"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium text-gray-400 group-hover:text-white text-center leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED MEALS ─*/}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">CHEF'S PICKS</p>
              <h2 className="text-3xl font-black text-white">Featured meals this week</h2>
            </div>
            <Link href="/menu" className="flex items-center gap-1 text-orange-500 font-semibold text-sm hover:gap-2 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.filter(f => f.featured).slice(0, 6).map(food => (
              <div key={food.id} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all duration-300 group flex flex-col justify-between">
                <Link href={`/menu/${food.id}`} className="relative h-48 overflow-hidden block">
                  <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-gray-900/80 backdrop-blur rounded-full px-2 py-1">
                    <Star size={11} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-semibold text-white">{food.rating}</span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-gray-900/80 backdrop-blur rounded-full px-2 py-1">
                    <Clock size={11} className="text-gray-400" />
                    <span className="text-xs text-gray-300">{food.deliveryTime}</span>
                  </div>
                </Link>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-orange-500 font-medium mb-1">{food.category}</p>
                    <Link href={`/menu/${food.id}`}>
                      <h3 className="font-bold text-white mb-3 hover:text-orange-500 transition-colors truncate">{food.name}</h3>
                    </Link>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-orange-500 font-bold">₦{food.price.toLocaleString()}</span>
                    <button
                      onClick={() => addToCart(food)}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">SIMPLE STEPS</p>
            <h2 className="text-3xl font-black text-white">How SwiftBite works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <ShoppingBag size={28} className="text-orange-500" />, step: '01', title: 'Browse & Select', desc: 'Explore hundreds of meals from top restaurants. Filter by category, price, or rating.' },
              { icon: <CheckCircle size={28} className="text-orange-500" />, step: '02', title: 'Place Your Order', desc: 'Add items to cart, enter your delivery address, and pay securely.' },
              { icon: <Truck size={28} className="text-orange-500" />, step: '03', title: 'Fast Delivery', desc: 'Your food is prepared fresh and delivered to your door in under 30 minutes.' },
            ].map(item => (
              <div key={item.step} className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-orange-500/50 transition-all">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <p className="text-5xl font-black text-gray-700 mb-2">{item.step}</p>
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP RATED */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">MOST LOVED</p>
              <h2 className="text-3xl font-black text-white">Top rated meals</h2>
            </div>
            <Link href="/menu" className="flex items-center gap-1 text-orange-500 font-semibold text-sm hover:gap-2 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {foods.filter(f => f.topRated).map(food => (
              <div key={food.id} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all group flex flex-col justify-between">
                <Link href={`/menu/${food.id}`} className="relative h-36 overflow-hidden block">
                  <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </Link>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/menu/${food.id}`}>
                      <h3 className="font-bold text-white text-sm mb-1 hover:text-orange-500 transition-colors truncate">{food.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1 mb-3">
                      <Star size={11} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-gray-400">{food.rating} ({food.reviews})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-orange-500 font-bold text-sm">₦{food.price.toLocaleString()}</span>
                    <button onClick={() => addToCart(food)} className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors">
                      Add +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*TESIMONIAL*/}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">LOVE LETTERS</p>
            <h2 className="text-3xl font-black text-white">What our customers say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm">"{t.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER  */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-orange-500 rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Get 10% off your first order</h2>
              <p className="text-orange-900 text-sm">Join SwiftBite for weekly drops, exclusive menus, and tasty deals.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-gray-900 text-white outline-none text-sm placeholder:text-gray-500"
              />
              <button className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

    </MainLayout>
  )
}
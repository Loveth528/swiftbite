'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, ArrowRight, User, Mail, Lock } from 'lucide-react'

export default function Register() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed')
        setIsSubmitting(false)
        return
      }

      // Store token and user data
      localStorage.setItem('swiftbite_token', data.token)
      localStorage.setItem('swiftbite_user', JSON.stringify(data.user))
      
      setIsSubmitting(false)
      router.push('/menu')
    } catch (err) {
      console.error('Registration error:', err)
      setError('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-950 min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative ambient light */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                S
              </span>
              <span className="text-white text-xl font-black tracking-tight">
                Swift<span className="text-orange-500">Bite</span>
              </span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white mb-2">Create Account</h2>
            <p className="text-gray-500 text-xs leading-normal">
              Sign up to enjoy faster checkouts, track orders, and unlock food discounts.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User size={16} className="text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full pl-12 pr-4 py-3 bg-gray-950 text-white placeholder-gray-600 rounded-xl border border-gray-800 focus:border-orange-500 outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-gray-950 text-white placeholder-gray-600 rounded-xl border border-gray-800 focus:border-orange-500 outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-gray-950 text-white placeholder-gray-600 rounded-xl border border-gray-800 focus:border-orange-500 outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-gray-950 text-white placeholder-gray-600 rounded-xl border border-gray-800 focus:border-orange-500 outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-850 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all text-xs uppercase tracking-wider mt-2 group"
            >
              {isSubmitting ? (
                'Creating account...'
              ) : (
                <>
                  Create Account
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-8 border-t border-gray-850 pt-6">
            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-orange-500 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <Link href="/" className="inline-flex items-center gap-1 text-[10px] text-gray-600 hover:text-gray-400 bg-gray-950 rounded-full px-3 py-1 border border-gray-850">
              <Sparkles size={10} className="text-orange-500" />
              <span>Back to home page</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  )
}

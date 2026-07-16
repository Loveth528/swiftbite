'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {

  // Stores the email typed by the user
  const [email, setEmail] = useState('')

  // Controls whether we show the success message
  const [submitted, setSubmitted] = useState(false)

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email.trim()) {
      return
    }

    // Simulates sending reset email
    setSubmitted(true)
  }


  return (
    <div className="bg-gray-950 min-h-screen flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">


        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />


        <div className="relative">


          {/* Logo section */}
          <div className="flex justify-center mb-8">

            <Link href="/" className="flex items-center gap-2">

              <span className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-black text-white text-xl">
                S
              </span>


              <span className="text-white text-xl font-black">
                Swift<span className="text-orange-500">Bite</span>
              </span>


            </Link>

          </div>



          {/* Heading */}
          <div className="text-center mb-8">

            <h1 className="text-2xl font-black text-white mb-2">
              Forgot Password?
            </h1>


            <p className="text-gray-500 text-xs">
              Enter your email and we'll send you a reset link.
            </p>

          </div>



          {
            submitted ? (

              // Success message after submission

              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 text-center">

                <CheckCircle 
                  className="text-green-500 mx-auto mb-3"
                  size={35}
                />


                <h3 className="text-white font-bold mb-2">
                  Check your email
                </h3>


                <p className="text-gray-400 text-xs">
                  If an account exists with this email,
                  a password reset link will be sent.
                </p>


              </div>


            ) : (


              <form 
                onSubmit={handleSubmit}
                className="space-y-5"
              >


                {/* Email Input */}

                <div>

                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">

                    Email Address

                  </label>



                  <div className="relative">

                    <Mail 
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />


                    <input

                      type="email"

                      value={email}

                      onChange={(e)=>setEmail(e.target.value)}

                      placeholder="name@example.com"

                      className="w-full pl-12 pr-4 py-3 bg-gray-950 text-white rounded-xl border border-gray-800 focus:border-orange-500 outline-none text-sm"

                    />


                  </div>


                </div>




                {/* Submit Button */}

                <button

                  type="submit"

                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all text-xs uppercase tracking-wider"

                >

                  Send Reset Link

                </button>



              </form>


            )
          }




          {/* Back to login */}

          <div className="text-center mt-8">

            <Link

              href="/login"

              className="inline-flex items-center gap-2 text-orange-500 text-xs font-bold hover:underline"

            >

              <ArrowLeft size={14}/>

              Back to Login

            </Link>


          </div>




          {/* Bottom branding */}

          <div className="flex justify-center mt-6">

            <div className="flex items-center gap-1 text-[10px] text-gray-600">

              <Sparkles size={10} className="text-orange-500"/>

              Secure SwiftBite Account Recovery

            </div>


          </div>


        </div>

      </div>

    </div>
  )
}
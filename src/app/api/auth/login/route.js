import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { generateToken } from '@/lib/jwt'

export async function POST(request) {
  try {
    await dbConnect()

    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please provide email and password' },
        { status: 400 }
      )
    }

    // Find user and select password field
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.email)

    // Return user without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      addresses: user.addresses || [],
    }

    return NextResponse.json(
      {
        message: 'Login successful',
        user: userResponse,
        token,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

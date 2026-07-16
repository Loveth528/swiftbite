import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { generateToken } from '@/lib/jwt'

export async function POST(request) {
  try {
    await dbConnect()

    const { name, email, password, confirmPassword } = await request.json()

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    })

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
        message: 'Account created successfully',
        user: userResponse,
        token,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'

export async function GET(request) {
  try {
    // Get token from Authorization header
    const token = getTokenFromRequest(request)

    if (!token) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Connect to database
    await dbConnect()

    // Find user
    const user = await User.findById(decoded.userId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Return user without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      addresses: user.addresses || [],
      createdAt: user.createdAt,
    }

    return NextResponse.json(userResponse, { status: 200 })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

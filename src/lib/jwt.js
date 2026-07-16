import jwt from 'jsonwebtoken'

export function generateToken(userId, email) {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production_12345',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  )
}

export function verifyToken(token) {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production_12345'
    )
  } catch (error) {
    return null
  }
}

export function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.slice(7)
}

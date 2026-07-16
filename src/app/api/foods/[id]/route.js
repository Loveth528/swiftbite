import { NextResponse } from 'next/server'
import { getDB } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const id = params.id
    const db = getDB()
    const food = db.foods.find(item => item.id === id)
    
    if (!food) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 })
    }
    
    return NextResponse.json(food)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

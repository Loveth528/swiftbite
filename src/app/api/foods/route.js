import { NextResponse } from 'next/server'
import { getDB } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    const db = getDB()
    let list = db.foods || []
    
    if (category && category !== 'All') {
      list = list.filter(item => item.category.toLowerCase() === category.toLowerCase())
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      list = list.filter(item => 
        item.name.toLowerCase().includes(searchLower) || 
        item.description.toLowerCase().includes(searchLower)
      )
    }
    
    return NextResponse.json(list)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

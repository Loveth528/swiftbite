import { NextResponse } from 'next/server'
import { getDB, saveDB } from '@/lib/db'

export async function POST(request) {
  try {
    const body = await request.json()
    const { items, customer, total } = body
    
    if (!items || items.length === 0 || !customer || !total) {
      return NextResponse.json({ error: 'Invalid order request' }, { status: 400 })
    }
    
    const db = getDB()
    const orderId = 'SWIFT-' + Math.floor(100000 + Math.random() * 900000)
    
    const newOrder = {
      id: orderId,
      items,
      customer,
      total,
      status: 'confirmed', // confirmed, preparing, transit, delivered
      timestamp: new Date().toISOString()
    }
    
    db.orders = db.orders || []
    db.orders.push(newOrder)
    saveDB(db)
    
    return NextResponse.json(newOrder)
  } catch (error) {
    console.error('Error in API orders POST:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Missing order ID parameter' }, { status: 400 })
    }
    
    const db = getDB()
    const order = db.orders.find(item => item.id === id)
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error in API orders GET:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request) {
  // Let's add an order status update handler for simulated step updates!
  try {
    const body = await request.json()
    const { id, status } = body
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing order ID or status' }, { status: 400 })
    }
    
    const db = getDB()
    const orderIndex = db.orders.findIndex(item => item.id === id)
    
    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    db.orders[orderIndex].status = status
    saveDB(db)
    
    return NextResponse.json(db.orders[orderIndex])
  } catch (error) {
    console.error('Error in API orders PUT:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

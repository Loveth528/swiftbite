import { Outfit } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
})

export const metadata = {
  title: 'SwiftBite | Premium Food Delivery in Port Harcourt',
  description: 'Craving party Jollof, spicy Suya, delicious seafood Okra, or classic burgers? SwiftBite delivers the best local cuisines and fast food right to your doorstep in 30 minutes.',
  keywords: 'food delivery, Port Harcourt, Nigeria, Jollof rice, Suya, Okra soup, local restaurants, order food online',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} scroll-smooth`}>
      <body className="bg-gray-950 text-gray-100 min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

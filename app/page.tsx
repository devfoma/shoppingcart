"use client"

import { useState, useEffect } from "react"
import { ProductGrid } from "@/components/product-grid"
import { CartSidebar } from "@/components/cart-sidebar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { products } from "@/lib/products"
import { CartProvider, useCart } from "@/contexts/cart-context"

function HomePageContent() {
  const { success, isLoaded } = useCart()
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (success) {
      setShowToast(true)
      const timer = setTimeout(() => setShowToast(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  return (
    <div className="min-h-screen bg-background">
      {/* Toast Notification */}
      {showToast && success && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        </div>
      )}

      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Shopping Cart Demo</h1>
          <CartSidebar />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Our Products</h2>
          <p className="text-muted-foreground">
            Discover our amazing collection of products. Add items to your cart and use coupon code{" "}
            <code className="bg-muted px-2 py-1 rounded text-sm">WEB3BRIDGECOHORTx</code> for 10% off!
          </p>
        </div>

        <ProductGrid products={products} />
      </main>
    </div>
  )
}

export default function HomePage() {
  return (
    <CartProvider>
      <HomePageContent />
    </CartProvider>
  )
}

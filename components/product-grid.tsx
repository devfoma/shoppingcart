"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart } from "lucide-react"
import type { Product } from "@/types"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addToCart, cart, isLoaded } = useCart()
  const [loadingProducts, setLoadingProducts] = useState<Set<string>>(new Set())

  const handleAddToCart = async (product: Product) => {
    setLoadingProducts((prev) => new Set(prev).add(product.id))

    // Add a small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 300))

    addToCart(product)

    setLoadingProducts((prev) => {
      const newSet = new Set(prev)
      newSet.delete(product.id)
      return newSet
    })
  }

  const getItemQuantity = (productId: string) => {
    if (!isLoaded) return 0
    const item = cart.items.find((item) => item.product.id === productId)
    return item ? item.quantity : 0
  }

  // Show loading skeletons if cart is not loaded yet
  if (!isLoaded) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader className="p-0">
              <div className="relative aspect-square">
                <Skeleton className="w-full h-full rounded-t-lg" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-8 w-20" />
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const quantity = getItemQuantity(product.id)
        const isLoading = loadingProducts.has(product.id)

        return (
          <Card key={product.id} className="flex flex-col">
            <CardHeader className="p-0">
              <div className="relative aspect-square">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <Badge className="absolute top-2 right-2" variant="secondary">
                  {product.category}
                </Badge>
                {quantity > 0 && (
                  <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">{quantity} in cart</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
              <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button onClick={() => handleAddToCart(product)} className="w-full" size="lg" disabled={isLoading}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isLoading ? "Adding..." : quantity > 0 ? "Add Another" : "Add to Cart"}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

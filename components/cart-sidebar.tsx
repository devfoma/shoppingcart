"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Minus, Plus, Trash2, Tag, X } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export function CartSidebar() {
  const {
    cart,
    error,
    success,
    isLoaded,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearError,
    clearSuccess,
  } = useCart()
  const [couponInput, setCouponInput] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  // Auto-open cart when items are added
  useEffect(() => {
    if (success && cart.items.length > 0) {
      setIsOpen(true)
    }
  }, [success, cart.items.length])

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      const success = applyCoupon(couponInput.trim())
      if (success) {
        setCouponInput("")
      }
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    setCouponInput("")
  }

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  // Show loading skeleton if not loaded yet
  if (!isLoaded) {
    return (
      <Button variant="outline" size="lg" disabled>
        <ShoppingCart className="w-5 h-5 mr-2" />
        <Skeleton className="h-4 w-8" />
      </Button>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className="relative">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Cart
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart {totalItems > 0 && `(${totalItems} items)`}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Error and Success Messages */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription className="flex items-center justify-between">
                {error}
                <Button variant="ghost" size="sm" onClick={clearError}>
                  <X className="w-4 h-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertDescription className="flex items-center justify-between text-green-800">
                {success}
                <Button variant="ghost" size="sm" onClick={clearSuccess}>
                  <X className="w-4 h-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {cart.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-muted-foreground">Add some products to get started</p>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-auto py-4">
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 p-4 border rounded-lg bg-card">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
                        <p className="text-sm font-medium">Total: ${(item.product.price * item.quantity).toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.product.id)}
                            className="ml-auto text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Footer */}
              <div className="border-t pt-4 space-y-4 bg-background">
                {/* Coupon Section */}
                <div className="space-y-2">
                  <Label htmlFor="coupon">Coupon Code</Label>
                  {cart.couponCode ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex-1">
                        <Tag className="w-3 h-3 mr-1" />
                        {cart.couponCode} (10% off)
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={handleRemoveCoupon}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        id="coupon"
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      />
                      <Button onClick={handleApplyCoupon} disabled={!couponInput.trim()}>
                        Apply
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items):</span>
                    <span>${cart.subtotal.toFixed(2)}</span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10% off):</span>
                      <span>-${cart.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={() => setIsOpen(false)}>
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

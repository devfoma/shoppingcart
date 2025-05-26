"use client"

import { useState, useEffect, useCallback } from "react"
import type { Cart, CartItem, Product } from "@/types"
import { validateCouponCode } from "@/lib/coupons"

const CART_STORAGE_KEY = "shopping-cart"

// Safe localStorage wrapper to handle SSR and errors
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.warn("localStorage getItem failed:", error)
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.warn("localStorage setItem failed:", error)
    }
  },
}

export const useCart = () => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    subtotal: 0,
    discount: 0,
  })
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = safeLocalStorage.getItem(CART_STORAGE_KEY)
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          // Validate the parsed cart structure
          if (parsedCart && Array.isArray(parsedCart.items)) {
            setCart(parsedCart)
          }
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      } finally {
        setIsLoaded(true)
      }
    }

    // Only load on client side
    if (typeof window !== "undefined") {
      loadCart()
    }
  }, [])

  // Save cart to localStorage whenever cart changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      safeLocalStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    }
  }, [cart, isLoaded])

  const calculateTotals = useCallback((items: CartItem[], couponCode?: string) => {
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    let discount = 0

    if (couponCode) {
      const coupon = validateCouponCode(couponCode)
      if (coupon) {
        discount = subtotal * coupon.discount
      }
    }

    const total = subtotal - discount

    return { subtotal, discount, total }
  }, [])

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      if (quantity <= 0) {
        setError("Quantity must be greater than 0")
        return
      }

      setError("")
      setSuccess(`${product.name} added to cart!`)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)

      setCart((prevCart) => {
        const existingItem = prevCart.items.find((item) => item.product.id === product.id)
        let newItems: CartItem[]

        if (existingItem) {
          newItems = prevCart.items.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          )
        } else {
          newItems = [...prevCart.items, { product, quantity }]
        }

        const totals = calculateTotals(newItems, prevCart.couponCode)

        return {
          items: newItems,
          couponCode: prevCart.couponCode,
          ...totals,
        }
      })
    },
    [calculateTotals],
  )

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prevCart) => {
        const newItems = prevCart.items.filter((item) => item.product.id !== productId)
        const totals = calculateTotals(newItems, prevCart.couponCode)

        return {
          items: newItems,
          couponCode: prevCart.couponCode,
          ...totals,
        }
      })
    },
    [calculateTotals],
  )

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 0) {
        setError("Quantity cannot be negative")
        return
      }

      if (quantity === 0) {
        removeFromCart(productId)
        return
      }

      setError("")
      setCart((prevCart) => {
        const newItems = prevCart.items.map((item) => (item.product.id === productId ? { ...item, quantity } : item))

        const totals = calculateTotals(newItems, prevCart.couponCode)

        return {
          items: newItems,
          couponCode: prevCart.couponCode,
          ...totals,
        }
      })
    },
    [calculateTotals, removeFromCart],
  )

  const applyCoupon = useCallback(
    (code: string) => {
      const coupon = validateCouponCode(code)

      if (!coupon) {
        setError("Invalid coupon code. Please check and try again.")
        return false
      }

      setError("")
      setSuccess("Coupon applied successfully!")
      setTimeout(() => setSuccess(""), 3000)

      setCart((prevCart) => {
        const totals = calculateTotals(prevCart.items, code)

        return {
          ...prevCart,
          couponCode: code,
          ...totals,
        }
      })

      return true
    },
    [calculateTotals],
  )

  const removeCoupon = useCallback(() => {
    setCart((prevCart) => {
      const totals = calculateTotals(prevCart.items)

      return {
        ...prevCart,
        couponCode: undefined,
        ...totals,
      }
    })
  }, [calculateTotals])

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      total: 0,
      subtotal: 0,
      discount: 0,
    })
  }, [])

  const clearError = useCallback(() => setError(""), [])

  const clearSuccess = useCallback(() => setSuccess(""), [])

  return {
    cart,
    error,
    success,
    isLoaded,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart,
    clearError,
    clearSuccess,
  }
}

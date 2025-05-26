export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
  subtotal: number
  discount: number
  couponCode?: string
}

export interface CouponCode {
  code: string
  discount: number
  description: string
}

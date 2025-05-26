import type { CouponCode } from "@/types"

export const validCoupons: CouponCode[] = [
  {
    code: "WEB3BRIDGECOHORTx",
    discount: 0.1, // 10%
    description: "10% off your entire order",
  },
]

export const validateCouponCode = (code: string): CouponCode | null => {
  // Regex pattern for alphanumeric coupon codes
  const couponPattern = /^[A-Za-z0-9]+$/

  if (!couponPattern.test(code)) {
    return null
  }

  return validCoupons.find((coupon) => coupon.code === code) || null
}

import { useState, useCallback } from 'react'
import { getStripe, createLineItems, getSuccessUrl, getCancelUrl } from '../utils/stripe'
import type { ICartItem } from '../types'

interface IUseStripeCheckoutReturn {
  isProcessing: boolean
  error: string | null
  checkout: (items: ICartItem[]) => Promise<void>
  clearError: () => void
}

export const useStripeCheckout = (): IUseStripeCheckoutReturn => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const checkout = useCallback(async (items: ICartItem[]) => {
    if (items.length === 0) {
      setError('Your cart is empty')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const stripe = await getStripe()

      if (!stripe) {
        setError('Stripe is not configured. Please add your Stripe publishable key to .env')
        setIsProcessing(false)
        return
      }

      const lineItems = createLineItems(
        items.map(item => ({
          price: item.product.stripePriceId,
          quantity: item.quantity,
        }))
      )

      if (lineItems.length === 0) {
        setError('No valid products for checkout. Please contact support.')
        setIsProcessing(false)
        return
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        lineItems,
        successUrl: getSuccessUrl(),
        cancelUrl: getCancelUrl(),
        mode: 'payment',
      })

      if (stripeError) {
        setError(stripeError.message || 'Payment failed. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Checkout error:', err)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  return {
    isProcessing,
    error,
    checkout,
    clearError,
  }
}
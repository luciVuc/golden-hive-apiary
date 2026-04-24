import { useState, useCallback } from 'react'
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
      const validItems = items.filter(item => {
        const priceId = item.product.stripePaymentLinkId || item.product.stripePriceId
        return priceId && 
          !priceId.includes('REPLACE') && 
          !priceId.includes('_REPLACE') &&
          (priceId.startsWith('price_') || priceId.startsWith('test_') || priceId.startsWith('pl_')) &&
          item.quantity > 0
      })

      if (validItems.length === 0) {
        setError('No valid products for checkout. Please contact support.')
        setIsProcessing(false)
        return
      }

if (validItems.length === 1) {
        const item = validItems[0]
        const quantity = item.quantity
        const paymentLinkId = item.product.stripePaymentLinkId || item.product.stripePriceId
        const isPaymentLink = paymentLinkId.startsWith('test_') || paymentLinkId.startsWith('pl_')
        
        if (isPaymentLink) {
          window.location.href = `https://buy.stripe.com/${paymentLinkId}?quantity=${quantity}`
        } else {
          setError('Invalid Stripe configuration. Please contact the merchant.')
          setIsProcessing(false)
          return
        }
      } else {
        const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0)
        if (totalItems <= 10) {
          const firstItem = validItems[0]
          const paymentLinkId = firstItem.product.stripePaymentLinkId || firstItem.product.stripePriceId
          const isPaymentLink = paymentLinkId.startsWith('test_') || paymentLinkId.startsWith('pl_')
          
          if (isPaymentLink) {
            window.location.href = `https://buy.stripe.com/${paymentLinkId}?quantity=${totalItems}`
          } else {
            setError('Invalid Stripe configuration. Please contact the merchant.')
            setIsProcessing(false)
            return
          }
        } else {
          setError('For bulk orders, please contact us at hello@csregusapiary.com to place your order.')
          setIsProcessing(false)
          return
        }
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
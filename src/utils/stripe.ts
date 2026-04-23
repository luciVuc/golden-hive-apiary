import { loadStripe, Stripe } from '@stripe/stripe-js'
import { STRIPE_PUBLISHABLE_KEY, SITE_URL } from './constants'

let stripePromise: Promise<Stripe | null> | null = null

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    if (!STRIPE_PUBLISHABLE_KEY || STRIPE_PUBLISHABLE_KEY === 'pk_test_REPLACE_ME') {
      console.warn('Stripe publishable key not configured. Set VITE_STRIPE_PUBLISHABLE_KEY in .env')
      return Promise.resolve(null)
    }
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

export interface LineItem {
  price: string
  quantity: number
}

export const createLineItems = (lineItems: LineItem[]): LineItem[] => {
  return lineItems.filter(item => {
    const priceId = item.price
    const hasValidPrice = priceId && 
      !priceId.includes('REPLACE') && 
      !priceId.includes('_REPLACE') &&
      priceId.startsWith('price_')
    return hasValidPrice && item.quantity > 0
  })
}

export const getSuccessUrl = (): string => {
  return `${SITE_URL}/#/?session=success`
}

export const getCancelUrl = (): string => {
  return `${SITE_URL}/#/?session=cancelled`
}
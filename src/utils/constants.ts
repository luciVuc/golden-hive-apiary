export const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173'
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
export const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID || ''

export const GITHUB_PAGES_BASE = '/cs-regus-apiary/'

export const PRODUCTS_PER_PAGE = 12

export const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'honey', label: 'Honey' },
  { id: 'beeswax', label: 'Beeswax' },
  { id: 'gifts', label: 'Gift Sets' },
  { id: 'subscriptions', label: 'Subscriptions' },
] as const

export const SECTION_IDS = {
  HOME: 'home',
  ABOUT: 'about',
  PROCESS: 'process',
  PRODUCTS: 'products',
  TESTIMONIALS: 'testimonials',
  CONTACT: 'contact',
} as const
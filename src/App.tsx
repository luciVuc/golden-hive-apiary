import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { store } from './store'
import { Layout } from './components/layout/Layout'
import { CartDrawer } from './components/shop/CartDrawer'
import { HeroSection } from './components/sections/HeroSection'
import { AboutSection } from './components/sections/AboutSection'
import { ProcessSection } from './components/sections/ProcessSection'
import { ProductsSection } from './components/sections/ProductsSection'
import { TestimonialsSection } from './components/sections/TestimonialsSection'
import { ContactSection } from './components/sections/ContactSection'
import siteData from './data/site.json'
import productsData from './data/products.json'
import testimonialsData from './data/testimonials.json'
import processData from './data/process.json'
import type { ISiteContent, IProduct, ITestimonial, IProcessStep } from './types'

type SiteContent = ISiteContent
type Product = IProduct
type Testimonial = ITestimonial
type ProcessStep = IProcessStep

const siteContent: SiteContent = siteData as SiteContent
const products: Product[] = productsData as Product[]
const testimonials: Testimonial[] = testimonialsData as Testimonial[]
const processSteps: ProcessStep[] = processData as ProcessStep[]

function AppContent() {
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '')
    if (params.get('session') === 'success') {
      setShowSuccessModal(true)
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const handleNavigate = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <Layout siteContent={siteContent}>
        <HeroSection content={siteContent} onNavigate={handleNavigate} />
        <AboutSection content={siteContent} />
        <ProcessSection steps={processSteps} />
        <ProductsSection products={products} />
        <TestimonialsSection testimonials={testimonials} />
        <ContactSection content={siteContent} />
      </Layout>
      <CartDrawer />

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🎉</span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-dark-900 mb-4">
                  Order Confirmed!
                </h2>
                <p className="font-body text-dark-600 mb-2">
                  Thank you for your order. A confirmation email will be sent shortly.
                </p>
                <p className="font-body text-sm text-dark-500 mb-6">
                  Questions? Contact us at {siteContent.email}
                </p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-6 py-2 bg-primary-500 text-white rounded-xl font-body font-medium hover:bg-primary-600 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </HashRouter>
    </Provider>
  )
}

export default App
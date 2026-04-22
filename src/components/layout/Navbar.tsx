import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { SECTION_IDS } from '../../utils/constants'

const navLinks = [
  { id: SECTION_IDS.HOME, label: 'Home' },
  { id: SECTION_IDS.ABOUT, label: 'About' },
  { id: SECTION_IDS.PROCESS, label: 'Our Process' },
  { id: SECTION_IDS.PRODUCTS, label: 'Shop' },
  { id: SECTION_IDS.TESTIMONIALS, label: 'Testimonials' },
  { id: SECTION_IDS.CONTACT, label: 'Contact' },
]

interface INavbarProps {
  onNavigate: (id: string) => void
}

export const Navbar = ({ onNavigate }: INavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { totalItems, open } = useCart()

  const sections = navLinks.map(link => ({
    id: link.id,
    ref: useRef<HTMLElement>(null),
  }))

  const activeSection = useScrollSpy(sections.filter(s => s.id !== 'home').map(s => ({
    ...s,
    ref: useRef<HTMLElement>(null),
  })), 100)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (id: string) => {
    onNavigate(id)
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => onNavigate(SECTION_IDS.HOME)}
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
          >
            <span className="text-3xl">🐝</span>
            <span className="font-heading text-xl font-bold text-dark-900 hidden sm:block">
              Golden Hive
            </span>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.slice(0, -1).map(link => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`font-body text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded ${
                  activeSection === link.id
                    ? 'text-primary-600'
                    : 'text-dark-600 hover:text-primary-600'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={open}
              className="relative p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <ShoppingCart className="w-6 h-6 text-dark-700" />
              {totalItems > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={totalItems}
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </motion.span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-dark-700" />
              ) : (
                <Menu className="w-6 h-6 text-dark-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-dark-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`block w-full text-left py-2 px-4 rounded-lg font-body font-medium transition-colors duration-200 ${
                    activeSection === link.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-dark-600 hover:bg-dark-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
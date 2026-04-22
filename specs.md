You are an expert full-stack TypeScript developer. Your task is to build a 
complete, production-ready React Vite application from scratch for a small 
beekeeping business website and online store. Follow every instruction 
carefully and completely before moving to the next step.

---

## PROJECT OVERVIEW

Build a single-page React application (SPA) for a beekeeping small business.
The app serves as both a presentation/marketing website AND an e-commerce 
store. It will be deployed as a static site on GitHub Pages.

There is NO backend, NO database, and NO server-side code. All dynamic 
content (products, site text, testimonials, etc.) is stored in local JSON 
files and imported at build time. State is managed client-side only.

---

## TECH STACK — USE EXACTLY THESE. DO NOT SUBSTITUTE.

- Runtime:         React 18 with TypeScript (strict mode)
- Build tool:      Vite
- State:           Redux Toolkit (RTK) with RTK Query where appropriate
- Styling:         Tailwind CSS v3
- Routing:         React Router v6 (hash router for GitHub Pages)
- Payments:        Stripe (Stripe.js + Stripe Checkout redirect, client-only)
- Contact form:    Formspree (REST API via fetch, no backend)
- Icons:           Lucide React
- Animations:      Framer Motion (subtle, tasteful — not excessive)

---

## PROJECT STRUCTURE

Generate the following folder and file structure exactly:

```text
/
├── public/
│   ├── images/
│   │   ├── hero.jpg          (placeholder)
│   │   ├── about.jpg         (placeholder)
│   │   └── products/         (placeholder images per product)
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ProductsSection.tsx
│   │   │   ├── ProcessSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   └── ContactSection.tsx
│   │   ├── shop/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── CheckoutButton.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── SectionHeader.tsx
│   │       ├── Badge.tsx
│   │       └── LoadingSpinner.tsx
│   ├── data/
│   │   ├── products.json
│   │   ├── testimonials.json
│   │   ├── process.json
│   │   └── site.json
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useScrollSpy.ts
│   │   └── useStripeCheckout.ts
│   ├── store/
│   │   ├── index.ts
│   │   ├── cartSlice.ts
│   │   └── uiSlice.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── stripe.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## DATA MODELS — DEFINE THESE TYPES FIRST IN src/types/index.ts

```ts
ProductCategory = 'honey' | 'beeswax' | 'gifts' | 'subscriptions'

Product {
  id: string
  name: string
  slug: string
  description: string
  longDescription: string
  price: number              // in cents (e.g. 1200 = $12.00)
  stripePriceId: string      // from Stripe Dashboard
  category: ProductCategory
  imageUrls: string[]
  thumbnailUrls: string[]
  inStock: boolean
  featured: boolean
  weight: string             // e.g. "16 oz"
  tags: string[]
}

CartItem {
  product: Product
  quantity: number
}

Testimonial {
  id: string
  name: string
  location: string
  rating: number             // 1-5
  text: string
  date: string
}

ProcessStep {
  id: string
  step: number
  title: string
  description: string
  icon: string               // lucide icon name
}

SocialLinks: {
  instagram?: string
  facebook?: string
  etsy?: string
}

SiteContent {
  businessName: string
  tagline: string
  heroHeadline: string
  heroSubheadline: string
  aboutTitle: string
  aboutText: string[]        // paragraphs array
  email: string
  phone: string
  location: string
  socialLinks: SocialLinks
}
```

---

## JSON DATA FILES — POPULATE WITH REALISTIC SAMPLE DATA

### src/data/site.json
Populate with a fictional but realistic beekeeping business named 
"Golden Hive Apiaries" based in Vermont. Write real, warm, 
marketing-quality copy for all text fields.

### src/data/products.json
Create 8 realistic products across the 4 categories:
- 3 honey varieties (wildflower, clover, buckwheat)
- 2 beeswax products (lip balm, candles)
- 2 gift sets
- 1 subscription (monthly honey club)
Use realistic prices. Set stripePriceId to placeholder strings 
like "price_REPLACE_WITH_STRIPE_ID". Mark 3 as featured.

### src/data/testimonials.json
Create 5 warm, authentic-sounding customer testimonials with 
5-star ratings and real-feeling names and locations.

### src/data/process.json
Create 5 steps describing the honey-making process 
(from hive to jar), with a fitting lucide icon name for each.

---

## REDUX STORE — src/store/

### cartSlice.ts
Actions:
- addToCart(product: Product)         → add or increment quantity
- removeFromCart(productId: string)   → remove completely
- updateQuantity({ id, quantity })    → set exact quantity
- clearCart()                         → empty the cart
- openCart() / closeCart()            → drawer visibility in uiSlice

State shape:
- items: CartItem[]
- isOpen: boolean (cart drawer)

Persist cart to localStorage using redux-persist or a custom 
localStorage middleware. Cart should survive page refresh.

### uiSlice.ts
- isCartOpen: boolean
- activeSectionId: string
- isLoading: boolean

---

## STRIPE INTEGRATION — src/utils/stripe.ts and src/hooks/useStripeCheckout.ts

Use Stripe Checkout in CLIENT-ONLY redirect mode (no backend needed).

Implementation:
1. Load Stripe.js via @stripe/stripe-js
2. On checkout, use stripe.redirectToCheckout() with line_items 
   built from the cart (each CartItem maps to a Stripe line item 
   using its stripePriceId and quantity)
3. Read the Stripe publishable key from: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
4. Pass a success_url and cancel_url pointing back to the site 
   (use window.location.origin + hash routes)
5. After successful Stripe redirect return, detect the 
   ?session=success query param and show an order confirmation 
   modal with order summary, thank you message, and note that 
   a confirmation email will be sent by Stripe
6. Handle errors gracefully with user-facing error messages

IMPORTANT: Add a clearly visible dev/demo note in the UI near 
the checkout button that says Stripe is in TEST MODE during 
development, with a note to replace keys for production.

---

## FORMSPREE INTEGRATION — src/components/sections/ContactSection.tsx

- Use Formspree's REST API (POST to https://formspree.io/f/REPLACE_WITH_FORM_ID)
- Form fields: Name, Email, Subject (dropdown), Message, 
  and a honeypot field for spam prevention
- Subject options: General Inquiry, Order Question, 
  Wholesale Inquiry, Other
- Show loading state during submission
- Show success message after submission
- Show error message with retry option on failure
- Read form ID from: import.meta.env.VITE_FORMSPREE_FORM_ID

---

## PAGE SECTIONS — BUILD IN THIS ORDER

All sections are on a single scrollable page. Use smooth scroll 
and a sticky navbar with active section highlighting via 
IntersectionObserver (useScrollSpy hook).

### 1. Navbar
- Logo (business name + bee icon from Lucide)
- Nav links: Home, About, Our Process, Shop, Testimonials, Contact
- Sticky with backdrop blur on scroll
- Cart icon with animated item count badge (from Redux state)
- Mobile hamburger menu with slide-down drawer
- Active link highlighting based on scroll position

### 2. HeroSection
- Full viewport height
- Large headline and subheadline from site.json
- Two CTAs: "Shop Our Honey" (scrolls to products) 
  and "Our Story" (scrolls to about)
- Warm golden/amber color palette — bees and honey aesthetic
- Subtle animated background or honey-drip CSS effect

### 3. AboutSection
- Two-column layout (text left, image right)
- Business story text from site.json (aboutText array = paragraphs)
- A row of 3 icon+stat highlights: e.g., "15 Years Experience", 
  "100% Raw & Natural", "Vermont Proud"

### 4. ProcessSection
- Section title: "From Hive to Your Table"
- Horizontal step timeline on desktop, vertical on mobile
- Each step: number, icon, title, description from process.json
- Subtle connecting line between steps

### 5. ProductsSection
- Section title: "Our Products"
- Category filter tabs: All, Honey, Beeswax, Gift Sets, Subscriptions
- Responsive grid: 1 col mobile, 2 col tablet, 3-4 col desktop
- Each ProductCard:
    - Product image
    - Name, weight, short description
    - Price (formatted as $XX.XX)
    - "Out of Stock" badge if inStock === false
    - "Add to Cart" button (disabled if out of stock)
    - Subtle hover effect

### 6. CartDrawer
- Slides in from the right as an overlay
- Lists all cart items with image, name, price, quantity controls
- Quantity increment/decrement buttons
- Remove item button (trash icon)
- Subtotal calculation
- "Continue Shopping" button (closes drawer)
- "Proceed to Checkout" button (triggers Stripe redirect)
- Empty cart state with message and CTA

### 7. TestimonialsSection
- Grid or carousel of customer reviews from testimonials.json
- Star rating display
- Customer name and location
- Quote styling

### 8. ContactSection
- Two-column: contact form (left) + contact info (right)
- Formspree-powered form
- Display: email, phone, location from site.json
- Optional: embed a simple Google Maps placeholder or 
  stylized location card

### 9. Footer
- Business name and tagline
- Nav links repeated
- Social media links from site.json
- Copyright notice with current year (dynamic)
- "Built with ❤️ in Vermont" tagline

---

## DESIGN SYSTEM — TAILWIND CONFIG

Define a custom Tailwind theme in tailwind.config.ts:

Colors:
- primary:   amber/honey gold tones  (#F59E0B range)
- secondary: warm brown tones        (#92400E range)  
- accent:    soft cream/off-white    (#FFFBEB range)
- dark:      deep charcoal           (#1C1917 range)

Typography:
- Headings: A clean, commonly used sans-serif Google Font (Playfair Display)
- Body:      Inter or similar clean sans-serif
- Load fonts via @import in index.css

Spacing and feel:
- Generous padding, warm and inviting
- Rounded corners on cards (roA serif Googunded-2xl)
- Soft shadows (shadow-amber-100)
- Hover transitions on all interactive elements

---

## ENVIRONMENT VARIABLES

Create .env.example with:
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_REPLACE_ME
VITE_FORMSPREE_FORM_ID=REPLACE_ME
VITE_SITE_URL=https://yourusername.github.io/your-repo-name

Document clearly in a README.md how to fill these in.

---

## GITHUB PAGES DEPLOYMENT

### vite.config.ts
- Set base to the repo name: base: '/your-repo-name/'
- Note in a comment that this must match the GitHub repo name

### package.json scripts
Add:
"predeploy": "npm run build"
"deploy": "gh-pages -d dist"

Install gh-pages as a devDependency.

### GitHub Actions — .github/workflows/deploy.yml
Create a workflow that:
- Triggers on push to main branch
- Installs dependencies
- Runs npm run build
- Deploys /dist to gh-pages branch using peaceiris/actions-gh-pages

---

## README.md

Write a comprehensive README that includes:
1. Project overview and screenshot placeholder
2. Tech stack list
3. Local development setup (clone, install, .env setup, npm run dev)
4. How to populate Stripe Price IDs (step by step)
5. How to set up Formspree
6. How to deploy to GitHub Pages
7. How to update content (edit JSON files and push)
8. Project structure explanation
9. License (MIT)

---

## CODE QUALITY RULES — ENFORCE THROUGHOUT

- TypeScript strict mode: no `any`, no implicit types
- All components are functional with proper typed props interfaces
- All typescript interfaces are prefixed with "I". E.g. `IProduct` for `Product`, `ICartItem` for `CartItem`, etc.
- All typescript enums, are prefixed with "E"  
- No inline styles — Tailwind classes only
- All images have alt text
- Accessible: proper aria labels, keyboard navigable cart and modals
- Responsive: mobile-first, tested breakpoints sm/md/lg/xl
- No console.log left in production code (use a logger util)
- All async operations have loading and error states
- All external links open in new tab with rel="noopener noreferrer"

---

## BUILD ORDER — FOLLOW THIS SEQUENCE

1. Initialize project with Vite + React + TypeScript template
2. Install all dependencies
3. Configure Tailwind, tsconfig, vite.config
4. Define all TypeScript types (src/types/index.ts)
5. Create all JSON data files with sample data
6. Set up Redux store (cartSlice, uiSlice)
7. Build reusable UI components (Button, Badge, etc.)
8. Build Layout components (Navbar, Footer)
9. Build each page section bottom-up
10. Integrate Stripe checkout flow
11. Integrate Formspree contact form
12. Add animations with Framer Motion
13. Wire up GitHub Pages deployment config
14. Write README.md
15. Final pass: check types, accessibility, responsiveness

---

## FINAL INSTRUCTION

Do not ask clarifying questions. Make all reasonable decisions 
yourself using the context provided. Where a value is unknown 
(like a real Stripe key), use the placeholder pattern defined 
above and document it clearly. Build the complete project, file 
by file, without stopping. When finished, confirm what was built 
and list any manual steps the developer must complete 
(e.g., replacing Stripe keys, setting up Formspree account).

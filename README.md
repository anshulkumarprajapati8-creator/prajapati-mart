# 🛒 Prajapati Mart — Quick Commerce Frontend

> Fast delivery in minutes | मिनटों में डिलीवरी

A production-ready React + TypeScript + Vite ecommerce frontend for a local Indian grocery store.

## 🚀 Quick Start

```bash
npm install
cp .env.example .env          # Add your API URL and Razorpay key
npm run dev
```

## 📁 Project Structure

```
prajapati-mart/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.tsx          # Sticky nav with cart badge + lang toggle
│   │   └── ProductCard.tsx     # Product card with qty control
│   ├── data/
│   │   └── products.ts         # 20 demo products with INR pricing
│   ├── hooks/
│   │   └── useLang.tsx         # Hindi/English toggle context
│   ├── pages/
│   │   ├── Home.tsx            # Product listing + search + category filter
│   │   ├── ProductDetail.tsx   # Product page + related products
│   │   ├── Checkout.tsx        # Delivery/pickup toggle + order form
│   │   ├── OTPPage.tsx         # 6-digit OTP with resend timer
│   │   └── TrackingPage.tsx    # Order timeline + Razorpay payment
│   ├── store/
│   │   └── cartStore.ts        # Zustand cart + localStorage persistence
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── utils/
│   │   ├── api.ts              # API fetch utility (VITE_API_URL)
│   │   ├── confetti.ts         # Payment success confetti
│   │   └── razorpay.ts         # Razorpay test checkout integration
│   ├── App.tsx                 # Router with lazy-loaded pages
│   ├── main.tsx
│   └── styles.css              # Full dark glassmorphism design system
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## ⚙️ Environment Variables

```env
VITE_API_URL=https://api.prajapatimart.in
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
```

## 🧪 Demo Credentials
- **OTP**: `123456`
- **Razorpay**: Test mode — use any test card from [Razorpay docs](https://razorpay.com/docs/payments/payments/test-card-details/)

## 🔑 Key Features
- ⚡ Vite + React 18 + TypeScript
- 🛒 Zustand cart with localStorage persistence
- 🌙 Dark glassmorphism UI (Syne + DM Sans fonts)
- 📱 Mobile-first responsive design
- 🇮🇳 Hindi / English language toggle
- 🔀 React Router v6 with lazy loading
- 💳 Razorpay test mode payment integration
- 🎉 Confetti on successful payment
- 📦 20 demo products across 5 categories

## 🏗️ Build

```bash
npm run build       # Production build
npm run preview     # Preview build locally
```

## 🔌 API Integration

All API calls use `VITE_API_URL` as base URL via `src/utils/api.ts`. The demo runs entirely client-side with no backend required.

## 💳 Razorpay Integration

1. Sign up at [razorpay.com](https://razorpay.com)
2. Get your test key from Dashboard → Settings → API Keys
3. Add `VITE_RAZORPAY_KEY_ID=rzp_test_...` to `.env`
4. The Razorpay SDK is loaded via script tag in `index.html`

Payment flow: Cart → Checkout → OTP → Tracking → Razorpay Modal → Confetti 🎉

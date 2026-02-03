import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export const PLANS = {
  pro: {
    name: 'Craig-O-Cache Pro',
    description: 'Professional caching layer manager',
    price: 14,
    priceId: process.env.STRIPE_PRICE_ID!,
    features: [
      'Unlimited cache stores',
      'Advanced TTL management',
      'Real-time analytics',
      'Cache invalidation patterns',
      'Memory usage monitoring',
      'Key browser with search',
      'API access',
      'Priority support',
    ],
  },
}

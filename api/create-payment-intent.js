/**
 * Vercel serverless function — creates a Stripe Payment Intent for Pro unlock ($1.99).
 *
 * Required Vercel environment variable (Project Settings → Environment Variables):
 *   STRIPE_SECRET_KEY = sk_test_... (never commit this key to git)
 */
import Stripe from 'stripe'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(req, res) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value)
  })

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return res.status(500).json({
      error: 'Stripe is not configured. Add STRIPE_SECRET_KEY in Vercel environment variables.',
    })
  }

  try {
    const stripe = new Stripe(secretKey)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 199,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    })

    return res.status(200).json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('create-payment-intent error:', err)
    return res.status(500).json({
      error: err.message || 'Failed to create payment intent',
    })
  }
}

import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { createPaymentIntent } from '../api/payments'

const stripePublishableKey = import.meta.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1a1a2e',
      fontFamily: 'Inter, system-ui, sans-serif',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#FF6B6B' },
  },
  hidePostalCode: false,
}

function PaymentForm({ clientSecret, onSuccess, onClose }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    const card = elements.getElement(CardElement)
    if (!card) return

    setProcessing(true)
    setError(null)

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card } },
    )

    setProcessing(false)

    if (stripeError) {
      setError('Payment failed — please try again')
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      onSuccess()
    } else {
      setError('Payment failed — please try again')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-card-element">
        <CardElement options={CARD_OPTIONS} />
      </div>

      {error && <p className="payment-form__error">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn-primary mt-5"
      >
        {processing ? 'Processing…' : 'Pay $1.99'}
      </button>

      <p className="payment-form__secure">Secured by Stripe</p>
    </form>
  )
}

export default function PaymentSheet({ onSuccess, onClose }) {
  const [clientSecret, setClientSecret] = useState(null)
  const [initError, setInitError] = useState(null)
  const [loadingIntent, setLoadingIntent] = useState(true)

  useEffect(() => {
    if (!stripePromise) {
      setInitError('Stripe publishable key is not configured.')
      setLoadingIntent(false)
      return
    }

    createPaymentIntent()
      .then(setClientSecret)
      .catch((err) => setInitError(err.message || 'Could not start payment'))
      .finally(() => setLoadingIntent(false))
  }, [])

  return (
    <div className="payment-overlay screen-enter" role="dialog" aria-modal="true">
      <button
        type="button"
        className="paywall-close"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>

      <div className="payment-sheet">
        <h2 className="payment-sheet__title">Unlock Your Full Profile</h2>
        <p className="payment-sheet__price">$1.99 one time</p>

        {!stripePublishableKey && (
          <p className="payment-form__error mt-4">
            Add REACT_APP_STRIPE_PUBLISHABLE_KEY to your environment.
          </p>
        )}

        {loadingIntent && (
          <div className="payment-sheet__loading mt-6">
            <div className="result-loader" />
            <p className="mt-4 text-sm text-[#6b7280]">Preparing secure checkout…</p>
          </div>
        )}

        {initError && !loadingIntent && (
          <p className="payment-form__error mt-4">{initError}</p>
        )}

        {clientSecret && stripePromise && !loadingIntent && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: { theme: 'stripe', variables: { colorPrimary: '#4A90D9' } },
            }}
          >
            <PaymentForm
              clientSecret={clientSecret}
              onSuccess={onSuccess}
              onClose={onClose}
            />
          </Elements>
        )}
      </div>
    </div>
  )
}

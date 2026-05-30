export async function createPaymentIntent() {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || 'Could not start payment')
  }

  if (!data.clientSecret) {
    throw new Error('Invalid payment response')
  }

  return data.clientSecret
}

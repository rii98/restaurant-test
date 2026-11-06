export function formatPrice(value: number, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', {style: 'currency', currency}).format(value)
  } catch {
    return `${currency} ${value.toFixed(2)}`
  }
}

/** "13:30" → "1:30 PM" */
export function formatTime(hhmm?: string) {
  if (!hhmm) return ''
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

export const DIETARY_LABELS: Record<string, string> = {
  vegetarian: 'V',
  vegan: 'VG',
  'gluten-free': 'GF',
  spicy: '🌶',
  nuts: 'N',
}

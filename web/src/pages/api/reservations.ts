// API ENDPOINT: POST /api/reservations — receives the booking form and writes to the database.
export const prerender = false

import type {APIRoute} from 'astro'
import {getSettings} from '../../lib/data'
import {runtime, isSameOrigin} from '../../lib/server'
import {createReservation, parseReservation} from '../../lib/reservations'

export const POST: APIRoute = async ({request, redirect}) => {
  if (!isSameOrigin(request)) return new Response('Forbidden', {status: 403})

  const form = await request.formData()
  // Honeypot: real people never fill the hidden "company" field; bots often do.
  if (form.get('company')) return redirect('/reserve/?code=THANKS', 303)

  const settings = await getSettings()
  const {db, timeZone, seatsPerSlot} = runtime(settings)
  const back = (error: string) =>
    redirect(`/reserve/?date=${encodeURIComponent(String(form.get('date') ?? ''))}&error=${encodeURIComponent(error)}`, 303)

  const input = parseReservation(form, settings, timeZone)
  if ('error' in input) return back(input.error)

  const result = await createReservation(db, input, seatsPerSlot)
  if ('error' in result) return back(result.error)

  // 303 = "go GET this page now" → refreshing the success page won't re-submit the form.
  return redirect(`/reserve/?code=${result.code}`, 303)
}

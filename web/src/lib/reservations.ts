// All reservation logic in one place: validation, availability, and the database writes.
// `db` is Cloudflare D1 (SQLite) — see migrations/0001_reservations.sql for the table.
import {addDays, slotsFor, todayIn} from './time'
import type {SiteSettings} from './types'

export const MAX_PARTY = 8
export const BOOKING_WINDOW_DAYS = 60

export interface SlotAvailability {
  time: string
  seatsLeft: number
}

/** Seats left in every slot of a given date. One query, grouped by time. */
export async function getAvailability(db: D1Database, settings: SiteSettings, date: string, seatsPerSlot: number) {
  const slots = slotsFor(settings.hours, date)
  if (slots.length === 0) return []
  const {results} = await db
    .prepare(
      `SELECT time, SUM(party_size) AS booked
       FROM reservations WHERE date = ? AND status = 'confirmed'
       GROUP BY time`,
    )
    .bind(date)
    .all<{time: string; booked: number}>()
  const booked = new Map(results.map((r) => [r.time, r.booked]))
  return slots.map((time) => ({time, seatsLeft: Math.max(0, seatsPerSlot - (booked.get(time) ?? 0))}))
}

export interface ReservationInput {
  name: string
  email: string
  phone?: string
  partySize: number
  date: string
  time: string
  notes?: string
}

/** Turn raw form data into a clean input, or return a human-readable error. */
export function parseReservation(form: FormData, settings: SiteSettings, timeZone: string): ReservationInput | {error: string} {
  const str = (k: string) => String(form.get(k) ?? '').trim()
  const input = {
    name: str('name').slice(0, 80),
    email: str('email').slice(0, 120),
    phone: str('phone').slice(0, 30) || undefined,
    partySize: Number(str('partySize')),
    date: str('date'),
    time: str('time'),
    notes: str('notes').slice(0, 500) || undefined,
  }
  const today = todayIn(timeZone)

  if (!input.name) return {error: 'Please enter your name.'}
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) return {error: 'Please enter a valid email.'}
  if (!Number.isInteger(input.partySize) || input.partySize < 1 || input.partySize > MAX_PARTY)
    return {error: `Party size must be 1–${MAX_PARTY}. For larger groups please call us.`}
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || input.date < today || input.date > addDays(today, BOOKING_WINDOW_DAYS))
    return {error: 'Please pick a date within the next two months.'}
  if (!slotsFor(settings.hours, input.date).includes(input.time)) return {error: 'That time is not available on this day.'}
  return input
}

/** Short, unambiguous confirmation code like "K7QX2M" */
function makeCode() {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  return Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => alphabet[b % alphabet.length]).join('')
}

/**
 * Insert the booking ONLY IF the slot still has room — in a single SQL statement.
 * Two people booking the last seats at the same moment can't both succeed,
 * because the capacity check and the insert happen together.
 */
export async function createReservation(
  db: D1Database,
  input: ReservationInput,
  seatsPerSlot: number,
): Promise<{code: string} | {error: string}> {
  const code = makeCode()
  const result = await db
    .prepare(
      `INSERT INTO reservations (code, name, email, phone, party_size, date, time, notes)
       SELECT ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8
       WHERE (SELECT COALESCE(SUM(party_size), 0) FROM reservations
              WHERE date = ?6 AND time = ?7 AND status = 'confirmed') + ?5 <= ?9`,
    )
    .bind(code, input.name, input.email, input.phone ?? null, input.partySize, input.date, input.time, input.notes ?? null, seatsPerSlot)
    .run()
  return result.meta.changes === 1 ? {code} : {error: 'Sorry, that time just filled up. Please pick another slot.'}
}

export interface ReservationRow {
  id: number
  code: string
  name: string
  email: string
  phone: string | null
  party_size: number
  date: string
  time: string
  notes: string | null
  status: 'confirmed' | 'cancelled'
  created_at: string
}

export async function listUpcoming(db: D1Database, fromDate: string) {
  const {results} = await db
    .prepare(`SELECT * FROM reservations WHERE date >= ? ORDER BY date, time, id LIMIT 200`)
    .bind(fromDate)
    .all<ReservationRow>()
  return results
}

export async function cancelReservation(db: D1Database, id: number) {
  await db.prepare(`UPDATE reservations SET status = 'cancelled' WHERE id = ?`).bind(id).run()
}

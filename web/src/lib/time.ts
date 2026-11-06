// Date/time helpers that always use the RESTAURANT's timezone, not the server's (UTC) or the visitor's.

/** Today's date in the restaurant's timezone as YYYY-MM-DD */
export function todayIn(timeZone: string, now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {timeZone, year: 'numeric', month: '2-digit', day: '2-digit'}).format(now)
}

/** "2026-11-06" → "Friday" */
export function weekdayOf(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {weekday: 'long', timeZone: 'UTC'})
}

/** "2026-11-06" + 3 → "2026-11-09" */
export function addDays(date: string, days: number) {
  const d = new Date(`${date}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** "Friday, November 6" */
export function prettyDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC'})
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const fromMinutes = (mins: number) => `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`

/** Bookable times for a day: every 30 min from opening until 1 hour before closing. */
export function slotsFor(hours: {day: string; closed?: boolean; opens?: string; closes?: string}[] = [], date: string) {
  const h = hours.find((x) => x.day === weekdayOf(date))
  if (!h || h.closed || !h.opens || !h.closes) return []
  const slots: string[] = []
  for (let t = toMinutes(h.opens); t <= toMinutes(h.closes) - 60; t += 30) slots.push(fromMinutes(t))
  return slots
}

/**
 * Local-time date helpers.
 *
 * `new Date().toISOString().split('T')[0]` returns the UTC date, which is
 * wrong for users west/east of UTC (it can be yesterday/tomorrow locally).
 * Booking dates are local calendar dates, so always format them locally.
 */
export function localDateInputValue(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Format a 24h "HH:MM" booking slot as "hh:MM AM/PM" for display. */
export function formatSlot12h(slot: string): string {
  const match = String(slot || '').trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return slot;
  const hour = Number(match[1]);
  if (hour > 23) return slot;
  const suffix = hour < 12 ? 'AM' : 'PM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(hour12).padStart(2, '0')}:${match[2]} ${suffix}`;
}

/** True when a value matches the 24h "HH:MM" API format. */
export function is24hSlot(slot: string): boolean {
  return /^([01]?\d|2[0-3]):[0-5]\d$/.test(String(slot || '').trim());
}

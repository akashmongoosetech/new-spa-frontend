/**
 * The legacy settings record may contain a placeholder "open 24 hours" value.
 * Do not repeat that unverified claim on the public site unless the owner has
 * confirmed real appointment hours.
 */
export function publicWorkingHours(value?: string): string {
  const hours = String(value || '').trim();
  if (!hours || /24\s*hours|open\s*24/i.test(hours)) return 'By appointment only';
  return hours;
}

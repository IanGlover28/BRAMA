/**
 * Guest checkout: shoppers can pay without an account. Their order is attached
 * to a User row keyed by the email they enter, and an httpOnly cookie holding
 * the Paystack reference lets only that browser verify the order afterwards.
 */

export const GUEST_REF_COOKIE = "brama_guest_ref";
export const GUEST_REF_MAX_AGE = 60 * 60 * 24; // one day to finish paying

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return email.length <= 254 && EMAIL_RE.test(email) ? email : null;
}

/** Accepts Ghana-style numbers like 055 211 9400 or +233 55 211 9400. */
export function normalizePhone(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const phone = value.trim();
  const digits = phone.replace(/\D/g, "");
  if (!/^\+?[\d\s()-]+$/.test(phone) || digits.length < 9 || digits.length > 15) return null;
  return phone;
}

export function normalizeName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const name = value.trim().replace(/\s+/g, " ");
  return name.length >= 2 && name.length <= 100 ? name : null;
}

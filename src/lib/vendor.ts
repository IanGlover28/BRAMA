import { currentUser } from "@clerk/nextjs/server";

export const VENDOR_EMAILS = ["bramacosmetics@gmail.com"];

export function isVendorEmail(email?: string | null): boolean {
  return !!email && VENDOR_EMAILS.includes(email);
}

/** Returns the current identity only if it belongs to a vendor; null otherwise. */
export async function getVendorSession(): Promise<{
  user: { name?: string; email?: string };
} | null> {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email || !isVendorEmail(email)) return null;
  return { user: { name: user.fullName ?? undefined, email } };
}
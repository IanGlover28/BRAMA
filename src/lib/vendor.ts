import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "./authOptions";

export const VENDOR_EMAILS = ["ianglover31@gmail.com"];

export function isVendorEmail(email?: string | null): boolean {
  return !!email && VENDOR_EMAILS.includes(email);
}

/** Returns the session only if it belongs to a vendor; null otherwise. */
export async function getVendorSession(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isVendorEmail(session.user.email)) return null;
  return session;
}

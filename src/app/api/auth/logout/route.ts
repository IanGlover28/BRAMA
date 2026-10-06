import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  } as const;

  // Clear both the dev and secure session cookies, plus the CSRF pair.
  const cleared = [
    serialize("next-auth.session-token", "", cookieOptions),
    serialize("__Secure-next-auth.session-token", "", { ...cookieOptions, secure: true }),
    serialize("next-auth.csrf-token", "", cookieOptions),
    serialize("__Secure-next-auth.csrf-token", "", { ...cookieOptions, secure: true }),
  ];

  const res = NextResponse.json({ message: "Logged out successfully" });
  res.headers.set("Set-Cookie", cleared.join(", "));
  return res;
}

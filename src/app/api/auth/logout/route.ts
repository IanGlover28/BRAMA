import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const cookie = serialize("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  const res = NextResponse.json({ message: "Logged out successfully" });
  res.headers.set("Set-Cookie", cookie);
  return res;
}

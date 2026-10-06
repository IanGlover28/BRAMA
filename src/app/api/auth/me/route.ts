// app/api/auth/me/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: session.user }, { status: 200 });
  } catch {
    return NextResponse.json({ user: null, error: "Internal server error" }, { status: 500 });
  }
}

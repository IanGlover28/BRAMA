// app/api/auth/me/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { isVendorEmail } from "@/lib/vendor";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const email = user.primaryEmailAddress?.emailAddress;

  const name = user.fullName ?? (email ? email.split("@")[0] : undefined);

  return NextResponse.json(
    {
      user: { name, email, image: user.imageUrl },
      isVendor: isVendorEmail(email),
    },
    { status: 200 }
  );
}
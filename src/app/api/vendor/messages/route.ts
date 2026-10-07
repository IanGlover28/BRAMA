import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVendorSession } from "@/lib/vendor";

export async function POST(req: Request) {
  const session = await getVendorSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { email, subject, body: messageBody } = body;

    if (typeof email !== "string" || !email.trim() || !email.includes("@")) {
      return NextResponse.json({ error: "A valid recipient email is required." }, { status: 400 });
    }
    if (typeof subject !== "string" || !subject.trim() || subject.trim().length > 200) {
      return NextResponse.json({ error: "Subject is required (max 200 chars)." }, { status: 400 });
    }
    if (typeof messageBody !== "string" || !messageBody.trim() || messageBody.trim().length > 5000) {
      return NextResponse.json({ error: "Message is required (max 5000 chars)." }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        email: email.trim().toLowerCase(),
        sender: "vendor",
        subject: subject.trim(),
        body: messageBody.trim(),
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
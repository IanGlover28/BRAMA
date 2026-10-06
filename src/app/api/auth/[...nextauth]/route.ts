// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Create a handler instance
const handler = NextAuth(authOptions);

// Export named HTTP method handlers
export const GET = handler;
export const POST = handler;

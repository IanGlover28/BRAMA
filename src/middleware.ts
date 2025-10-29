import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";


export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });


  const protectedPages = ["/dashboard", "/account", "/products"];
  const isProtectedPage = protectedPages.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );


  const protectedAPIs = ["/api/orders", "/api/cart"];
  const isProtectedAPI = protectedAPIs.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );


  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL("/signup", req.url));
  }


  if (isProtectedAPI && !token) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/products/:path*",
    "/api/orders/:path*",
    "/api/cart/:path*",
  ],
};

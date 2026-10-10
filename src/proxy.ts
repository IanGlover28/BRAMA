import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedPage = createRouteMatcher([
  "/account(.*)",
  "/orders(.*)",
  "/inbox(.*)",
  "/reviews(.*)",
  "/vouchers(.*)",
  "/wishlist(.*)",
  "/vendor(.*)",
]);

// API routes that require an authenticated session. The Paystack webhook is
// deliberately excluded - it authenticates via its own HMAC signature.
const isProtectedAPI = createRouteMatcher([
  "/api/orders(.*)",
  "/api/inbox(.*)",
  "/api/reviews(.*)",
  "/api/wishlist(.*)",
  "/api/paystack/initialize(.*)",
  "/api/paystack/verify(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedPage(req)) {
    await auth.protect();
  }

  if (isProtectedAPI(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Match API routes
    "/(api|trpc)(.*)",
    // Clerk's auto-proxy path used for client session sync
    "/__clerk/:path*",
    // Protected pages
    "/account/:path*",
    "/orders/:path*",
    "/inbox/:path*",
    "/reviews/:path*",
    "/vouchers/:path*",
    "/wishlist/:path*",
    "/vendor/:path*",
    // Public pages that read the session via currentUser()
    "/products/:path*",
  ],
};
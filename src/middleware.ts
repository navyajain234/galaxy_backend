import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const _isPublicRoute = createRouteMatcher(['/', '/dashboard', '/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (_auth, _request) => {
  // temporarily disabled auth.protect() to debug 404 routing
  return;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

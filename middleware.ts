import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard", "wizard"]);

export default clerkMiddleware(
  (auth, req) => {
    if (!auth().userId && isProtectedRoute(req)) {
      // Add custom logic to run before redirecting
      return auth().redirectToSignIn();
    }
  },
  { debug: true }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

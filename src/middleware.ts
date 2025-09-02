import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    // Protect dashboard routes
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (!token) {
        // No token → redirect to login
        const loginUrl = new URL("/", req.url);
        loginUrl.searchParams.set("redirect", req.nextUrl.pathname); // optional: redirect back after login
        return NextResponse.redirect(loginUrl);
      }

      // Validate the token
      const isValid = verifyToken(token);
      if (!isValid) {
        // Invalid or expired token → clear cookie & redirect to login
        const response = NextResponse.redirect(new URL("/", req.url));
        response.cookies.delete("token");
        return response;
      }
    }

    // Allow request to continue
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);

    // On error → redirect to home/login
    return NextResponse.redirect(new URL("/", req.url));
  }
}

// Apply middleware only to dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};

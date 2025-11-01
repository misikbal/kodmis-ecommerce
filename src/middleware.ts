import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Admin routes protection
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (req.nextauth.token?.role !== "ADMIN") {
        return Response.redirect(new URL("/auth/signin", req.url))
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (req.nextUrl.pathname.startsWith("/auth") || 
            req.nextUrl.pathname === "/" ||
            req.nextUrl.pathname.startsWith("/products") ||
            req.nextUrl.pathname.startsWith("/categories")) {
          return true
        }
        
        // Require authentication for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/api/admin/:path*"
  ]
}

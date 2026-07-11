import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // If user is trying to access /admin (but not /admin/login)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    // Check if the admin_session cookie exists and is valid
    const sessionCookie = request.cookies.get('admin_session')
    
    // We are looking for a simple boolean string "true" in this case, 
    // because the cookie is HttpOnly and cryptographically signed/secured by Next.js if we wanted, 
    // but here we just check for its existence for simple protection.
    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      // Redirect to login page
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

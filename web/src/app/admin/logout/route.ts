import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  // Clear the admin session cookie
  cookies().delete('admin_session')
  
  // Redirect to home page
  const homeUrl = new URL('/', request.url)
  return NextResponse.redirect(homeUrl)
}

'use server'

import { cookies } from 'next/headers'

export async function loginAdmin(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD
  
  if (!correctPassword) {
    return { error: 'Admin password not configured in environment variables.' }
  }

  if (password === correctPassword) {
    // Set a secure, HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'admin_session',
      value: 'authenticated',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    
    return { success: true }
  } else {
    return { error: 'Incorrect password.' }
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session')
}

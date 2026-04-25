/**
 * Middleware to protect routes and keep user sessions active.
 */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

interface CookieToSet {
  name: string
  value: string
  options?: any
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refreshing the auth token
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Define which pages are for authentication (login/signup)
  const isAuthPage = pathname.startsWith('/login') ||
                     pathname.startsWith('/signup') ||
                     pathname.startsWith('/auth')

  // Define public pages that anyone can see
  const isPublicRoute =
    pathname === '/' ||
    pathname === '/admin' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    // Allow unauthenticated access to public profiles (/profile/[username])
    pathname.startsWith('/profile/')

  // If there's no user and they're trying to visit a private page, send them to login
  if (!user && !isAuthPage && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

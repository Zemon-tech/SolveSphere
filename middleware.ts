import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the routes that require authentication
const protectedRoutes = [
  '/problems/create',
  '/solutions/create',
  '/profile',
  '/problems/[id]/solve',
  '/api/solutions'
];

// Define the routes that should redirect to dashboard if user is already authenticated
const authRoutes = [
  '/auth/signin',
  '/auth/signup',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession();
  
  const path = req.nextUrl.pathname;
  
  // Check if the path requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    path.startsWith(route)
  );
  
  // Check if path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    path === route
  );
  
  // If accessing a protected route without session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/signin', req.url);
    redirectUrl.searchParams.set('redirectTo', path);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If accessing auth routes with session, redirect to homepage
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 
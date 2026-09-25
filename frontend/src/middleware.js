import { NextResponse } from "next/server";

export async function middleware(request) {
    const sessionToken = request.cookies.get("better-auth.session_token") || 
                         request.cookies.get("__Secure-better-auth.session_token");
    
    const { pathname } = request.nextUrl;
    
    // Protected routes
    const isProtectedRoute = pathname.startsWith("/create-poster") || pathname.startsWith("/my-poster");
    // Auth routes (redirect to home if already logged in)
    const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

    if (isProtectedRoute && !sessionToken) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && sessionToken) {
        return NextResponse.redirect(new URL("/create-poster", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/create-poster/:path*", "/my-poster/:path*", "/login", "/register"],
};

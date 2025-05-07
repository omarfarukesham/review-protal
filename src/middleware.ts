import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const currentRoute = request.nextUrl.pathname;
  // Run the NextAuth.js middleware first
  const session = await auth();
  const isPublicRoute =
    currentRoute === "/login" || currentRoute === "/register";

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let redirectRoute  = session?.user.role.toLowerCase() === 'admin' ?  `/dashboard/${session?.user.role.toLowerCase()}/analytics` :  `/dashboard/${session?.user.role.toLowerCase()}/my-reviews`

  if (session?.user && isPublicRoute) {
    return NextResponse.redirect(
      new URL(
        redirectRoute,
        request.url
      )
    );
  }
  // Ensuring a particullar role session?.user can access only a particular route
  if (
    session?.user?.role &&
    !currentRoute.startsWith(`/dashboard/${session?.user.role.toLowerCase()}`)
  ) {
    return NextResponse.redirect(
      new URL(`/dashboard/${session?.user.role}`, request.url)
    );
  }
  console.log(currentRoute);
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};

import { type NextRequest, NextResponse } from "next/server"

import { getCurrentUser } from "./app/actions"

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl?.pathname ?? new URL(request.url).pathname

  // Ignore index, login and the profile/settings pages to avoid redirect loops
  const ignoredPaths = ["/", "/login", "/auth/login", "/profile", "/settings"]
  if (ignoredPaths.includes(pathname)) {
    return NextResponse.next()
  }

  const user = await getCurrentUser()

  if (!user) {
    // no user, let the request continue (e.g. public pages / login)
    return NextResponse.next()
  }
  // If profile is explicitly incomplete, redirect based on role
  if (user.admin && user.admin?.profile_complete === false) {
    return NextResponse.redirect(new URL("/settings", request.url))
  } else if (user.vendor && user.vendor?.profile_complete === false) {
    return NextResponse.redirect(new URL("/profile", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|lottie|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}

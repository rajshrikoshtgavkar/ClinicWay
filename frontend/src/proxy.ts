import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicPaths = ["/"];
  const isPublicPath = publicPaths.includes(pathname);

  const token = req.cookies.get("authToken")?.value;

  // Not logged in
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Logged in → verify
  if (token) {
    const user = await verifyToken(req);

    if (!user) {
      // ❗ token invalid → logout backend + redirect
      const res = NextResponse.redirect(new URL("/", req.url));

      res.cookies.set("authToken", "", {
        maxAge: 0,
        path: "/",
      });

      return res;
    }

    const { role } = user;

    if (isPublicPath) {
      return NextResponse.redirect(
        new URL(`/${role.toLowerCase()}/dashboard`, req.url),
      );
    }
  }

  return NextResponse.next();
}

async function verifyToken(req: NextRequest) {
  try {
    const response = await fetch("http://localhost:8080/api/auth/me", {
      method: "GET",
      headers: {
        Cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export const config = {
  matcher: ["/", "/doctor/:path*", "/staff/:path*", "/patient/:path*"],
};

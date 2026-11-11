import { NextResponse, type NextRequest } from "next/server";
import { getFreebuff } from "./lib/freebuff-auth";

/**
 * Refreshes an expired Freebuff session before pages render.
 * Any failure here must not take the public site down.
 */
export async function proxy(request: NextRequest) {
  try {
    const freebuff = await getFreebuff();
    return await freebuff.proxy(request);
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.[a-z0-9]+$).*)"],
};

import type { FreebuffUser } from "@freebuff/auth";
import { getFreebuff } from "./freebuff-auth";

export type UserGate = { ok: true; user: FreebuffUser } | { ok: false; status: 401 | 503; message: string };

/**
 * Any signed-in Freebuff visitor. Unlike requireAdmin there is no allowlist:
 * every student may read and write their own saved progress.
 */
export async function requireUser(): Promise<UserGate> {
  try {
    const freebuff = await getFreebuff();
    const user = await freebuff.getUser();
    if (!user) return { ok: false, status: 401, message: "Sign in to save your progress." };
    return { ok: true, user };
  } catch (error) {
    return { ok: false, status: 503, message: error instanceof Error ? error.message : "Sign in is unavailable." };
  }
}

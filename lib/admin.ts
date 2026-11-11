import type { FreebuffUser } from "@freebuff/auth";
import { getFreebuff } from "./freebuff-auth";
import { envValue } from "./site-env";

export type AdminGate =
  | { ok: true; user: FreebuffUser }
  | { ok: false; status: 401 | 403 | 503; user?: FreebuffUser; message: string };

async function allowlist(key: "ADMIN_EMAILS" | "ADMIN_SUBS"): Promise<string[]> {
  const raw = (await envValue(key)) ?? "";
  return raw
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * The admin area is closed by default: access requires an explicit
 * ADMIN_EMAILS (or ADMIN_SUBS) allowlist. Without it nothing is granted.
 */
export async function requireAdmin(): Promise<AdminGate> {
  let user: FreebuffUser | null = null;
  try {
    const freebuff = await getFreebuff();
    user = await freebuff.getUser();
  } catch (error) {
    return { ok: false, status: 503, message: error instanceof Error ? error.message : "Sign in is unavailable." };
  }
  if (!user) return { ok: false, status: 401, message: "Sign in required." };

  const emails = await allowlist("ADMIN_EMAILS");
  const subs = await allowlist("ADMIN_SUBS");
  if (!emails.length && !subs.length) {
    return {
      ok: false,
      status: 403,
      user,
      message: "No admin allowlist is configured. Set ADMIN_EMAILS (comma-separated) for this site to grant access.",
    };
  }

  const email = user.email?.toLowerCase();
  const allowed = (email ? emails.includes(email) : false) || subs.includes(user.sub.toLowerCase());
  if (!allowed) {
    return {
      ok: false,
      status: 403,
      user,
      message: `This account is not an administrator. Signed in as ${user.email ?? user.sub}.`,
    };
  }
  return { ok: true, user };
}

import { createFreebuffNext, type FreebuffNext } from "@freebuff/auth/next";
import { envValue } from "./site-env";

let cached: { key: string; instance: FreebuffNext } | null = null;

/**
 * Sign in with Freebuff, built once per isolate.
 * The client ID and origin are public configuration injected at deploy time;
 * the origin is never derived from the request's Host header.
 */
export async function getFreebuff(): Promise<FreebuffNext> {
  const clientId = await envValue("FREEBUFF_CLIENT_ID");
  const baseUrl = await envValue("APP_ORIGIN");
  if (!clientId || !baseUrl) {
    throw new Error("Sign in is not configured: FREEBUFF_CLIENT_ID and APP_ORIGIN are missing.");
  }
  const key = `${clientId}|${baseUrl}`;
  if (cached && cached.key === key) return cached.instance;

  const instance = createFreebuffNext({
    clientId,
    baseUrl,
    issuer: await envValue("FREEBUFF_ISSUER"),
    allowInsecureLocalhost: /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])/.test(baseUrl),
  });
  cached = { key, instance };
  return instance;
}

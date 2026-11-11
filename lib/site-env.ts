import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Reads a Worker var or secret. Falls back to process.env so plain
 * `next dev` works from .env.local when the Cloudflare shim is absent.
 */
export async function envValue(key: string): Promise<string | undefined> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const value = (env as unknown as Record<string, unknown>)[key];
    if (typeof value === "string" && value.length > 0) return value;
  } catch {
    /* not running inside workerd */
  }
  const fallback = process.env[key];
  return fallback && fallback.length > 0 ? fallback : undefined;
}

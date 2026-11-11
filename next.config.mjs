import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Gives `next dev` the same D1/R2 bindings the Worker gets, backed by local storage.
initOpenNextCloudflareForDev({ configPath: "./freebuff.wrangler.jsonc" });

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The cloud preview proxies requests with its own Host header. Supplied per-process,
  // never committed with a fixed hostname.
  allowedDevOrigins: process.env.PREVIEW_HOST ? [process.env.PREVIEW_HOST] : [],
};

export default nextConfig;

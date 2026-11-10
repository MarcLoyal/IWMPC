import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const nextConfig: NextConfig = {
  env: {
    // Shown as "Last updated" in the footer.
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  cacheComponents: true,
  // Off on purpose: with partial prefetching, an unknown advisory URL is answered
  // with a 200 fallback shell before notFound() runs. Shared links must 404 properly.
  partialPrefetching: false,
  // Content files are read with fs; make sure they ship with the server bundle.
  outputFileTracingIncludes: { "/**": ["./content/**/*"] },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);

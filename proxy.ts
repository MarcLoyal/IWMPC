import createMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Everything except API routes, the CMS, Next internals and files with an extension.
  matcher: "/((?!api|keystatic|_next|_vercel|.*\\..*).*)",
};

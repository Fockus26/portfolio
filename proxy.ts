import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// `/` redirects to the language of the visitor (Spanish when none matches) and every
// response carries the hreflang `link` header.
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next and Vercel internals, and files with an extension.
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

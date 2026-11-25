import { notFound } from "next/navigation";

// Any path under a language that no page claims ends here and renders the localized 404
// (app/[locale]/not-found.tsx) with a real 404 status.
export default function CatchAll() {
  notFound();
}

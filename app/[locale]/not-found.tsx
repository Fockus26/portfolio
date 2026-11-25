import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { StatusScreenView } from "@/components/sections/StatusScreenView";
import { statusTitle } from "@/lib/status";

// The 404 (HANDOFF § 5b). Next answers 404 and adds noindex by itself; the catch-all in
// [...rest] sends every unknown path under a locale here, so it comes in the visitor's
// language and inside the site's header.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Status");
  return { title: { absolute: statusTitle(t("notFound.label")) } };
}

export default function NotFound() {
  return <StatusScreenView variant="not-found" />;
}

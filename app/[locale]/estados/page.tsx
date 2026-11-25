import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StatusScreenView } from "@/components/sections/StatusScreenView";
import { Link } from "@/i18n/navigation";
import { isStatusVariant, STATUS_VARIANTS } from "@/lib/status";

// Development-only gallery of the status screens (kit STATUS-SCREENS): every variant is one
// URL, so it can be reviewed and captured without making the site fail. Like /componentes
// it is 404 in production, so its captions are not site copy and stay out of messages/.
export const metadata: Metadata = {
  title: "Estados",
  robots: { index: false, follow: false },
};

// A sample digest, only to show the 500 with a code
const SAMPLE_CODE = "2893347615";

async function Gallery({
  searchParams,
}: {
  searchParams: PageProps<"/[locale]/estados">["searchParams"];
}) {
  const { screen } = await searchParams;
  const value = Array.isArray(screen) ? screen[0] : screen;

  if (isStatusVariant(value)) {
    return (
      <StatusScreenView
        variant={value}
        code={value === "error" ? SAMPLE_CODE : undefined}
      />
    );
  }

  return (
    <div className="container-page flex flex-col gap-6 py-24 pt-[calc(var(--spacing-header)+--spacing(16))]">
      <h1 className="text-h1-status">Estados</h1>
      <ul className="flex flex-col gap-1 font-mono text-code">
        {STATUS_VARIANTS.map((variant) => (
          <li key={variant}>
            <Link
              href={`/estados?screen=${variant}`}
              className="inline-flex min-h-11 items-center underline underline-offset-5"
            >
              ?screen={variant}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/estados/falla"
            className="inline-flex min-h-11 items-center underline underline-offset-5"
          >
            /estados/falla (lanza un error de servidor)
          </Link>
        </li>
        <li>
          <Link
            href="/estados/falla?tipo=cliente"
            className="inline-flex min-h-11 items-center underline underline-offset-5"
          >
            /estados/falla?tipo=cliente (sin código)
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default function StatusGalleryPage(
  props: PageProps<"/[locale]/estados">,
) {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <Suspense>
      <Gallery searchParams={props.searchParams} />
    </Suspense>
  );
}

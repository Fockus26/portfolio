import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Thrower } from "./Thrower";

// Development-only: a page that throws on purpose, to see the real error.tsx run.
// `?tipo=cliente` throws in the browser (no digest), the default in the server (with one).
export const metadata: Metadata = {
  title: "Falla",
  robots: { index: false, follow: false },
};

async function Boom({
  searchParams,
}: {
  searchParams: PageProps<"/[locale]/estados/falla">["searchParams"];
}) {
  const { tipo } = await searchParams;
  if (tipo === "cliente") return <Thrower />;
  throw new Error("Falla de prueba del servidor");
}

export default function FailPage(props: PageProps<"/[locale]/estados/falla">) {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <Suspense>
      <Boom searchParams={props.searchParams} />
    </Suspense>
  );
}

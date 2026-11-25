"use client";

import { RotateCcw } from "lucide-react";
import { IBM_Plex_Mono, Schibsted_Grotesk } from "next/font/google";
import { useState, useSyncExternalStore } from "react";
import { StatusScreen } from "@/components/sections/StatusScreen";
import { Button } from "@/components/ui/button";
import { localeFromPath, SITE_NAME, statusTitle } from "@/lib/status";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const COPY = { es: es.Status, en: en.Status } as const;
const LOCALES = ["es", "en"] as const;

const noSubscription = () => () => {};

// A failure of the layout itself (HANDOFF § 5b): there are no providers, so this screen
// brings its own document and reads the language from the path, with the copy of the
// messages files and without next-intl. It is always the variant without a code.
export default function GlobalError({ retry }: { retry: () => void }) {
  const path = useSyncExternalStore(
    noSubscription,
    () => window.location.pathname,
    () => "/",
  );
  const locale = localeFromPath(path);
  const t = COPY[locale];
  const [retrying, setRetrying] = useState(false);

  return (
    <html
      lang={locale}
      className={`${schibsted.variable} ${plexMono.variable} antialiased`}
    >
      <body>
        <title>{statusTitle(t.error.label)}</title>
        <header className="fixed inset-x-0 top-0 z-header h-header bg-wall">
          <div className="container-page flex h-full items-center justify-between">
            <span className="text-wordmark tracking-wordmark text-ink">
              {SITE_NAME}
            </span>
            <nav aria-label={locale === "en" ? "Language" : "Idioma"}>
              <ul className="flex items-center gap-1 text-small">
                {LOCALES.map((code) => (
                  <li key={code}>
                    <a
                      href={`/${code}`}
                      lang={code}
                      hrefLang={code}
                      aria-current={code === locale ? "true" : undefined}
                      className="inline-grid h-11 min-w-9 place-items-center rounded-sm text-graphite underline-offset-5 hover:text-ink hover:underline aria-[current]:font-semibold aria-[current]:text-ink"
                    >
                      {code.toUpperCase()}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main id="contenido">
          <StatusScreen
            variant="error-no-code"
            label={t.error.label}
            title={t.error.title}
            line={t.error.lineNoCode}
          >
            <Button
              loading={retrying}
              onClick={() => {
                setRetrying(true);
                retry();
              }}
            >
              {!retrying && <RotateCcw aria-hidden="true" />}
              {retrying ? t.error.retrying : t.error.retry}
            </Button>
            <Button asChild variant="secondary">
              <a href={`/${locale}`}>{t.error.home}</a>
            </Button>
          </StatusScreen>
        </main>
      </body>
    </html>
  );
}

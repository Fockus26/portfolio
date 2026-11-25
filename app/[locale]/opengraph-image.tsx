import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

// 1200×630, one per language (HANDOFF § 5, artboard `OG`). Satori cannot read CSS
// variables, so the values of app/globals.css are repeated here: wall, stone, ink,
// graphite and light-2.
const WALL = "#FAFAF7";
const STONE = "#DDD6C8";
const INK = "#17160F";
const GRAPHITE = "#5A574E";
const LIGHT = "#FFFBED";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The alt text is per language, which a static `alt` export cannot be.
export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Next also calls this while it collects static params, before any locale is known.
  const requested = (await params)?.locale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return [{ id: "card", alt: t("ogAlt"), size, contentType }];
}

// Both files are read at build time from the project root (Next traces the literal paths).
const font = await readFile(
  join(
    process.cwd(),
    "node_modules/@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-500-normal.woff",
  ),
);
const mark = await readFile(join(process.cwd(), "app/icon.svg"), "base64");

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const entrance = await getTranslations({ locale, namespace: "Entrance" });
  const host = new URL(SITE_URL).host;

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        background: WALL,
        color: INK,
        fontFamily: "Schibsted Grotesk",
        fontWeight: 500,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "76%",
          width: 300,
          background: LIGHT,
          transform: "skewX(-22deg)",
        }}
      />
      {/* biome-ignore lint/performance/noImgElement: Satori renders this, not the browser */}
      <img
        src={`data:image/svg+xml;base64,${mark}`}
        width={64}
        height={64}
        alt=""
        style={{ position: "absolute", left: 80, top: 72 }}
      />
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 136,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: 136,
            lineHeight: 0.92,
            letterSpacing: -6.12,
          }}
        >
          {entrance("name")}
        </div>
        <div
          style={{
            fontSize: 36,
            lineHeight: 1.2,
            letterSpacing: -0.72,
            paddingTop: 28,
            maxWidth: 880,
          }}
        >
          {entrance("line")}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 88,
          padding: "0 80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: STONE,
          fontSize: 24,
          lineHeight: "32px",
        }}
      >
        <span>{t("ogTagline")}</span>
        <span style={{ color: GRAPHITE }}>{host}</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Schibsted Grotesk", data: font, weight: 500, style: "normal" },
      ],
    },
  );
}

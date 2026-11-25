// Generates the brand icons from one source (HANDOFF § 5, artboard `Marca`):
//   app/icon.svg, app/favicon.ico, app/apple-icon.png,
//   public/icon-192.png, public/icon-512.png, public/icon-maskable-512.png
// The letters "CL" (Schibsted Grotesk 600) are converted to outlines with opentype.js, so no
// output references a font. Run: bun scripts/gen-brand-assets.ts

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import opentype from "opentype.js";
import sharp from "sharp";

const ROOT = join(import.meta.dirname, "..");
const FONT = join(
  ROOT,
  "node_modules/@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-600-normal.woff",
);

// The brand's own colors (HANDOFF § 5). The icons are files: they cannot read CSS variables.
const MOSS = "#1E4A3A";
const BAND = "#2A5C4A";
const WALL = "#FAFAF7";

const VIEW = 512;
const RADIUS = 32; // 6.25 % of the square
const BAND_WIDTH = 0.26;
const BAND_LEFT = 0.62;
const BAND_SKEW = Math.tan((-18 * Math.PI) / 180);

const buf = readFileSync(FONT);
const font = opentype.parse(
  buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
);
const capUnits = font.tables.os2.sCapHeight as number;

type Letters = { d: string; width: number; minX: number };

/** "CL" as one outline path with its ink origin at (0, 0) and the ink box measured. */
function letters(capPx: number, tracking: number): Letters {
  const size = (capPx * font.unitsPerEm) / capUnits;
  let x = 0;
  const paths: opentype.Path[] = [];
  const chars = ["C", "L"];
  chars.forEach((ch, i) => {
    const glyph = font.charToGlyph(ch);
    paths.push(glyph.getPath(x, 0, size));
    const kern =
      i < chars.length - 1
        ? font.getKerningValue(glyph, font.charToGlyph(chars[i + 1]))
        : 0;
    x +=
      ((glyph.advanceWidth ?? 0) + kern) * (size / font.unitsPerEm) +
      tracking * size;
  });
  const boxes = paths.map((p) => p.getBoundingBox());
  const minX = Math.min(...boxes.map((b) => b.x1));
  const maxX = Math.max(...boxes.map((b) => b.x2));
  const d = paths
    .map((p) => {
      const out = new opentype.Path();
      out.commands = p.commands;
      return out.toPathData(2);
    })
    .join("");
  return { d, width: maxX - minX, minX };
}

type Spec = {
  size: number; // output pixels
  radius: number; // corner radius in viewBox units
  band: boolean;
  /** Cap height as a fraction of the square. */
  cap: number;
  tracking: number; // em
  /** Keep letters and band inside the central circle of this radius fraction (maskable). */
  circle?: number;
};

function svg(spec: Spec): string {
  const capPx = spec.cap * VIEW;
  const l = letters(capPx, spec.tracking);
  const tx = VIEW / 2 - l.width / 2 - l.minX;
  const ty = VIEW / 2 + capPx / 2;

  const left = BAND_LEFT * VIEW;
  const w = BAND_WIDTH * VIEW;
  // Skew about the vertical center, so the band leans like "/" through the middle.
  const top = (0 - VIEW / 2) * BAND_SKEW;
  const bottom = (VIEW - VIEW / 2) * BAND_SKEW;
  const f = (n: number) => +n.toFixed(2);
  const band = `M${f(left + top)} 0H${f(left + top + w)}L${f(left + bottom + w)} ${VIEW}H${f(left + bottom)}Z`;

  const clipShape = spec.circle
    ? `<circle cx="${VIEW / 2}" cy="${VIEW / 2}" r="${(spec.circle * VIEW) / 2}"/>`
    : `<rect width="${VIEW}" height="${VIEW}" rx="${spec.radius}"/>`;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW} ${VIEW}" width="${spec.size}" height="${spec.size}">`,
    `<defs><clipPath id="c">${clipShape}</clipPath></defs>`,
    `<rect width="${VIEW}" height="${VIEW}" rx="${spec.circle ? 0 : spec.radius}" fill="${MOSS}"/>`,
    spec.band ? `<path d="${band}" fill="${BAND}" clip-path="url(#c)"/>` : "",
    `<path d="${l.d}" transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)})" fill="${WALL}"/>`,
    "</svg>",
  ].join("");
}

const png = (spec: Spec) => {
  const img = sharp(Buffer.from(svg(spec)));
  // Square icons (apple, maskable) are opaque: iOS paints transparency black.
  return (spec.radius === 0 ? img.flatten({ background: MOSS }) : img)
    .png()
    .toBuffer();
};

// Standard composition: cap height ≈ 38 %, tracking −0.06em, band on.
const STANDARD = { cap: 0.38, tracking: -0.06, band: true } as const;

// The source: 512 viewBox, rounded square, outlines, band.
const source = svg({ ...STANDARD, size: VIEW, radius: RADIUS });
writeFileSync(join(ROOT, "app/icon.svg"), `${source}\n`);

writeFileSync(
  join(ROOT, "app/apple-icon.png"),
  await png({ ...STANDARD, size: 180, radius: 0 }),
);
writeFileSync(
  join(ROOT, "public/icon-192.png"),
  await png({ ...STANDARD, size: 192, radius: RADIUS }),
);
writeFileSync(
  join(ROOT, "public/icon-512.png"),
  await png({ ...STANDARD, size: 512, radius: RADIUS }),
);
// Maskable: square to the edges, letters and band inside the central 80 % circle.
writeFileSync(
  join(ROOT, "public/icon-maskable-512.png"),
  await png({ ...STANDARD, size: 512, radius: 0, circle: 0.8 }),
);

// favicon.ico: 16 and 32 without the band (16 with bigger letters, tighter tracking), 48 with it.
const ico = [
  { size: 16, band: false, cap: 0.6, tracking: -0.04 },
  { size: 32, band: false, cap: 0.5, tracking: -0.06 },
  { size: 48, band: true, cap: 0.38, tracking: -0.06 },
];
const images = await Promise.all(ico.map((s) => png({ ...s, radius: RADIUS })));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = 6 + 16 * images.length;
const entries = images.map((img, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(ico[i].size, 0);
  e.writeUInt8(ico[i].size, 1);
  e.writeUInt16LE(1, 4); // planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(img.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += img.length;
  return e;
});
writeFileSync(
  join(ROOT, "app/favicon.ico"),
  Buffer.concat([header, ...entries, ...images]),
);

console.log("brand assets written");

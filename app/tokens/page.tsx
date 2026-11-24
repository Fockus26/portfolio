import { notFound } from "next/navigation";
import { COLOR_TOKENS, CONTRAST_PAIRS } from "@/lib/tokens";

// Development-only reference of every token (phase 01). It returns 404 in production,
// so its labels are not site copy and do not go through messages/.

// Literal class names so Tailwind generates them.
const TYPE_SAMPLES = [
  ["display", "text-display"],
  ["h1", "text-h1"],
  ["h1-status", "text-h1-status"],
  ["h2", "text-h2"],
  ["h2-long", "text-h2-long"],
  ["h3", "text-h3"],
  ["h4", "text-h4"],
  ["h5", "text-h5"],
  ["h6", "text-h6"],
  ["body", "text-body"],
  ["body-lg", "text-body-lg"],
  ["role", "text-role"],
  ["small", "text-small"],
  ["caption", "font-mono text-caption"],
  ["button", "text-button"],
  ["micro", "text-micro"],
  ["code", "font-mono text-code"],
] as const;

const DURATIONS = [
  ["dur-fast", "duration-fast"],
  ["dur-base", "duration-base"],
  ["dur-slow", "duration-slow"],
  ["dur-entrance", "duration-entrance"],
] as const;

export default function TokensPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="flex flex-col gap-16 px-6 py-24 md:px-10 lg:px-12">
      <h1 className="text-h1-status">Tokens</h1>

      <section aria-labelledby="t-color" className="flex flex-col gap-6">
        <h2 id="t-color" className="text-h5">
          Color
        </h2>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {COLOR_TOKENS.map((token) => (
            <li key={token} className="flex flex-col gap-2">
              <span
                className="block h-16 rounded-sm border border-line-strong"
                style={{ backgroundColor: `var(--color-${token})` }}
              />
              <span className="font-mono text-caption text-graphite">
                {token}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="t-pairs" className="flex flex-col gap-6">
        <h2 id="t-pairs" className="text-h5">
          Pares de contraste
        </h2>
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {CONTRAST_PAIRS.map(([fg, bg, min]) => (
            <li
              key={`${fg}-${bg}`}
              className="rounded-sm border border-line-strong px-4 py-3 text-role"
              style={{
                color: `var(--color-${fg})`,
                backgroundColor: `var(--color-${bg})`,
              }}
            >
              {fg} sobre {bg} · mínimo {min}:1
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="t-type" className="flex flex-col gap-6">
        <h2 id="t-type" className="text-h5">
          Tipografía
        </h2>
        <ul className="flex flex-col gap-6">
          {TYPE_SAMPLES.map(([role, classes]) => (
            <li key={role} className="flex flex-col gap-1">
              <span className="text-small text-graphite">{role}</span>
              <span className={`${classes} wrap-anywhere`}>
                Nueve proyectos reales
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="t-shape" className="flex flex-col gap-6">
        <h2 id="t-shape" className="text-h5">
          Radios y sombras
        </h2>
        <ul className="flex flex-wrap gap-8">
          <li className="flex flex-col gap-2 text-small text-graphite">
            <span className="block size-16 rounded-none bg-stone" />
            radius-none
          </li>
          <li className="flex flex-col gap-2 text-small text-graphite">
            <span className="block size-16 rounded-sm bg-stone" />
            radius-sm
          </li>
          <li className="flex flex-col gap-2 text-small text-graphite">
            <span className="block size-16 rounded-md bg-stone" />
            radius-md
          </li>
          <li className="flex flex-col gap-2 text-small text-graphite">
            <span className="block size-16 rounded-sm bg-wall shadow-control-hover" />
            control-hover
          </li>
          <li className="flex flex-col gap-2 text-small text-graphite">
            <span className="block size-16 rounded-sm bg-wall shadow-current-row" />
            current-row
          </li>
          <li className="flex flex-col gap-2 text-small text-graphite">
            <span className="block size-16 rounded-sm bg-stone p-2">
              <span className="block size-full rounded-sm bg-wall shadow-focus-halo outline-2 outline-offset-2 outline-ink" />
            </span>
            focus-halo
          </li>
        </ul>
      </section>

      <section aria-labelledby="t-motion" className="flex flex-col gap-6">
        <h2 id="t-motion" className="text-h5">
          Movimiento
        </h2>
        <p className="text-small text-graphite">
          Pasa el cursor o enfoca cada barra.
        </p>
        <ul className="flex flex-col gap-3">
          {DURATIONS.map(([name, cls]) => (
            <li key={name} className="flex flex-col gap-1">
              <span className="text-small text-graphite">{name}</span>
              <button
                type="button"
                aria-label={name}
                className={`${cls} h-11 w-24 rounded-sm bg-moss ease-out outline-offset-2 outline-moss transition-[width] hover:w-full focus-visible:w-full focus-visible:outline-2 motion-reduce:transition-none`}
              />
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="t-stone"
        className="surface-stone -mx-6 flex flex-col gap-4 px-6 py-16 md:-mx-10 md:px-10 lg:-mx-12 lg:px-12"
      >
        <h2 id="t-stone" className="text-h5">
          Superficie stone
        </h2>
        <p className="max-w-[46ch] text-body text-graphite">
          Selecciona este texto: dentro de una sección stone la selección usa
          moss con wall. Fuera de ella, el verde claro con ink.
        </p>
      </section>
    </main>
  );
}

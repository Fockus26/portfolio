import { ArrowDown, MessageCircle, RotateCcw } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { TextLink } from "@/components/ui/TextLink";
import { VideoControl } from "@/components/ui/VideoControl";
import { SECTION_IDS } from "@/lib/site";

// Development-only gallery of every component and its states (phase 03). Like /tokens it
// returns 404 in production, so its captions are not site copy and stay out of messages/.
// Hover, focus and active are real states: move the pointer or press Tab.

function Cell({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <li className="flex max-w-full flex-col items-start gap-3">
      {children}
      <span className="font-mono text-caption text-graphite">{caption}</span>
    </li>
  );
}

function Group({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-6">
      <h2 id={id} className="text-h5">
        {title}
      </h2>
      {children}
    </section>
  );
}

const ROW = "flex flex-wrap items-end gap-x-10 gap-y-8";

export default async function ComponentsPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const header = await getTranslations("Header");

  return (
    <div className="container-page flex flex-col gap-16 py-24">
      <h1 className="text-h1-status">Componentes</h1>

      <Group id="c-button" title="Button">
        <ul className={ROW}>
          <Cell caption="primary · md">
            <Button asChild>
              <a href={`#${SECTION_IDS.contact}`}>{header("contact")}</a>
            </Button>
          </Cell>
          <Cell caption="primary · sm (cabecera)">
            <Button size="sm">{header("contact")}</Button>
          </Cell>
          <Cell caption="primary · lg + icono">
            <Button size="lg">
              <MessageCircle aria-hidden="true" />
              Escribir por WhatsApp
            </Button>
          </Cell>
          <Cell caption="primary · icono al final">
            <Button>
              {header("contact")}
              <ArrowDown aria-hidden="true" />
            </Button>
          </Cell>
          <Cell caption="primary · disabled">
            <Button disabled>{header("contact")}</Button>
          </Cell>
          <Cell caption="primary · loading">
            <Button loading>Reintentando</Button>
          </Cell>
        </ul>
        <ul className={ROW}>
          <Cell caption="secondary · md">
            <Button variant="secondary">
              Ver proyectos
              <ArrowDown aria-hidden="true" />
            </Button>
          </Cell>
          <Cell caption="secondary · sm">
            <Button variant="secondary" size="sm">
              Copiar código
            </Button>
          </Cell>
          <Cell caption="secondary · lg">
            <Button variant="secondary" size="lg">
              Ir al inicio
            </Button>
          </Cell>
          <Cell caption="secondary · xs (36px, objetivo 44px)">
            <Button variant="secondary" size="xs">
              Reintentar
            </Button>
          </Cell>
          <Cell caption="secondary · disabled">
            <Button variant="secondary" disabled>
              Ver proyectos
            </Button>
          </Cell>
          <Cell caption="secondary · loading">
            <Button variant="secondary" loading>
              Reintentando
            </Button>
          </Cell>
          <Cell caption="enlace deshabilitado (aria-disabled)">
            <Button asChild disabled>
              <span>{header("contact")}</span>
            </Button>
          </Cell>
        </ul>
        <div className="surface-stone -mx-side px-side py-10">
          <ul className={ROW}>
            <Cell caption="sobre stone · primary">
              <Button>
                <RotateCcw aria-hidden="true" />
                Reintentar
              </Button>
            </Cell>
            <Cell caption="sobre stone · secondary (hover stone-hover)">
              <Button variant="secondary">Ver proyectos</Button>
            </Cell>
            <Cell caption="sobre stone · disabled">
              <Button disabled>Ver proyectos</Button>
            </Cell>
          </ul>
        </div>
      </Group>

      <Group id="c-link" title="TextLink">
        <ul className={ROW}>
          <Cell caption="externo · con proyecto">
            <TextLink href="https://example.com" context="Maranatha">
              Ver sitio
            </TextLink>
          </Cell>
          <Cell caption="externo · sin proyecto">
            <TextLink href="https://example.com">Ver código</TextLink>
          </Cell>
          <Cell caption="sin enlace (deshabilitado)">
            <TextLink>Ver demo</TextLink>
          </Cell>
          <Cell caption="contact · correo (sin icono)">
            <TextLink variant="contact" href="mailto:nombre@example.com">
              nombre@example.com
            </TextLink>
          </Cell>
          <Cell caption="contact · externo">
            <TextLink variant="contact" href="https://example.com">
              LinkedIn
            </TextLink>
          </Cell>
          <Cell caption="quiet · volver arriba">
            <TextLink variant="quiet" icon="up" href={`#${SECTION_IDS.main}`}>
              Volver arriba
            </TextLink>
          </Cell>
        </ul>
        <div className="surface-stone -mx-side px-side py-10">
          <ul className={ROW}>
            <Cell caption="sobre stone">
              <TextLink variant="contact" href="https://example.com">
                GitHub
              </TextLink>
            </Cell>
            <Cell caption="sobre stone · quiet">
              <TextLink variant="quiet" icon="up" href={`#${SECTION_IDS.main}`}>
                Volver arriba
              </TextLink>
            </Cell>
          </ul>
        </div>
      </Group>

      <Group id="c-lang" title="LanguageSwitch">
        <ul className={ROW}>
          <Cell caption="actual: peso 600 + barra de 2px">
            <LanguageSwitch />
          </Cell>
          <Cell caption="con sección (#p03)">
            <LanguageSwitch sectionId="p03" />
          </Cell>
        </ul>
      </Group>

      <Group id="c-video" title="VideoControl">
        <ul className={ROW}>
          <Cell caption="reproduciendo → pausa">
            <div className="relative aspect-video w-80 max-w-full rounded-sm bg-stone">
              <VideoControl playing project="Maranatha" />
            </div>
          </Cell>
          <Cell caption="en pausa">
            <div className="relative aspect-video w-80 max-w-full rounded-sm bg-stone">
              <VideoControl
                playing={false}
                project="Maranatha"
                label="En pausa"
              />
            </div>
          </Cell>
          <Cell caption="solo póster">
            <div className="relative aspect-video w-80 max-w-full rounded-sm bg-ink">
              <VideoControl
                playing={false}
                project="Maranatha"
                label="Ver el video"
              />
            </div>
          </Cell>
        </ul>
      </Group>
    </div>
  );
}

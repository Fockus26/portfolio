import { ArrowDown, MessageCircle, RotateCcw } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { ProjectIndex } from "@/components/ui/ProjectIndex";
import { TextLink } from "@/components/ui/TextLink";
import { VideoControl } from "@/components/ui/VideoControl";
import { VideoProvider } from "@/components/ui/VideoProvider";
import { Window } from "@/components/ui/Window";
import { projects } from "@/content/projects";
import { getProjectMedia } from "@/lib/media";
import { buildSections, projectSectionId } from "@/lib/sections";
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

// A video that is not in the repository: the QA script serves one at this address.
const DEMO_SOURCES = [
  { src: "/work/_demo/loop.webm", type: "video/webm" },
] as const;

const ROW = "flex flex-wrap items-end gap-x-10 gap-y-8";

export default async function ComponentsPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const header = await getTranslations("Header");
  const names = await getTranslations("Sections");
  const sections = buildSections(
    projects.map(({ order, name }) => ({ order, name })),
    {
      entrance: names("entrance"),
      about: names("about"),
      contact: names("contact"),
    },
  );

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

      <Group id="c-index" title="ProjectIndex">
        <ul className={ROW}>
          <Cell caption="en la entrada">
            <ProjectIndex sections={sections} />
          </Cell>
          <Cell caption="en un proyecto (03)">
            <ProjectIndex sections={sections} currentId={projectSectionId(3)} />
          </Cell>
          <Cell caption="nombre largo (08)">
            <ProjectIndex sections={sections} currentId={projectSectionId(8)} />
          </Cell>
          <Cell caption="en Sobre mí">
            <ProjectIndex sections={sections} currentId={SECTION_IDS.about} />
          </Cell>
        </ul>
        <p className="max-w-reading text-small text-graphite">
          Desde 768px abre un popover; por debajo, una hoja desde abajo. La
          cabecera de esta página usa el mismo componente y sigue las secciones
          de prueba del final.
        </p>
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

      <Group id="c-window" title="Window">
        <p className="max-w-reading text-small text-graphite">
          Las tres primeras piden un video de prueba (`/work/_demo/…`, que no
          está en el repositorio): sin él muestran el estado «no cargó». Las
          demás usan los archivos reales de cada proyecto y, mientras no
          existan, quedan en póster provisional sin control.
        </p>
        <VideoProvider>
          <ul className="flex flex-wrap items-start gap-x-10 gap-y-8">
            <Cell caption="desktop 16:9 · reveal izquierda">
              <Window
                id="demo-desktop"
                project="Maranatha"
                format="desktop"
                sources={DEMO_SOURCES}
                className="w-120 max-w-full"
              />
            </Cell>
            <Cell caption="phone 9:19.5 · reveal derecha">
              <Window
                id="demo-phone"
                project="Melao"
                format="phone"
                reveal="right"
                sources={DEMO_SOURCES}
                className="w-52 max-w-full"
              />
            </Cell>
            <Cell caption="chat 9:16">
              <Window
                id="demo-chat"
                project="Gaby"
                format="chat"
                sources={DEMO_SOURCES}
                className="w-57 max-w-full"
              />
            </Cell>
            {projects.slice(0, 2).map((project) => {
              const media = getProjectMedia(project);
              return (
                <Cell
                  key={project.slug}
                  caption={`${project.slug} · archivos reales (${media.sources.length} video, ${media.poster ? "con" : "sin"} póster)`}
                >
                  <Window
                    id={project.slug}
                    project={project.name}
                    format={project.media.format}
                    poster={media.poster}
                    sources={media.sources}
                    flushStacked={project.media.format === "desktop"}
                    className={
                      project.media.format === "desktop"
                        ? "w-120 max-w-full"
                        : "w-52 max-w-full"
                    }
                  />
                </Cell>
              );
            })}
          </ul>
        </VideoProvider>
      </Group>

      <Group id="c-sections" title="Secciones de prueba">
        <p className="max-w-reading text-small text-graphite">
          Una sección por parada de la página, con sus ids reales, para probar
          el índice de la cabecera, el cambio de idioma y los saltos de ancla.
        </p>
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="page-section flex min-h-svh flex-col justify-center border-t border-line"
          >
            <h3 className="text-h2 wrap-anywhere">{section.name}</h3>
            <p className="font-mono text-caption text-graphite">
              #{section.id}
            </p>
          </section>
        ))}
      </Group>
    </div>
  );
}

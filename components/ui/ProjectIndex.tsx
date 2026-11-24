"use client";

import { ChevronDown, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment, type MouseEvent, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MEDIA, useMediaQuery } from "@/hooks/useMediaQuery";
import { goToSection, isPlainClick } from "@/lib/anchors";
import {
  groupIndexRows,
  pad2,
  type SectionEntry,
  triggerLabel,
} from "@/lib/sections";
import { cn } from "@/lib/utils";

type ProjectIndexProps = {
  /** Every section of the page, in order (`buildSections`). */
  sections: readonly SectionEntry[];
  /** Id of the section in view. Without it the trigger reads as in the entrance. */
  currentId?: string;
  className?: string;
};

// The project index of the header (HANDOFF § 2.5): a popover from 768px, a bottom sheet
// below. Its content is a <nav> of links, not a menu. The current row is marked by weight,
// a bar and the text "Estás aquí", never by color alone.
export function ProjectIndex({
  sections,
  currentId,
  className,
}: ProjectIndexProps) {
  const t = useTranslations("ProjectIndex");
  const isDesktop = useMediaQuery(MEDIA.md);
  const [open, setOpen] = useState(false);
  // The row the visitor chose: the jump happens once the list has closed.
  const pending = useRef<string | null>(null);

  const total = sections.filter((s) => s.kind === "project").length;
  const current = sections.find((s) => s.id === currentId);
  const label = triggerLabel(current, total, t("projects"));

  function onRowClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    pending.current = id;
    setOpen(false);
  }

  // Esc and the close button return the focus to the trigger (the library's default).
  // After choosing a row the focus goes to that section's heading instead.
  function onCloseAutoFocus(event: Event) {
    const id = pending.current;
    if (!id) return;
    pending.current = null;
    event.preventDefault();
    goToSection(id);
  }

  const trigger = (
    <button
      type="button"
      className={cn(
        "inline-flex h-11 items-center gap-1.5 rounded-sm px-2 text-start text-small text-ink tabular-nums",
        "transition-colors duration-fast ease-out hover:bg-fill-hover data-[state=open]:bg-fill-hover",
        "motion-reduce:transition-none md:min-w-55 md:gap-3 md:px-3",
        "group",
        className,
      )}
    >
      <span className="sr-only">{t("label")}. </span>
      <span
        // A new key replays the fade, so number and name swap with a 240ms crossfade
        key={`${label.number} ${label.name}`}
        className="flex flex-1 animate-fade-in items-center gap-1.5 motion-reduce:animate-none md:gap-3"
      >
        <span className="text-graphite">{label.number}</span>
        <span className="sr-only font-medium md:not-sr-only">{label.name}</span>
      </span>
      <ChevronDown
        aria-hidden="true"
        className="size-4 shrink-0 transition-transform duration-fast ease-out group-data-[state=open]:rotate-180 motion-reduce:transition-none"
      />
    </button>
  );

  const list = (layout: "popover" | "sheet") => (
    <nav aria-label={t("label")}>
      {groupIndexRows(sections, layout).map((group, index) => (
        <Fragment key={group[0].id}>
          {index > 0 && (
            <div aria-hidden="true" className="my-2 h-px bg-line" />
          )}
          <ul>
            {group.map((section) => {
              const isCurrent = section.id === currentId;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={isCurrent ? "location" : undefined}
                    onClick={(event) => onRowClick(event, section.id)}
                    className={cn(
                      "flex min-h-11 items-center gap-4 rounded-sm px-3 text-role text-ink",
                      "transition-colors duration-fast ease-out hover:bg-fill-hover",
                      "focus-visible:-outline-offset-2 motion-reduce:transition-none",
                      isCurrent && "font-semibold shadow-current-row",
                    )}
                  >
                    <span className="w-5 shrink-0 text-small font-normal text-graphite tabular-nums">
                      {section.order !== undefined && pad2(section.order)}
                    </span>
                    <span className="wrap-anywhere">{section.name}</span>
                    {isCurrent && (
                      <span className="ml-auto shrink-0 text-micro font-normal text-graphite">
                        {t("here")}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </Fragment>
      ))}
    </nav>
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          aria-label={t("label")}
          onCloseAutoFocus={onCloseAutoFocus}
        >
          {list("popover")}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        aria-describedby={undefined}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <div className="flex h-14 shrink-0 items-center justify-between pl-3">
          <SheetTitle>{t("projects")}</SheetTitle>
          <SheetClose
            aria-label={t("close")}
            className="grid size-11 place-items-center rounded-sm text-ink transition-colors duration-fast ease-out hover:bg-fill-hover motion-reduce:transition-none"
          >
            <X aria-hidden="true" className="size-5" />
          </SheetClose>
        </div>
        {list("sheet")}
      </SheetContent>
    </Sheet>
  );
}

import { Search, TriangleAlert, WifiOff } from "lucide-react";
import type { ReactNode, Ref } from "react";
import type { StatusVariant } from "@/lib/status";
import { cn } from "@/lib/utils";

type StatusScreenProps = {
  variant: StatusVariant;
  label: string;
  title: string;
  line: string;
  /** The offline checklist. */
  list?: readonly string[];
  /** The block between the line and the actions (the code to copy). */
  block?: ReactNode;
  /** The actions: links that navigate, buttons that act. */
  children: ReactNode;
  /** The <h1>, so a client wrapper can move the focus to it. */
  titleRef?: Ref<HTMLHeadingElement>;
};

// Every variant has its own icon and color; the label text next to it carries the meaning.
const ICONS = {
  "not-found": { Icon: Search, className: "text-graphite" },
  error: { Icon: TriangleAlert, className: "text-error" },
  "error-no-code": { Icon: TriangleAlert, className: "text-error" },
  offline: { Icon: WifiOff, className: "text-warning" },
} as const;

// Below the header: 112px, 72px for the 500 with its code and 88px offline at >=1024, so
// the taller ones stay inside 720px (HANDOFF § 5b). Written out so Tailwind finds them.
const OFFSETS = {
  "not-found": "lg:pt-[calc(var(--spacing-header)+--spacing(28))]",
  error: "lg:pt-[calc(var(--spacing-header)+--spacing(18))]",
  "error-no-code": "lg:pt-[calc(var(--spacing-header)+--spacing(28))]",
  offline: "lg:pt-[calc(var(--spacing-header)+--spacing(22))]",
} as const;

// The one layout of the four status screens (HANDOFF § 5b). It sits inside the layout's
// <main>, so the title is the page's <h1>. The root clips its overflow so a light band can
// be added later (wave 2); there is none yet. `data-status-screen` is what the header looks
// for to show only the wordmark and the language.
export function StatusScreen({
  variant,
  label,
  title,
  line,
  list,
  block,
  children,
  titleRef,
}: StatusScreenProps) {
  const { Icon, className: iconColor } = ICONS[variant];

  return (
    <div
      data-status-screen={variant}
      className="relative isolate overflow-hidden"
    >
      <div
        className={cn(
          "container-page grid-page pt-[calc(var(--spacing-header)+--spacing(34))] pb-24 md:pt-[calc(var(--spacing-header)+--spacing(28))]",
          OFFSETS[variant],
        )}
      >
        <div className="col-span-full lg:col-[1/10]">
          <p className="flex items-center gap-2.5 text-h6 text-ink">
            <Icon aria-hidden="true" className={cn("size-5", iconColor)} />
            {label}
          </p>
          <h1
            ref={titleRef}
            tabIndex={-1}
            className="mt-4 text-h1-status text-ink outline-none md:mt-5"
          >
            {title}
          </h1>
          <p className="mt-6 max-w-support text-body-lg text-graphite">
            {line}
          </p>
          {list && (
            <ul className="mt-4 list-disc pl-6 text-base text-ink leading-relaxed marker:text-graphite md:text-lg">
              {list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {block && <div className="mt-6 md:mt-8">{block}</div>}
          <div
            className={cn(
              "flex flex-col gap-3 md:flex-row md:gap-4",
              block ? "mt-6" : "mt-8 md:mt-10",
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

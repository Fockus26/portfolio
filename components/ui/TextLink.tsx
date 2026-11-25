import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type * as React from "react";
import { isExternalHref } from "@/lib/links";
import { cn } from "@/lib/utils";

// Project links, contact links and "Volver arriba" (HANDOFF § 2.2).
const textLinkVariants = cva(
  [
    "inline-flex min-h-11 items-center gap-1.5 rounded-sm font-medium",
    "underline decoration-1 underline-offset-5 transition-colors duration-fast ease-out",
    "hover:decoration-2 active:decoration-2 focus-visible:outline-offset-4 motion-reduce:transition-none",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "text-role text-moss hover:text-moss-hover active:text-moss-active focus-visible:outline-moss",
        contact:
          "wrap-anywhere text-contact text-moss hover:text-moss-hover active:text-moss-active focus-visible:outline-moss lg:text-contact-lg",
        // "Volver arriba" and the like: ink text, so the ring is ink too
        quiet: "text-small text-ink focus-visible:outline-ink",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

type TextLinkProps = Omit<React.ComponentProps<"a">, "href"> &
  VariantProps<typeof textLinkVariants> & {
    /** Without it the link is shown as disabled text (a project without a live link). */
    href?: string;
    /** `up` for back-to-top. External links get their arrow on their own. */
    icon?: "up" | "none";
    /** What the link belongs to (the project name); it completes the accessible name. */
    context?: string;
  };

function TextLink({
  href,
  icon,
  context,
  variant = "default",
  className,
  children,
  ...props
}: TextLinkProps) {
  const t = useTranslations("TextLink");

  if (!href) {
    return (
      <span
        aria-disabled="true"
        className={cn(
          textLinkVariants({ variant }),
          "cursor-not-allowed text-graphite no-underline hover:text-graphite active:text-graphite",
          className,
        )}
      >
        {children}
      </span>
    );
  }

  const external = isExternalHref(href);
  const label = typeof children === "string" ? children : undefined;

  return (
    <a
      href={href}
      className={cn(textLinkVariants({ variant }), className)}
      {...(external && {
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": label
          ? context
            ? t("externalWithContext", { label, context })
            : t("external", { label })
          : undefined,
      })}
      {...props}
    >
      {children}
      {external && icon !== "none" && <ArrowUpRight aria-hidden="true" />}
      {icon === "up" && <ArrowUp aria-hidden="true" />}
    </a>
  );
}

export { TextLink, type TextLinkProps, textLinkVariants };

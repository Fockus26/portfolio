"use client";

import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { StatusScreen } from "@/components/sections/StatusScreen";
import { Button } from "@/components/ui/button";
import { CopyCode } from "@/components/ui/CopyCode";
import { Link } from "@/i18n/navigation";
import { SECTION_IDS } from "@/lib/site";
import { type StatusVariant, statusTitle } from "@/lib/status";

type StatusScreenViewProps = {
  variant: StatusVariant;
  /** The error's digest, shown in the 500 with a code. */
  code?: string;
  /** "Reintentar": present in the 500 and offline variants. */
  onRetry?: () => void;
  retrying?: boolean;
  /** Moves the focus to the title on mount (the visitor came from another screen). */
  focusTitle?: boolean;
};

// A status screen with its copy and actions in the visitor's language (next-intl). Used by
// not-found, error and the /estados gallery; global-error has no providers and builds the
// same StatusScreen by hand.
export function StatusScreenView({
  variant,
  code,
  onRetry,
  retrying = false,
  focusTitle = false,
}: StatusScreenViewProps) {
  const t = useTranslations("Status");
  const titleRef = useRef<HTMLHeadingElement>(null);

  const copy =
    variant === "not-found"
      ? {
          label: t("notFound.label"),
          title: t("notFound.title"),
          line: t("notFound.line"),
        }
      : variant === "offline"
        ? {
            label: t("offline.label"),
            title: t("offline.title"),
            line: t("offline.line"),
          }
        : {
            label: t("error.label"),
            title: t("error.title"),
            line: variant === "error" ? t("error.line") : t("error.lineNoCode"),
          };

  useEffect(() => {
    document.title = statusTitle(copy.label);
  }, [copy.label]);

  useEffect(() => {
    if (focusTitle) titleRef.current?.focus({ preventScroll: true });
  }, [focusTitle]);

  const retryLabel =
    variant === "offline" ? t("offline.retry") : t("error.retry");
  const retryingLabel =
    variant === "offline" ? t("offline.retrying") : t("error.retrying");

  return (
    <StatusScreen
      variant={variant}
      {...copy}
      titleRef={titleRef}
      list={
        variant === "offline"
          ? [t("offline.tipWifi"), t("offline.tipAirplane")]
          : undefined
      }
      block={
        variant === "error" && code ? (
          <CopyCode
            code={code}
            labels={{
              label: t("copyCode.label"),
              copy: t("copyCode.copy"),
              copied: t("copyCode.copied"),
              fallback: t("copyCode.fallback"),
            }}
          />
        ) : undefined
      }
    >
      {variant === "not-found" ? (
        <>
          <Button asChild>
            <Link href="/">{t("notFound.home")}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={`/#${SECTION_IDS.contact}`}>
              {t("notFound.contact")}
            </Link>
          </Button>
        </>
      ) : (
        <>
          <Button onClick={onRetry} loading={retrying}>
            {!retrying && <RotateCcw aria-hidden="true" />}
            {retrying ? retryingLabel : retryLabel}
          </Button>
          {variant !== "offline" && (
            <Button asChild variant="secondary">
              <Link href="/">{t("error.home")}</Link>
            </Button>
          )}
        </>
      )}
    </StatusScreen>
  );
}

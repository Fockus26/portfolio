"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { COPIED_MS } from "@/lib/status";
import { cn } from "@/lib/utils";

type CopyCodeProps = {
  /** The text to show and copy: the error's `digest`. */
  code: string;
  labels: {
    /** "Código" */
    label: string;
    /** "Copiar código" */
    copy: string;
    /** "Copiado" */
    copied: string;
    /** "Selecciona y copia el código" */
    fallback: string;
  };
  className?: string;
};

// The error code with its copy button (HANDOFF § 2.12). After copying, the button gives way
// to "Copiado" for COPIED_MS; if the browser refuses the clipboard, the code is selected so
// the visitor can copy it by hand. The <output> is a polite live region that exists from the
// start, so what it says is announced.
export function CopyCode({ code, labels, className }: CopyCodeProps) {
  const codeRef = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");

  useEffect(() => () => clearTimeout(timer.current), []);

  function selectCode() {
    const node = codeRef.current;
    const selection = window.getSelection();
    if (!node || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(code);
      setState("copied");
      timer.current = setTimeout(() => setState("idle"), COPIED_MS);
    } catch {
      selectCode();
      setState("manual");
    }
  }

  return (
    <div
      className={cn(
        "flex max-w-170 flex-col gap-3 border-y border-line py-3 md:flex-row md:items-center md:gap-4",
        className,
      )}
    >
      <span className="text-small text-graphite">{labels.label}</span>
      <code
        ref={codeRef}
        className="wrap-anywhere select-all font-mono text-code text-ink md:flex-1"
      >
        {code}
      </code>
      <div className="flex min-h-11 flex-col justify-center gap-1 md:items-end">
        {state !== "copied" && (
          <Button
            variant="secondary"
            size="sm"
            onClick={copy}
            className="max-md:w-full"
          >
            <Copy aria-hidden="true" />
            {labels.copy}
          </Button>
        )}
        <output
          className={cn(
            "inline-flex min-h-11 items-center gap-2 text-button text-success",
            state === "idle" && "sr-only",
            state === "manual" && "min-h-0 text-small text-ink",
          )}
        >
          {state === "copied" && (
            <>
              <Check aria-hidden="true" className="size-4" />
              {labels.copied}
            </>
          )}
          {state === "manual" && labels.fallback}
        </output>
      </div>
    </div>
  );
}

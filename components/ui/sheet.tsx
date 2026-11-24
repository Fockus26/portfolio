"use client";

import { Dialog as SheetPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

// shadcn Sheet restyled with the tokens (HANDOFF § 2.5, § 6.6). Only the bottom sheet the
// design uses: wall, 4px top corners, at most 85svh with its own scroll, scrim behind.
// It slides up in 480ms and leaves in 240ms; with reduced motion both are a 120ms fade.

function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(
  props: React.ComponentProps<typeof SheetPrimitive.Trigger>,
) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-scrim bg-scrim",
        "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
        "motion-reduce:data-[state=open]:animate-fade-in-fast motion-reduce:data-[state=closed]:animate-fade-out-fast",
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content>) {
  return (
    <SheetPrimitive.Portal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed inset-x-0 bottom-0 z-sheet flex max-h-sheet flex-col overflow-y-auto overscroll-contain rounded-t-md bg-wall px-2 pt-2 pb-4 text-ink outline-none",
          "data-[state=open]:animate-sheet-in data-[state=closed]:animate-sheet-out",
          "motion-reduce:data-[state=open]:animate-fade-in-fast motion-reduce:data-[state=closed]:animate-fade-out-fast",
          className,
        )}
        {...props}
      >
        {children}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-button-lg text-ink", className)}
      {...props}
    />
  );
}

export { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger };

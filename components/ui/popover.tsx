"use client";

import { Popover as PopoverPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

// shadcn Popover restyled with the tokens (HANDOFF § 2.5, § 6.6): wall, a 1px informative
// border, 4px radius, no shadow. It opens with opacity + 4px in 240ms and closes with
// opacity in 120ms; with reduced motion both are a 120ms fade.

function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger(
  props: React.ComponentProps<typeof PopoverPrimitive.Trigger>,
) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 8,
  collisionPadding = 8,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          "z-popover w-80 max-w-(--radix-popover-content-available-width) rounded-md border border-line-strong bg-wall p-2 text-ink outline-none",
          "data-[state=open]:animate-popover-in data-[state=closed]:animate-fade-out-fast",
          "motion-reduce:data-[state=open]:animate-fade-in-fast",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverContent, PopoverTrigger };

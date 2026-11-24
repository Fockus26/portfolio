import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { Slot } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

// shadcn Button restyled with the tokens of "Ático de día" (HANDOFF § 2.1). The focus ring
// takes each variant's ink: moss for primary, ink for secondary (§ 8).
const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border border-transparent",
    // One line from 768 up. Below it a long label may wrap instead of pushing the page
    // sideways at 320px or at 200% text (D008); at 360 every label of the design fits.
    "text-center text-button transition-colors duration-fast ease-out md:whitespace-nowrap",
    "active:translate-y-px motion-reduce:transition-none",
    "aria-disabled:cursor-not-allowed aria-disabled:border-transparent aria-disabled:bg-stone aria-disabled:text-graphite aria-disabled:active:translate-y-0",
    "aria-busy:cursor-progress aria-busy:active:translate-y-0",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-moss text-wall selection:bg-wall selection:text-moss",
          "hover:bg-moss-hover active:bg-moss-active focus-visible:outline-moss",
          "aria-busy:hover:bg-moss aria-busy:active:bg-moss",
          "aria-disabled:hover:bg-stone aria-disabled:active:bg-stone",
        ],
        secondary: [
          "border-ink bg-transparent text-ink",
          "hover:bg-fill-hover active:bg-wash-active focus-visible:outline-ink",
          "aria-busy:hover:bg-transparent aria-busy:active:bg-transparent",
          "aria-disabled:hover:bg-stone aria-disabled:active:bg-stone",
        ],
      },
      size: {
        // 36px high inside the failed-video panel; the pseudo-element keeps a 44px target
        xs: "relative min-h-9 px-3 text-small font-medium after:absolute after:inset-x-0 after:-inset-y-1.25",
        sm: "min-h-11 px-3.5 md:px-5",
        md: "min-h-12 px-6",
        lg: "min-h-14 px-7 text-button-lg [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Renders the child element (a link) with the button's look. */
    asChild?: boolean;
    /** Shows the spinner and ignores clicks. The caller changes the label ("Reintentando"). */
    loading?: boolean;
  };

function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild) {
    return (
      <Slot.Root
        data-slot="button"
        aria-disabled={disabled || undefined}
        className={classes}
        {...props}
      >
        {children}
      </Slot.Root>
    );
  }

  return (
    <button
      data-slot="button"
      type={type}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-busy={loading || undefined}
      className={classes}
      onClick={loading ? undefined : onClick}
      {...props}
    >
      {loading && (
        <LoaderCircle
          aria-hidden="true"
          className="animate-spinner motion-reduce:animate-none"
        />
      )}
      {children}
    </button>
  );
}

export { Button, type ButtonProps, buttonVariants };

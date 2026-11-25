import { TextLink } from "@/components/ui/TextLink";
import { cn } from "@/lib/utils";

export type ContactRow = {
  label: string;
  href: string;
  /** The link's text: the address itself for the email, an action for the rest. */
  text: string;
  /**
   * Below 768 the label goes above the link: the email is long and wraps anywhere.
   * The other rows keep the label on the left and the link on the right.
   */
  stacked?: boolean;
};

// The ways to reach César, one per row (HANDOFF § 2.11)
export function ContactRows({ rows }: { rows: readonly ContactRow[] }) {
  return (
    <ul>
      {rows.map((row) => (
        <li
          key={row.label}
          className={cn(
            "border-t border-line-strong last:border-b md:flex md:min-h-16 md:items-center md:gap-6",
            row.stacked
              ? "max-md:pt-3 max-md:pb-2"
              : "max-md:flex max-md:min-h-16 max-md:items-center max-md:justify-between max-md:gap-6",
          )}
        >
          <span
            className={cn(
              "text-small md:w-24 md:shrink-0",
              row.stacked && "max-md:block",
            )}
          >
            {row.label}
          </span>
          <TextLink
            href={row.href}
            variant="contact"
            context={row.label}
            icon={row.stacked ? "none" : undefined}
          >
            {row.text}
          </TextLink>
        </li>
      ))}
    </ul>
  );
}

import { cn } from "../../utils/cn";

/**
 * Small capitalised label that opens a section. A short cyan rule replaces the
 * usual pill so stacked sections stay quiet rather than competing for attention.
 *
 * @param {{ light?: boolean, className?: string, children: React.ReactNode }} props
 */
export function Eyebrow({ light = false, className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-eyebrow uppercase",
        light ? "text-accent-300" : "text-accent-700 dark:text-accent-300",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-px w-6 shrink-0", light ? "bg-accent-300/70" : "bg-accent-600/60 dark:bg-accent-300/60")}
      />
      {children}
    </span>
  );
}

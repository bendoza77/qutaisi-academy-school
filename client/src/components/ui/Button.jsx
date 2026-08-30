import { cn } from "../../utils/cn";

const variants = {
  /* Navy fill — the default commitment action. 15.7:1 on white. */
  primary:
    "bg-primary-900 text-white shadow-sm hover:bg-primary-800 hover:shadow-md active:bg-primary-950 " +
    "dark:bg-white dark:text-primary-950 dark:hover:bg-primary-100",
  /* Cyan fill — used where the surrounding field is navy and the action must pop. */
  accent:
    "bg-accent-600 text-white shadow-sm hover:bg-accent-700 hover:shadow-md active:bg-accent-800",
  /* Bordered, sits on light surfaces next to a primary action. */
  secondary:
    "bg-surface text-primary-900 border border-line-strong hover:border-primary-300 hover:bg-primary-50 " +
    "dark:text-white dark:hover:bg-white/5 dark:hover:border-primary-400",
  /* Chromeless. */
  ghost:
    "text-primary-800 hover:bg-primary-50 dark:text-white dark:hover:bg-white/10",
  /* On a dark/navy field. */
  outline:
    "border border-white/25 text-white hover:bg-white/10 hover:border-white/45 backdrop-blur-[2px]",
  /* Inline text action. */
  link:
    "text-accent-700 underline underline-offset-4 decoration-accent-700/30 hover:decoration-accent-700 " +
    "dark:text-accent-300 dark:decoration-accent-300/30 dark:hover:decoration-accent-300 px-0 py-0",
};

const sizes = {
  sm: "h-9 px-3.5 text-caption gap-1.5",
  md: "h-11 px-5 text-btn gap-2",
  lg: "h-[3.25rem] px-7 text-btn gap-2",
};

/**
 * @param {{
 *   as?: React.ElementType,
 *   variant?: keyof typeof variants,
 *   size?: keyof typeof sizes,
 *   loading?: boolean,
 *   fullWidth?: boolean,
 *   className?: string,
 *   children: React.ReactNode
 * } & Record<string, any>} props
 */
export function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}) {
  const isNative = Tag === "button";

  return (
    <Tag
      className={cn(
        "relative inline-flex items-center justify-center rounded-control font-semibold whitespace-nowrap",
        "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-[var(--ease-out-soft)]",
        "active:translate-y-px",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:pointer-events-none disabled:opacity-55",
        variant !== "link" && sizes[size],
        variants[variant],
        fullWidth && "w-full",
        loading && "pointer-events-none",
        className
      )}
      aria-busy={loading || undefined}
      {...(isNative ? { disabled: disabled || loading, type: props.type ?? "button" } : {})}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>
        {children}
      </span>
    </Tag>
  );
}

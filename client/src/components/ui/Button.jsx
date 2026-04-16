import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-primary-900 text-white hover:bg-primary-800 focus-visible:ring-primary-700 shadow-lg shadow-primary-900/25 hover:shadow-primary-900/40",
  secondary:
    "bg-white text-primary-900 border border-primary-200 hover:bg-primary-50 hover:border-primary-300 focus-visible:ring-primary-400",
  accent:
    "bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-accent-400 shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40",
  ghost:
    "text-primary-900 hover:bg-primary-50 focus-visible:ring-primary-400 dark:text-white dark:hover:bg-white/10",
  outline:
    "border border-white/30 text-white hover:bg-white/10 focus-visible:ring-white/50 backdrop-blur-sm",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
  xl: "px-10 py-4.5 text-lg",
};

/**
 * @param {{
 *   variant?: keyof typeof variants,
 *   size?: keyof typeof sizes,
 *   className?: string,
 *   children: React.ReactNode,
 *   [key: string]: any
 * }} props
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold",
        "transition-all duration-200 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

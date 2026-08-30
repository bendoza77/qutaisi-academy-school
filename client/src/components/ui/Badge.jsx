import { cn } from "../../utils/cn";

const tones = {
  neutral: "bg-primary-50 text-primary-700 ring-primary-100 dark:bg-white/8 dark:text-primary-100 dark:ring-white/10",
  accent: "bg-accent-50 text-accent-800 ring-accent-100 dark:bg-accent-400/12 dark:text-accent-200 dark:ring-accent-400/20",
  gold: "bg-gold-200/40 text-gold-600 ring-gold-300/60 dark:bg-gold-400/12 dark:text-gold-300 dark:ring-gold-400/25",
  success: "bg-success-50 text-success-600 ring-success-500/20 dark:bg-success-500/12 dark:text-success-500 dark:ring-success-500/25",
  onDark: "bg-white/10 text-white ring-white/15 backdrop-blur-[2px]",
};

/**
 * @param {{ tone?: keyof typeof tones, className?: string, children: React.ReactNode }} props
 */
export function Badge({ tone = "neutral", className, children, ...rest }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold ring-1 ring-inset",
        tones[tone],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

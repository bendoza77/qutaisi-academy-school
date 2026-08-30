import { cn } from "../../utils/cn";

/**
 * Surface primitive. One border colour, one radius, one shadow step — used by
 * every card on the public site so panels never drift apart visually.
 *
 * @param {{
 *   as?: React.ElementType,
 *   interactive?: boolean,
 *   padded?: boolean,
 *   className?: string,
 *   children: React.ReactNode
 * } & Record<string, any>} props
 */
export function Card({
  as: Tag = "div",
  interactive = false,
  padded = true,
  className,
  children,
  ...rest
}) {
  return (
    <Tag
      className={cn(
        "rounded-card border border-line bg-surface",
        padded && "p-6",
        interactive &&
          "transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] " +
            "hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg dark:hover:border-primary-600",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

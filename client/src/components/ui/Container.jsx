import { cn } from "../../utils/cn";

const sizes = {
  wide: "max-w-[88rem]",
  default: "max-w-7xl",
  narrow: "max-w-5xl",
  prose: "max-w-3xl",
};

/**
 * The single horizontal rhythm of the site. Every full-bleed section places its
 * content inside one of these — no ad-hoc max-widths or paddings anywhere else.
 *
 * @param {{
 *   as?: React.ElementType,
 *   size?: keyof typeof sizes,
 *   className?: string,
 *   children: React.ReactNode
 * }} props
 */
export function Container({ as: Tag = "div", size = "default", className, children, ...rest }) {
  return (
    <Tag className={cn("mx-auto w-full px-5 sm:px-6 lg:px-8", sizes[size], className)} {...rest}>
      {children}
    </Tag>
  );
}

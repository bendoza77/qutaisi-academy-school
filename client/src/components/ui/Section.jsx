import { Container } from "./Container";
import { cn } from "../../utils/cn";

const tones = {
  canvas: "bg-canvas text-fg",
  subtle: "bg-canvas-subtle text-fg",
  brand: "bg-primary-950 text-white",
};

const spacing = {
  none: "",
  compact: "py-12 sm:py-16",
  default: "py-16 sm:py-20 lg:py-28",
  tall: "py-20 sm:py-28 lg:py-36",
};

/**
 * Vertical rhythm primitive. Owning the section padding in one place is what
 * keeps the page cadence identical from the hero to the footer.
 *
 * @param {{
 *   id?: string,
 *   tone?: keyof typeof tones,
 *   space?: keyof typeof spacing,
 *   container?: false | 'wide' | 'default' | 'narrow' | 'prose',
 *   className?: string,
 *   innerClassName?: string,
 *   children: React.ReactNode
 * }} props
 */
export function Section({
  id,
  tone = "canvas",
  space = "default",
  container = "default",
  className,
  innerClassName,
  children,
  ...rest
}) {
  const content =
    container === false ? (
      children
    ) : (
      <Container size={container} className={innerClassName}>
        {children}
      </Container>
    );

  return (
    <section
      id={id}
      className={cn("relative isolate", tones[tone], spacing[space], className)}
      {...rest}
    >
      {content}
    </section>
  );
}

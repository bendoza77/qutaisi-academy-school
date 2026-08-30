import { useState } from "react";
import { cn } from "../../utils/cn";
import { stock, STOCK_WIDTHS } from "../../constants/media";

const ratios = {
  "1/1": "aspect-square",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "16/9": "aspect-video",
  "21/9": "aspect-[21/9]",
  "3/4": "aspect-[3/4]",
};

const frames = {
  /** Default: hairline border on the page surface. */
  panel: "rounded-panel border border-line bg-canvas-subtle",
  /** On a navy field. */
  dark: "rounded-panel border border-white/10 bg-white/5",
  /** No chrome — for images that sit inside another card. */
  bare: "rounded-card bg-canvas-subtle",
};

/**
 * Editorial image with a fixed aspect box, a responsive srcset and a tint that
 * ties stock photography back to the brand navy.
 *
 * The aspect box is what keeps CLS at zero: the slot is reserved before the
 * bytes arrive, and the photo cross-fades in on decode.
 *
 * @param {{
 *   id: string,                    // key from PHOTOS
 *   alt: string,                   // "" only when the image is decorative
 *   ratio?: keyof typeof ratios,
 *   frame?: keyof typeof frames,
 *   sizes?: string,                // CSS sizes hint; default assumes a half-width column
 *   priority?: boolean,            // above the fold — skip lazy loading
 *   tint?: boolean,                // navy duotone wash, on by default
 *   overlay?: React.ReactNode,     // badge / caption rendered over the image
 *   className?: string
 * }} props
 */
export function StockImage({
  id,
  alt,
  ratio = "4/3",
  frame = "panel",
  sizes = "(min-width: 1024px) 46vw, 100vw",
  priority = false,
  tint = true,
  overlay,
  className,
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("group relative isolate overflow-hidden", frames[frame], ratios[ratio], className)}>
      <img
        src={stock(id, { w: 1280 })}
        srcSet={STOCK_WIDTHS.map((w) => `${stock(id, { w })} ${w}w`).join(", ")}
        sizes={sizes}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-700 ease-[var(--ease-out-soft)]",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Brand wash: keeps borrowed photography from fighting the navy palette. */}
      {tint && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950/45 via-primary-950/5 to-transparent mix-blend-multiply"
        />
      )}

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-primary-950/10 dark:ring-white/10"
      />

      {overlay}
    </div>
  );
}

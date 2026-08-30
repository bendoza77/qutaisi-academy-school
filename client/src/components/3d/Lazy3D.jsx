import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";

/* three.js is ~150 kB gzipped. It is decoration, so it must never be part of
   the bundle that renders the first screen — this dynamic import puts it in
   its own chunk that is fetched only once <Lazy3D> decides to run. */
const Scene3D = lazy(() => import("./Scene3D"));

/** Devices we do not ask to render WebGL. */
function shouldSkip() {
  if (typeof window === "undefined") return true;
  if (!("IntersectionObserver" in window)) return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;

  /* Phones get none of it. A narrow viewport only ever shows the middle of the
     scene — the shapes live out in the gutters — so the whole 150 kB download
     would buy a few drifting points, on exactly the devices least able to
     afford it. */
  if (window.innerWidth < 768) return true;

  const connection = navigator.connection;
  if (connection?.saveData) return true;
  if (connection && /(^|-)2g$/.test(connection.effectiveType || "")) return true;

  // Chromium-only hints; absent elsewhere, in which case we give the benefit
  // of the doubt rather than punishing Safari and Firefox.
  if (navigator.deviceMemory && navigator.deviceMemory < 4) return true;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return true;

  return false;
}

/**
 * Gate in front of the WebGL layer. It mounts the scene only when two things
 * are both true: the slot is near the viewport, and the browser has gone idle.
 *
 * Near-viewport alone is not enough for the hero — the canvas would boot while
 * the browser is still painting the largest text on the page and would show up
 * as a worse LCP. Waiting for idle costs nothing visually (the CSS field below
 * is already the finished design) and keeps the main thread free when it
 * matters.
 *
 * @param {{
 *   variant?: 'shapes'|'globe',
 *   cameraZ?: number,
 *   opacity?: number,   // resting opacity once the scene has faded in
 *   className?: string
 * }} props
 */
export function Lazy3D({ variant = "shapes", cameraZ, opacity = 1, className }) {
  const slotRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot || shouldSkip()) return;

    let near = false;
    let idle = false;
    let idleHandle;
    const promote = () => near && idle && setMounted(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near = true;
        observer.disconnect();
        promote();
      },
      { rootMargin: "250px" },
    );
    observer.observe(slot);

    if ("requestIdleCallback" in window) {
      idleHandle = window.requestIdleCallback(
        () => {
          idle = true;
          promote();
        },
        { timeout: 3000 },
      );
    } else {
      idleHandle = window.setTimeout(() => {
        idle = true;
        promote();
      }, 1200);
    }

    return () => {
      observer.disconnect();
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idleHandle);
      else window.clearTimeout(idleHandle);
    };
  }, []);

  return (
    <div
      ref={slotRef}
      aria-hidden="true"
      /* Opacity is inline rather than a utility class: cn() is a plain join,
         so an `opacity-70` passed by a caller would race the fade-in class
         instead of overriding it. */
      style={{ opacity: mounted ? opacity : 0 }}
      className={cn(
        "pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-[var(--ease-out-soft)]",
        className,
      )}
    >
      {mounted && (
        <Suspense fallback={null}>
          <Scene3D variant={variant} cameraZ={cameraZ} />
        </Suspense>
      )}
    </div>
  );
}

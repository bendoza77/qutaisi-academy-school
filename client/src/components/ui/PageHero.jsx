import { motion } from "framer-motion";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { Lazy3D } from "../3d/Lazy3D";
import { EASE } from "../../utils/motion";

/**
 * Dark brand header used at the top of every inner page.
 *
 * The backdrop is deliberately layered: photograph, navy scrim, blueprint
 * grid, then an optional WebGL layer. The photo is the page's subject, the
 * scrim is what keeps AAA contrast on the heading no matter which photo is
 * passed, and the 3D arrives last and only when the device can spare it.
 *
 * @param {{
 *   eyebrow?: string,
 *   title: string,
 *   highlight?: string,
 *   subtitle?: string,
 *   bgImage?: string,
 *   scene?: 'shapes' | 'globe' | false,
 *   children?: React.ReactNode
 * }} props
 */
export function PageHero({ eyebrow, title, highlight, subtitle, bgImage, scene = "shapes", children }) {
  return (
    <section className="relative isolate overflow-hidden bg-primary-950 pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {bgImage && (
          <>
            <img
              src={bgImage}
              alt=""
              /* Decorative and behind a 75% scrim: it must never outrank the
                 heading for bandwidth on a slow connection. */
              fetchPriority="low"
              decoding="async"
              className="h-full w-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-primary-950/65" />
          </>
        )}
        {!bgImage && (
          <div className="absolute inset-0 bg-[radial-gradient(100%_110%_at_60%_0%,#1b3153_0%,#0d1c33_55%,#0a1526_100%)]" />
        )}
        <div className="bg-grid absolute inset-0 opacity-50" />
        {scene && <Lazy3D variant={scene} cameraZ={7} opacity={0.4} />}
        <div className="absolute -right-20 -top-24 h-96 w-96 rounded-full bg-accent-500/12 blur-[110px]" />
      </div>

      <Container size="narrow">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col items-center text-center"
        >
          {eyebrow && <Eyebrow light>{eyebrow}</Eyebrow>}

          <h1 className="mt-5 max-w-3xl text-h1 text-white">
            {title}
            {highlight && (
              <>
                {" "}
                <span className="text-accent-300">{highlight}</span>
              </>
            )}
          </h1>

          {subtitle && (
            <p className="mt-5 max-w-2xl text-body-lg text-primary-100/80">{subtitle}</p>
          )}

          {children}
        </motion.div>
      </Container>
    </section>
  );
}

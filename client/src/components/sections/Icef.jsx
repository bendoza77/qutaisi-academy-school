import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Globe2, QrCode, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Container } from "../ui/Container";
import { Eyebrow } from "../ui/Eyebrow";
import { Button } from "../ui/Button";
import { Lazy3D } from "../3d/Lazy3D";
import { fadeUp, fadeLeft, stagger, inView } from "../../utils/motion";
/* 1440px WebP at ~67 kB against a 1800px PNG at 257 kB, indistinguishable at
   the size this panel renders. The PNG stays as the <picture> fallback for
   browsers older than WebP (Safari < 14). */
import icefBadgeWebp from "../../assets/icef-accredited.webp";
import icefBadgePng from "../../assets/icef-accredited.png";

const POINT_ICONS = [ShieldCheck, Globe2, QrCode, BadgeCheck];
const listVariants = stagger(0.08, 0.1);

/**
 * ICEF accreditation.
 *
 * The academy's strongest external proof point, so it gets its own band rather
 * than a line in a list of features: the awarded seal at full size, what the
 * status actually means. The globe behind the copy is the same idea in
 * another register — a network the academy is now part of.
 */
export function Icef() {
  const { t } = useTranslation();

  const points = t("icef.points", { returnObjects: true });
  const items = Array.isArray(points) ? points : [];

  return (
    <section
      id="icef"
      aria-labelledby="icef-heading"
      className="relative isolate overflow-hidden bg-primary-950 py-16 sm:py-20 lg:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(110%_100%_at_20%_0%,#1b3153_0%,#0d1c33_50%,#0a1526_100%)]" />
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute -left-24 top-1/4 h-[26rem] w-[26rem] rounded-full bg-accent-500/10 blur-[120px]" />
      </div>

      {/* The globe is boxed into the copy column so it never sits under the
          seal, and the box itself is display:none below md — which also means
          Lazy3D never observes, never mounts and never downloads three.js on a
          phone, where this band is a stack and there is no room for it. */}
      <div
        aria-hidden="true"
        /* Cropped by the left edge and vignetted, so the cage is densest in the
           gutter and has faded to nothing by the time it reaches the column of
           body copy. */
        style={{
          maskImage: "radial-gradient(closest-side, #000 45%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(closest-side, #000 45%, transparent 100%)",
        }}
        className="pointer-events-none absolute inset-y-0 -left-32 -z-10 hidden w-[42rem] md:block"
      >
        <Lazy3D variant="globe" cameraZ={5.4} opacity={0.55} />
      </div>

      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Copy */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            className="lg:col-span-6"
          >
            <Eyebrow light>{t("icef.eyebrow")}</Eyebrow>

            <h2 id="icef-heading" className="mt-4 text-h2 text-white">
              {t("icef.title")} <span className="text-accent-300">{t("icef.titleHighlight")}</span>
            </h2>

            <p className="mt-5 max-w-xl text-body-lg text-primary-100/80">{t("icef.description")}</p>

            <motion.ul
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              className="mt-9 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2"
            >
              {items.map((point, i) => {
                const Icon = POINT_ICONS[i % POINT_ICONS.length];
                return (
                  <motion.li key={i} variants={fadeUp} className="flex gap-3.5">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-white/8 text-accent-300 ring-1 ring-inset ring-white/10">
                      <Icon className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-h4 text-white">{point.title}</span>
                      <span className="mt-1 block text-body-sm leading-relaxed text-primary-100/70">
                        {point.desc}
                      </span>
                    </span>
                  </motion.li>
                );
              })}
            </motion.ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button as={Link} to="/contact" variant="accent" size="lg" className="group w-full sm:w-auto">
                {t("icef.secondaryCta")}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </motion.div>

          {/* The award itself */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            className="lg:col-span-6"
          >
            <figure className="relative rounded-panel border border-white/12 bg-white/[0.06] p-2.5 backdrop-blur-md sm:p-3">
              <picture>
                <source srcSet={icefBadgeWebp} type="image/webp" />
                <img
                  src={icefBadgePng}
                  alt={t("icef.badgeAlt")}
                  width={1800}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-[calc(var(--radius-panel)-0.5rem)] object-cover"
                />
              </picture>

              <figcaption className="flex flex-wrap items-center justify-between gap-3 px-3 pb-1 pt-4">
                <span className="inline-flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.14em] text-primary-200/70">
                  <BadgeCheck className="h-4 w-4 text-accent-300" aria-hidden="true" />
                  {t("icef.statusLabel")}
                </span>
                <span className="tabular text-body-sm font-bold text-white">{t("icef.statusValue")}</span>
              </figcaption>
            </figure>

            <p className="mt-4 px-1 text-caption text-primary-200/60">{t("icef.disclaimer")}</p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

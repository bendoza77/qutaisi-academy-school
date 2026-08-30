import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { useSiteData } from "../../context/SiteDataContext";
import { fadeUp, fadeLeft, inView, EASE } from "../../utils/motion";
import logoSrc from "../../assets/Screenshot_2026-04-16_211914-removebg-preview.png";

/** Internal paths route through the SPA; anything else is a real anchor. */
function CtaLink({ href, children }) {
  const className =
    "group inline-flex h-12 items-center gap-2 rounded-control bg-primary-900 px-6 text-btn font-semibold text-white transition-colors duration-200 hover:bg-primary-800 dark:bg-white dark:text-primary-950 dark:hover:bg-primary-100";
  const inner = (
    <>
      {children}
      <ArrowRight
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </>
  );

  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={href || "/about"} className={className}>
      {inner}
    </Link>
  );
}

/** Founder quote — falls back to the crest when no photo has been uploaded. */
function QuotePanel({ quote, founder, founderTitle, compact = false }) {
  if (!quote) return null;
  const initials = (founder || "")
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2);

  return (
    <figure
      className={`relative overflow-hidden rounded-panel bg-primary-950 p-6 ring-1 ring-inset ring-white/10 sm:p-8 dark:bg-primary-900/70 ${
        compact ? "" : "flex flex-1 flex-col justify-center"
      }`}
    >
      <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-50" />
      <img
        src={logoSrc}
        alt=""
        aria-hidden="true"
        width={220}
        height={220}
        loading="lazy"
        className="pointer-events-none absolute -bottom-8 -right-6 w-40 opacity-[0.07]"
      />

      <Quote className="relative h-7 w-7 text-accent-400" strokeWidth={1.5} aria-hidden="true" />
      <blockquote className="relative mt-4 text-body-lg font-medium leading-relaxed text-white">
        {quote}
      </blockquote>
      {founder && (
        <figcaption className="relative mt-6 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-600 text-caption font-bold text-white">
            {initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-body-sm font-semibold text-white">{founder}</span>
            <span className="block truncate text-caption text-primary-200/70">{founderTitle}</span>
          </span>
        </figcaption>
      )}
    </figure>
  );
}

/**
 * "About Our Academy" — every string, the image, the CTA, the statistics and
 * the section's visibility come from Admin → About Section (Firestore).
 */
export function About() {
  const { t, i18n } = useTranslation();
  const { siteData } = useSiteData();
  const isKa = i18n.language === "ka";

  const about = siteData.about || {};
  const ka = about.ka || {};

  if (about.visible === false) return null;

  const pick = (field, localeKey) =>
    isKa ? ka[field] || t(localeKey, { defaultValue: about[field] }) : about[field];

  const eyebrow = pick("eyebrow", "about.eyebrow");
  const title = pick("title", "about.title");
  const titleHighlight = pick("titleHighlight", "about.titleHighlight");
  const description = pick("description", "about.description");
  const secondary = pick("secondaryDescription", "about.secondaryDescription");
  const ctaText = pick("ctaText", "about.learnMore");
  const quote = pick("quote", "about.quote");
  const founder = pick("founder", "about.founder");
  const founderTitle = pick("founderTitle", "about.founderTitle");

  const rawHighlights = isKa
    ? ka.highlights || t("about.highlights", { returnObjects: true, defaultValue: about.highlights })
    : about.highlights;
  const highlights = Array.isArray(rawHighlights) ? rawHighlights : [];

  const rawStats = isKa
    ? ka.stats || t("aboutPage.highlights.stats", { returnObjects: true, defaultValue: about.stats })
    : about.stats;
  const stats = Array.isArray(rawStats) ? rawStats.filter((s) => s && (s.value || s.label)) : [];

  const image = about.image;
  const imageAlt = (isKa ? ka.imageAlt : about.imageAlt) || t("about.sectionLabel");

  return (
    <Section id="about" tone="canvas" aria-labelledby="about-heading">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Copy */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="flex flex-col lg:col-span-6"
        >
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

          <h2 id="about-heading" className="mt-4 text-h2 text-fg">
            {title}
            {titleHighlight && (
              <>
                {title?.endsWith(" ") ? "" : " "}
                <span className="gradient-text">{titleHighlight}</span>
              </>
            )}
          </h2>

          {description && <p className="mt-5 text-body-lg text-fg-muted">{description}</p>}
          {secondary && <p className="mt-4 text-body text-fg-muted">{secondary}</p>}

          {highlights.length > 0 && (
            <ul className="mt-8 flex flex-col gap-3.5">
              {highlights.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-700 dark:bg-accent-400/15 dark:text-accent-300">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className="text-body-sm leading-relaxed text-fg-muted">{point}</span>
                </li>
              ))}
            </ul>
          )}

          {stats.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-8 sm:grid-cols-4">
              {stats.map((stat, i) => (
                <div key={stat.id ?? i}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block text-h3 font-bold tabular text-fg">{stat.value}</span>
                    <span className="mt-1 block text-caption text-fg-subtle">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {ctaText && (
            <div className="mt-9">
              <CtaLink href={about.ctaLink}>{ctaText}</CtaLink>
            </div>
          )}
        </motion.div>

        {/* Media */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="flex w-full flex-col gap-5 lg:col-span-6"
        >
          {image ? (
            <>
              <div className="relative overflow-hidden rounded-panel border border-line bg-canvas-subtle">
                <img
                  src={image}
                  alt={imageAlt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-panel ring-1 ring-inset ring-primary-950/8"
                />
              </div>
              <QuotePanel
                quote={quote}
                founder={founder}
                founderTitle={founderTitle}
                compact
              />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={inView}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex min-h-[22rem] flex-col"
            >
              <QuotePanel quote={quote} founder={founder} founderTitle={founderTitle} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </Section>
  );
}

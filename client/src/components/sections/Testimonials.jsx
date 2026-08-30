import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Quote, Star, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../ui/SectionTitle";
import { Section } from "../ui/Section";
import { useSiteData } from "../../context/SiteDataContext";
import { stagger, fadeUp, inView } from "../../utils/motion";

const gridVariants = stagger(0.07);

function StarRating({ rating = 5 }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={
            i < rating
              ? "h-3.5 w-3.5 fill-gold-400 text-gold-400"
              : "h-3.5 w-3.5 text-line-strong"
          }
        />
      ))}
    </div>
  );
}

function TestimonialCard({ item }) {
  return (
    <motion.li
      variants={fadeUp}
      className="flex h-full flex-col rounded-card border border-line bg-surface p-6 transition-[border-color,box-shadow] duration-300 hover:border-primary-200 hover:shadow-md dark:hover:border-primary-600"
    >
      <div className="flex items-start justify-between gap-4">
        <Quote className="h-6 w-6 shrink-0 text-primary-200 dark:text-primary-600" strokeWidth={1.5} aria-hidden="true" />
        <StarRating rating={item.rating} />
      </div>

      <blockquote className="mt-4 flex-1 text-body-sm leading-relaxed text-fg-muted">
        {item.text}
      </blockquote>

      <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        {item.photoUrl ? (
          <img
            src={item.photoUrl}
            alt=""
            loading="lazy"
            decoding="async"
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-caption font-bold text-white ${item.color || "bg-primary-700"}`}
          >
            {item.avatar}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-body-sm font-semibold text-fg">{item.name}</p>
          <p className="truncate text-caption text-fg-subtle">
            {[item.role, item.location].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>
    </motion.li>
  );
}

/** Aggregate proof panel — figures come from the CMS-backed page data. */
function ProofPanel({ stats, ctaText }) {
  const { t } = useTranslation();
  if (!Array.isArray(stats) || stats.length === 0) return null;

  return (
    <motion.li
      variants={fadeUp}
      className="relative flex h-full flex-col justify-between overflow-hidden rounded-card bg-primary-950 p-6 text-white ring-1 ring-inset ring-white/10 dark:bg-primary-900/70"
    >
      <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-50" />

      <div className="relative">
        <StarRating rating={5} />
        <p className="mt-4 text-h3 text-white">{ctaText}</p>
      </div>

      <dl className="relative mt-8 grid grid-cols-2 gap-x-4 gap-y-5">
        {stats.slice(0, 4).map((stat, i) => (
          <div key={i}>
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="block text-h3 font-bold tabular text-white">{stat.value}</span>
              <span className="mt-0.5 block text-caption text-primary-200/70">{stat.label}</span>
            </dd>
          </div>
        ))}
      </dl>

      <Link
        to="/testimonials"
        className="group relative mt-8 inline-flex items-center gap-2 text-btn font-semibold text-accent-300 transition-colors hover:text-accent-200"
      >
        {t("testimonials.eyebrow")}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </motion.li>
  );
}

export function Testimonials() {
  const { t, i18n } = useTranslation();
  const { siteData } = useSiteData();
  const isKa = i18n.language === "ka";
  const raw = siteData.testimonials || [];

  if (raw.length === 0) return null;

  const testimonials = raw.slice(0, 5).map((item, i) => {
    if (!isKa) return item;
    const ka = item.ka || {};
    const localised = t(`testimonials.items.${i}`, { returnObjects: true, defaultValue: {} }) || {};
    return {
      ...item,
      name: ka.name || localised.name || item.name,
      role: ka.role || localised.role || item.role,
      location: ka.location || localised.location || item.location,
      text: ka.text || localised.text || item.text,
    };
  });

  const pageStats =
    siteData.pages?.testimonials?.stats ||
    t("testimonialsPage.stats", { returnObjects: true, defaultValue: [] });

  return (
    <Section id="testimonials" tone="canvas" aria-label={t("testimonials.eyebrow")}>
      <SectionTitle
        eyebrow={t("testimonials.eyebrow")}
        title={t("testimonials.title")}
        highlight={t("testimonials.titleHighlight")}
        description={t("testimonials.description")}
        align="center"
        className="mb-12 lg:mb-14"
      />

      <motion.ul
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
      >
        <ProofPanel stats={pageStats} ctaText={t("testimonialsPage.ctaText")} />
        {testimonials.map((item) => (
          <TestimonialCard key={item.id} item={item} />
        ))}
      </motion.ul>
    </Section>
  );
}

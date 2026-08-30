import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen, TrendingUp, Award, Briefcase, Star, Zap, Target, Globe, GraduationCap, Layers,
  Clock, Users, Calendar, Check, ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../ui/SectionTitle";
import { Section } from "../ui/Section";
import { Badge } from "../ui/Badge";
import { useSiteData } from "../../context/SiteDataContext";
import { stagger, fadeUp, inView } from "../../utils/motion";
import { cn } from "../../utils/cn";

const iconMap = { BookOpen, TrendingUp, Award, Briefcase, Star, Zap, Target, Globe, GraduationCap, Layers };
const SLUG_TO_INDEX = { foundation: 0, progressive: 1, mastery: 2, business: 3 };
const gridVariants = stagger(0.08);

/** Georgian copy falls back through: CMS override → locale file → English CMS. */
function useCourseCopy(course, isKa) {
  const { t } = useTranslation();
  if (!isKa) return course;

  const ka = course.ka || {};
  const idx = SLUG_TO_INDEX[course.slug];
  const fromLocale = (field) =>
    idx !== undefined ? t(`courses.items.${idx}.${field}`, { defaultValue: course[field] }) : course[field];

  return {
    ...course,
    badge: ka.badge || fromLocale("badge"),
    level: ka.level || fromLocale("level"),
    title: ka.title || fromLocale("title"),
    description: ka.description || fromLocale("description"),
    duration: ka.duration || fromLocale("duration"),
    sessionsPerWeek: ka.sessionsPerWeek || fromLocale("sessionsPerWeek"),
    groupSize: ka.groupSize || fromLocale("groupSize"),
    features:
      ka.features ||
      (idx !== undefined
        ? t(`courses.items.${idx}.features`, { returnObjects: true, defaultValue: course.features })
        : course.features),
  };
}

function CourseCard({ course, isKa }) {
  const { t } = useTranslation();
  const copy = useCourseCopy(course, isKa);
  const Icon = iconMap[course.icon] || BookOpen;
  const accent = course.accent || "#233e68";
  const features = Array.isArray(copy.features) ? copy.features : [];

  return (
    <motion.article
      variants={fadeUp}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card border bg-surface",
        "transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)]",
        "hover:-translate-y-1 hover:shadow-lg",
        course.popular
          ? "border-primary-300 shadow-md dark:border-primary-500"
          : "border-line hover:border-primary-200 dark:hover:border-primary-600"
      )}
    >
      <span aria-hidden="true" className="h-[3px] w-full shrink-0" style={{ background: accent }} />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control"
            style={{ background: `color-mix(in srgb, ${accent} 14%, transparent)` }}
          >
            <Icon className="h-5 w-5" style={{ color: accent }} strokeWidth={2} aria-hidden="true" />
          </span>
          {course.popular ? (
            <Badge tone="gold">
              <Star className="h-3 w-3 fill-current" aria-hidden="true" />
              {t("courses.popular")}
            </Badge>
          ) : (
            <Badge tone="neutral">{copy.badge}</Badge>
          )}
        </div>

        <p className="text-caption font-semibold uppercase tracking-[0.1em] text-fg-subtle">
          {copy.level}
        </p>
        <h3 className="mt-1.5 text-h3 text-fg">
          <Link
            to={`/courses/${course.slug}`}
            className="transition-colors duration-200 hover:text-primary-700 dark:hover:text-accent-300"
          >
            {copy.title}
          </Link>
        </h3>
        <p className="mt-2.5 text-body-sm leading-relaxed text-fg-muted">{copy.description}</p>

        {course.price && (
          <p className="mt-5 flex items-baseline gap-1.5">
            <span className="text-h3 font-bold tabular text-fg">{course.price}</span>
            <span className="text-caption text-fg-subtle">{course.priceNote}</span>
          </p>
        )}

        <div className="mt-5 grid grid-cols-3 gap-2 border-y border-line py-3.5">
          {[
            { Icon: Clock, label: copy.duration },
            { Icon: Calendar, label: copy.sessionsPerWeek },
            { Icon: Users, label: copy.groupSize },
          ].map(({ Icon: MetaIcon, label }, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-center">
              <MetaIcon className="h-3.5 w-3.5 text-fg-subtle" aria-hidden="true" />
              <span className="text-caption leading-tight text-fg-muted">{label}</span>
            </div>
          ))}
        </div>

        {features.length > 0 && (
          <>
            <p className="mt-5 text-eyebrow uppercase text-fg-subtle">{t("courses.whatYouLearn")}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accent }} aria-hidden="true" />
                  <span className="text-body-sm text-fg-muted">{feature}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-auto flex flex-col gap-2.5 pt-6">
          <Link
            to="/enroll"
            className={cn(
              "inline-flex h-11 w-full items-center justify-center gap-2 rounded-control text-btn font-semibold transition-colors duration-200",
              course.popular
                ? "bg-primary-900 text-white hover:bg-primary-800 dark:bg-white dark:text-primary-950 dark:hover:bg-primary-100"
                : "border border-line-strong text-fg hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-white/10"
            )}
          >
            {t("courses.enrollBtn")}
          </Link>
          <Link
            to={`/courses/${course.slug}`}
            className="group/link inline-flex items-center justify-center gap-1.5 text-caption font-semibold text-accent-700 transition-colors hover:text-accent-800 dark:text-accent-300 dark:hover:text-accent-200"
          >
            {t("courses.detailsLink")}
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function Courses() {
  const { t, i18n } = useTranslation();
  const { siteData } = useSiteData();
  const courses = siteData.courses || [];
  const isKa = i18n.language === "ka";

  return (
    <Section id="courses" tone="subtle" aria-label={t("courses.eyebrow")}>
      <div className="mb-12 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle
          eyebrow={t("courses.eyebrow")}
          title={t("courses.title")}
          highlight={t("courses.titleHighlight")}
          description={t("courses.description")}
          align="left"
          className="lg:max-w-2xl"
        />
        <Link
          to="/courses"
          className="group hidden shrink-0 items-center gap-2 text-btn font-semibold text-primary-700 transition-colors hover:text-primary-900 lg:inline-flex dark:text-accent-300 dark:hover:text-accent-200"
        >
          {t("about.viewCourses")}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>

      <motion.div
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6"
      >
        {courses.map((course) => (
          <CourseCard key={course.id ?? course.slug} course={course} isKa={isKa} />
        ))}
      </motion.div>

      <p className="mt-10 text-center text-body-sm text-fg-muted">
        {t("courses.placementNote")}{" "}
        <Link
          to="/english-test"
          className="font-semibold text-accent-700 underline decoration-accent-700/30 underline-offset-4 transition-colors hover:decoration-accent-700 dark:text-accent-300 dark:decoration-accent-300/30"
        >
          {t("courses.placementLink")}
        </Link>
      </p>
    </Section>
  );
}

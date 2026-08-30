import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Section } from "../ui/Section";
import { SectionTitle } from "../ui/SectionTitle";
import { useSiteData } from "../../context/SiteDataContext";
import { stagger, fadeUp, inView } from "../../utils/motion";

const gridVariants = stagger(0.08);

function TeacherCard({ teacher, isKa, experienceLabel }) {
  const ka = teacher.ka || {};
  const title = (isKa && ka.title) || teacher.title;
  const specialties = ((isKa && ka.specialties) || teacher.specialties || []).slice(0, 3);

  return (
    <motion.li
      variants={fadeUp}
      className="group flex flex-col rounded-card border border-line bg-surface p-6 transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg dark:hover:border-primary-600"
    >
      <div className="flex items-start gap-4">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-control bg-primary-800 text-body font-bold text-white ring-1 ring-inset ring-white/10 dark:bg-primary-700"
          aria-hidden="true"
        >
          {teacher.avatar}
        </span>
        <div className="min-w-0">
          <h3 className="text-h4 leading-tight text-fg">{teacher.name}</h3>
          <p className="mt-1 text-body-sm text-accent-700 dark:text-accent-300">{title}</p>
          {teacher.experience && (
            <p className="mt-0.5 text-caption text-fg-subtle">
              {teacher.experience} {experienceLabel}
            </p>
          )}
        </div>
      </div>

      {Array.isArray(teacher.credentials) && teacher.credentials.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {teacher.credentials.map((credential) => (
            <li
              key={credential}
              className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-1 text-caption font-semibold text-primary-700 dark:bg-white/8 dark:text-primary-100"
            >
              <Award className="h-3 w-3" aria-hidden="true" />
              {credential}
            </li>
          ))}
        </ul>
      )}

      {specialties.length > 0 && (
        <p className="mt-4 text-body-sm leading-relaxed text-fg-muted">
          {specialties.join(" · ")}
        </p>
      )}
    </motion.li>
  );
}

/** Team preview. Renders nothing when the CMS holds no teachers. */
export function Teachers() {
  const { t, i18n } = useTranslation();
  const { siteData } = useSiteData();
  const isKa = i18n.language === "ka";
  const teachers = (siteData.teachers || []).slice(0, 4);

  if (teachers.length === 0) return null;

  const hero = t("teachersPage.pageHero", { returnObjects: true }) || {};

  return (
    <Section tone="subtle" aria-label={hero.eyebrow}>
      <div className="mb-12 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle
          eyebrow={hero.eyebrow}
          title={hero.title}
          highlight={hero.highlight}
          description={hero.subtitle}
          align="left"
          className="lg:max-w-2xl"
        />
        <Link
          to="/teachers"
          className="group hidden shrink-0 items-center gap-2 text-btn font-semibold text-primary-700 transition-colors hover:text-primary-900 lg:inline-flex dark:text-accent-300 dark:hover:text-accent-200"
        >
          {t("teachers.viewAll")}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>

      <motion.ul
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6"
      >
        {teachers.map((teacher) => (
          <TeacherCard
            key={teacher.id}
            teacher={teacher}
            isKa={isKa}
            experienceLabel={t("teachersPage.experienceLabel")}
          />
        ))}
      </motion.ul>

      <div className="mt-10 flex justify-center lg:hidden">
        <Link
          to="/teachers"
          className="group inline-flex items-center gap-2 text-btn font-semibold text-primary-700 dark:text-accent-300"
        >
          {t("teachers.viewAll")}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </Section>
  );
}

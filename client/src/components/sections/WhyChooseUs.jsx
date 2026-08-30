import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GraduationCap, Users, Lightbulb, Calendar, Globe, Shield, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../ui/SectionTitle";
import { Section } from "../ui/Section";
import { useSiteData } from "../../context/SiteDataContext";
import { BENEFIT_ICONS } from "../../constants";
import { stagger, fadeUp, inView } from "../../utils/motion";

const iconMap = { GraduationCap, Users, Lightbulb, Calendar, Globe, Shield };
const gridVariants = stagger(0.07);

function BenefitCard({ iconKey, title, description }) {
  const Icon = iconMap[iconKey] || GraduationCap;

  return (
    <motion.li
      variants={fadeUp}
      className="group relative flex flex-col rounded-card border border-line bg-surface p-6 transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg dark:hover:border-primary-600"
    >
      <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-control bg-primary-50 text-primary-700 transition-colors duration-300 group-hover:bg-accent-600 group-hover:text-white dark:bg-white/8 dark:text-accent-300 dark:group-hover:bg-accent-600 dark:group-hover:text-white">
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </span>
      <h3 className="text-h4 text-fg">{title}</h3>
      <p className="mt-2 text-body-sm leading-relaxed text-fg-muted">{description}</p>
    </motion.li>
  );
}

export function WhyChooseUs() {
  const { t, i18n } = useTranslation();
  const { siteData } = useSiteData();
  const benefits = siteData.benefits || [];
  const isKa = i18n.language === "ka";

  return (
    <Section id="why-us" tone="canvas" aria-label={t("benefits.eyebrow")}>
      <SectionTitle
        eyebrow={t("benefits.eyebrow")}
        title={t("benefits.title")}
        highlight={t("benefits.titleHighlight")}
        description={t("benefits.description")}
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
        {benefits.map((item, i) => {
          const ka = item.ka || {};
          return (
            <BenefitCard
              key={i}
              iconKey={BENEFIT_ICONS[i % BENEFIT_ICONS.length]}
              title={isKa ? ka.title || t(`benefits.items.${i}.title`, { defaultValue: item.title }) : item.title}
              description={
                isKa
                  ? ka.description ||
                    t(`benefits.items.${i}.description`, { defaultValue: item.description })
                  : item.description
              }
            />
          );
        })}
      </motion.ul>

      {/* Conversion strip */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
        className="mt-12 flex flex-col items-start justify-between gap-6 rounded-card border border-line bg-canvas-subtle p-6 sm:p-8 lg:mt-14 lg:flex-row lg:items-center"
      >
        <div className="max-w-xl">
          <h3 className="text-h3 text-fg">{t("benefits.ctaTitle")}</h3>
          <p className="mt-2 text-body-sm text-fg-muted">{t("benefits.ctaDesc")}</p>
        </div>
        <Link
          to="/english-test"
          className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-control bg-primary-900 px-6 text-btn font-semibold text-white transition-colors duration-200 hover:bg-primary-800 dark:bg-white dark:text-primary-950 dark:hover:bg-primary-100"
        >
          {t("benefits.ctaBtn")}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </motion.div>
    </Section>
  );
}

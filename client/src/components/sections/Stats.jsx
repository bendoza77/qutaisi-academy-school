import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCounter } from "../../hooks/useCounter";
import { useSiteData } from "../../context/SiteDataContext";
import { Container } from "../ui/Container";
import { EASE } from "../../utils/motion";

const STAT_KEYS = ["students", "teachers", "years", "success"];

function StatItem({ stat, isActive, index, isKa }) {
  const { t } = useTranslation();
  const count = useCounter(stat.value, 1800, isActive);
  const label = isKa ? stat.labelKa || t(`stats.${STAT_KEYS[index] || "students"}`) : stat.label;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
      className="flex flex-col items-center px-2 text-center sm:items-start sm:text-left"
    >
      <p className="flex items-baseline gap-0.5 text-h1 tabular text-fg">
        <span>{(isActive ? count : 0).toLocaleString()}</span>
        <span className="text-accent-600 dark:text-accent-300">{stat.suffix}</span>
      </p>
      <p className="mt-1 text-body-sm text-fg-muted">{label}</p>
    </motion.div>
  );
}

/**
 * Credibility band. Values come straight from the CMS — nothing here is
 * hard-coded, so the numbers can never contradict the admin's figures.
 */
export function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { i18n } = useTranslation();
  const { siteData } = useSiteData();
  const stats = siteData.stats || [];
  const isKa = i18n.language === "ka";

  if (stats.length === 0) return null;

  return (
    <section ref={ref} aria-label="Academy in numbers" className="border-b border-line bg-canvas">
      <Container>
        <div className="grid grid-cols-2 gap-y-10 py-12 sm:gap-x-8 lg:grid-cols-4 lg:py-14">
          {stats.map((stat, i) => (
            <div
              key={stat.id ?? i}
              className={i > 0 ? "sm:border-l sm:border-line sm:pl-8 lg:pl-10" : ""}
            >
              <StatItem stat={stat} isActive={isInView} index={i} isKa={isKa} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

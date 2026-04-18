import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCounter } from "../../hooks/useCounter";
import { useSiteData } from "../../context/SiteDataContext";

const STAT_KEYS = ["students", "teachers", "years", "success"];

function StatItem({ stat, isActive, index, total, isKa }) {
  const { t } = useTranslation();
  const count = useCounter(stat.value, 2200, isActive);
  const label = isKa
    ? (stat.labelKa || t(`stats.${STAT_KEYS[index] || "students"}`))
    : stat.label;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="text-center px-6 py-8 relative group"
    >
      {index < total - 1 && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-white/10" />
      )}
      <div className="flex items-end justify-center gap-0.5 mb-1">
        <span className="text-4xl lg:text-5xl font-bold text-white tabular-nums">
          {isActive ? count.toLocaleString() : 0}
        </span>
        <span className="text-2xl lg:text-3xl font-bold text-accent-400 mb-0.5">
          {stat.suffix}
        </span>
      </div>
      <p className="text-blue-200/70 text-sm font-medium">{label}</p>
      <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
    </motion.div>
  );
}

export function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { i18n } = useTranslation();
  const { siteData } = useSiteData();
  const stats = siteData.stats;
  const isKa = i18n.language === "ka";

  return (
    <section
      ref={ref}
      aria-label="Academy statistics"
      className="relative bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 border-y border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatItem
              key={stat.id}
              stat={stat}
              isActive={isInView}
              index={i}
              total={stats.length}
              isKa={isKa}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

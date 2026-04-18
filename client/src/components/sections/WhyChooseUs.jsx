import { motion } from "framer-motion";
import {
  GraduationCap, Users, Lightbulb, Calendar, Globe, Shield,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../ui/SectionTitle";
import { useSiteData } from "../../context/SiteDataContext";
import { BENEFIT_ICONS, BENEFIT_COLORS } from "../../constants";

const iconMap = { GraduationCap, Users, Lightbulb, Calendar, Globe, Shield };

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function BenefitCard({ iconKey, colors, title, description }) {
  const Icon = iconMap[iconKey] || GraduationCap;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-700 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${colors.bg} transition-transform duration-300 group-hover:scale-110`}>
        <Icon className={`w-5 h-5 ${colors.icon}`} strokeWidth={2} />
      </div>
      <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-base">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
      <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-primary-600 dark:bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
    </motion.div>
  );
}

export function WhyChooseUs() {
  const { t, i18n } = useTranslation();
  const { siteData } = useSiteData();
  const benefitItems = siteData.benefits;
  const isKa = i18n.language === "ka";

  return (
    <section
      id="why-us"
      className="relative py-20 lg:py-32 bg-white dark:bg-slate-900 overflow-hidden"
      aria-label="Why choose us"
    >
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary-50 dark:bg-primary-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-14">
          <SectionTitle
            eyebrow={t("benefits.eyebrow")}
            title={t("benefits.title")}
            highlight={t("benefits.titleHighlight")}
            description={t("benefits.description")}
            align="center"
            className="mx-auto"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
        >
          {Array.isArray(benefitItems) &&
            benefitItems.map((item, i) => {
              const kaData = item.ka || {};
              const title = isKa
                ? (kaData.title || t(`benefits.items.${i}.title`))
                : item.title;
              const description = isKa
                ? (kaData.description || t(`benefits.items.${i}.description`))
                : item.description;
              return (
                <BenefitCard
                  key={i}
                  iconKey={BENEFIT_ICONS[i]}
                  colors={BENEFIT_COLORS[i]}
                  title={title}
                  description={description}
                />
              );
            })}
        </motion.div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-14 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-950/40 dark:to-slate-800/40 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-primary-100 dark:border-primary-900/40"
        >
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {t("benefits.ctaTitle")}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t("benefits.ctaDesc")}</p>
          </div>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-primary-900 text-white rounded-xl text-sm font-semibold hover:bg-primary-800 transition-colors duration-200 shadow-md shadow-primary-900/20 cursor-pointer whitespace-nowrap"
          >
            {t("benefits.ctaBtn")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { SectionTitle } from "../ui/SectionTitle";
import { Button } from "../ui/Button";
import { AboutOrb3D } from "../3d/AboutOrb3D";

const cardVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function About() {
  const { t } = useTranslation();
  const highlights = t("about.highlights", { returnObjects: true });

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="about"
      className="relative py-20 lg:py-32 bg-white dark:bg-slate-900 overflow-hidden"
      aria-label="About us"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 dark:bg-primary-950/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text */}
          <div className="flex flex-col gap-8">
            <SectionTitle
              eyebrow={t("about.eyebrow")}
              title={t("about.title")}
              highlight={t("about.titleHighlight")}
              description={t("about.description")}
              align="left"
            />

            <ul className="flex flex-col gap-4">
              {Array.isArray(highlights) &&
                highlights.map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {point}
                    </span>
                  </motion.li>
                ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <Button
                variant="primary"
                size="md"
                onClick={() => scrollTo("courses")}
                className="group"
              >
                {t("about.viewCourses")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Button variant="ghost" size="md" onClick={() => scrollTo("contact")}>
                {t("about.getInTouch")}
              </Button>
            </motion.div>
          </div>

          {/* Visual */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-gradient-to-br from-primary-900 to-primary-950 rounded-3xl p-8 lg:p-10 overflow-hidden"
            >
              {/* 3D globe backdrop */}
              <div className="absolute inset-0">
                <AboutOrb3D />
              </div>

              {/* Dot pattern */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3Ccircle cx='23' cy='3' r='1.5'/%3E%3Ccircle cx='3' cy='23' r='1.5'/%3E%3Ccircle cx='23' cy='23' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              <blockquote className="relative z-10">
                <div className="text-5xl font-serif text-accent-400 leading-none mb-4">"</div>
                <p className="text-white/90 text-lg lg:text-xl leading-relaxed font-medium mb-6">
                  {t("about.quote")}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">DG</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t("about.founder")}</div>
                    <div className="text-blue-300/60 text-xs">{t("about.founderTitle")}</div>
                  </div>
                </div>
              </blockquote>
            </motion.div>

            {/* Floating achievement badges */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-15 -left-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-slate-100 dark:border-slate-700"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                <span className="text-xl">🎓</span>
              </div>
              <div>
                <div className="text-slate-900 dark:text-white font-bold text-lg leading-none">98%</div>
                <div className="text-slate-500 dark:text-slate-400 text-xs">{t("about.satisfactionLabel")}</div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-slate-100 dark:border-slate-700"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                <span className="text-xl">⭐</span>
              </div>
              <div>
                <div className="text-slate-900 dark:text-white font-bold text-lg leading-none">4.9/5</div>
                <div className="text-slate-500 dark:text-slate-400 text-xs">{t("about.ratingLabel")}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

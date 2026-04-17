import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles } from "lucide-react";
import { CTABackground3D } from "../3d/CTABackground3D";

export function CTA() {
  const { t } = useTranslation();
  const benefits = t("cta.benefits", { returnObjects: true });

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      aria-label="Call to action"
      className="relative py-20 lg:py-28 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800" />

      {/* 3D sphere + rings */}
      <CTABackground3D />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-primary-700/30 blur-3xl" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6"
        >
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-blue-100 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            {t("cta.badge")}
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            {t("cta.title")}{" "}
            <span className="gradient-text-light">{t("cta.titleHighlight")}</span>
          </h2>

          <p className="text-blue-100/75 text-lg leading-relaxed max-w-2xl">
            {t("cta.description")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-blue-200/70 text-sm">
            {Array.isArray(benefits) &&
              benefits.map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                  {item}
                </span>
              ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <motion.button
              onClick={() => scrollTo("contact")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-bold text-base shadow-xl shadow-accent-500/30 hover:shadow-accent-600/40 transition-all duration-200 cursor-pointer group"
            >
              {t("cta.enrollBtn")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
            <motion.button
              onClick={() => scrollTo("courses")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/25 hover:bg-white/10 text-white rounded-xl font-semibold text-base backdrop-blur-sm transition-all duration-200 cursor-pointer"
            >
              {t("cta.browseBtn")}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

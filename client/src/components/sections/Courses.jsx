import { motion } from "framer-motion";
import {
  BookOpen, TrendingUp, Award, Briefcase, Star, Zap, Target, Globe, GraduationCap, Layers,
  Clock, Users, Calendar, CheckCircle2, ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../ui/SectionTitle";
import { useSiteData } from "../../context/SiteDataContext";
import { cn } from "../../utils/cn";

const iconMap = { BookOpen, TrendingUp, Award, Briefcase, Star, Zap, Target, Globe, GraduationCap, Layers };

const SLUG_TO_INDEX = { foundation: 0, progressive: 1, mastery: 2, business: 3 };

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function CourseCard({ course, isKa }) {
  const { t } = useTranslation();
  const Icon = iconMap[course.icon] || BookOpen;
  const meta = course;

  const idx = SLUG_TO_INDEX[course.slug];
  const kaData = course.ka || {};

  const badge    = isKa ? (kaData.badge    || (idx !== undefined ? t(`courses.items.${idx}.badge`)    : course.badge))    : course.badge;
  const level    = isKa ? (kaData.level    || (idx !== undefined ? t(`courses.items.${idx}.level`)    : course.level))    : course.level;
  const title    = isKa ? (kaData.title    || (idx !== undefined ? t(`courses.items.${idx}.title`)    : course.title))    : course.title;
  const desc     = isKa ? (kaData.description || (idx !== undefined ? t(`courses.items.${idx}.description`) : course.description)) : course.description;
  const duration = isKa ? (kaData.duration || (idx !== undefined ? t(`courses.items.${idx}.duration`) : course.duration)) : course.duration;
  const sessions = isKa ? (kaData.sessionsPerWeek || (idx !== undefined ? t(`courses.items.${idx}.sessionsPerWeek`) : course.sessionsPerWeek)) : course.sessionsPerWeek;
  const groupSz  = isKa ? (kaData.groupSize || (idx !== undefined ? t(`courses.items.${idx}.groupSize`) : course.groupSize)) : course.groupSize;
  const features = isKa
    ? (kaData.features || (idx !== undefined ? t(`courses.items.${idx}.features`, { returnObjects: true }) : course.features))
    : course.features;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
      className={cn(
        "relative flex flex-col bg-white dark:bg-slate-800/60 rounded-2xl border transition-all duration-300 group overflow-hidden",
        meta.popular
          ? "border-primary-300 dark:border-primary-600 shadow-xl shadow-primary-900/10"
          : "border-slate-200 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-700 shadow-sm hover:shadow-lg hover:shadow-primary-900/8"
      )}
    >
      {meta.popular && (
        <div className="absolute top-0 right-6 bg-primary-900 text-white text-xs font-semibold px-4 py-1 rounded-b-lg flex items-center gap-1">
          <Star className="w-3 h-3 fill-accent-400 text-accent-400" />
          {t("courses.popular")}
        </div>
      )}

      {/* Header */}
      <div
        className="p-6 pb-5"
        style={{ background: `linear-gradient(135deg, ${meta.accent}15 0%, transparent 60%)` }}
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: `${meta.accent}20` }}
          >
            <Icon className="w-5 h-5" style={{ color: meta.accent }} strokeWidth={2} />
          </div>
          <span className={cn("text-xs font-semibold px-3 py-1 rounded-full", meta.badgeColor)}>
            {badge}
          </span>
        </div>
        <div className="mb-1">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{level}</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
      </div>

      {/* Meta row */}
      <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700/50 grid grid-cols-3 gap-3">
        {[
          { Icon: Clock, label: duration },
          { Icon: Calendar, label: sessions },
          { Icon: Users, label: groupSz },
        ].map(({ Icon: MI, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 text-center">
            <MI className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{label}</span>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="px-6 pb-6 flex flex-col gap-2.5 flex-1">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
          {t("courses.whatYouLearn")}
        </p>
        {Array.isArray(features) &&
          features.map((feature, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: meta.accent }} />
              <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
            </div>
          ))}
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        <button
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          className={cn(
            "w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 group/btn cursor-pointer",
            meta.popular
              ? "bg-primary-900 text-white hover:bg-primary-800 shadow-md shadow-primary-900/20"
              : "bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-900 dark:hover:text-primary-300"
          )}
        >
          {t("courses.enrollBtn")}
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </motion.div>
  );
}

export function Courses() {
  const { t, i18n } = useTranslation();
  const { siteData } = useSiteData();
  const courseItems = siteData.courses;
  const isKa = i18n.language === "ka";

  return (
    <section
      id="courses"
      className="relative py-20 lg:py-32 bg-slate-50 dark:bg-slate-900/50 overflow-hidden"
      aria-label="Our courses"
    >
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-100/50 dark:bg-primary-950/20 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 mb-14">
          <SectionTitle
            eyebrow={t("courses.eyebrow")}
            title={t("courses.title")}
            highlight={t("courses.titleHighlight")}
            description={t("courses.description")}
            align="center"
            className="mx-auto"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {Array.isArray(courseItems) &&
            courseItems.map((course) => (
              <CourseCard key={course.id} course={course} isKa={isKa} />
            ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-slate-400 dark:text-slate-500 mt-10"
        >
          {t("courses.placementNote")}{" "}
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="text-primary-600 dark:text-primary-400 font-medium hover:underline cursor-pointer"
          >
            {t("courses.placementLink")}
          </button>
        </motion.p>
      </div>
    </section>
  );
}

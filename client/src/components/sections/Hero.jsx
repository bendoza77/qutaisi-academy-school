import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Check, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { Lazy3D } from "../3d/Lazy3D";
import { useSiteData } from "../../context/SiteDataContext";
import { EASE } from "../../utils/motion";
import logoSrc from "../../assets/Screenshot_2026-04-16_211914-removebg-preview.png";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/**
 * The CEFR ladder doubles as the hero visual: it is the academy's actual
 * course structure rather than decoration, so the first screen already answers
 * "where would I start?".
 */
function CourseLadder({ courses, isKa }) {
  const { t } = useTranslation();

  return (
    <div className="relative rounded-panel border border-white/12 bg-white/[0.06] p-5 backdrop-blur-md sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-white/10 ring-1 ring-inset ring-white/15">
          <img src={logoSrc} alt="" width={32} height={32} className="h-7 w-7 object-contain" />
        </span>
        <div className="min-w-0">
          <p className="text-body-sm font-semibold text-white">{t("footer.brand")} {t("footer.brandSub")}</p>
          <p className="text-caption text-primary-200/70">{t("courses.eyebrow")}</p>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {courses.slice(0, 4).map((course, i) => (
          <motion.li
            key={course.id ?? course.slug}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.09, duration: 0.5, ease: EASE }}
          >
            <Link
              to={`/courses/${course.slug}`}
              className="group flex items-center gap-3 rounded-control px-3 py-2.5 transition-colors duration-200 hover:bg-white/8 focus-visible:bg-white/8"
            >
              <span
                aria-hidden="true"
                className="h-8 w-1 shrink-0 rounded-full"
                style={{ background: course.accent }}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-body-sm font-semibold text-white">
                  {isKa ? course.ka?.title || course.title : course.title}
                </span>
                <span className="block text-caption text-primary-200/70">
                  {isKa ? course.ka?.level || course.level : course.level}
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-primary-200/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent-300"
                aria-hidden="true"
              />
            </Link>
          </motion.li>
        ))}
      </ul>

      <Link
        to="/english-test"
        className="mt-4 flex items-center justify-between gap-3 rounded-control border border-accent-400/25 bg-accent-400/10 px-4 py-3 transition-colors duration-200 hover:bg-accent-400/18"
      >
        <span className="flex items-center gap-2.5 text-body-sm font-semibold text-white">
          <GraduationCap className="h-4 w-4 shrink-0 text-accent-300" aria-hidden="true" />
          {t("nav.englishTest")}
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-accent-300" aria-hidden="true" />
      </Link>
    </div>
  );
}

export function Hero() {
  const { t, i18n } = useTranslation();
  const { siteData } = useSiteData();
  const isKa = i18n.language === "ka";

  const hero = siteData.hero || {};
  const ka = hero.ka || {};

  const badge = isKa ? ka.badge || t("hero.badge") : hero.badge;
  const title = isKa ? ka.title || t("hero.title") : hero.title;
  const titleHighlight = isKa ? ka.titleHighlight || t("hero.titleHighlight") : hero.titleHighlight;
  const subtitle = isKa ? ka.subtitle || t("hero.subtitle") : hero.subtitle;
  const rawBadges = isKa
    ? ka.trustBadges || t("hero.trustBadges", { returnObjects: true })
    : hero.trustBadges;
  const trustBadges = Array.isArray(rawBadges) ? rawBadges : [];

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-primary-950 pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24"
    >
      {/* Field: a single soft light source plus a blueprint grid, with a WebGL
          layer of drifting wireframes on top. The scene is additive — the
          section is finished without it, and it only arrives once the browser
          is idle, so it can never delay the headline. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_78%_8%,#1b3153_0%,#0d1c33_45%,#0a1526_100%)]" />
        <div className="bg-grid absolute inset-0 opacity-60" />
        <Lazy3D variant="shapes" opacity={0.75} />
        <div className="absolute -right-24 top-[-10%] h-[32rem] w-[32rem] rounded-full bg-accent-500/12 blur-[120px]" />
        <div className="absolute -left-32 bottom-[-20%] h-[28rem] w-[28rem] rounded-full bg-primary-500/18 blur-[110px]" />
      </div>

      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7"
          >
            {badge && (
              <motion.p variants={item} className="mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3.5 py-1.5 text-caption font-semibold text-primary-100 backdrop-blur-sm">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-300" />
                  {badge}
                </span>
              </motion.p>
            )}

            <motion.h1 variants={item} className="max-w-[16ch] text-display text-white">
              {title}{" "}
              <span className="relative whitespace-nowrap text-accent-300">
                {titleHighlight}
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.75, duration: 0.6, ease: EASE }}
                  className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left rounded-full bg-accent-400/70"
                />
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-body-lg text-primary-100/80"
            >
              {subtitle}
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button as={Link} to="/enroll" variant="accent" size="lg" className="group w-full sm:w-auto">
                {t("hero.enrollBtn")}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
              <Button as={Link} to="/courses" variant="outline" size="lg" className="w-full sm:w-auto">
                {t("hero.discoverBtn")}
              </Button>
            </motion.div>

            {/* The accreditation earns a place on the first screen — it is the
                one claim here a visitor can independently check. */}
            <motion.p variants={item} className="mt-9">
              <a
                href="#icef"
                className="group inline-flex items-center gap-2.5 rounded-full border border-accent-400/25 bg-accent-400/10 py-2 pl-3.5 pr-4 transition-colors duration-200 hover:bg-accent-400/18"
              >
                <BadgeCheck className="h-4 w-4 shrink-0 text-accent-300" aria-hidden="true" />
                <span className="text-caption font-semibold text-white">
                  {t("icef.eyebrow")}
                  <span className="mx-1.5 text-accent-300/50" aria-hidden="true">
                    /
                  </span>
                  <span className="text-primary-100/80">{t("icef.statusValue")}</span>
                </span>
                <ArrowRight
                  className="h-3.5 w-3.5 shrink-0 text-accent-300 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </motion.p>

            {trustBadges.length > 0 && (
              <motion.ul
                variants={item}
                className="mt-8 grid grid-cols-1 gap-x-6 gap-y-3 border-t border-white/10 pt-8 sm:grid-cols-2"
              >
                {trustBadges.map((badgeText, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-body-sm text-primary-100/75">
                    <Check className="h-4 w-4 shrink-0 text-accent-300" aria-hidden="true" />
                    <span className="min-w-0">{badgeText}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
            className="lg:col-span-5"
          >
            <CourseLadder courses={siteData.courses || []} isKa={isKa} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

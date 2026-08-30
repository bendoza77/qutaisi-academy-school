import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Lazy3D } from "../3d/Lazy3D";
import { useSiteData } from "../../context/SiteDataContext";
import { fadeUp, inView } from "../../utils/motion";

export function CTA() {
  const { t, i18n } = useTranslation();
  const { siteData } = useSiteData();
  const cta = siteData.cta || {};
  const isKa = i18n.language === "ka";
  const ka = cta.ka || {};

  const pick = (field, key) => (isKa ? ka[field] || t(key, { defaultValue: cta[field] }) : cta[field]);

  const badge = pick("badge", "cta.badge");
  const title = pick("title", "cta.title");
  const titleHighlight = pick("titleHighlight", "cta.titleHighlight");
  const description = pick("description", "cta.description");
  const rawBenefits = isKa
    ? ka.benefits || t("cta.benefits", { returnObjects: true, defaultValue: cta.benefits })
    : cta.benefits;
  const benefits = Array.isArray(rawBenefits) ? rawBenefits : [];

  return (
    <section aria-label={badge} className="relative isolate overflow-hidden bg-primary-950 py-20 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(90%_120%_at_50%_0%,#1b3153_0%,#0d1c33_55%,#0a1526_100%)]" />
        <div className="bg-grid absolute inset-0 opacity-60" />
        <Lazy3D variant="shapes" cameraZ={7} opacity={0.7} />
        <div className="absolute left-1/2 top-0 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-accent-500/12 blur-[130px]" />
      </div>

      <Container size="narrow">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="flex flex-col items-center text-center"
        >
          {badge && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3.5 py-1.5 text-caption font-semibold text-primary-100 backdrop-blur-sm">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-300" />
              {badge}
            </span>
          )}

          <h2 className="mt-6 max-w-3xl text-h1 text-white">
            {title}{" "}
            <span className="text-accent-300">{titleHighlight}</span>
          </h2>

          {description && (
            <p className="mt-5 max-w-2xl text-body-lg text-primary-100/80">{description}</p>
          )}

          {benefits.length > 0 && (
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {benefits.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-body-sm text-primary-100/75">
                  <Check className="h-4 w-4 shrink-0 text-accent-300" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <Button as={Link} to="/enroll" variant="accent" size="lg" className="group w-full sm:w-auto">
              {t("cta.enrollBtn")}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Button>
            <Button as={Link} to="/courses" variant="outline" size="lg" className="w-full sm:w-auto">
              {t("cta.browseBtn")}
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, PlayCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { HeroBackground3D } from "../3d/HeroBackground3D";
import { useSiteData } from "../../context/SiteDataContext";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  const { siteData } = useSiteData();
  const hero = siteData.hero;
  const trustBadges = hero.trustBadges;
  const floatingCards = [
    { title: "Expert Teachers", sub: "CELTA Certified" },
    { title: "All Levels", sub: "A1 to C2" },
    { title: "Global Standards", sub: "CEFR Aligned" },
  ];

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800" />

      {/* 3D floating shapes */}
      <HeroBackground3D />

      {/* Decorative orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-700/30 blur-3xl"
        />
        <motion.div
          animate={{ y: [8, -8, 8] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"
        />
        <motion.div
          animate={{ y: [-12, 12, -12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-accent-500/10 blur-2xl"
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-blue-100 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
              {hero.badge}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight max-w-4xl"
          >
            {hero.title}{" "}
            <span className="relative inline-block">
              <span className="gradient-text-light">{hero.titleHighlight}</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-1 left-0 right-0 h-0.5 bg-accent-400 origin-left"
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-blue-100/80 text-lg sm:text-xl max-w-2xl leading-relaxed"
          >
            {hero.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-3 pt-2"
          >
            <Button
              variant="accent"
              size="lg"
              onClick={() => scrollTo("contact")}
              className="group w-full sm:w-auto"
            >
              Enroll Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollTo("about")}
              className="group w-full sm:w-auto"
            >
              <PlayCircle className="w-4 h-4" />
              Discover More
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-6 pt-4"
          >
            {Array.isArray(trustBadges) &&
              trustBadges.map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-blue-200/70 text-sm">
                  <div className="w-1 h-1 rounded-full bg-accent-400" />
                  {badge}
                </div>
              ))}
          </motion.div>
        </motion.div>

        {/* Floating cards — desktop only */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex items-center justify-center gap-4 mt-16"
        >
          {Array.isArray(floatingCards) &&
            floatingCards.map((card, i) => (
              <motion.div
                key={card.title}
                animate={{ y: [0, i % 2 === 0 ? -8 : 8, 0] }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-4 text-center"
              >
                <div className="text-2xl mb-1">
                  {["🎓", "📚", "🌍"][i]}
                </div>
                <div className="text-white font-semibold text-sm">{card.title}</div>
                <div className="text-blue-200/60 text-xs">{card.sub}</div>
              </motion.div>
            ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        onClick={() => scrollTo("about")}
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors duration-200 cursor-pointer"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </section>
  );
}

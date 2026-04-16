import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import { NAV_LINK_KEYS } from "../../constants";
import { cn } from "../../utils/cn";

export function Navbar() {
  const { isDark, toggle } = useTheme();
  const { t } = useTranslation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = NAV_LINK_KEYS.map((l) => l.href.replace("#", ""));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-200/60 dark:border-slate-700/60"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <button
              onClick={() => handleNavClick("#home")}
              className="flex items-center gap-2.5 group"
              aria-label="Kutaisi English Academy home"
            >
              <div className="w-9 h-9 bg-primary-900 dark:bg-primary-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-primary-900/40 transition-shadow duration-300">
                <BookOpen className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className={cn(
                    "font-bold text-sm tracking-tight transition-colors duration-300",
                    scrolled ? "text-primary-900 dark:text-white" : "text-white"
                  )}
                >
                  {t("footer.brand")}
                </span>
                <span
                  className={cn(
                    "font-medium text-xs tracking-widest uppercase transition-colors duration-300",
                    scrolled ? "text-primary-600 dark:text-primary-400" : "text-blue-200"
                  )}
                >
                  {t("footer.brandSub")}
                </span>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {NAV_LINK_KEYS.map((link) => {
                const isActive = activeSection === link.href.replace("#", "");
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                      scrolled
                        ? isActive
                          ? "text-primary-900 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20"
                          : "text-slate-600 hover:text-primary-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10"
                        : isActive
                        ? "text-white bg-white/15"
                        : "text-blue-100 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {t(link.key)}
                  </button>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">

              {/* Language switcher — desktop */}
              <div className="hidden sm:block">
                <LanguageSwitcher scrolled={scrolled} />
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={toggle}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200",
                  scrolled
                    ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                )}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Enroll CTA */}
              <button
                onClick={() => handleNavClick("#contact")}
                className={cn(
                  "hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer",
                  scrolled
                    ? "bg-primary-900 text-white hover:bg-primary-800 shadow-md shadow-primary-900/20"
                    : "bg-white text-primary-900 hover:bg-blue-50 shadow-md"
                )}
              >
                {t("nav.enrollNow")}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileOpen}
                className={cn(
                  "lg:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer",
                  scrolled
                    ? "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                    : "text-white hover:bg-white/10"
                )}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-16 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-lg lg:hidden"
          >
            <nav
              className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1"
              role="navigation"
              aria-label="Mobile navigation"
            >
              {NAV_LINK_KEYS.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:text-primary-900 hover:bg-primary-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors duration-150 cursor-pointer"
                >
                  {t(link.key)}
                </motion.button>
              ))}

              {/* Language switcher — mobile */}
              <div className="mt-1">
                <LanguageSwitcher mobile />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleNavClick("#contact")}
                  className="w-full bg-primary-900 text-white py-3 rounded-lg text-sm font-semibold hover:bg-primary-800 transition-colors duration-200 cursor-pointer"
                >
                  {t("nav.enrollNow")}
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

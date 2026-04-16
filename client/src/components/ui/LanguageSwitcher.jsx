import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

/**
 * Two-option language toggle: EN | KA
 * @param {{ scrolled?: boolean, mobile?: boolean }} props
 */
export function LanguageSwitcher({ scrolled = false, mobile = false }) {
  const { i18n } = useTranslation();
  const current = i18n.language.startsWith("ka") ? "ka" : "en";

  const switchTo = (lang) => {
    if (lang === current) return;
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  };

  if (mobile) {
    return (
      <div className="flex items-center gap-1 px-4 py-2">
        {["en", "ka"].map((lang) => (
          <button
            key={lang}
            onClick={() => switchTo(lang)}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer",
              current === lang
                ? "bg-primary-900 text-white"
                : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
            )}
          >
            {lang === "en" ? "EN" : "ქარ"}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center rounded-lg p-0.5 gap-0.5",
        scrolled
          ? "bg-slate-100 dark:bg-slate-800"
          : "bg-white/10 backdrop-blur-sm"
      )}
      role="group"
      aria-label="Language switcher"
    >
      {["en", "ka"].map((lang) => (
        <button
          key={lang}
          onClick={() => switchTo(lang)}
          aria-pressed={current === lang}
          aria-label={lang === "en" ? "Switch to English" : "Switch to Georgian"}
          className={cn(
            "relative px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer z-10",
            current === lang
              ? scrolled
                ? "text-white"
                : "text-primary-900"
              : scrolled
              ? "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              : "text-blue-200/70 hover:text-white"
          )}
        >
          {current === lang && (
            <motion.span
              layoutId="lang-pill"
              className={cn(
                "absolute inset-0 rounded-md",
                scrolled ? "bg-primary-900 dark:bg-primary-600" : "bg-white"
              )}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{lang === "en" ? "EN" : "ქარ"}</span>
        </button>
      ))}
    </div>
  );
}

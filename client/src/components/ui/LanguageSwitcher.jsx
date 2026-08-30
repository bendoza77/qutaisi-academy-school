import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";

const LANGS = [
  { code: "en", label: "EN", aria: "Switch to English" },
  { code: "ka", label: "ქარ", aria: "Switch to Georgian" },
];

/**
 * Two-option language toggle.
 *
 * @param {{
 *   onDark?: boolean,        // sits on the transparent header over the hero
 *   variant?: 'inline' | 'block',
 *   className?: string
 * }} props
 */
export function LanguageSwitcher({ onDark = false, variant = "inline", className }) {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith("ka") ? "ka" : "en";

  const switchTo = (lang) => {
    if (lang === current) return;
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  };

  if (variant === "block") {
    return (
      <div className={cn("grid grid-cols-2 gap-2", className)} role="group" aria-label="Language">
        {LANGS.map(({ code, label, aria }) => (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            aria-label={aria}
            aria-pressed={current === code}
            className={cn(
              "h-11 rounded-control text-btn font-semibold transition-colors duration-200",
              current === code
                ? "bg-white/15 text-white ring-1 ring-inset ring-white/25"
                : "text-primary-200 hover:bg-white/10 hover:text-white"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-control p-0.5",
        onDark ? "bg-white/10" : "bg-primary-50 dark:bg-white/8",
        className
      )}
      role="group"
      aria-label="Language"
    >
      {LANGS.map(({ code, label, aria }) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          aria-label={aria}
          aria-pressed={current === code}
          className={cn(
            "rounded-[0.4375rem] px-2.5 py-1 text-caption font-semibold transition-colors duration-200",
            current === code
              ? onDark
                ? "bg-white text-primary-900"
                : "bg-primary-900 text-white dark:bg-white dark:text-primary-950"
              : onDark
                ? "text-primary-100 hover:text-white"
                : "text-fg-subtle hover:text-fg"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

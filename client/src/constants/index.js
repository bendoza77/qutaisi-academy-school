/**
 * Structural / non-translatable data.
 * All user-facing text lives in src/i18n/locales/
 */

export const NAV_LINK_KEYS = [
  { key: "nav.home", href: "#home" },
  { key: "nav.about", href: "#about" },
  { key: "nav.courses", href: "#courses" },
  { key: "nav.whyUs", href: "#why-us" },
  { key: "nav.testimonials", href: "#testimonials" },
  { key: "nav.contact", href: "#contact" },
];

/** Visual/structural metadata for the 4 courses (order matches translation items array) */
export const COURSES_META = [
  {
    id: 1,
    icon: "BookOpen",
    accent: "#10b981",
    badgeColor: "bg-emerald-100 text-emerald-700",
    popular: false,
  },
  {
    id: 2,
    icon: "TrendingUp",
    accent: "#2563eb",
    badgeColor: "bg-blue-100 text-blue-700",
    popular: true,
  },
  {
    id: 3,
    icon: "Award",
    accent: "#7c3aed",
    badgeColor: "bg-purple-100 text-purple-700",
    popular: false,
  },
  {
    id: 4,
    icon: "Briefcase",
    accent: "#f59e0b",
    badgeColor: "bg-amber-100 text-amber-700",
    popular: false,
  },
];

/** Color palette for benefit cards (order matches translation items array) */
export const BENEFIT_COLORS = [
  { bg: "bg-primary-100 dark:bg-primary-900/30", icon: "text-primary-700 dark:text-primary-400" },
  { bg: "bg-emerald-100 dark:bg-emerald-900/30", icon: "text-emerald-700 dark:text-emerald-400" },
  { bg: "bg-purple-100 dark:bg-purple-900/30", icon: "text-purple-700 dark:text-purple-400" },
  { bg: "bg-amber-100 dark:bg-amber-900/30", icon: "text-amber-700 dark:text-amber-400" },
  { bg: "bg-rose-100 dark:bg-rose-900/30", icon: "text-rose-700 dark:text-rose-400" },
  { bg: "bg-cyan-100 dark:bg-cyan-900/30", icon: "text-cyan-700 dark:text-cyan-400" },
];

/** Icon names for benefits (order matches translation items array) */
export const BENEFIT_ICONS = [
  "GraduationCap",
  "Users",
  "Lightbulb",
  "Calendar",
  "Globe",
  "Shield",
];

/** Visual metadata for testimonials (order matches translation items array) */
export const TESTIMONIALS_META = [
  { id: 1, avatar: "MK", color: "bg-blue-600", rating: 5 },
  { id: 2, avatar: "GT", color: "bg-purple-600", rating: 5 },
  { id: 3, avatar: "AB", color: "bg-emerald-600", rating: 5 },
  { id: 4, avatar: "LG", color: "bg-amber-600", rating: 5 },
  { id: 5, avatar: "NS", color: "bg-rose-600", rating: 5 },
];

/** Numeric values and suffixes for stats (labels come from translations) */
export const STATS_META = [
  { value: 1200, suffix: "+" },
  { value: 15, suffix: "+" },
  { value: 8, suffix: "" },
  { value: 96, suffix: "%" },
];

/** Static contact data that doesn't need translation */
export const CONTACT_INFO = {
  phone: "+995 599 123 456",
  email: "info@kutaisi-english.ge",
  social: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
    linkedin: "#",
  },
};

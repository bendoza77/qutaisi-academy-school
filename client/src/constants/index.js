/**
 * Structural / non-translatable data.
 * All user-facing text lives in src/i18n/locales/
 */

/**
 * Header navigation. Deliberately five items: the Georgian labels are ~40%
 * wider than the English ones, and a five-item row fits both languages at
 * 1024px without wrapping or the negative-margin hacks it used to need.
 * Everything else stays one tap away in the drawer and the footer.
 */
export const PRIMARY_NAV = [
  { key: "nav.courses",  path: "/courses"  },
  { key: "nav.teachers", path: "/teachers" },
  { key: "nav.about",    path: "/about"    },
  { key: "nav.blog",     path: "/blog"     },
  { key: "nav.contact",  path: "/contact"  },
];

/** Shown in the mobile drawer and the footer. */
export const SECONDARY_NAV = [
  { key: "nav.whyUs",        path: "/why-us"       },
  { key: "nav.testimonials", path: "/testimonials" },
  { key: "nav.faq",          path: "/faq"          },
  { key: "nav.englishTest",  path: "/english-test" },
];

/** Every public route, in reading order. */
export const NAV_LINK_KEYS = [
  { key: "nav.home", path: "/" },
  ...PRIMARY_NAV,
  ...SECONDARY_NAV,
];

/** Icon names for benefits (order matches the benefits array) */
export const BENEFIT_ICONS = [
  "GraduationCap",
  "Users",
  "Lightbulb",
  "Calendar",
  "Globe",
  "Shield",
];

/** Static contact data that doesn't need translation */
export const CONTACT_INFO = {
  phone: "+995 511 236 890",
  email: "2022theenglishacademy@gmail.com",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=100078710533510",
    instagram: "#",
    youtube: "#",
    linkedin: "#",
  },
};

/** Studio credit shown in the footer. No URL is published for WEBI, so the
 *  credit renders as text only — never invent a link. */
export const BUILT_BY = { name: "WEBI", url: "" };

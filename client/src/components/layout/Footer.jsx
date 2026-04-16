import { useTranslation } from "react-i18next";
import { BookOpen, Phone, Mail, MapPin } from "lucide-react";
import { NAV_LINK_KEYS, CONTACT_INFO } from "../../constants";

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function Footer() {
  const { t } = useTranslation();

  const handleNavClick = (href) => {
    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
  };

  const year = new Date().getFullYear();
  const courseLinks = t("footer.courseLinks", { returnObjects: true });

  return (
    <footer className="bg-slate-950 text-slate-400" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary-700 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-sm text-white tracking-tight">
                  {t("footer.brand")}
                </span>
                <span className="font-medium text-xs text-primary-400 uppercase tracking-widest">
                  {t("footer.brandSub")}
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 mb-6 max-w-xs">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-2">
              {[
                { Icon: FacebookIcon, href: CONTACT_INFO.social.facebook, label: "Facebook" },
                { Icon: InstagramIcon, href: CONTACT_INFO.social.instagram, label: "Instagram" },
                { Icon: YoutubeIcon, href: CONTACT_INFO.social.youtube, label: "YouTube" },
                { Icon: LinkedinIcon, href: CONTACT_INFO.social.linkedin, label: "LinkedIn" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary-700 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              {t("footer.navigation")}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINK_KEYS.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-150 cursor-pointer group flex items-center gap-1"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                      {t(link.key)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              {t("footer.courses")}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {Array.isArray(courseLinks) &&
                courseLinks.map((name) => (
                  <li key={name}>
                    <button
                      onClick={() => handleNavClick("#courses")}
                      className="text-sm text-slate-400 hover:text-white transition-colors duration-150 cursor-pointer group flex items-center gap-1"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                        {name}
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              {t("footer.contact")}
            </h3>
            <ul className="flex flex-col gap-3.5">
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                  className="flex items-start gap-3 group"
                >
                  <div className="mt-0.5 w-7 h-7 rounded-md bg-slate-800 group-hover:bg-primary-700 flex items-center justify-center transition-colors duration-200 shrink-0">
                    <Phone className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors duration-150">
                    {CONTACT_INFO.phone}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-start gap-3 group"
                >
                  <div className="mt-0.5 w-7 h-7 rounded-md bg-slate-800 group-hover:bg-primary-700 flex items-center justify-center transition-colors duration-200 shrink-0">
                    <Mail className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors duration-150 break-all">
                    {CONTACT_INFO.email}
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <span className="text-sm text-slate-400">{t("contact.address")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {year} {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors duration-150">
              {t("footer.privacy")}
            </a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors duration-150">
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

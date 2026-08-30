import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { PRIMARY_NAV, SECONDARY_NAV, BUILT_BY } from "../../constants";
import { useSiteData } from "../../context/SiteDataContext";
import { Container } from "../ui/Container";
import logoSrc from "../../assets/Screenshot_2026-04-16_211914-removebg-preview.png";

/* lucide-react ships no brand marks — these are the four we actually link to. */
const SOCIAL_ICONS = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon fill="#0a1526" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
};

const SOCIAL_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
};

function FooterLink({ to, children }) {
  return (
    <li>
      <Link
        to={to}
        className="group inline-flex items-center gap-1 py-1 text-body-sm text-primary-200/80 transition-colors duration-150 hover:text-white"
      >
        <span>{children}</span>
        <ArrowUpRight
          className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}

function ColumnHeading({ children }) {
  return (
    <h2 className="mb-4 text-eyebrow uppercase text-accent-300">{children}</h2>
  );
}

export function Footer() {
  const { t, i18n } = useTranslation();
  const { siteData } = useSiteData();

  const contact = siteData.contact || {};
  const isKa = i18n.language.startsWith("ka");
  const address = (isKa && contact.ka?.address) || contact.address;
  const hours = (isKa && contact.ka?.hours) || contact.hours;
  const year = new Date().getFullYear();

  /* Placeholder "#" entries in the CMS must never render as dead links. */
  const socials = Object.entries(contact.social || {}).filter(
    ([key, href]) => SOCIAL_ICONS[key] && typeof href === "string" && href.startsWith("http")
  );

  return (
    <footer className="bg-primary-950 text-primary-200" role="contentinfo">
      <Container className="py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="mb-5 inline-flex items-center gap-3">
              <img src={logoSrc} alt="" width={44} height={44} className="h-11 w-11 object-contain" />
              <span className="flex flex-col leading-none">
                <span className="text-[0.9375rem] font-bold tracking-[-0.02em] text-white">
                  {t("footer.brand")}
                </span>
                <span className="mt-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-accent-300">
                  {t("footer.brandSub")}
                </span>
              </span>
            </Link>

            <p className="max-w-xs text-body-sm leading-relaxed text-primary-200/80">
              {t("footer.tagline")}
            </p>

            {socials.length > 0 && (
              <div className="mt-6 flex items-center gap-2">
                {socials.map(([key, href]) => (
                  <a
                    key={key}
                    href={href}
                    aria-label={SOCIAL_LABELS[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-control bg-white/8 text-primary-100 transition-colors duration-200 hover:bg-accent-600 hover:text-white"
                  >
                    {SOCIAL_ICONS[key]}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Academy */}
          <nav className="lg:col-span-2" aria-labelledby="footer-academy">
            <ColumnHeading>
              <span id="footer-academy">{t("footer.navigation")}</span>
            </ColumnHeading>
            <ul className="flex flex-col">
              {PRIMARY_NAV.map((link) => (
                <FooterLink key={link.path} to={link.path}>
                  {t(link.key)}
                </FooterLink>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <nav className="lg:col-span-3" aria-labelledby="footer-resources">
            <ColumnHeading>
              <span id="footer-resources">{t("footer.courses")}</span>
            </ColumnHeading>
            <ul className="flex flex-col">
              {(siteData.courses || []).map((course) => (
                <FooterLink key={course.slug} to={`/courses/${course.slug}`}>
                  {isKa ? course.ka?.title || course.title : course.title}
                </FooterLink>
              ))}
              {SECONDARY_NAV.map((link) => (
                <FooterLink key={link.path} to={link.path}>
                  {t(link.key)}
                </FooterLink>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <ColumnHeading>{t("footer.contact")}</ColumnHeading>
            <ul className="flex flex-col gap-3.5">
              {contact.phone && (
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="group flex items-start gap-3 text-body-sm text-primary-200/80 transition-colors hover:text-white"
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" aria-hidden="true" />
                    <span>{contact.phone}</span>
                  </a>
                </li>
              )}
              {contact.email && (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="group flex items-start gap-3 text-body-sm text-primary-200/80 transition-colors hover:text-white"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" aria-hidden="true" />
                    <span className="break-all">{contact.email}</span>
                  </a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-3 text-body-sm text-primary-200/80">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" aria-hidden="true" />
                  <span>{address}</span>
                </li>
              )}
              {hours && (
                <li className="flex items-start gap-3 text-body-sm text-primary-200/80">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" aria-hidden="true" />
                  <span>{hours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="order-2 text-caption text-primary-200/60 sm:order-1">
            © {year} {t("footer.copyright")}
          </p>

          <div className="order-1 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:order-2">
            <Link
              to="/privacy"
              className="text-caption text-primary-200/60 transition-colors hover:text-white"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              to="/terms"
              className="text-caption text-primary-200/60 transition-colors hover:text-white"
            >
              {t("footer.terms")}
            </Link>
            <span aria-hidden="true" className="hidden h-3 w-px bg-white/15 sm:block" />
            <p className="text-caption text-primary-200/60">
              {isKa ? "საიტი შექმნილია" : "Website designed & developed by"}{" "}
              {BUILT_BY.url ? (
                <a
                  href={BUILT_BY.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold tracking-[0.08em] text-primary-100 transition-colors hover:text-accent-300"
                >
                  {BUILT_BY.name}
                </a>
              ) : (
                <span className="font-semibold tracking-[0.08em] text-primary-100">
                  {BUILT_BY.name}
                </span>
              )}
              {isKa ? "-ის მიერ" : ""}
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}

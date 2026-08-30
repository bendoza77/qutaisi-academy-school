import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, ArrowRight, Phone } from "lucide-react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { useSiteData } from "../../context/SiteDataContext";
import { useDialogBehavior } from "../../hooks/useDialogBehavior";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import { Container } from "../ui/Container";
import { PRIMARY_NAV, SECONDARY_NAV } from "../../constants";
import { cn } from "../../utils/cn";
import logoSrc from "../../assets/Screenshot_2026-04-16_211914-removebg-preview.png";

function Wordmark({ onDark }) {
  const { t } = useTranslation();
  return (
    <Link
      to="/"
      className="group flex shrink-0 items-center gap-2.5 rounded-lg"
      aria-label={`${t("footer.brand")} ${t("footer.brandSub")} — home`}
    >
      <img
        src={logoSrc}
        alt=""
        width={40}
        height={40}
        className="h-9 w-9 shrink-0 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10"
      />
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={cn(
            "truncate text-[0.9375rem] font-bold tracking-[-0.02em]",
            onDark ? "text-white" : "text-fg"
          )}
        >
          {t("footer.brand")}
        </span>
        <span
          className={cn(
            "mt-0.5 truncate text-[0.6875rem] font-semibold uppercase tracking-[0.16em]",
            onDark ? "text-accent-300" : "text-accent-700 dark:text-accent-300"
          )}
        >
          {t("footer.brandSub")}
        </span>
      </span>
    </Link>
  );
}

function IconButton({ onDark, className, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-control transition-colors duration-200",
        onDark
          ? "text-primary-100 hover:bg-white/15 hover:text-white"
          : "text-fg-muted hover:bg-primary-50 hover:text-primary-800 dark:hover:bg-white/10 dark:hover:text-white",
        className
      )}
      {...props}
    />
  );
}

export function Navbar() {
  const { isDark, toggle } = useTheme();
  const { t } = useTranslation();
  const { siteData } = useSiteData();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef(null);

  /* The home hero is a dark full-bleed panel, so the header floats over it
     until the visitor scrolls. Every other route opens on a light surface and
     gets the solid header immediately — no invisible white-on-white logo. */
  const isHome = location.pathname === "/";
  const onDark = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useDialogBehavior({ open: menuOpen, onClose: closeMenu, ref: panelRef });

  const navLinkClass = ({ isActive }) =>
    cn(
      "relative rounded-lg px-3 py-2 text-nav transition-colors duration-200",
      "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:transition-transform after:duration-300 after:content-['']",
      isActive ? "after:scale-x-100" : "after:scale-x-0",
      onDark
        ? cn("after:bg-accent-300", isActive ? "text-white" : "text-primary-100 hover:text-white")
        : cn(
            "after:bg-accent-600 dark:after:bg-accent-300",
            isActive ? "text-fg" : "text-fg-muted hover:text-fg"
          )
    );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
          onDark
            ? "border-b border-transparent bg-transparent"
            : "border-b border-line bg-canvas/85 shadow-nav backdrop-blur-xl supports-[not(backdrop-filter:blur(0))]:bg-canvas"
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-3 lg:h-[4.5rem]">
          <Wordmark onDark={onDark} />

          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label={t("footer.navigation")}
          >
            {PRIMARY_NAV.map((link) => (
              <NavLink key={link.path} to={link.path} className={navLinkClass} end={link.path === "/"}>
                {t(link.key)}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5">
            <div className="hidden sm:block">
              <LanguageSwitcher onDark={onDark} />
            </div>

            <IconButton
              onDark={onDark}
              onClick={toggle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </IconButton>

            <Link
              to="/enroll"
              className={cn(
                "hidden h-10 items-center gap-2 rounded-control px-5 text-btn font-semibold transition-all duration-200 sm:inline-flex",
                onDark
                  ? "bg-white text-primary-900 shadow-sm hover:bg-primary-50"
                  : "bg-primary-900 text-white shadow-sm hover:bg-primary-800 dark:bg-white dark:text-primary-950 dark:hover:bg-primary-100"
              )}
            >
              {t("nav.enrollNow")}
            </Link>

            <IconButton
              onDark={onDark}
              className="lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label={t("footer.navigation")}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </IconButton>
          </div>
        </Container>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
              className="absolute inset-0 bg-primary-950/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            <motion.div
              ref={panelRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={t("footer.navigation")}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto overscroll-contain bg-primary-950 text-white shadow-xl"
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
                <span className="text-eyebrow uppercase text-accent-300">
                  {t("footer.navigation")}
                </span>
                <button
                  type="button"
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-control text-primary-100 transition-colors hover:bg-white/15 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-1 flex-col px-5 py-6" aria-label={t("footer.navigation")}>
                <ul className="flex flex-col">
                  {PRIMARY_NAV.map((link) => (
                    <li key={link.path}>
                      <NavLink
                        to={link.path}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center justify-between border-b border-white/10 py-3.5 text-[1.0625rem] font-semibold transition-colors",
                            isActive ? "text-accent-300" : "text-white hover:text-accent-300"
                          )
                        }
                      >
                        {t(link.key)}
                        <ArrowRight className="h-4 w-4 opacity-40" aria-hidden="true" />
                      </NavLink>
                    </li>
                  ))}
                </ul>

                <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-1">
                  {SECONDARY_NAV.map((link) => (
                    <li key={link.path}>
                      <NavLink
                        to={link.path}
                        className={({ isActive }) =>
                          cn(
                            "block py-2 text-body-sm transition-colors",
                            isActive ? "text-accent-300" : "text-primary-200 hover:text-white"
                          )
                        }
                      >
                        {t(link.key)}
                      </NavLink>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col gap-4 pt-8">
                  <LanguageSwitcher variant="block" />

                  <Link
                    to="/enroll"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-control bg-white text-btn font-semibold text-primary-900 transition-colors hover:bg-primary-50"
                  >
                    {t("nav.enrollNow")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>

                  <a
                    href={`tel:${(siteData.contact?.phone || "").replace(/\s/g, "")}`}
                    className="inline-flex items-center justify-center gap-2 text-body-sm text-primary-200 transition-colors hover:text-white"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {siteData.contact?.phone}
                  </a>
                </div>
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

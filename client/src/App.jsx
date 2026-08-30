import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ThemeProvider } from "./context/ThemeContext";
import { SiteDataProvider } from "./context/SiteDataContext";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/Home";
import { Seo } from "./components/Seo";
import { FloatingHelpers } from "./components/ui/FloatingHelpers";

// Lazy-load every route except the home page shell
const AdminPage        = lazy(() => import("./pages/admin/AdminPage").then(m => ({ default: m.AdminPage })));
const AboutPage        = lazy(() => import("./pages/AboutPage").then(m => ({ default: m.AboutPage })));
const CoursesPage      = lazy(() => import("./pages/CoursesPage").then(m => ({ default: m.CoursesPage })));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage").then(m => ({ default: m.CourseDetailPage })));
const WhyUsPage        = lazy(() => import("./pages/WhyUsPage").then(m => ({ default: m.WhyUsPage })));
const TestimonialsPage = lazy(() => import("./pages/TestimonialsPage").then(m => ({ default: m.TestimonialsPage })));
const ContactPage      = lazy(() => import("./pages/ContactPage").then(m => ({ default: m.ContactPage })));
const TeachersPage     = lazy(() => import("./pages/TeachersPage").then(m => ({ default: m.TeachersPage })));
const FAQPage          = lazy(() => import("./pages/FAQPage").then(m => ({ default: m.FAQPage })));
const EnrollPage       = lazy(() => import("./pages/EnrollPage").then(m => ({ default: m.EnrollPage })));
const PrivacyPage      = lazy(() => import("./pages/PrivacyPage").then(m => ({ default: m.PrivacyPage })));
const TermsPage        = lazy(() => import("./pages/TermsPage").then(m => ({ default: m.TermsPage })));
const BlogPage         = lazy(() => import("./pages/BlogPage").then(m => ({ default: m.BlogPage })));
const BlogDetailPage   = lazy(() => import("./pages/BlogDetailPage").then(m => ({ default: m.BlogDetailPage })));
const EnglishTestPage  = lazy(() => import("./pages/EnglishTestPage").then(m => ({ default: m.EnglishTestPage })));
const NotFoundPage     = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas" role="status" aria-live="polite">
      <span className="sr-only">Loading</span>
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-700 dark:border-white/20 dark:border-t-accent-300" />
    </div>
  );
}

/** New route, top of the page — matches what a full page load would do. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

/** Keeps <html lang> in step with the active locale. */
function useDocumentLanguage() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("ka") ? "ka" : "en";
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return lang;
}

function HomeShell() {
  const lang = useDocumentLanguage();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-canvas">
      <Seo description={t("footer.tagline")} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-control focus:bg-white focus:px-4 focus:py-2 focus:text-btn focus:font-semibold focus:text-primary-900 focus:shadow-lg"
      >
        {lang === "ka" ? "მთავარ კონტენტზე გადასვლა" : "Skip to main content"}
      </a>
      <Navbar />
      <main id="main-content">
        <Home />
      </main>
      <Footer />
      <FloatingHelpers />
    </div>
  );
}

const lazyRoute = (element) => <Suspense fallback={<PageLoader />}>{element}</Suspense>;

function App() {
  return (
    <SiteDataProvider>
      <ThemeProvider>
        {/* Honours prefers-reduced-motion for every Framer Motion animation. */}
        <MotionConfig reducedMotion="user">
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/"                  element={<HomeShell />} />
              <Route path="/academy-panel"     element={lazyRoute(<AdminPage />)} />
              <Route path="/about"             element={lazyRoute(<AboutPage />)} />
              <Route path="/courses"           element={lazyRoute(<CoursesPage />)} />
              <Route path="/courses/:courseSlug" element={lazyRoute(<CourseDetailPage />)} />
              <Route path="/why-us"            element={lazyRoute(<WhyUsPage />)} />
              <Route path="/testimonials"      element={lazyRoute(<TestimonialsPage />)} />
              <Route path="/contact"           element={lazyRoute(<ContactPage />)} />
              <Route path="/teachers"          element={lazyRoute(<TeachersPage />)} />
              <Route path="/faq"               element={lazyRoute(<FAQPage />)} />
              <Route path="/enroll"            element={lazyRoute(<EnrollPage />)} />
              <Route path="/blog"              element={lazyRoute(<BlogPage />)} />
              <Route path="/blog/:slug"        element={lazyRoute(<BlogDetailPage />)} />
              <Route path="/english-test"      element={lazyRoute(<EnglishTestPage />)} />
              <Route path="/privacy"           element={lazyRoute(<PrivacyPage />)} />
              <Route path="/terms"             element={lazyRoute(<TermsPage />)} />
              <Route path="*"                  element={lazyRoute(<NotFoundPage />)} />
            </Routes>
          </BrowserRouter>
        </MotionConfig>
      </ThemeProvider>
    </SiteDataProvider>
  );
}

export default App;

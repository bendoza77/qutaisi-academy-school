import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeProvider } from "./context/ThemeContext";
import { SiteDataProvider } from "./context/SiteDataContext";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/Home";
import { WhatsAppButton } from "./components/ui/WhatsAppButton";
import { AIChatWidget } from "./components/ui/AIChatWidget";

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
const NotFoundPage     = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
      <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );
}

function HomeShell() {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("ka") ? "ka" : "en";

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-primary-900 focus:rounded-lg focus:shadow-lg focus:font-medium text-sm"
      >
        {lang === "ka" ? "მთავარ კონტენტზე გადასვლა" : "Skip to main content"}
      </a>
      <Navbar />
      <main id="main-content">
        <Home />
      </main>
      <Footer />
      <WhatsAppButton />
      <AIChatWidget />
    </div>
  );
}

function App() {
  return (
    <SiteDataProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeShell />} />
            <Route path="/academy-panel" element={
              <Suspense fallback={<PageLoader />}><AdminPage /></Suspense>
            } />
            <Route path="/about" element={
              <Suspense fallback={<PageLoader />}><AboutPage /></Suspense>
            } />
            <Route path="/courses" element={
              <Suspense fallback={<PageLoader />}><CoursesPage /></Suspense>
            } />
            <Route path="/courses/:courseSlug" element={
              <Suspense fallback={<PageLoader />}><CourseDetailPage /></Suspense>
            } />
            <Route path="/why-us" element={
              <Suspense fallback={<PageLoader />}><WhyUsPage /></Suspense>
            } />
            <Route path="/testimonials" element={
              <Suspense fallback={<PageLoader />}><TestimonialsPage /></Suspense>
            } />
            <Route path="/contact" element={
              <Suspense fallback={<PageLoader />}><ContactPage /></Suspense>
            } />
            <Route path="/teachers" element={
              <Suspense fallback={<PageLoader />}><TeachersPage /></Suspense>
            } />
            <Route path="/faq" element={
              <Suspense fallback={<PageLoader />}><FAQPage /></Suspense>
            } />
            <Route path="/enroll" element={
              <Suspense fallback={<PageLoader />}><EnrollPage /></Suspense>
            } />
            <Route path="/blog" element={
              <Suspense fallback={<PageLoader />}><BlogPage /></Suspense>
            } />
            <Route path="/blog/:slug" element={
              <Suspense fallback={<PageLoader />}><BlogDetailPage /></Suspense>
            } />
            <Route path="/privacy" element={
              <Suspense fallback={<PageLoader />}><PrivacyPage /></Suspense>
            } />
            <Route path="/terms" element={
              <Suspense fallback={<PageLoader />}><TermsPage /></Suspense>
            } />
            <Route path="*" element={
              <Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>
            } />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </SiteDataProvider>
  );
}

export default App;

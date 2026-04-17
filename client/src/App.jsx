import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeProvider } from "./context/ThemeContext";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/Home";
import { AboutPage } from "./pages/AboutPage";
import { CoursesPage } from "./pages/CoursesPage";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { WhyUsPage } from "./pages/WhyUsPage";
import { TestimonialsPage } from "./pages/TestimonialsPage";
import { ContactPage } from "./pages/ContactPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { NotFoundPage } from "./pages/NotFoundPage"
import { TeachersPage } from "./pages/TeachersPage"
import { FAQPage } from "./pages/FAQPage"
import { EnrollPage } from "./pages/EnrollPage"
import { WhatsAppButton } from "./components/ui/WhatsAppButton";

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
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeShell />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseSlug" element={<CourseDetailPage />} />
          <Route path="/why-us" element={<WhyUsPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/enroll" element={<EnrollPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

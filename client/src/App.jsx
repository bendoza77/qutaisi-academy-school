import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ThemeProvider } from "./context/ThemeContext";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/Home";

/**
 * Inner component — has access to i18n context (i18n is initialised in main.jsx before render).
 * Keeps the html[lang] attribute in sync with the active language.
 */
function AppShell() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language.startsWith("ka") ? "ka" : "en";
  }, [i18n.language]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Accessibility: skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-primary-900 focus:rounded-lg focus:shadow-lg focus:font-medium text-sm"
      >
        {i18n.language.startsWith("ka") ? "მთავარ კონტენტზე გადასვლა" : "Skip to main content"}
      </a>

      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}

/**
 * Root component — wraps everything in ThemeProvider.
 * i18n does NOT need a React provider; it is module-level singleton.
 */
function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

export default App;

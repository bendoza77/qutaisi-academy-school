import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, User, ArrowRight, BookOpen, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { PageLayout } from "../components/layout/PageLayout";
import { PageHero } from "../components/ui/PageHero";
import { CTA } from "../components/sections/CTA";
import { useSiteData } from "../context/SiteDataContext";

const POSTS_PER_PAGE = 4;

const CATEGORY_COLORS = {
  Tips:       "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Grammar:    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Business:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Vocabulary: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  News:       "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const CATEGORY_IMAGES = {
  Tips:       "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80",
  Grammar:    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
  Business:   "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
  Vocabulary: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
  News:       "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
};

function BlogCard({ post, index }) {
  const color = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.Tips;
  const coverSrc = post.coverImage || CATEGORY_IMAGES[post.category] || CATEGORY_IMAGES.Tips;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: (index % POSTS_PER_PAGE) * 0.06 }}
      className="group flex flex-col bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30"
    >
      {/* Cover */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={coverSrc}
          alt={post.title}
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${color}`}>
          {post.category}
        </span>
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-xs text-white/70 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
          <Clock className="w-3 h-3" />{post.readTime}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h2 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors leading-snug">
          {post.title}
        </h2>
        <p className="text-sm text-white/50 leading-relaxed mb-5 line-clamp-3 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-white/35 mb-4 pt-4 border-t border-white/10">
          <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{post.author}</span>
        </div>
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-white hover:gap-3 transition-all duration-200"
        >
          Read article <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.article>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-14">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/8 border border-white/10 text-white/60 hover:bg-white/15 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4" /> Prev
      </button>

      <div className="flex items-center gap-1.5">
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
              page === currentPage
                ? "bg-white text-primary-900 shadow-lg shadow-white/10"
                : "bg-white/8 border border-white/10 text-white/60 hover:bg-white/15 hover:text-white hover:border-white/20"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/8 border border-white/10 text-white/60 hover:bg-white/15 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export function BlogPage() {
  const { siteData } = useSiteData();
  const allPosts = (siteData.blogs || []).filter(p => p.published);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ["All", ...Array.from(new Set(allPosts.map(p => p.category).filter(Boolean)))];
  const filtered = activeCategory === "All" ? allPosts : allPosts.filter(p => p.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [activeCategory]);

  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo({ top: 480, behavior: "smooth" });
  }

  return (
    <PageLayout pageTitle="Blog">
      <PageHero
        eyebrow="Our Blog"
        title="English Learning"
        highlight="Insights & Tips"
        subtitle="Expert advice, grammar guides, and language learning strategies from our team of professional English instructors."
        bgImage="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-16 lg:py-24 bg-gradient-to-b from-primary-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-white text-primary-900 shadow-lg"
                      : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white border border-white/10"
                  }`}
                >
                  {cat !== "All" && <Tag className="w-3 h-3" />}
                  {cat}
                </button>
              ))}
            </div>
          )}

          {filtered.length > 0 && (
            <p className="text-center text-white/30 text-sm mb-8">
              Showing {(currentPage - 1) * POSTS_PER_PAGE + 1}–{Math.min(currentPage * POSTS_PER_PAGE, filtered.length)} of {filtered.length} articles
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-lg font-medium">No posts yet</p>
              <p className="text-white/30 text-sm mt-1">Check back soon for new articles.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${currentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6"
              >
                {paginated.map((post, i) => <BlogCard key={post.id} post={post} index={i} />)}
              </motion.div>
            </AnimatePresence>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </section>

      <CTA />
    </PageLayout>
  );
}

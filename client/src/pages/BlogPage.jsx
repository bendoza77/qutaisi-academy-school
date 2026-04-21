import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, User, ArrowRight, BookOpen, Tag } from "lucide-react";
import { PageLayout } from "../components/layout/PageLayout";
import { PageHero } from "../components/ui/PageHero";
import { CTA } from "../components/sections/CTA";
import { useSiteData } from "../context/SiteDataContext";

const CATEGORY_COLORS = {
  Tips:       "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Grammar:    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Business:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Vocabulary: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  News:       "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

function BlogCard({ post, index }) {
  const color = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.Tips;
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.07 }}
      className="group flex flex-col bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30"
    >
      {/* Cover */}
      <div className="relative h-48 bg-gradient-to-br from-primary-800 via-primary-700 to-blue-600 overflow-hidden">
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
          {post.category}
        </span>
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
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime} read</span>
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

export function BlogPage() {
  const { siteData } = useSiteData();
  const allPosts = (siteData.blogs || []).filter(p => p.published);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(allPosts.map(p => p.category).filter(Boolean)))];
  const filtered = activeCategory === "All" ? allPosts : allPosts.filter(p => p.category === activeCategory);

  return (
    <PageLayout pageTitle="Blog">
      <PageHero
        eyebrow="Our Blog"
        title="English Learning"
        highlight="Insights & Tips"
        subtitle="Expert advice, grammar guides, and language learning strategies from our team of professional English instructors."
      />

      <section className="py-16 lg:py-24 bg-gradient-to-b from-primary-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-12 justify-center">
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

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-lg font-medium">No posts yet</p>
              <p className="text-white/30 text-sm mt-1">Check back soon for new articles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => <BlogCard key={post.id} post={post} index={i} />)}
            </div>
          )}
        </div>
      </section>

      <CTA />
    </PageLayout>
  );
}

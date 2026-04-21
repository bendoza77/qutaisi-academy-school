import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, User, Calendar, Tag, BookOpen } from "lucide-react";
import { PageLayout } from "../components/layout/PageLayout";
import { CTA } from "../components/sections/CTA";
import { useSiteData } from "../context/SiteDataContext";

const CATEGORY_COLORS = {
  Tips:       "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Grammar:    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Business:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Vocabulary: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  News:       "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function BlogDetailPage() {
  const { slug } = useParams();
  const { siteData } = useSiteData();
  const post = (siteData.blogs || []).find(b => b.slug === slug && b.published);

  if (!post) {
    return (
      <PageLayout pageTitle="Post Not Found">
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 py-20">
          <BookOpen className="w-14 h-14 text-slate-300 dark:text-slate-600" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Post not found</h1>
          <Link to="/blog" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
            ← Back to Blog
          </Link>
        </div>
      </PageLayout>
    );
  }

  const color = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.Tips;

  return (
    <PageLayout pageTitle={post.title}>
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-blue-700 py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent" />
        {post.coverImage && (
          <img src={post.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        )}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>

            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-5 ${color}`}>
              <Tag className="w-3 h-3" />{post.category}
            </span>

            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white font-medium leading-none">{post.author}</p>
                  {post.authorRole && <p className="text-white/50 text-xs mt-0.5">{post.authorRole}</p>}
                </div>
              </span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(post.publishedAt)}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.readTime} read</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Article body */}
      <section className="py-14 lg:py-20 bg-gradient-to-b from-primary-950 to-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3
              [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2
              [&_p]:text-white/70 [&_p]:leading-relaxed [&_p]:mb-4
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul_li]:text-white/70 [&_ul_li]:mb-1.5
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol_li]:text-white/70 [&_ol_li]:mb-1.5
              [&_strong]:text-white [&_strong]:font-semibold
              [&_a]:text-blue-300 [&_a]:underline hover:[&_a]:text-white
              text-base"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className="mt-12 pt-8 border-t border-white/10">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-white hover:gap-3 transition-all">
              <ArrowLeft className="w-4 h-4" /> Back to all articles
            </Link>
          </div>
        </div>
      </section>

      <CTA />
    </PageLayout>
  );
}

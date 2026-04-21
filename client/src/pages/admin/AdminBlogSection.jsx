import { useState } from "react";
import { Plus, Trash2, Edit3, Eye, EyeOff, X, Save, Globe, FileText } from "lucide-react";
import { useSiteData } from "../../context/SiteDataContext";

const CATEGORIES = ["Tips", "Grammar", "Business", "Vocabulary", "News"];

const CATEGORY_COLORS = {
  Tips:       "bg-emerald-100 text-emerald-700",
  Grammar:    "bg-blue-100 text-blue-700",
  Business:   "bg-amber-100 text-amber-700",
  Vocabulary: "bg-purple-100 text-purple-700",
  News:       "bg-rose-100 text-rose-700",
};

const EMPTY_POST = {
  title: "", excerpt: "", content: "", category: "Tips",
  coverImage: "", author: "", authorRole: "", readTime: "3 min", published: true,
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function Field({ label, value, onChange, type = "text", rows, placeholder, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</label>
      {rows ? (
        <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-y" />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" />
      )}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function PostModal({ post, onSave, onClose }) {
  const [form, setForm] = useState({ ...EMPTY_POST, ...post });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const isEdit = !!post?.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">{isEdit ? "Edit Post" : "New Post"}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-4">
          <Field label="Title *" value={form.title} onChange={v => set("title", v)} placeholder="Enter post title..." />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Category</label>
              <select value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 cursor-pointer">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Field label="Read Time" value={form.readTime} onChange={v => set("readTime", v)} placeholder="5 min" />
          </div>

          <Field label="Excerpt" value={form.excerpt} onChange={v => set("excerpt", v)} rows={2}
            placeholder="Short description shown on the blog listing page..." />

          <Field label="Content (HTML)" value={form.content} onChange={v => set("content", v)} rows={10}
            placeholder="<p>Write your article here. Use HTML: <strong>, <h2>, <ul>, <li>, etc.</p>"
            hint="Supported tags: <h2> headings, <p> paragraphs, <ul><li> lists, <strong> bold." />

          <Field label="Cover Image URL" value={form.coverImage} onChange={v => set("coverImage", v)}
            placeholder="https://..." hint="Optional — leave empty for the default gradient." />

          <div className="grid grid-cols-2 gap-4">
            <Field label="Author Name" value={form.author} onChange={v => set("author", v)} placeholder="John Smith" />
            <Field label="Author Role" value={form.authorRole} onChange={v => set("authorRole", v)} placeholder="English Instructor" />
          </div>

          {/* Published toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="text-sm font-semibold text-slate-900">Published</p>
              <p className="text-xs text-slate-400 mt-0.5">Visible to visitors on the blog page</p>
            </div>
            <button onClick={() => set("published", !form.published)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.published ? "bg-blue-600" : "bg-slate-300"}`}>
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${form.published ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={() => onSave(form)} disabled={!form.title.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white rounded-xl text-sm font-semibold transition-colors">
            <Save className="w-4 h-4" />
            {isEdit ? "Save Changes" : "Publish Post"}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:border-slate-300 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminBlogSection() {
  const { siteData, updateSection } = useSiteData();
  const posts = siteData.blogs || [];
  const [modal, setModal] = useState(null);

  const savePost = (form) => {
    if (!form.title.trim()) return;
    let updated;
    if (form.id) {
      updated = posts.map(p => p.id === form.id ? { ...p, ...form } : p);
    } else {
      const newPost = {
        ...form,
        id: Date.now().toString(),
        slug: slugify(form.title),
        publishedAt: new Date().toISOString(),
      };
      updated = [newPost, ...posts];
    }
    updateSection("blogs", updated);
    setModal(null);
  };

  const deletePost = (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    updateSection("blogs", posts.filter(p => p.id !== id));
  };

  const togglePublished = (post) => {
    updateSection("blogs", posts.map(p => p.id === post.id ? { ...p, published: !p.published } : p));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
          <p className="text-sm text-slate-500 mt-0.5">{posts.length} total · {posts.filter(p => p.published).length} published</p>
        </div>
        <button onClick={() => setModal({})}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* Post list */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-900 mb-1">No blog posts yet</p>
          <p className="text-sm text-slate-400 mb-4">Click "New Post" to write your first article.</p>
          <button onClick={() => setModal({})}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors">
            <Plus className="w-4 h-4" /> Create first post
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start gap-4 hover:border-slate-300 transition-colors">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-900 to-blue-700 flex items-center justify-center shrink-0 overflow-hidden">
                {post.coverImage
                  ? <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                  : <FileText className="w-6 h-6 text-white/40" />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-1">{post.title}</h3>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[post.category] || "bg-slate-100 text-slate-600"}`}>
                    {post.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 mb-1.5">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{post.author}</span>
                  <span>·</span>
                  <span>{post.readTime} read</span>
                  <span>·</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => togglePublished(post)}
                  title={post.published ? "Live — click to unpublish" : "Draft — click to publish"}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    post.published ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                  {post.published ? <Globe className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {post.published ? "Live" : "Draft"}
                </button>
                <button onClick={() => setModal(post)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="Edit">
                  <Edit3 className="w-4 h-4" />
                </button>
                <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer"
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors" title="View">
                  <Eye className="w-4 h-4" />
                </a>
                <button onClick={() => deletePost(post.id, post.title)} className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal !== null && <PostModal post={modal} onSave={savePost} onClose={() => setModal(null)} />}
    </div>
  );
}

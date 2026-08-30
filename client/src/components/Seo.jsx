import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const SITE_ORIGIN = "https://www.kutaisi-english-academy.ge";
export const SITE_NAME = "Kutaisi English Academy";

/** Create-or-update a single head tag, keyed by its selector. */
function upsert(tag, selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(tag);
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
}

const meta = (selector, attrs) => upsert("meta", selector, attrs);
const link = (selector, attrs) => upsert("link", selector, attrs);

/**
 * Per-route document head. The static tags in index.html cover the home page
 * and give crawlers a correct first paint; this keeps title, description,
 * canonical and Open Graph in step as the visitor navigates the SPA.
 *
 * @param {{
 *   title?: string,        // page name — the brand suffix is added here
 *   description?: string,
 *   image?: string,        // absolute or root-relative
 *   type?: string,
 *   noIndex?: boolean
 * }} props
 */
export function Seo({ title, description, image, type = "website", noIndex = false }) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Professional English Courses in Kutaisi, Georgia`;

    const url = `${SITE_ORIGIN}${pathname === "/" ? "/" : pathname.replace(/\/$/, "")}`;
    const ogImage = image
      ? image.startsWith("http")
        ? image
        : `${SITE_ORIGIN}${image}`
      : `${SITE_ORIGIN}/og-image.png`;

    if (description) {
      meta('meta[name="description"]', { name: "description", content: description });
      meta('meta[property="og:description"]', { property: "og:description", content: description });
      meta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    }

    meta('meta[property="og:title"]', { property: "og:title", content: document.title });
    meta('meta[name="twitter:title"]', { name: "twitter:title", content: document.title });
    meta('meta[property="og:type"]', { property: "og:type", content: type });
    meta('meta[property="og:url"]', { property: "og:url", content: url });
    meta('meta[property="og:image"]', { property: "og:image", content: ogImage });
    meta('meta[name="twitter:image"]', { name: "twitter:image", content: ogImage });
    link('link[rel="canonical"]', { rel: "canonical", href: url });
    meta('meta[name="robots"]', {
      name: "robots",
      content: noIndex
        ? "noindex, nofollow"
        : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    });
  }, [title, description, image, type, noIndex, pathname]);

  return null;
}

/**
 * Photography library.
 *
 * The academy has no photo shoot of its own yet, so editorial imagery is
 * served from the Unsplash CDN. Two rules keep that honest and fast:
 *
 *  1. Every id below was checked to resolve — nothing here is a guess.
 *  2. Nothing is hot-linked at full size. `stock()` asks the CDN for the exact
 *     width we render at and for `auto=format`, so modern browsers get AVIF or
 *     WebP instead of the original JPEG. <StockImage> builds the srcset.
 *
 * When the academy supplies real photography, swap the ids here — no component
 * touches an image URL directly.
 */

const CDN = "https://images.unsplash.com/photo-";

/** Widths offered to the browser. Anything wider is wasted on a 1440px layout. */
export const STOCK_WIDTHS = [640, 960, 1280, 1920];

/**
 * @param {string} id Unsplash photo id
 * @param {{ w?: number, h?: number, q?: number }} [opts]
 * @returns {string} CDN URL sized for the slot it fills
 */
export function stock(id, { w = 1280, h, q = 68 } = {}) {
  const params = new URLSearchParams({ auto: "format", fit: "crop", w: String(w), q: String(q) });
  if (h) params.set("h", String(h));
  return `${CDN}${id}?${params.toString()}`;
}

/**
 * Semantic names, not filenames — a component asks for `PHOTOS.classroom`,
 * never for "photo-1524178…". Keeps the site from repeating one image twice on
 * the same page and makes a re-shoot a one-file change.
 */
export const PHOTOS = {
  /** Adult class listening to a lecturer. */
  classroom: "1524178232363-1fb2b075b655",
  /** Young learners at desks with a teacher. */
  youngLearners: "1509062522246-3755977927d7",
  /** Children writing at a shared table. */
  writingClass: "1588072432836-e10032774350",
  /** Teacher at the blackboard, full class. */
  teacherAtBoard: "1577896851231-70ef18881754",
  /** Three students laughing over laptops. */
  studyGroup: "1522202176988-66273c2fd55f",
  /** Four friends talking around a café table. */
  conversation: "1543269865-cbf427effbad",
  /** Small group taking notes around a wooden table. */
  discussion: "1517048676732-d65bc937f952",
  /** Team at a whiteboard covered in sticky notes. */
  workshop: "1552664730-d307ca884978",
  /** Students working together in a book-lined room. */
  libraryStudy: "1523240795612-9a054b0db644",
  /** Wall of old books. */
  libraryShelves: "1507842217343-583bb7270b66",
  /** Stack of coloured textbooks. */
  textbooks: "1497633762265-9d179a990aa6",
  /** Open book and notebook in front of a bookcase. */
  openBooks: "1456513080510-7bf3a84b82f8",
  /** Hand writing in a notebook beside a coffee cup. */
  writingByHand: "1434030216411-0b793f4b4173",
  /** Hands pointing at a laptop screen. */
  onlineLesson: "1516321318423-f06f85e504b3",
  /** Notes, laptop and pen — planning a course. */
  planning: "1454165804606-c3d57bc86b40",
  /** Graduates throwing caps against a city skyline. */
  graduation: "1541339907198-e08756dedf3f",
  /** Vintage desk globe. */
  globe: "1521295121783-8a321d551ad2",
  /** Child reading against a tree at sunset. */
  readingAtSunset: "1491841550275-ad7854e35ca6",
  /** "Love to learn" pencil sign. */
  loveToLearn: "1546410531-bb4caa6b424d",
};

/**
 * Ready-made 1920px page-hero backdrops. `PageHero` renders these behind a
 * navy scrim at 25% opacity, so they only ever need one size.
 */
export const HERO_BACKDROPS = {
  about: stock(PHOTOS.libraryStudy, { w: 1920, q: 60 }),
  courses: stock(PHOTOS.textbooks, { w: 1920, q: 60 }),
  teachers: stock(PHOTOS.teacherAtBoard, { w: 1920, q: 60 }),
  whyUs: stock(PHOTOS.workshop, { w: 1920, q: 60 }),
  testimonials: stock(PHOTOS.conversation, { w: 1920, q: 60 }),
  contact: stock(PHOTOS.discussion, { w: 1920, q: 60 }),
  faq: stock(PHOTOS.libraryShelves, { w: 1920, q: 60 }),
  enroll: stock(PHOTOS.graduation, { w: 1920, q: 60 }),
  blog: stock(PHOTOS.openBooks, { w: 1920, q: 60 }),
  englishTest: stock(PHOTOS.writingByHand, { w: 1920, q: 60 }),
  courseDetail: stock(PHOTOS.classroom, { w: 1920, q: 60 }),
};

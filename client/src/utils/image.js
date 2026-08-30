/**
 * Client-side image preparation for CMS uploads.
 *
 * Site content lives in a single Firestore document, which is capped at 1 MiB,
 * so an uploaded photo is downscaled and re-encoded in the browser until it
 * fits a byte budget. Nothing leaves the device before it is compressed.
 */

const DEFAULTS = {
  maxDim: 1600,        // longest edge, in CSS pixels
  maxBytes: 240_000,   // budget for the resulting data URL
  qualities: [0.82, 0.72, 0.62, 0.5],
};

export const MAX_SOURCE_BYTES = 6 * 1024 * 1024;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode-failed"));
    };
    img.src = url;
  });
}

function draw(img, width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

/**
 * @param {File} file
 * @param {{ maxDim?: number, maxBytes?: number }} [options]
 * @returns {Promise<{ dataUrl: string, width: number, height: number, bytes: number }>}
 */
export async function compressImage(file, options = {}) {
  const { maxDim, maxBytes, qualities } = { ...DEFAULTS, ...options };
  const img = await loadImage(file);

  let scale = Math.min(maxDim / Math.max(img.width, img.height), 1);
  let best = null;

  // Drop quality first, then resolution — quality is the cheaper trade.
  for (let attempt = 0; attempt < 4; attempt++) {
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));
    const canvas = draw(img, width, height);

    for (const quality of qualities) {
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      const bytes = dataUrl.length;
      if (!best || bytes < best.bytes) best = { dataUrl, width, height, bytes };
      if (bytes <= maxBytes) return { dataUrl, width, height, bytes };
    }
    scale *= 0.75;
  }

  return best;
}

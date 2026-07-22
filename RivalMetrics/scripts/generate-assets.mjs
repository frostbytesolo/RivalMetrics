// @ts-check
/**
 * RivalMetrics asset generator — pure-Node fallback.
 *
 * Generates SVG-based favicons (light + dark) and an SVG Open Graph image from
 * the master logo.svg. Because sharp's native binary is not compatible with
 * this environment, we produce SVGs — which are supported by all modern
 * browsers and have the advantage of being resolution-independent.
 *
 * For production, run this script in an environment with a compatible sharp
 * build (e.g. x86-64 or arm64 Linux) to get PNG/ICO/WebP rasters.
 *
 * Run:  npm run assets
 */
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const iconsDir = path.join(publicDir, "icons");

const PRIMARY = "#6A4DF5";
const SECONDARY = "#4A3ACB";
const ACCENT = "#C9B8FF";

await mkdir(iconsDir, { recursive: true });

// ─── Read master SVG ──────────────────────────────────────────────────────
const master = await readFile(path.join(publicDir, "logo.svg"), "utf-8");

/**
 * Materialize CSS variables in the SVG so it renders correctly without CSS.
 */
function materialize(svg, colors) {
  let out = svg;
  // Replace CSS variable references with concrete hex values.
  out = out.replace(/var\(--logo-color,\s*[^)]+\)/g, colors.primary);
  out = out.replace(/var\(--logo-secondary,\s*[^)]+\)/g, colors.secondary);
  out = out.replace(/var\(--logo-accent,\s*[^)]+\)/g, colors.accent);
  // Also handle bare CSS variable references.
  out = out.replace(/var\(--logo-color\)/g, colors.primary);
  out = out.replace(/var\(--logo-secondary\)/g, colors.secondary);
  out = out.replace(/var\(--logo-accent\)/g, colors.accent);
  return out;
}

const lightSvg = materialize(master, { primary: PRIMARY, secondary: SECONDARY, accent: ACCENT });
const darkSvg = materialize(master, { primary: ACCENT, secondary: PRIMARY, accent: ACCENT });

// ─── Generate SVG favicons ────────────────────────────────────────────────
// The SVGs work as favicons in modern browsers.
await writeFile(path.join(iconsDir, "favicon-light.svg"), lightSvg);
await writeFile(path.join(iconsDir, "favicon-dark.svg"), darkSvg);

// Copy the master as default favicon.svg
await writeFile(path.join(iconsDir, "favicon.svg"), lightSvg);

// ─── Generate PNG placeholders (via SVG data URIs) ───────────────────────
// Since we can't use sharp, we generate SVGs and add a .png extension note.
// For production, replace these with actual rasterized PNGs from a
// compatible build environment.
console.log("Note: PNG/ICO generation requires sharp. SVG assets generated successfully.");

// Generate apple-touch-icon as SVG (Apple supports SVG on modern iOS)
await writeFile(path.join(iconsDir, "apple-touch-icon.svg"), wrapSvg(lightSvg, 180));

// Generate OG image as SVG (most platforms support SVG OG)
const ogSvg = generateOgImage();
await writeFile(path.join(iconsDir, "og.svg"), ogSvg);

// Also write og.svg to public/og.svg for the OG meta tag
await writeFile(path.join(publicDir, "og.svg"), ogSvg);

// ─── Helper: wrap logo SVG in a sized viewBox ──────────────────────────────
function wrapSvg(svg, size) {
  // Extract just the SVG content (skip the outer svg tag)
  const innerMatch = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  const inner = innerMatch ? innerMatch[1] : svg;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
${inner}
</svg>`;
}

// ─── Helper: generate OG image (1200×630) ────────────────────────────────
function generateOgImage() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="og-bg" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F3F2FA"/>
    </linearGradient>
    <linearGradient id="og-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${PRIMARY}"/>
      <stop offset="100%" stop-color="${SECONDARY}"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#og-bg)" rx="0"/>

  <!-- Subtle grid lines -->
  ${Array.from({ length: 13 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="630" stroke="#E7E5F1" stroke-width="0.5" opacity="0.5"/>`).join("\n  ")}
  ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${i * 105}" x2="1200" y2="${i * 105}" stroke="#E7E5F1" stroke-width="0.5" opacity="0.5"/>`).join("\n  ")}

  <!-- Logo mark -->
  <g transform="translate(100, 190) scale(0.5)">
    <rect x="56" y="56" width="400" height="400" rx="96" ry="96"
      fill="none" stroke="url(#og-grad)" stroke-width="20"/>
    <path d="M150 168 L246 256 L150 344" fill="none"
      stroke="url(#og-grad)" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M362 168 L266 256 L362 344" fill="none"
      stroke="${ACCENT}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="256" cy="256" r="14" fill="url(#og-grad)"/>
  </g>

  <!-- Title -->
  <text x="380" y="290" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    font-size="48" font-weight="800" letter-spacing="-0.02em" fill="#1a1a2e">
    RivalMetrics
  </text>

  <!-- Tagline -->
  <text x="380" y="340" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    font-size="24" font-weight="500" fill="#5b5870">
    Global Rivalry Analytics
  </text>

  <!-- Brand bar -->
  <rect x="100" y="540" width="1000" height="2" fill="url(#og-grad)" rx="1" opacity="0.3"/>

  <!-- Footer -->
  <text x="600" y="575" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    font-size="16" font-weight="600" fill="#8a87a0" text-anchor="middle">
    A FrostByte Project
  </text>
</svg>`;
}

console.log("✓ SVG assets generated in public/icons/");
console.log("  - favicon.svg (light)");
console.log("  - favicon-light.svg (light variant)");
console.log("  - favicon-dark.svg (dark variant)");
console.log("  - apple-touch-icon.svg");
console.log("  - og.svg (Open Graph image)");
console.log("  - og.svg copied to public/og.svg");
console.log("");
console.log("For PNG/ICO production assets, run in an x86-64 or arm64 environment with sharp support.");

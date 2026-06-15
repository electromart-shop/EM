/**
 * Returns the correct asset path for deployment.
 *
 * - For Vercel / standard hosting: images are served from the root.
 * - No /EM prefix is needed since the app is deployed at the root domain.
 *
 * For local images stored in public/products/, the path from products.json
 * (e.g., "/products/arduino-uno-r3-1.webp") maps directly to the file.
 */
export function getAssetPath(path: string): string {
  if (!path || path.trim() === "") return "";

  // External URLs pass through unchanged
  if (path.startsWith("http")) return path;

  // Normalise: lowercase + spaces → hyphens (matches stored filenames)
  const normalised = path.toLowerCase().replace(/\s+/g, "-");

  return normalised.startsWith("/") ? normalised : `/${normalised}`;
}

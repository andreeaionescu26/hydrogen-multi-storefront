/**
 * Because the same collection concept (e.g. "Freestanding Bioethanol
 * Fireplaces") exists multiple times in Shopify Admin — once per storefront
 * (ScandiFlames / Electric / Bio) — and Shopify's metaobject reference
 * picker only ever shows a title + thumbnail (no tags, no metafields, no
 * internal notes field on Collections), we disambiguate them in Admin by
 * prefixing the title, e.g.:
 *
 *   [SF] Freestanding Bioethanol Fireplaces   → ScandiFlames
 *   [EF] Freestanding Bioethanol Fireplaces   → Electric Fireplaces
 *   [BIO] Freestanding Bioethanol Fireplaces  → Bio / Gas
 *
 * This prefix is an Admin-only convenience and must never reach a customer.
 * Anywhere `collection.title` is rendered on the storefront (page headings,
 * card labels, meta titles, predictive search, etc.), run it through
 * `displayTitle()` first.
 */
const STOREFRONT_PREFIX = /^\[[A-Za-z0-9]+\]\s*/;

export function displayTitle(title) {
  if (!title) return title;
  return title.replace(STOREFRONT_PREFIX, '');
}

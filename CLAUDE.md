# Hydrogen Multi-Storefront Project

## Overview

This is a Shopify Hydrogen storefront that supports **multiple storefronts from a single codebase**. Two (or more) Hydrogen storefronts deploy from `main` via Oxygen, each with different env vars that drive different content and navigation.

## Tech Stack

- Shopify Hydrogen 2026.1.0
- React Router 7
- JavaScript (JSX) — no TypeScript
- Tailwind CSS 4
- Deployed on Shopify Oxygen

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run codegen` — regenerate GraphQL types (generates `.d.ts` files, used for reference only)
- `npm run lint` — ESLint

## Architecture: Multi-Storefront Differentiation

### Env-Var Driven Identity

Each Oxygen deployment gets its own env vars. The single key that drives content differentiation is `STOREFRONT_HANDLE`:

| Variable | Storefront 1 | Variant B |
|---|---|---|
| `STOREFRONT_HANDLE` | `default` | `variant-b` |
| `HEADER_MENU_HANDLE` | `main-menu` | `main-menu-variant-b` |
| `FOOTER_MENU_HANDLE` | `footer` | `footer-variant-b` |

These are typed in `env.d.ts` and defaulted in `.env` for local dev.

### Per-Storefront Menus

`app/root.tsx` reads `HEADER_MENU_HANDLE` and `FOOTER_MENU_HANDLE` from env vars (with fallbacks to `main-menu` and `footer`). Navigation menus are created in Shopify Admin with matching handles.

### Metaobjects CMS

Content is driven by two patterns depending on whether a Shopify resource exists for the route.

---

#### Pages (Shopify Page resources)

Shopify Pages are the source of truth. Each Page resource has **per-storefront metafields** that point to a `route` metaobject (`[HYDROGEN DEMO] Sections wrapper`), which holds the sections list.

**Data chain:**
```
Page resource
  └─ metafield(namespace: "{storefrontHandle}", key: "sections")
       └─ reference → Metaobject (type: "route")
            └─ field(key: "sections") → list of section metaobjects
```

- The page route (`app/routes/($locale).pages.$handle.tsx`) queries the page and drills into `sectionsWrapper.reference.sections`
- Pages are created in Shopify Admin and automatically become routes — no code change needed
- Each Page has a metafield definition per storefront (e.g. `namespace: "default"` and `namespace: "variant-b"`)

---

#### Index / Home page

The homepage has no Page resource, so it uses a dedicated metaobject type: `hydrogen_demo_index_wrapper`.

**Data chain:**
```
metaobjects(type: "hydrogen_demo_index_wrapper")
  └─ filter: field(key: "storefront_handle").value === STOREFRONT_HANDLE
       └─ field(key: "sections") → list of section metaobjects
```

- The loader fetches all `hydrogen_demo_index_wrapper` entries and matches on `storefront_handle` field
- Each storefront has one entry (e.g. storefront_handle = `default`, storefront_handle = `variant-b`)

---

### Metaobject Definitions in Shopify Admin

**Settings > Custom data > Metaobjects** (enable storefront access on all):

| Display name | Type | Key fields |
|---|---|---|
| `[HYDROGEN DEMO] Index wrapper` | `hydrogen_demo_index_wrapper` | `title`, `sections` (list.metaobject_reference), `storefront_handle` (single_line_text) |
| `[HYDROGEN DEMO] Sections wrapper` | `route` | `title`, `sections` (list.metaobject_reference) |
| `[HYDROGEN DEMO] Section - hero` | `section_hero` | TBD |
| `[HYDROGEN DEMO] Section - featured products` | `section_featured_products` | TBD |
| `[HYDROGEN DEMO] Section - featured collections` | `section_featured_collections` | TBD |
| `[HYDROGEN DEMO] Section - contact form` | `section_contact_form` | TBD |

**Page metafield definitions** (Settings > Custom data > Pages):

One metafield definition per storefront, each of type Metaobject (referencing `route`):
- Namespace: `default`, Key: `sections` → for Storefront 1
- Namespace: `variant-b`, Key: `sections` → for Variant B

---

### Section Registry Pattern

`app/sections/Sections.tsx` is the **single registry** for all section types. It aggregates fragments and maps metaobject types to components. Unknown types fall back to displaying `type: heading` so content is never invisible.

**Why all fragments live in `SECTIONS_FRAGMENT`:**
Shopify's Storefront API returns every section metaobject as the same `Metaobject` GraphQL type — there are no separate types per definition. So we spread all section fragments onto every node and get `null` back for fields that don't belong to a given definition. Each component only uses its own fields.

**To add a new section type (e.g. `section_text_with_image`):**
1. Create the metaobject definition in Shopify Admin
2. Create `app/sections/SectionTextWithImage.tsx` — export the component + `SECTION_TEXT_WITH_IMAGE_FRAGMENT`
3. In `Sections.tsx`:
   - Import the component and fragment
   - Add `section_text_with_image: SectionTextWithImage` to `SECTION_REGISTRY`
   - Spread `${SECTION_TEXT_WITH_IMAGE_FRAGMENT}` into `SECTIONS_FRAGMENT`
4. Run `npm run codegen`

The `Sections` component and `SECTIONS_FRAGMENT` can be used in **any route** — pages, collections, products — by querying the relevant metafield and passing it to `<Sections sections={...} />`.

---

### Adding a New Page (Zero Code Changes)

1. Create a Shopify Page in Admin (e.g. handle `about`)
2. Set the per-storefront metafields on the page pointing to a `route` metaobject
3. Create `route` metaobject entries and add section metaobjects — the `/pages/about` route already exists

---

### Adding a New Storefront (Zero Code Changes)

1. Create a new storefront in Shopify Admin, connect same GitHub repo
2. Set env vars in Oxygen:
   - `STOREFRONT_HANDLE=storefront-3`
   - `HEADER_MENU_HANDLE=main-menu-storefront-3`
   - `FOOTER_MENU_HANDLE=footer-storefront-3`
3. Create navigation menus in Shopify Admin
4. Add a `hydrogen_demo_index_wrapper` entry with `storefront_handle = storefront-3`
5. Add metafield definitions on Pages for `namespace: storefront-3`
6. Push to `main` — new storefront deploys with its own content automatically

---

## Project Structure (Key Paths)

```
app/
  components/EditRoute.tsx        — dev-only edit link to Shopify admin
  lib/fragments.ts                — shared GraphQL fragments (cart, menu, product)
  routes/($locale)._index.tsx     — homepage (hydrogen_demo_index_wrapper-driven)
  routes/($locale).pages.$handle  — pages route (Page resource + metafield sections)
  sections/Sections.tsx           — registry-based section renderer + SECTIONS_FRAGMENT
  sections/Section*.tsx           — section components (registered in Sections.tsx)
env.d.ts                          — Env type extensions
.env                              — local dev defaults
```

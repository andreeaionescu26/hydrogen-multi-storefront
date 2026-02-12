# Hydrogen Multi-Storefront Project

## Overview

This is a Shopify Hydrogen storefront that supports **multiple storefronts from a single codebase**. Two (or more) Hydrogen storefronts deploy from `main` via Oxygen, each with different env vars that drive different content and navigation.

## Tech Stack

- Shopify Hydrogen 2026.1.0
- React Router 7
- TypeScript
- Tailwind CSS 4
- Deployed on Shopify Oxygen

## Commands

- `npm run dev` — local dev server with codegen
- `npm run build` — production build
- `npm run typecheck` — run `react-router typegen && tsc --noEmit`
- `npm run codegen` — regenerate GraphQL types
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

### Metaobjects CMS (Route-Based Content)

Based on the [Shopify Metaobjects CMS cookbook](https://shopify.dev/docs/storefronts/headless/hydrogen/cookbook/metaobjects). Standalone pages (homepage, about, etc.) use `route` metaobjects.

**How it works:**
1. A `route` metaobject definition has a `sections` field (list of metaobject references)
2. Each section is a metaobject: `section_hero`, `section_featured_products`, `section_featured_collections`
3. The route handle follows the convention: `{page}-{storefrontHandle}` (e.g. `home-default`, `home-variant-b`)
4. The loader fetches the route metaobject and `<RouteContent>` renders its sections dynamically

**Key files:**
- `app/sections/RouteContent.tsx` — fetches route metaobject, renders sections, exports `ROUTE_CONTENT_QUERY`
- `app/sections/Sections.tsx` — dynamic section renderer (switch on `section.type`)
- `app/sections/SectionHero.tsx` — hero banner with background image + CTA
- `app/sections/SectionFeaturedProducts.tsx` — product grid
- `app/sections/SectionFeaturedCollections.tsx` — collection grid
- `app/utils/parseSection.ts` — recursively parses metaobject fields into usable data
- `app/components/EditRoute.tsx` — dev/preview "Edit Route" button linking to Shopify admin

### Metaobject Definitions in Shopify Admin

Create these in **Settings > Custom data > Metaobjects** (enable storefront access on all):

1. **`route`** — `title` (single_line_text_field), `sections` (list.metaobject_reference)
2. **`section_hero`** — `heading`, `subheading` (single_line_text_field), `image` (file_reference), `link` (metaobject_reference to `link`)
3. **`section_featured_products`** — `heading`, `body` (single_line_text_field), `products` (list.product_reference), `with_product_prices` (boolean)
4. **`section_featured_collections`** — `heading` (single_line_text_field), `collections` (list.collection_reference)
5. **`link`** — `text`, `href`, `target` (single_line_text_field)

### Scaling Content to Other Routes

#### Standalone pages (no existing resource)

Use the route metaobject pattern. Create a new route file:

```tsx
// app/routes/($locale).about.tsx
import {useLoaderData} from 'react-router';
import {ROUTE_CONTENT_QUERY, RouteContent} from '~/sections/RouteContent';

export async function loader({context}: Route.LoaderArgs) {
  const storefrontHandle = context.env.STOREFRONT_HANDLE || 'default';
  const {route} = await context.storefront.query(ROUTE_CONTENT_QUERY, {
    variables: {handle: `about-${storefrontHandle}`},
  });
  return {route};
}

export default function About() {
  const {route} = useLoaderData<typeof loader>();
  return <RouteContent route={route} />;
}
```

Then create route metaobject entries: `about-default`, `about-variant-b`.

#### Resource pages (products, collections, pages)

For pages that already have a Shopify resource, attach sections as **metafields on the resource** instead of using a separate route metaobject:

1. **Shopify Admin** > Settings > Custom data > Products > Add definition:
   - Key: `sections`, Type: `list.metaobject_reference`

2. Add the metafield to the existing product query:
   ```graphql
   product(handle: $handle) {
     # ... existing fields
     sections: metafield(namespace: "custom", key: "sections") {
       references(first: 10) {
         nodes {
           ... on Metaobject {
             id
             type
             ...SectionHero
             ...SectionFeaturedProducts
             ...SectionFeaturedCollections
           }
         }
       }
     }
   }
   ```

3. Render alongside the product: `{product.sections && <Sections sections={product.sections} />}`

This works the same way for collections, pages, or any resource that supports metafields. No extra API call needed — sections come back in the same query.

### Adding a New Section Type

1. Create a metaobject definition in Shopify Admin (e.g. `section_rich_text`)
2. Create `app/sections/SectionRichText.tsx` with the component + GraphQL fragment
3. Register in `app/sections/Sections.tsx` switch statement + add fragment to `SECTIONS_FRAGMENT`

### Adding a New Storefront (Zero Code Changes)

1. Create a new storefront in Shopify Admin, connect same GitHub repo
2. Set env vars in Oxygen:
   - `STOREFRONT_HANDLE=storefront-3`
   - `HEADER_MENU_HANDLE=main-menu-storefront-3`
   - `FOOTER_MENU_HANDLE=footer-storefront-3`
3. Create navigation menus with those handles in Shopify Admin
4. Create route metaobject entries: `home-storefront-3`, etc.
5. Push to `main` — the new storefront deploys with its own content automatically

## Project Structure (Key Paths)

```
app/
  components/EditRoute.tsx     — dev-only edit link to Shopify admin
  lib/fragments.ts             — shared GraphQL fragments (cart, menu, product)
  routes/($locale)._index.tsx  — homepage (metaobjects-driven)
  sections/                    — CMS section components + RouteContent
  utils/parseSection.ts        — metaobject field parser
env.d.ts                       — Env type extensions
.env                           — local dev defaults
```

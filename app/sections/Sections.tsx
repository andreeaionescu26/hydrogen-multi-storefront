import type {SectionsFragment} from 'storefrontapi.generated';
import {SECTION_HERO_FRAGMENT, SectionHero} from './SectionHero';
import {
  SECTION_FEATURED_PRODUCTS_FRAGMENT,
  SectionFeaturedProducts,
} from './SectionFeaturedProducts';
import {
  SECTION_FEATURED_COLLECTIONS_FRAGMENT,
  SectionFeaturedCollections,
} from './SectionFeaturedCollections';

/**
 * Registry of implemented section components, keyed by metaobject type.
 *
 * To add a new section type:
 *   1. Create app/sections/SectionFoo.tsx — export the component + SECTION_FOO_FRAGMENT
 *   2. Import both here and add to SECTION_REGISTRY
 *   3. Spread SECTION_FOO_FRAGMENT into SECTIONS_FRAGMENT below
 *   4. Run `npm run codegen`
 *
 * Unknown types fall back to displaying the type name + heading.
 */
const SECTION_REGISTRY: Record<
  string,
  React.ComponentType<any>
> = {
  section_hero: SectionHero,
  section_featured_products: SectionFeaturedProducts,
  section_featured_collections: SectionFeaturedCollections,
};

export function Sections({sections}: {sections: SectionsFragment}) {
  const nodes = sections?.references?.nodes ?? [];
  if (!nodes.length) return null;

  return (
    <div className="sections">
      {nodes.map((section) => {
        const Component = SECTION_REGISTRY[section.type];
        if (Component) return <Component {...section} key={section.id} />;
        // Fallback for section types not yet implemented
        return (
          <div
            key={section.id}
            style={{padding: '1rem', border: '1px dashed #ccc', margin: '0.5rem 0'}}
          >
            {section.type}: <strong>{section.heading?.value}</strong>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Aggregates all section fragments.
 * `heading` is fetched at the top level so the fallback renderer always has it,
 * even for section types not yet implemented in code.
 */
export const SECTIONS_FRAGMENT = `#graphql
  fragment Sections on MetaobjectField {
    references(first: 10) {
      nodes {
        ... on Metaobject {
          id
          type
          heading: field(key: "heading") {
            value
          }
          ...SectionHero
          ...SectionFeaturedProducts
          ...SectionFeaturedCollections
        }
      }
    }
  }
  ${SECTION_HERO_FRAGMENT}
  ${SECTION_FEATURED_PRODUCTS_FRAGMENT}
  ${SECTION_FEATURED_COLLECTIONS_FRAGMENT}
`;

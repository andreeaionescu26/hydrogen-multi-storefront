import { SECTION_HERO_FRAGMENT, SectionHero } from "./SectionHero";
import {
  SECTION_FEATURED_PRODUCTS_FRAGMENT,
  SectionFeaturedProducts
} from "./SectionFeaturedProducts";
import {
  SECTION_FEATURED_COLLECTIONS_FRAGMENT,
  SectionFeaturedCollections
} from "./SectionFeaturedCollections";
const SECTION_REGISTRY = {
  section_hero: SectionHero,
  section_featured_products: SectionFeaturedProducts,
  section_featured_collections: SectionFeaturedCollections
};
function Sections({ sections }) {
  const nodes = sections?.references?.nodes ?? [];
  if (!nodes.length) return null;
  return <div className="sections">
      {nodes.map((section) => {
    const Component = SECTION_REGISTRY[section.type];
    if (Component) return <Component {...section} key={section.id} />;
    return <div
      key={section.id}
      style={{ padding: "1rem", border: "1px dashed #ccc", margin: "0.5rem 0" }}
    >
            {section.type}: <strong>{section.heading?.value}</strong>
          </div>;
  })}
    </div>;
}
const SECTIONS_FRAGMENT = `#graphql
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
export {
  SECTIONS_FRAGMENT,
  Sections
};

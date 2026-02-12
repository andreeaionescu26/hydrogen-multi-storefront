import {SECTION_HERO_FRAGMENT, SectionHero} from '~/sections/SectionHero';
import {
  SECTION_FEATURED_PRODUCTS_FRAGMENT,
  SectionFeaturedProducts,
} from '~/sections/SectionFeaturedProducts';
import {
  SECTION_FEATURED_COLLECTIONS_FRAGMENT,
  SectionFeaturedCollections,
} from '~/sections/SectionFeaturedCollections';

import type {SectionsFragment} from 'storefrontapi.generated';

export function Sections({sections}: {sections: SectionsFragment}) {
  return (
    <div className="sections">
      {sections?.references?.nodes.map((section) => {
        switch (section.type) {
          case 'section_hero':
            return <SectionHero {...section} key={section.id} />;
          case 'section_featured_products':
            return <SectionFeaturedProducts {...section} key={section.id} />;
          case 'section_featured_collections':
            return <SectionFeaturedCollections {...section} key={section.id} />;
          default:
            console.log(`Unsupported section type: ${section.type}`);
            return null;
        }
      })}
    </div>
  );
}

export const SECTIONS_FRAGMENT = `#graphql
  fragment Sections on MetaobjectField {
    ... on MetaobjectField {
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
  ${SECTION_HERO_FRAGMENT}
  ${SECTION_FEATURED_PRODUCTS_FRAGMENT}
  ${SECTION_FEATURED_COLLECTIONS_FRAGMENT}
`;

import { SECTION_PAGE_HEADER_FRAGMENT, SectionPageHeader } from "./SectionPageHeader";
import {
  SECTION_LIST_OF_COLLECTIONS_FRAGMENT,
  SectionListOfCollections,
} from "./SectionListOfCollections";

// TODO: rebuild and register once field structure is confirmed the same way
// page header and list of collections were:
//   - cms_section_list_of_products
//
// The old SectionHero / SectionFeaturedProducts / SectionFeaturedCollections
// components were built against demo metaobject types (section_hero,
// section_featured_products, section_featured_collections) that don't match
// this store's real definitions. They're intentionally left out of the
// registry until rebuilt against confirmed real field keys, same process as
// the two sections below.

const SECTION_REGISTRY = {
  cms_section_page_header: SectionPageHeader,
  cms_section_list_of_collections: SectionListOfCollections,
};

function Sections({ sections }) {
  const nodes = sections?.references?.nodes ?? [];
  if (!nodes.length) return null;
  return (
    <div className="sections">
      {nodes.map((section) => {
        const Component = SECTION_REGISTRY[section.type];
        if (!Component) console.log(section);
        return (
          <div
            key={section.id}
            style={{ border: "1px dashed #ccc", margin: "0.5rem 0" }}
          >
            {Component ? (
              <Component {...section} />
            ) : (
              <div style={{ padding: "1rem" }}>
                {section.type}:{" "}
                <strong>
                  {section.heading?.value ?? "Section missing registry"}
                </strong>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
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
          ...SectionPageHeader
          ...SectionListOfCollections
        }
      }
    }
  }
  ${SECTION_PAGE_HEADER_FRAGMENT}
  ${SECTION_LIST_OF_COLLECTIONS_FRAGMENT}
`;

export { SECTIONS_FRAGMENT, Sections };

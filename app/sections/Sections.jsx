import {
  SECTION_PAGE_HEADER_FRAGMENT,
  SectionPageHeader,
} from './SectionPageHeader';

import {
  SECTION_LIST_OF_COLLECTIONS_FRAGMENT,
  SectionListOfCollections,
} from './SectionListOfCollections';

import {
  SECTION_LIST_OF_PRODUCTS_FRAGMENT,
  SectionListOfProducts,
} from './SectionListOfProducts';

import {
  SECTION_LIST_OF_PAGES_FRAGMENT,
  SectionListOfPages,
} from './SectionListOfPages';

import {
  SECTION_TEXT_FULL_WIDTH_FRAGMENT,
  SectionTextFullWidth,
} from './SectionTextFullWidth';

import {
  SECTION_TEXT_MEDIA_FRAGMENT,
  SectionTextMedia,
} from './SectionTextMedia';

import {
  SECTION_TEXT_TWO_COLUMNS_FRAGMENT,
  SectionTextTwoColumns,
} from './SectionTextTwoColumns';

import {
  SECTION_SINGLE_MEDIA_FRAGMENT,
  SectionSingleMedia,
} from './SectionSingleMedia';

import {SECTION_TWO_MEDIA_FRAGMENT, SectionTwoMedia} from './SectionTwoMedia';

import {
  SECTION_RICH_TEXT_WITH_BACKGROUND_FRAGMENT,
  SectionRichTextWithBackground,
} from './SectionRichTextWithBackground';

const SECTION_REGISTRY = {
  cms_section_page_header: SectionPageHeader,
  cms_section_list_of_collections: SectionListOfCollections,
  cms_section_list_of_products: SectionListOfProducts,
  cms_section_list_of_pages: SectionListOfPages,
  cms_section_text_full_width: SectionTextFullWidth,
  cms_section_text_media: SectionTextMedia,
  cms_section_text_two_columns: SectionTextTwoColumns,
  cms_section_single_media: SectionSingleMedia,
  cms_section_two_media: SectionTwoMedia,
  cms_section_rich_text_with_background: SectionRichTextWithBackground,
};

function Sections({sections}) {
  const nodes = sections?.references?.nodes ?? [];
  if (!nodes.length) return null;

  return (
    <div className="sections">
      {nodes.map((section) => {
        const Component = SECTION_REGISTRY[section.type];
        if (!Component);

        return (
          <div
            key={section.id}
            style={{border: '1px dashed #ccc', margin: '0.5rem 0'}}
          >
            {Component ? (
              <Component {...section} />
            ) : (
              <div style={{padding: '1rem'}}>
                {section.type}:{' '}
                <strong>
                  {section.heading?.value ?? 'Section missing registry'}
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
    references(first: 50) {
      nodes {
        ... on Metaobject {
          id
          type
          heading: field(key: "heading") {
            value
          }
          ...SectionPageHeader
          ...SectionListOfCollections
          ...SectionListOfProducts
          ...SectionListOfPages
          ...SectionTextFullWidth
          ...SectionTextMedia
          ...SectionTextTwoColumns
          ...SectionSingleMedia
          ...SectionTwoMedia
          ...SectionRichTextWithBackground
        }
      }
    }
  }
  ${SECTION_PAGE_HEADER_FRAGMENT}
  ${SECTION_LIST_OF_COLLECTIONS_FRAGMENT}
  ${SECTION_LIST_OF_PRODUCTS_FRAGMENT}
  ${SECTION_LIST_OF_PAGES_FRAGMENT}
  ${SECTION_TEXT_FULL_WIDTH_FRAGMENT}
  ${SECTION_TEXT_MEDIA_FRAGMENT}
  ${SECTION_TEXT_TWO_COLUMNS_FRAGMENT}
  ${SECTION_SINGLE_MEDIA_FRAGMENT}
  ${SECTION_TWO_MEDIA_FRAGMENT}
  ${SECTION_RICH_TEXT_WITH_BACKGROUND_FRAGMENT}
`;

export {SECTIONS_FRAGMENT, Sections};

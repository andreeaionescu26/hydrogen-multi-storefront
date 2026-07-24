import {Link} from '~/components/Link';
import {RichText} from '@shopify/hydrogen';
import {displayTitle} from '~/lib/collectionTitle';

function SectionListOfCollections(props) {
  const {header, text, collections, buttonLabel, buttonLink, buttonPageLink} =
    props;

  const collectionNodes = collections?.references?.nodes ?? [];

  const buttonHref = buttonLink?.reference?.handle
    ? `/collections/${buttonLink.reference.handle}`
    : buttonPageLink?.reference?.handle
      ? `/pages/${buttonPageLink.reference.handle}`
      : null;

  const hasTopButton = buttonLabel?.value && buttonHref;

  return (
    <section className="collection-list">
      <div className="collection-list__inner">
        <div className="collection-list__top">
          <div className="collection-list__intro">
            {header?.value && (
              <h2 className="collection-list__heading">{header.value}</h2>
            )}
            {text?.value && (
              <div className="collection-list__text">
                <RichText data={text.value} />
              </div>
            )}
          </div>

          {hasTopButton && (
            <Link
              to={buttonHref}
              prefetch="intent"
              className="collection-list__cta"
            >
              {buttonLabel.value}
            </Link>
          )}
        </div>

        {collectionNodes.length > 0 && (
          <div className="collection-list__grid">
            {collectionNodes.map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.handle}`}
                prefetch="intent"
                className="collection-list__card"
              >
                <div className="collection-list__card-media">
                  {collection.image?.url ? (
                    <img
                      src={collection.image.url}
                      alt={
                        collection.image.altText ??
                        displayTitle(collection.title)
                      }
                      loading="lazy"
                    />
                  ) : (
                    <div className="collection-list__card-placeholder" />
                  )}
                </div>
                <p className="collection-list__card-title">
                  {displayTitle(collection.title)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const SECTION_LIST_OF_COLLECTIONS_FRAGMENT = `#graphql
  fragment SectionListOfCollections on Metaobject {
    header: field(key: "header") { value }
    text: field(key: "text") { value }
    collections: field(key: "collections") {
      references(first: 10) {
        nodes {
          ... on Collection {
            id
            handle
            title
            image { url altText }
          }
        }
      }
    }
    buttonLabel: field(key: "button_label") { value }
    buttonLink: field(key: "button_link") {
      reference {
        ... on Collection { handle }
      }
    }
    buttonPageLink: field(key: "button_page_link") {
      reference {
        ... on Page { handle }
      }
    }
  }
`;

export {SECTION_LIST_OF_COLLECTIONS_FRAGMENT, SectionListOfCollections};

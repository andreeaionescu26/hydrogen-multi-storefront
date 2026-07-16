import { Link } from "~/components/Link";
import { RichText } from "@shopify/hydrogen";

function SectionListOfCollections(props) {
  const { header, text, collections, buttonLabel, buttonLink, buttonPageLink } = props;

  const collectionNodes = collections?.references?.nodes ?? [];

  const buttonHref = buttonLink?.reference?.handle
    ? `/collections/${buttonLink.reference.handle}`
    : buttonPageLink?.reference?.handle
    ? `/pages/${buttonPageLink.reference.handle}`
    : null;

  return (
    <section>
      {header?.value && <h2>{header.value}</h2>}
      {text?.value && <RichText data={text.value} />}

      {collectionNodes.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "1rem",
            overflowX: "auto",
            padding: "1rem 0",
          }}
        >
          {collectionNodes.map((collection) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.handle}`}
              prefetch="intent"
              style={{ flex: "0 0 220px", textDecoration: "none" }}
            >
              {collection.image?.url && (
                <img
                  src={collection.image.url}
                  alt={collection.image.altText ?? collection.title}
                  style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }}
                />
              )}
              <p>{collection.title}</p>
            </Link>
          ))}
        </div>
      )}

      {buttonLabel?.value && buttonHref && (
        <Link to={buttonHref} prefetch="intent">
          {buttonLabel.value}
        </Link>
      )}
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

export { SECTION_LIST_OF_COLLECTIONS_FRAGMENT, SectionListOfCollections };

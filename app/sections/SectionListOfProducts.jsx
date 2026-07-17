import { Link } from "~/components/Link";
import { RichText } from "@shopify/hydrogen";

function SectionListOfProducts(props) {
  const {
    header,
    richText,
    products,
    buttonLabel,
    buttonCollectionLink,
    buttonPageLink,
    buttonProductLink,
  } = props;

  const productNodes = products?.references?.nodes ?? [];

  // Only one of these three should be filled in per entry — use whichever is set
  const buttonHref = buttonCollectionLink?.reference?.handle
    ? `/collections/${buttonCollectionLink.reference.handle}`
    : buttonPageLink?.reference?.handle
    ? `/pages/${buttonPageLink.reference.handle}`
    : buttonProductLink?.reference?.handle
    ? `/products/${buttonProductLink.reference.handle}`
    : null;

  return (
    <section>
      {header?.value && <h2>{header.value}</h2>}
      {richText?.value && <RichText data={richText.value} />}

      {productNodes.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1rem",
          }}
        >
          {productNodes.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.handle}`}
              prefetch="intent"
              style={{ textDecoration: "none" }}
            >
              {product.featuredImage?.url && (
                <img
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }}
                />
              )}
              <p>{product.title}</p>
              {product.priceRange?.minVariantPrice && (
                <p>
                  From {product.priceRange.minVariantPrice.amount}{" "}
                  {product.priceRange.minVariantPrice.currencyCode}
                </p>
              )}
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

const SECTION_LIST_OF_PRODUCTS_FRAGMENT = `#graphql
  fragment SectionListOfProducts on Metaobject {
    header: field(key: "header") { value }
    richText: field(key: "rich_text") { value }
    products: field(key: "products") {
      references(first: 10) {
        nodes {
          ... on Product {
            id
            handle
            title
            featuredImage { url altText }
            priceRange {
              minVariantPrice { amount currencyCode }
            }
          }
        }
      }
    }
    buttonLabel: field(key: "button_label") { value }
    buttonCollectionLink: field(key: "button_collection_link") {
      reference {
        ... on Collection { handle }
      }
    }
    buttonPageLink: field(key: "button_page_link") {
      reference {
        ... on Page { handle }
      }
    }
    buttonProductLink: field(key: "button_product_link") {
      reference {
        ... on Product { handle }
      }
    }
  }
`;

export { SECTION_LIST_OF_PRODUCTS_FRAGMENT, SectionListOfProducts };

import { Money, Image } from "@shopify/hydrogen";
import { Link } from "~/components/Link";
function SectionFeaturedProducts(props) {
  const { heading, body, products, withProductPrices } = props;
  const showPrices = withProductPrices?.value === "true";
  return <section>
      {heading?.value && <h2>{heading.value}</h2>}
      {body?.value && <p>{body.value}</p>}
      {products?.references?.nodes && <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gridGap: "1rem",
      paddingTop: "1rem"
    }}
  >
          {products.references.nodes.map((product) => {
    const variant = product.variants?.nodes?.[0];
    return <Link
      key={product.id}
      to={`/products/${product.handle}`}
      prefetch="intent"
    >
                {variant?.image && <Image data={variant.image} style={{ width: "auto" }} />}
                <h5 style={{ marginBottom: ".5rem" }}>{product.title}</h5>
                {showPrices && <small style={{ display: "flex", marginTop: ".5rem" }}>
                    <span>From</span>&nbsp;
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>}
              </Link>;
  })}
        </div>}
    </section>;
}
const FEATURED_PRODUCT_FRAGMENT = `#graphql
  fragment FeaturedProduct on Product {
    id
    title
    handle
    variants(first: 1) {
      nodes {
        image {
          altText
          width
          height
          url
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;
const SECTION_FEATURED_PRODUCTS_FRAGMENT = `#graphql
  fragment SectionFeaturedProducts on Metaobject {
    heading: field(key: "heading") {
      value
    }
    body: field(key: "body") {
      value
    }
    products: field(key: "products") {
      references(first: 10) {
        nodes {
          ... on Product {
            ...FeaturedProduct
          }
        }
      }
    }
    withProductPrices: field(key: "with_product_prices") {
      value
    }
  }
  ${FEATURED_PRODUCT_FRAGMENT}
`;
export {
  SECTION_FEATURED_PRODUCTS_FRAGMENT,
  SectionFeaturedProducts
};

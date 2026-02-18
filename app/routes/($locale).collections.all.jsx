import { useLoaderData } from "react-router";
import { getPaginationVariables } from "@shopify/hydrogen";
import { PaginatedResourceSection } from "~/components/PaginatedResourceSection";
import { ProductItem } from "~/components/ProductItem";
const meta = () => {
  return [{ title: `Hydrogen | Products` }];
};
async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return { ...deferredData, ...criticalData };
}
async function loadCriticalData({ context, request }) {
  const { storefront } = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8
  });
  const [{ products }] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: { ...paginationVariables }
    })
    // Add other queries here, so that they are loaded in parallel
  ]);
  return { products };
}
function loadDeferredData({ context }) {
  return {};
}
function Collection() {
  const { products } = useLoaderData();
  return <div className="collection">
      <h1>Products</h1>
      <PaginatedResourceSection
    connection={products}
    resourcesClassName="products-grid"
  >
        {({ node: product, index }) => <ProductItem
    key={product.id}
    product={product}
    loading={index < 8 ? "eager" : void 0}
  />}
      </PaginatedResourceSection>
    </div>;
}
const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
`;
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
`;
export {
  Collection as default,
  loader,
  meta
};

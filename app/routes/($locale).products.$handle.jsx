import { useLoaderData } from "react-router";
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam
} from "@shopify/hydrogen";
import { ProductPrice } from "~/components/ProductPrice";
import { ProductImage } from "~/components/ProductImage";
import { ProductForm } from "~/components/ProductForm";
import { redirectIfHandleIsLocalized } from "~/lib/redirect";
const meta = ({ data }) => {
  return [
    { title: `Hydrogen | ${data?.product.title ?? ""}` },
    {
      rel: "canonical",
      href: `/products/${data?.product.handle}`
    }
  ];
};
async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return { ...deferredData, ...criticalData };
}
async function loadCriticalData({ context, params, request }) {
  const { handle } = params;
  const { storefront } = context;
  if (!handle) {
    throw new Error("Expected product handle to be defined");
  }
  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: { handle, selectedOptions: getSelectedProductOptions(request) }
    })
    // Add other queries here, so that they are loaded in parallel
  ]);
  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }
  redirectIfHandleIsLocalized(request, { handle, data: product });
  return {
    product
  };
}
function loadDeferredData({ context, params }) {
  return {};
}
function Product() {
  const { product } = useLoaderData();
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product)
  );
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant
  });
  const { title, descriptionHtml } = product;
  return <div className="product">
      <ProductImage image={selectedVariant?.image} />
      <div className="product-main">
        <h1>{title}</h1>
        <ProductPrice
    price={selectedVariant?.price}
    compareAtPrice={selectedVariant?.compareAtPrice}
  />
        <br />
        <ProductForm
    productOptions={productOptions}
    selectedVariant={selectedVariant}
  />
        <br />
        <br />
        <p>
          <strong>Description</strong>
        </p>
        <br />
        <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
        <br />
      </div>
      <Analytics.ProductView
    data={{
      products: [
        {
          id: product.id,
          title: product.title,
          price: selectedVariant?.price.amount || "0",
          vendor: product.vendor,
          variantId: selectedVariant?.id || "",
          variantTitle: selectedVariant?.title || "",
          quantity: 1
        }
      ]
    }}
  />
    </div>;
}
const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;
const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;
const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;
export {
  Product as default,
  loader,
  meta
};

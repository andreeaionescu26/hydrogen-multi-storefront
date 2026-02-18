import { useLoaderData } from "react-router";
import { Link } from "~/components/Link";
import { getPaginationVariables } from "@shopify/hydrogen";
import { PaginatedResourceSection } from "~/components/PaginatedResourceSection";
const meta = () => {
  return [{ title: `Hydrogen | Blogs` }];
};
async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return { ...deferredData, ...criticalData };
}
async function loadCriticalData({ context, request }) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10
  });
  const [{ blogs }] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        ...paginationVariables
      }
    })
    // Add other queries here, so that they are loaded in parallel
  ]);
  return { blogs };
}
function loadDeferredData({ context }) {
  return {};
}
function Blogs() {
  const { blogs } = useLoaderData();
  return <div className="blogs">
      <h1>Blogs</h1>
      <div className="blogs-grid">
        <PaginatedResourceSection connection={blogs}>
          {({ node: blog }) => <Link
    className="blog"
    key={blog.handle}
    prefetch="intent"
    to={`/blogs/${blog.handle}`}
  >
              <h2>{blog.title}</h2>
            </Link>}
        </PaginatedResourceSection>
      </div>
    </div>;
}
const BLOGS_QUERY = `#graphql
  query Blogs(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    blogs(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        title
        handle
        seo {
          title
          description
        }
      }
    }
  }
`;
export {
  Blogs as default,
  loader,
  meta
};

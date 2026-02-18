import { Pagination } from "@shopify/hydrogen";
function PaginatedResourceSection({
  connection,
  children,
  resourcesClassName
}) {
  return <Pagination connection={connection}>
      {({ nodes, isLoading, PreviousLink, NextLink }) => {
    const resourcesMarkup = nodes.map(
      (node, index) => children({ node, index })
    );
    return <div>
            <PreviousLink>
              {isLoading ? "Loading..." : <span>↑ Load previous</span>}
            </PreviousLink>
            {resourcesClassName ? <div className={resourcesClassName}>{resourcesMarkup}</div> : resourcesMarkup}
            <NextLink>
              {isLoading ? "Loading..." : <span>Load more ↓</span>}
            </NextLink>
          </div>;
  }}
    </Pagination>;
}
export {
  PaginatedResourceSection
};

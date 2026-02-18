import { Image } from "@shopify/hydrogen";
function SectionFeaturedCollections(props) {
  const { heading, collections } = props;
  return <section className="featured-collections">
      {heading?.value && <h2>{heading.value}</h2>}
      {collections?.references?.nodes && <ul style={{ listStyle: "none", padding: 0, display: "flex", gap: "1rem" }}>
          {collections.references.nodes.map((collection) => <li key={collection.id}>
              <a href={`/collections/${collection.handle}`}>
                {collection.image && <Image
    data={collection.image}
    style={{ height: "auto", width: 400 }}
    aspectRatio="1/1"
  />}
                <h5>{collection.title}</h5>
              </a>
            </li>)}
        </ul>}
    </section>;
}
const FEATURED_COLLECTION_FRAGMENT = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    handle
    image {
      altText
      url
      width
      height
    }
  }
`;
const SECTION_FEATURED_COLLECTIONS_FRAGMENT = `#graphql
  fragment SectionFeaturedCollections on Metaobject {
    heading: field(key: "heading") {
      value
    }
    collections: field(key: "collections") {
      references(first: 10) {
        nodes {
          ... on Collection {
            ...FeaturedCollection
          }
        }
      }
    }
  }
  ${FEATURED_COLLECTION_FRAGMENT}
`;
export {
  SECTION_FEATURED_COLLECTIONS_FRAGMENT,
  SectionFeaturedCollections
};

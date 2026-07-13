import { useLoaderData } from "react-router";
import { SECTIONS_FRAGMENT, Sections } from "~/sections/Sections";
const meta = () => {
  return [{ title: "Hydrogen | Home" }];
};
async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return { ...deferredData, ...criticalData };
}
async function loadCriticalData({ context }) {
  const { storefront, env } = context;
  const storefrontHandle = env.STOREFRONT_HANDLE || "default";
  const { metaobjects } = await storefront.query(INDEX_CONTENT_QUERY, {
    variables: {}
  });
  console.log(JSON.stringify(metaobjects, null, 2));
  
  const indexWrapper = metaobjects?.nodes.find(
    (node) => node.storefrontHandle?.value === storefrontHandle
  );
  return { sections: indexWrapper?.sections ?? null };
}
function loadDeferredData({ context }) {
  return {};
}
function Homepage() {
  const { sections } = useLoaderData();
  return <div className="home">
      {sections ? <Sections sections={sections} /> : <p>No content for this storefront.</p>}
    </div>;
}
const INDEX_CONTENT_QUERY = `#graphql
  query IndexContent(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobjects(type: "cms_index_wrapper", first: 10) {
      nodes {
        id
        storefrontHandle: field(key: "storefront_handle") {
          value
        }
        sections: field(key: "sections") {
          ...Sections
        }
      }
    }
  }
  ${SECTIONS_FRAGMENT}
`;
export {
  Homepage as default,
  loader,
  meta
};

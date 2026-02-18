import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';

import {SECTIONS_FRAGMENT, Sections} from '~/sections/Sections';
import type {IndexContentQuery} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  const {storefront, env} = context;
  const storefrontHandle = env.STOREFRONT_HANDLE || 'default';

  const {metaobjects} = await storefront.query(INDEX_CONTENT_QUERY, {
    variables: {},
  });

  // Find the index wrapper entry matching the current storefront
  const indexWrapper = metaobjects?.nodes.find(
    (node) => node.storefrontHandle?.value === storefrontHandle,
  );

  return {sections: indexWrapper?.sections ?? null};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Homepage() {
  const {sections} = useLoaderData<typeof loader>();
  return (
    <div className="home">
      {sections ? (
        <Sections sections={sections} />
      ) : (
        <p>No content for this storefront.</p>
      )}
    </div>
  );
}

const INDEX_CONTENT_QUERY = `#graphql
  query IndexContent(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobjects(type: "hydrogen_demo_index_wrapper", first: 10) {
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
` as const;

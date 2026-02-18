import {useLoaderData} from 'react-router';
import type {Route} from './+types/pages.$handle';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {SECTIONS_FRAGMENT, Sections} from '~/sections/Sections';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.page.title ?? ''}`}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const storefrontHandle = context.env.STOREFRONT_HANDLE || 'default';

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
        storefrontHandle,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});

  return {page};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  // The page metafield (namespace=storefrontHandle, key=sections) references a
  // route metaobject, which in turn holds the sections list.
  const sections =
    page.sectionsWrapper?.reference?.__typename === 'Metaobject'
      ? page.sectionsWrapper.reference.sections
      : null;

  return (
    <div className="page">
      <header>
        <h1>{page.title}</h1>
      </header>
      <main dangerouslySetInnerHTML={{__html: page.body}} />
      {sections && <Sections sections={sections} />}
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!,
    $storefrontHandle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
      sectionsWrapper: metafield(namespace: $storefrontHandle, key: "sections") {
        reference {
          __typename
          ... on Metaobject {
            id
            sections: field(key: "sections") {
              ...Sections
            }
          }
        }
      }
    }
  }
  ${SECTIONS_FRAGMENT}
` as const;

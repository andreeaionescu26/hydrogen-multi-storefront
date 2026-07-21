import {useLoaderData} from 'react-router';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {SECTIONS_FRAGMENT, Sections} from '~/sections/Sections';
const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.page.title ?? ''}`}];
};
async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}
async function loadCriticalData({context, request, params}) {
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
function loadDeferredData({context}) {
  return {};
}
function Page() {
  const {page} = useLoaderData();
  const sections =
    page.sectionsWrapper?.reference?.__typename === 'Metaobject'
      ? page.sectionsWrapper.reference.sections
      : null;
  return (
    <div className="page">{sections && <Sections sections={sections} />}</div>
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
`;
export {Page as default, loader, meta};

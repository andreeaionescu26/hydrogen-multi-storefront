import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';

import {ROUTE_CONTENT_QUERY, RouteContent} from '~/sections/RouteContent';

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

  const [{route}] = await Promise.all([
    storefront.query(ROUTE_CONTENT_QUERY, {
      variables: {handle: `home-${storefrontHandle}`},
    }),
  ]);

  return {route};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Homepage() {
  const {route} = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <RouteContent route={route} />
    </div>
  );
}

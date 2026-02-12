import {useState, useEffect} from 'react';
import {Link, useMatches} from 'react-router';

/**
 * Displays an "Edit Route" button in the top right corner of the page.
 * Opens a new tab to edit the metaobject entry in the Shopify Admin.
 * Only displayed in development or preview branch deployments.
 */
export function EditRoute({routeId}: {routeId: string}) {
  const [url, setUrl] = useState<URL | null>(null);
  const [root] = useMatches();
  // @ts-expect-error data might not have publicStoreSubdomain
  const publicStoreSubdomain = root?.data?.publicStoreSubdomain;

  useEffect(() => {
    setUrl(new URL(window.location.href));
  }, []);

  if (!url || !publicStoreSubdomain) return null;

  const isDev =
    url.hostname.includes('localhost') || url.hostname.includes('127.0.0.1');
  const isPreview = url.hostname.includes('preview');
  const legacyId = routeId.split('/').pop();
  const adminEditUrl = `https://admin.shopify.com/store/${publicStoreSubdomain}/content/entries/route/${legacyId}`;

  const shouldShowEditLink = isDev || isPreview;
  if (!shouldShowEditLink) return null;

  return (
    <Link
      to={adminEditUrl}
      target="_blank"
      rel="noreferrer"
      style={{
        position: 'absolute',
        top: '5rem',
        right: '3rem',
        padding: '0.5rem',
        backgroundColor: 'black',
        color: 'white',
        zIndex: 100,
      }}
    >
      Edit Route
    </Link>
  );
}

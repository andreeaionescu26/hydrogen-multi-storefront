import {useRouteLoaderData} from 'react-router';
const DEFAULT_LOCALE = {
  language: 'EN',
  country: 'GB',
  pathPrefix: '',
};
const SUPPORTED_LOCALES = [
  DEFAULT_LOCALE,
  {language: 'EN', country: 'DE', pathPrefix: '/en'},
  // weird test setup based off ankon.dk Markets
];
function findLocaleByPrefix(prefix) {
  const normalized = '/' + prefix.replace(/^\//, '').toLowerCase();
  return SUPPORTED_LOCALES.find(
    (locale) =>
      locale.pathPrefix !== '' &&
      locale.pathPrefix.toLowerCase() === normalized,
  );
}
function getLocaleFromRequest(request) {
  const url = new URL(request.url);
  const firstSegment = url.pathname.split('/')[1] ?? '';
  if (firstSegment) {
    const match = findLocaleByPrefix(firstSegment);
    if (match) return match;
  }
  return DEFAULT_LOCALE;
}
function useSelectedLocale() {
  const data = useRouteLoaderData('root');
  return data?.selectedLocale ?? DEFAULT_LOCALE;
}
function getPathWithoutLocale(pathname) {
  for (const locale of SUPPORTED_LOCALES) {
    if (
      locale.pathPrefix &&
      pathname.toLowerCase().startsWith(locale.pathPrefix.toLowerCase())
    ) {
      const rest = pathname.slice(locale.pathPrefix.length);
      return rest === '' ? '/' : rest;
    }
  }
  return pathname;
}
function cleanMenuUrl(url, primaryDomainUrl, publicStoreDomain, itemType) {
  const isKnownInternalType = itemType && itemType !== 'HTTP';
  const isInternal =
    isKnownInternalType ||
    url.includes('myshopify.com') ||
    url.includes(publicStoreDomain) ||
    url.includes(primaryDomainUrl);
  if (!isInternal) return url;
  try {
    const pathname = new URL(url).pathname;
    return getPathWithoutLocale(pathname);
  } catch {
    return url;
  }
}
export {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  cleanMenuUrl,
  findLocaleByPrefix,
  getLocaleFromRequest,
  getPathWithoutLocale,
  useSelectedLocale,
};

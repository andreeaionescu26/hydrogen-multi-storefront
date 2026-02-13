import type {I18nBase} from '@shopify/hydrogen';
import {useRouteLoaderData} from 'react-router';
import type {RootLoader} from '~/root';

export interface I18nLocale extends I18nBase {
  pathPrefix: string;
}

export const DEFAULT_LOCALE: I18nLocale = {
  language: 'DA',
  country: 'DK',
  pathPrefix: '',
};

export const SUPPORTED_LOCALES: I18nLocale[] = [
  DEFAULT_LOCALE,
  {language: 'EN', country: 'DE', pathPrefix: '/en'},
];

/**
 * Find a supported locale by its URL path prefix (case-insensitive).
 * Returns undefined if no match.
 */
export function findLocaleByPrefix(
  prefix: string,
): I18nLocale | undefined {
  const normalized = '/' + prefix.replace(/^\//, '').toLowerCase();
  return SUPPORTED_LOCALES.find(
    (locale) =>
      locale.pathPrefix !== '' &&
      locale.pathPrefix.toLowerCase() === normalized,
  );
}

/**
 * Detect locale from the request URL's first path segment.
 * Matches against SUPPORTED_LOCALES prefixes (e.g. `/en`).
 * Falls back to DEFAULT_LOCALE.
 */
export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const firstSegment = url.pathname.split('/')[1] ?? '';

  if (firstSegment) {
    const match = findLocaleByPrefix(firstSegment);
    if (match) return match;
  }

  return DEFAULT_LOCALE;
}

/**
 * Hook to read the current locale from root loader data.
 */
export function useSelectedLocale(): I18nLocale {
  const data = useRouteLoaderData<RootLoader>('root');
  return (data?.selectedLocale as I18nLocale) ?? DEFAULT_LOCALE;
}

/**
 * Strip locale prefix from a pathname.
 * e.g. `/en/products/foo` → `/products/foo`
 */
export function getPathWithoutLocale(pathname: string): string {
  for (const locale of SUPPORTED_LOCALES) {
    if (locale.pathPrefix && pathname.toLowerCase().startsWith(locale.pathPrefix.toLowerCase())) {
      const rest = pathname.slice(locale.pathPrefix.length);
      return rest === '' ? '/' : rest;
    }
  }
  return pathname;
}

/**
 * Clean a Shopify menu URL: strip domain, strip locale prefix.
 * Menu URLs from the Storefront API include the full domain.
 */
export function cleanMenuUrl(
  url: string,
  primaryDomainUrl: string,
  publicStoreDomain: string,
): string {
  const isInternal =
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

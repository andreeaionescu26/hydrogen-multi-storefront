import {findLocaleByPrefix} from '~/lib/i18n';

export async function loader({params}: {params: {locale?: string}}) {
  // If there's a locale param but it doesn't match any supported locale, 404
  if (params.locale && !findLocaleByPrefix(params.locale)) {
    throw new Response(null, {status: 404});
  }

  return null;
}

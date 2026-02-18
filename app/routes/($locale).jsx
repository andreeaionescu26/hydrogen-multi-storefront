import { findLocaleByPrefix } from "~/lib/i18n";
async function loader({ params }) {
  if (params.locale && !findLocaleByPrefix(params.locale)) {
    throw new Response(null, { status: 404 });
  }
  return null;
}
export {
  loader
};

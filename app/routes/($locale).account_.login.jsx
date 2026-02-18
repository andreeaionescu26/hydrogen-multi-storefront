async function loader({ request, context }) {
  const url = new URL(request.url);
  const acrValues = url.searchParams.get("acr_values") || void 0;
  const loginHint = url.searchParams.get("login_hint") || void 0;
  const loginHintMode = url.searchParams.get("login_hint_mode") || void 0;
  const locale = url.searchParams.get("locale") || void 0;
  return context.customerAccount.login({
    countryCode: context.storefront.i18n.country,
    acrValues,
    loginHint,
    loginHintMode,
    locale
  });
}
export {
  loader
};

import { Analytics, getShopAnalytics, useNonce, Script } from "@shopify/hydrogen";
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData
} from "react-router";
import favicon from "~/assets/favicon.svg";
import { FOOTER_QUERY, HEADER_QUERY } from "~/lib/fragments";
import resetStyles from "~/styles/reset.css?url";
import appStyles from "~/styles/app.css?url";
import tailwindCss from "./styles/tailwind.css?url";
import { PageLayout } from "./components/PageLayout";
import { DEFAULT_LOCALE } from "~/lib/i18n";
const shouldRevalidate = ({
  formMethod,
  currentUrl,
  nextUrl,
  currentParams,
  nextParams
}) => {
  if (formMethod && formMethod !== "GET") return true;
  if (currentUrl.toString() === nextUrl.toString()) return true;
  if (currentParams.locale !== nextParams.locale) return true;
  return false;
};
function links() {
  return [
    {
      rel: "preconnect",
      href: "https://cdn.shopify.com"
    },
    {
      rel: "preconnect",
      href: "https://shop.app"
    },
    { rel: "icon", type: "image/svg+xml", href: favicon }
  ];
}
async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  const { storefront, env, customerAccount } = args.context;
  const selectedLocale = storefront.i18n;

  let customerAccessToken = null;
  try {
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (isLoggedIn) {
      customerAccessToken = await customerAccount.getAccessToken();
    }
  } catch (error) {
    customerAccessToken = null;
  }

  return {
    ...deferredData,
    ...criticalData,
    selectedLocale,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    publicAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
    customerAccessToken,
    storefrontHandle: env.STOREFRONT_HANDLE || "default",
    publicStoreSubdomain: env.PUBLIC_STORE_DOMAIN?.replace(
      ".myshopify.com",
      ""
    ),
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: selectedLocale.country,
      language: selectedLocale.language
    }
  };
}
async function loadCriticalData({ context }) {
  const { storefront } = context;
  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: context.env.HEADER_MENU_HANDLE || "main-menu"
      }
    })
    // Add other queries here, so that they are loaded in parallel
  ]);
  return { header };
}
function loadDeferredData({ context }) {
  const { storefront, customerAccount, cart } = context;
  const footer = storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: context.env.FOOTER_MENU_HANDLE || "footer"
    }
  }).catch((error) => {
    console.error(error);
    return null;
  });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer
  };
}
function Layout({ children }) {
  const nonce = useNonce();
  const data = useRouteLoaderData("root");
  const locale = data?.selectedLocale ?? DEFAULT_LOCALE;
  return <html lang={locale.language.toLowerCase()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss} />
        <link rel="stylesheet" href={resetStyles} />
        <link rel="stylesheet" href={appStyles} />
        <Meta />
        <Links />
        <Script
          src="https://cdn.shopify.com/storefront/web-components/account.js"
          type="module"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>;
}
function App() {
  const data = useRouteLoaderData("root");
  if (!data) {
    return <Outlet />;
  }
  return <Analytics.Provider
    cart={data.cart}
    shop={data.shop}
    consent={data.consent}
  >
      <PageLayout
    key={`${data.selectedLocale?.language}-${data.selectedLocale?.country}`}
    {...data}
  >
        <Outlet />
      </PageLayout>
    </Analytics.Provider>;
}
function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = "Unknown error";
  let errorStatus = 500;
  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  return <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>}
    </div>;
}
export {
  ErrorBoundary,
  Layout,
  App as default,
  links,
  loader,
  shouldRevalidate
};

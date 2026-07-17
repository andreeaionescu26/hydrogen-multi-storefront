import { Suspense } from "react";
import { Await, useAsyncValue } from "react-router";
import {
  useAnalytics,
  useOptimisticCart
} from "@shopify/hydrogen";
import { useAside } from "~/components/Aside";
import { Link } from "~/components/Link";
import { cleanMenuUrl } from "~/lib/i18n";
function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
  publicAccessToken,
  customerAccessToken,
  logoUrl,
}) {
  const { shop, menu } = header;
  return <header className="header">
      <Link variant="nav" prefetch="intent" to="/" style={activeLinkStyle} end>
        {logoUrl ? (
          <img src={logoUrl} alt={shop.name} style={{ height: 40 }} />
        ) : (
          <strong>{shop.name}</strong>
        )}
      </Link>
      <HeaderMenu
    menu={menu}
    viewport="desktop"
    primaryDomainUrl={header.shop.primaryDomain.url}
    publicStoreDomain={publicStoreDomain}
  />
      <HeaderCtas
    cart={cart}
    publicStoreDomain={publicStoreDomain}
    publicAccessToken={publicAccessToken}
    customerAccessToken={customerAccessToken}
  />
    </header>;
}
function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain
}) {
  const className = `header-menu-${viewport}`;
  const { close } = useAside();
  return <nav className={className} role="navigation">
      {viewport === "mobile" && <Link
    variant="nav"
    end
    onClick={close}
    prefetch="intent"
    style={activeLinkStyle}
    to="/"
  >
          Home
        </Link>}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
    if (!item.url) return null;
    const url = cleanMenuUrl(item.url, primaryDomainUrl, publicStoreDomain);
    return <Link
      variant="nav"
      className="header-menu-item"
      end
      key={item.id}
      onClick={close}
      prefetch="intent"
      style={activeLinkStyle}
      to={url}
    >
            {item.title}
          </Link>;
  })}
    </nav>;
}
function HeaderCtas({
  cart,
  publicStoreDomain,
  publicAccessToken,
  customerAccessToken
}) {
  return <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <shopify-store
        store-domain={publicStoreDomain}
        public-access-token={publicAccessToken}
        customer-access-token={customerAccessToken || undefined}
      >
        <shopify-account sign-in-url="/account/login"></shopify-account>
      </shopify-store>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>;
}
function HeaderMenuMobileToggle() {
  const { open } = useAside();
  return <button
    className="header-menu-mobile-toggle reset"
    onClick={() => open("mobile")}
  >
      <h3>☰</h3>
    </button>;
}
function SearchToggle() {
  const { open } = useAside();
  return <button className="reset" onClick={() => open("search")}>
      Search
    </button>;
}
function CartBadge({ count }) {
  const { open } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();
  return <a
    href="/cart"
    onClick={(e) => {
      e.preventDefault();
      open("cart");
      publish("cart_viewed", {
        cart,
        prevCart,
        shop,
        url: window.location.href || ""
      });
    }}
  >
      Cart {count === null ? <span>&nbsp;</span> : count}
    </a>;
}
function CartToggle({ cart }) {
  return <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>;
}
function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}
const FALLBACK_HEADER_MENU = {
  id: "gid://shopify/Menu/199655587896",
  items: [
    {
      id: "gid://shopify/MenuItem/461609500728",
      resourceId: null,
      tags: [],
      title: "Collections",
      type: "HTTP",
      url: "/collections",
      items: []
    },
    {
      id: "gid://shopify/MenuItem/461609533496",
      resourceId: null,
      tags: [],
      title: "Blog",
      type: "HTTP",
      url: "/blogs/journal",
      items: []
    },
    {
      id: "gid://shopify/MenuItem/461609566264",
      resourceId: null,
      tags: [],
      title: "Policies",
      type: "HTTP",
      url: "/policies",
      items: []
    },
    {
      id: "gid://shopify/MenuItem/461609599032",
      resourceId: "gid://shopify/Page/92591030328",
      tags: [],
      title: "About",
      type: "PAGE",
      url: "/pages/about",
      items: []
    }
  ]
};
function activeLinkStyle({
  isActive,
  isPending
}) {
  return {
    fontWeight: isActive ? "bold" : void 0,
    color: isPending ? "grey" : "black"
  };
}
export {
  Header,
  HeaderMenu
};

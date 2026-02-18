import { Suspense } from "react";
import { Await } from "react-router";
import { Link } from "~/components/Link";
import { cleanMenuUrl } from "~/lib/i18n";
function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain
}) {
  return <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => <footer className="footer">
            {footer?.menu && header.shop.primaryDomain?.url && <FooterMenu
    menu={footer.menu}
    primaryDomainUrl={header.shop.primaryDomain.url}
    publicStoreDomain={publicStoreDomain}
  />}
          </footer>}
      </Await>
    </Suspense>;
}
function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain
}) {
  return <nav className="footer-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
    if (!item.url) return null;
    const url = cleanMenuUrl(item.url, primaryDomainUrl, publicStoreDomain);
    const isExternal = !url.startsWith("/");
    return isExternal ? <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a> : <Link
      variant="nav"
      end
      key={item.id}
      prefetch="intent"
      style={activeLinkStyle}
      to={url}
    >
            {item.title}
          </Link>;
  })}
    </nav>;
}
const FALLBACK_FOOTER_MENU = {
  id: "gid://shopify/Menu/199655620664",
  items: [
    {
      id: "gid://shopify/MenuItem/461633060920",
      resourceId: "gid://shopify/ShopPolicy/23358046264",
      tags: [],
      title: "Privacy Policy",
      type: "SHOP_POLICY",
      url: "/policies/privacy-policy",
      items: []
    },
    {
      id: "gid://shopify/MenuItem/461633093688",
      resourceId: "gid://shopify/ShopPolicy/23358013496",
      tags: [],
      title: "Refund Policy",
      type: "SHOP_POLICY",
      url: "/policies/refund-policy",
      items: []
    },
    {
      id: "gid://shopify/MenuItem/461633126456",
      resourceId: "gid://shopify/ShopPolicy/23358111800",
      tags: [],
      title: "Shipping Policy",
      type: "SHOP_POLICY",
      url: "/policies/shipping-policy",
      items: []
    },
    {
      id: "gid://shopify/MenuItem/461633159224",
      resourceId: "gid://shopify/ShopPolicy/23358079032",
      tags: [],
      title: "Terms of Service",
      type: "SHOP_POLICY",
      url: "/policies/terms-of-service",
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
    color: isPending ? "grey" : "white"
  };
}
export {
  Footer
};

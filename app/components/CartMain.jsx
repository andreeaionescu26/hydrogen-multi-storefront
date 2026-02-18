import { useOptimisticCart } from "@shopify/hydrogen";
import { Link } from "~/components/Link";
import { useAside } from "~/components/Aside";
import { CartLineItem } from "~/components/CartLineItem";
import { CartSummary } from "./CartSummary";
function getLineItemChildrenMap(lines) {
  const children = {};
  for (const line of lines) {
    if ("parentRelationship" in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ("lineComponents" in line) {
      const children2 = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(children2)) {
        if (!children2[parentId]) children2[parentId] = [];
        children2[parentId].push(...childIds);
      }
    }
  }
  return children;
}
function CartMain({ layout, cart: originalCart }) {
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount = cart && Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? "with-discount" : ""}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);
  return <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details">
        <p id="cart-lines" className="sr-only">
          Line items
        </p>
        <div>
          <ul aria-labelledby="cart-lines">
            {(cart?.lines?.nodes ?? []).map((line) => {
    if ("parentRelationship" in line && line.parentRelationship?.parent) {
      return null;
    }
    return <CartLineItem
      key={line.id}
      line={line}
      layout={layout}
      childrenMap={childrenMap}
    />;
  })}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>;
}
function CartEmpty({
  hidden = false
}) {
  const { close } = useAside();
  return <div hidden={hidden}>
      <br />
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Link to="/collections" onClick={close} prefetch="viewport">
        Continue shopping →
      </Link>
    </div>;
}
export {
  CartMain
};

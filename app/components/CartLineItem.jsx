import { CartForm, Image } from "@shopify/hydrogen";
import { useVariantUrl } from "~/lib/variants";
import { Link } from "~/components/Link";
import { ProductPrice } from "./ProductPrice";
import { useAside } from "./Aside";
function CartLineItem({
  layout,
  line,
  childrenMap
}) {
  const { id, merchandise } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const { close } = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;
  return <li key={id} className="cart-line">
      <div className="cart-line-inner">
        {image && <Image
    alt={title}
    aspectRatio="1/1"
    data={image}
    height={100}
    loading="lazy"
    width={100}
  />}

        <div>
          <Link
    prefetch="intent"
    to={lineItemUrl}
    onClick={() => {
      if (layout === "aside") {
        close();
      }
    }}
  >
            <p>
              <strong>{product.title}</strong>
            </p>
          </Link>
          <ProductPrice price={line?.cost?.totalAmount} />
          <ul>
            {selectedOptions.map((option) => <li key={option.name}>
                <small>
                  {option.name}: {option.value}
                </small>
              </li>)}
          </ul>
          <CartLineQuantity line={line} />
        </div>
      </div>

      {lineItemChildren ? <div>
          <p id={childrenLabelId} className="sr-only">
            Line items with {product.title}
          </p>
          <ul aria-labelledby={childrenLabelId} className="cart-line-children">
            {lineItemChildren.map((childLine) => <CartLineItem
    childrenMap={childrenMap}
    key={childLine.id}
    line={childLine}
    layout={layout}
  />)}
          </ul>
        </div> : null}
    </li>;
}
function CartLineQuantity({ line }) {
  if (!line || typeof line?.quantity === "undefined") return null;
  const { id: lineId, quantity, isOptimistic } = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));
  return <div className="cart-line-quantity">
      <small>Quantity: {quantity} &nbsp;&nbsp;</small>
      <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
        <button
    aria-label="Decrease quantity"
    disabled={quantity <= 1 || !!isOptimistic}
    name="decrease-quantity"
    value={prevQuantity}
  >
          <span>&#8722; </span>
        </button>
      </CartLineUpdateButton>
      &nbsp;
      <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
        <button
    aria-label="Increase quantity"
    name="increase-quantity"
    value={nextQuantity}
    disabled={!!isOptimistic}
  >
          <span>&#43;</span>
        </button>
      </CartLineUpdateButton>
      &nbsp;
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>;
}
function CartLineRemoveButton({
  lineIds,
  disabled
}) {
  return <CartForm
    fetcherKey={getUpdateKey(lineIds)}
    route="/cart"
    action={CartForm.ACTIONS.LinesRemove}
    inputs={{ lineIds }}
  >
      <button disabled={disabled} type="submit">
        Remove
      </button>
    </CartForm>;
}
function CartLineUpdateButton({
  children,
  lines
}) {
  const lineIds = lines.map((line) => line.id);
  return <CartForm
    fetcherKey={getUpdateKey(lineIds)}
    route="/cart"
    action={CartForm.ACTIONS.LinesUpdate}
    inputs={{ lines }}
  >
      {children}
    </CartForm>;
}
function getUpdateKey(lineIds) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join("-");
}
export {
  CartLineItem
};

import { CartForm } from "@shopify/hydrogen";
function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick
}) {
  return <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => <>
          <input
    name="analytics"
    type="hidden"
    value={JSON.stringify(analytics)}
  />
          <button
    type="submit"
    onClick={onClick}
    disabled={disabled ?? fetcher.state !== "idle"}
  >
            {children}
          </button>
        </>}
    </CartForm>;
}
export {
  AddToCartButton
};

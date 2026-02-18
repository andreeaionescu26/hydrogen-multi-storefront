import { useLoaderData, data } from "react-router";
import { CartForm } from "@shopify/hydrogen";
import { CartMain } from "~/components/CartMain";
const meta = () => {
  return [{ title: `Hydrogen | Cart` }];
};
const headers = ({ actionHeaders }) => actionHeaders;
async function action({ request, context }) {
  const { cart } = context;
  const formData = await request.formData();
  const { action: action2, inputs } = CartForm.getFormInput(formData);
  if (!action2) {
    throw new Error("No action provided");
  }
  let status = 200;
  let result;
  switch (action2) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;
      const discountCodes = formDiscountCode ? [formDiscountCode] : [];
      discountCodes.push(...inputs.discountCodes);
      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesAdd: {
      const formGiftCardCode = inputs.giftCardCode;
      const giftCardCodes = formGiftCardCode ? [formGiftCardCode] : [];
      result = await cart.addGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes;
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity
      });
      break;
    }
    default:
      throw new Error(`${action2} cart action is not defined`);
  }
  const cartId = result?.cart?.id;
  const headers2 = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const { cart: cartResult, errors, warnings } = result;
  const redirectTo = formData.get("redirectTo") ?? null;
  if (typeof redirectTo === "string") {
    status = 303;
    headers2.set("Location", redirectTo);
  }
  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId
      }
    },
    { status, headers: headers2 }
  );
}
async function loader({ context }) {
  const { cart } = context;
  return await cart.get();
}
function Cart() {
  const cart = useLoaderData();
  return <div className="cart">
      <h1>Cart</h1>
      <CartMain layout="page" cart={cart} />
    </div>;
}
export {
  action,
  Cart as default,
  headers,
  loader,
  meta
};

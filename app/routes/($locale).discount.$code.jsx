import { redirect } from "react-router";
async function loader({ request, context, params }) {
  const { cart } = context;
  const { code } = params;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  let redirectParam = searchParams.get("redirect") || searchParams.get("return_to") || "/";
  if (redirectParam.includes("//")) {
    redirectParam = "/";
  }
  searchParams.delete("redirect");
  searchParams.delete("return_to");
  const redirectUrl = `${redirectParam}?${searchParams}`;
  if (!code) {
    return redirect(redirectUrl);
  }
  const result = await cart.updateDiscountCodes([code]);
  const headers = cart.setCartId(result.cart.id);
  return redirect(redirectUrl, {
    status: 303,
    headers
  });
}
export {
  loader
};

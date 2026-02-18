import { redirect, useLoaderData } from "react-router";
import { Money, Image } from "@shopify/hydrogen";
import { CUSTOMER_ORDER_QUERY } from "~/graphql/customer-account/CustomerOrderQuery";
const meta = ({ data }) => {
  return [{ title: `Order ${data?.order?.name}` }];
};
async function loader({ params, context }) {
  const { customerAccount } = context;
  if (!params.id) {
    return redirect("/account/orders");
  }
  const orderId = atob(params.id);
  const { data, errors } = await customerAccount.query(CUSTOMER_ORDER_QUERY, {
    variables: {
      orderId,
      language: customerAccount.i18n.language
    }
  });
  if (errors?.length || !data?.order) {
    throw new Error("Order not found");
  }
  const { order } = data;
  const lineItems = order.lineItems.nodes;
  const discountApplications = order.discountApplications.nodes;
  const fulfillmentStatus = order.fulfillments.nodes[0]?.status ?? "N/A";
  const firstDiscount = discountApplications[0]?.value;
  const discountValue = firstDiscount?.__typename === "MoneyV2" ? firstDiscount : null;
  const discountPercentage = firstDiscount?.__typename === "PricingPercentageValue" ? firstDiscount.percentage : null;
  return {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus
  };
}
function OrderRoute() {
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus
  } = useLoaderData();
  return <div className="account-order">
      <h2>Order {order.name}</h2>
      <p>Placed on {new Date(order.processedAt).toDateString()}</p>
      {order.confirmationNumber && <p>Confirmation: {order.confirmationNumber}</p>}
      <br />
      <div>
        <table>
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((lineItem, lineItemIndex) => (
    // eslint-disable-next-line react/no-array-index-key
    <OrderLineRow key={lineItemIndex} lineItem={lineItem} />
  ))}
          </tbody>
          <tfoot>
            {(discountValue && discountValue.amount || discountPercentage) && <tr>
                <th scope="row" colSpan={3}>
                  <p>Discounts</p>
                </th>
                <th scope="row">
                  <p>Discounts</p>
                </th>
                <td>
                  {discountPercentage ? <span>-{discountPercentage}% OFF</span> : discountValue && <Money data={discountValue} />}
                </td>
              </tr>}
            <tr>
              <th scope="row" colSpan={3}>
                <p>Subtotal</p>
              </th>
              <th scope="row">
                <p>Subtotal</p>
              </th>
              <td>
                <Money data={order.subtotal} />
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={3}>
                Tax
              </th>
              <th scope="row">
                <p>Tax</p>
              </th>
              <td>
                <Money data={order.totalTax} />
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={3}>
                Total
              </th>
              <th scope="row">
                <p>Total</p>
              </th>
              <td>
                <Money data={order.totalPrice} />
              </td>
            </tr>
          </tfoot>
        </table>
        <div>
          <h3>Shipping Address</h3>
          {order?.shippingAddress ? <address>
              <p>{order.shippingAddress.name}</p>
              {order.shippingAddress.formatted ? <p>{order.shippingAddress.formatted}</p> : ""}
              {order.shippingAddress.formattedArea ? <p>{order.shippingAddress.formattedArea}</p> : ""}
            </address> : <p>No shipping address defined</p>}
          <h3>Status</h3>
          <div>
            <p>{fulfillmentStatus}</p>
          </div>
        </div>
      </div>
      <br />
      <p>
        <a target="_blank" href={order.statusPageUrl} rel="noreferrer">
          View Order Status →
        </a>
      </p>
    </div>;
}
function OrderLineRow({ lineItem }) {
  return <tr key={lineItem.id}>
      <td>
        <div>
          {lineItem?.image && <div>
              <Image data={lineItem.image} width={96} height={96} />
            </div>}
          <div>
            <p>{lineItem.title}</p>
            <small>{lineItem.variantTitle}</small>
          </div>
        </div>
      </td>
      <td>
        <Money data={lineItem.price} />
      </td>
      <td>{lineItem.quantity}</td>
      <td>
        <Money data={lineItem.totalDiscount} />
      </td>
    </tr>;
}
export {
  OrderRoute as default,
  loader,
  meta
};

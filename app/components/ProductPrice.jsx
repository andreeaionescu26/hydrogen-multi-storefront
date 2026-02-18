import { Money } from "@shopify/hydrogen";
function ProductPrice({
  price,
  compareAtPrice
}) {
  return <div className="product-price">
      {compareAtPrice ? <div className="product-price-on-sale">
          {price ? <Money data={price} /> : null}
          <s>
            <Money data={compareAtPrice} />
          </s>
        </div> : price ? <Money data={price} /> : <span>&nbsp;</span>}
    </div>;
}
export {
  ProductPrice
};

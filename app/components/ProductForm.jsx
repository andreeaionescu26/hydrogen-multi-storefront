import { useNavigate } from "react-router";
import { Link } from "~/components/Link";
import { AddToCartButton } from "./AddToCartButton";
import { useAside } from "./Aside";
function ProductForm({
  productOptions,
  selectedVariant
}) {
  const navigate = useNavigate();
  const { open } = useAside();
  return <div className="product-form">
      {productOptions.map((option) => {
    if (option.optionValues.length === 1) return null;
    return <div className="product-options" key={option.name}>
            <h5>{option.name}</h5>
            <div className="product-options-grid">
              {option.optionValues.map((value) => {
      const {
        name,
        handle,
        variantUriQuery,
        selected,
        available,
        exists,
        isDifferentProduct,
        swatch
      } = value;
      if (isDifferentProduct) {
        return <Link
          className="product-options-item"
          key={option.name + name}
          prefetch="intent"
          preventScrollReset
          replace
          to={`/products/${handle}?${variantUriQuery}`}
          style={{
            border: selected ? "1px solid black" : "1px solid transparent",
            opacity: available ? 1 : 0.3
          }}
        >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>;
      } else {
        return <button
          type="button"
          className={`product-options-item${exists && !selected ? " link" : ""}`}
          key={option.name + name}
          style={{
            border: selected ? "1px solid black" : "1px solid transparent",
            opacity: available ? 1 : 0.3
          }}
          disabled={!exists}
          onClick={() => {
            if (!selected) {
              void navigate(`?${variantUriQuery}`, {
                replace: true,
                preventScrollReset: true
              });
            }
          }}
        >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>;
      }
    })}
            </div>
            <br />
          </div>;
  })}
      <AddToCartButton
    disabled={!selectedVariant || !selectedVariant.availableForSale}
    onClick={() => {
      open("cart");
    }}
    lines={selectedVariant ? [
      {
        merchandiseId: selectedVariant.id,
        quantity: 1,
        selectedVariant
      }
    ] : []}
  >
        {selectedVariant?.availableForSale ? "Add to cart" : "Sold out"}
      </AddToCartButton>
    </div>;
}
function ProductOptionSwatch({
  swatch,
  name
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;
  if (!image && !color) return name;
  return <div
    aria-label={name}
    className="product-option-label-swatch"
    style={{
      backgroundColor: color || "transparent"
    }}
  >
      {!!image && <img src={image} alt={name} />}
    </div>;
}
export {
  ProductForm
};

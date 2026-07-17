import { Link } from "~/components/Link";
import { RichText } from "@shopify/hydrogen";

function SectionTextFullWidth(props) {
  const {
    heading,
    richText,
    buttonLabel,
    buttonCollectionLink,
    buttonProductLink,
    buttonPageLink,
  } = props;

  // Only one of these three should be filled in per entry — use whichever is set
  const buttonHref = buttonCollectionLink?.reference?.handle
    ? `/collections/${buttonCollectionLink.reference.handle}`
    : buttonProductLink?.reference?.handle
    ? `/products/${buttonProductLink.reference.handle}`
    : buttonPageLink?.reference?.handle
    ? `/pages/${buttonPageLink.reference.handle}`
    : null;

  return (
    <section>
      {heading?.value && <h2>{heading.value}</h2>}
      {richText?.value && <RichText data={richText.value} />}
      {buttonLabel?.value && buttonHref && (
        <Link to={buttonHref} prefetch="intent">
          {buttonLabel.value}
        </Link>
      )}
    </section>
  );
}

const SECTION_TEXT_FULL_WIDTH_FRAGMENT = `#graphql
  fragment SectionTextFullWidth on Metaobject {
    heading: field(key: "heading") { value }
    richText: field(key: "rich_text") { value }
    buttonLabel: field(key: "button_label") { value }
    buttonCollectionLink: field(key: "button_collection_link") {
      reference {
        ... on Collection { handle }
      }
    }
    buttonProductLink: field(key: "button_product_link") {
      reference {
        ... on Product { handle }
      }
    }
    buttonPageLink: field(key: "button_page_link") {
      reference {
        ... on Page { handle }
      }
    }
  }
`;

export { SECTION_TEXT_FULL_WIDTH_FRAGMENT, SectionTextFullWidth };

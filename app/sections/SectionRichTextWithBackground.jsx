import { Link } from "~/components/Link";
import { RichText } from "@shopify/hydrogen";

function SectionRichTextWithBackground(props) {
  const {
    subheading,
    heading,
    richText,
    buttonLabel,
    buttonCollectionLink,
    buttonPageLink,
    buttonProductLink,
    image,
    backgroundColour,
  } = props;

  // Only one of these three should be filled in per entry — use whichever is set
  const buttonHref = buttonCollectionLink?.reference?.handle
    ? `/collections/${buttonCollectionLink.reference.handle}`
    : buttonPageLink?.reference?.handle
    ? `/pages/${buttonPageLink.reference.handle}`
    : buttonProductLink?.reference?.handle
    ? `/products/${buttonProductLink.reference.handle}`
    : null;

  const imageUrl = image?.reference?.image?.url;

  // Image background takes priority; falls back to solid color if no image is set
  const backgroundStyle = imageUrl
    ? {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : backgroundColour?.value
    ? { backgroundColor: backgroundColour.value }
    : {};

  return (
    <section style={{ position: "relative", padding: "3rem", ...backgroundStyle }}>
      <div style={{ position: "relative", zIndex: 1 }}>
        {subheading?.value && <p>{subheading.value}</p>}
        {heading?.value && <h2>{heading.value}</h2>}
        {richText?.value && <RichText data={richText.value} />}
        {buttonLabel?.value && buttonHref && (
          <Link to={buttonHref} prefetch="intent">
            {buttonLabel.value}
          </Link>
        )}
      </div>
    </section>
  );
}

const SECTION_RICH_TEXT_WITH_BACKGROUND_FRAGMENT = `#graphql
  fragment SectionRichTextWithBackground on Metaobject {
    subheading: field(key: "subheading") { value }
    heading: field(key: "heading") { value }
    richText: field(key: "rich_text") { value }
    buttonLabel: field(key: "button_label") { value }
    buttonCollectionLink: field(key: "button_collection_link") {
      reference {
        ... on Collection { handle }
      }
    }
    buttonPageLink: field(key: "button_page_link") {
      reference {
        ... on Page { handle }
      }
    }
    buttonProductLink: field(key: "button_product_link") {
      reference {
        ... on Product { handle }
      }
    }
    image: field(key: "image") {
      reference {
        ... on MediaImage {
          image { url altText }
        }
      }
    }
    backgroundColour: field(key: "background_colour") { value }
  }
`;

export {
  SECTION_RICH_TEXT_WITH_BACKGROUND_FRAGMENT,
  SectionRichTextWithBackground,
};

import { Link } from "~/components/Link";
import { RichText } from "@shopify/hydrogen";

function SectionListOfPages(props) {
  const { title, text, pages, image, imageAltText } = props;

  const pageNodes = pages?.references?.nodes ?? [];
  const imageUrl = image?.reference?.image?.url;

  return (
    <section style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={imageAltText?.value ?? ""}
          style={{ flex: "0 0 300px", width: 300, objectFit: "cover" }}
        />
      )}
      <div style={{ flex: 1 }}>
        {title?.value && <h2>{title.value}</h2>}
        {text?.value && <RichText data={text.value} />}
        {pageNodes.length > 0 && (
          <ul>
            {pageNodes.map((page) => (
              <li key={page.id}>
                <Link to={`/pages/${page.handle}`} prefetch="intent">
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

const SECTION_LIST_OF_PAGES_FRAGMENT = `#graphql
  fragment SectionListOfPages on Metaobject {
    title: field(key: "title") { value }
    text: field(key: "text") { value }
    pages: field(key: "pages") {
      references(first: 10) {
        nodes {
          ... on Page {
            id
            handle
            title
          }
        }
      }
    }
    image: field(key: "image") {
      reference {
        ... on MediaImage {
          image {
            url
            altText
          }
        }
      }
    }
    imageAltText: field(key: "image_alt_text") { value }
  }
`;

export { SECTION_LIST_OF_PAGES_FRAGMENT, SectionListOfPages };

import { Link } from "~/components/Link";
import { RichText } from "@shopify/hydrogen";

function SectionTextMedia(props) {
  const {
    subheader,
    header,
    richText,
    image,
    imageAlt,
    video,
    youtubeUrl,
    buttonLabel,
    buttonCollectionLink,
    buttonPageLink,
    buttonProductLink,
    buttonBlogPostLink,
    badgeImage,
    badgeText,
    mediaOnLeft,
  } = props;

  // Only one of these four should be filled in per entry — use whichever is set
  const buttonHref = buttonCollectionLink?.reference?.handle
    ? `/collections/${buttonCollectionLink.reference.handle}`
    : buttonPageLink?.reference?.handle
    ? `/pages/${buttonPageLink.reference.handle}`
    : buttonProductLink?.reference?.handle
    ? `/products/${buttonProductLink.reference.handle}`
    : buttonBlogPostLink?.reference?.handle && buttonBlogPostLink?.reference?.blog?.handle
    ? `/blogs/${buttonBlogPostLink.reference.blog.handle}/${buttonBlogPostLink.reference.handle}`
    : null;

  const imageUrl = image?.reference?.image?.url;
  const videoSource = video?.reference?.sources?.[0];
  const badgeImageUrl = badgeImage?.reference?.image?.url;
  const isMediaOnLeft = mediaOnLeft?.value === "true";

  const mediaBlock = (
    <div style={{ position: "relative", flex: "1 1 0" }}>
      {badgeImageUrl && (
        <div
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            zIndex: 1,
          }}
        >
          <img src={badgeImageUrl} alt="" style={{ width: 32, height: 32 }} />
          {badgeText?.value && <span>{badgeText.value}</span>}
        </div>
      )}

      {videoSource ? (
        <video autoPlay muted loop playsInline style={{ width: "100%" }}>
          <source src={videoSource.url} type={videoSource.mimeType} />
        </video>
      ) : youtubeUrl?.value ? (
        <iframe
          src={youtubeUrl.value}
          title={header?.value ?? "Video"}
          style={{ width: "100%", aspectRatio: "16/9", border: 0 }}
          allowFullScreen
        />
      ) : imageUrl ? (
        <img src={imageUrl} alt={imageAlt?.value ?? ""} style={{ width: "100%" }} />
      ) : null}
    </div>
  );

  const textBlock = (
    <div style={{ flex: "1 1 0" }}>
      {subheader?.value && <p>{subheader.value}</p>}
      {header?.value && <h2>{header.value}</h2>}
      {richText?.value && <RichText data={richText.value} />}
      {buttonLabel?.value && buttonHref && (
        <Link to={buttonHref} prefetch="intent">
          {buttonLabel.value}
        </Link>
      )}
    </div>
  );

  return (
    <section style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
      {isMediaOnLeft ? (
        <>
          {mediaBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {mediaBlock}
        </>
      )}
    </section>
  );
}

const SECTION_TEXT_MEDIA_FRAGMENT = `#graphql
  fragment SectionTextMedia on Metaobject {
    subheader: field(key: "subheader") { value }
    header: field(key: "header") { value }
    richText: field(key: "rich_text") { value }
    image: field(key: "image") {
      reference {
        ... on MediaImage {
          image { url altText }
        }
      }
    }
    imageAlt: field(key: "image_alt") { value }
    video: field(key: "video") {
      reference {
        ... on Video {
          sources { url mimeType }
        }
      }
    }
    youtubeUrl: field(key: "youtube_url") { value }
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
    buttonBlogPostLink: field(key: "button_blog_post_link") {
      reference {
        ... on Article {
          handle
          blog { handle }
        }
      }
    }
    badgeImage: field(key: "badge_image") {
      reference {
        ... on MediaImage {
          image { url }
        }
      }
    }
    badgeText: field(key: "badge_text") { value }
    mediaOnLeft: field(key: "media_on_left") { value }
  }
`;

export { SECTION_TEXT_MEDIA_FRAGMENT, SectionTextMedia };

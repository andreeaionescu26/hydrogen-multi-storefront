import { Link } from "~/components/Link";

function SectionSingleMedia(props) {
  const {
    image,
    imageAlt,
    video,
    youtubeUrl,
    mediaTitleText,
    mediaTitleLinkCollection,
    mediaTitleLinkPage,
    mediaTitleLinkProduct,
  } = props;

  const imageUrl = image?.reference?.image?.url;
  const videoSource = video?.reference?.sources?.[0];

  // Only one of these three should be filled in per entry — use whichever is set
  const titleHref = mediaTitleLinkCollection?.reference?.handle
    ? `/collections/${mediaTitleLinkCollection.reference.handle}`
    : mediaTitleLinkPage?.reference?.handle
    ? `/pages/${mediaTitleLinkPage.reference.handle}`
    : mediaTitleLinkProduct?.reference?.handle
    ? `/products/${mediaTitleLinkProduct.reference.handle}`
    : null;

  const media = videoSource ? (
    <video autoPlay muted loop playsInline style={{ width: "100%" }}>
      <source src={videoSource.url} type={videoSource.mimeType} />
    </video>
  ) : youtubeUrl?.value ? (
    <iframe
      src={youtubeUrl.value}
      title={mediaTitleText?.value ?? "Video"}
      style={{ width: "100%", aspectRatio: "16/9", border: 0 }}
      allowFullScreen
    />
  ) : imageUrl ? (
    <img src={imageUrl} alt={imageAlt?.value ?? ""} style={{ width: "100%" }} />
  ) : null;

  return (
    <section style={{ position: "relative" }}>
      {media}
      {mediaTitleText?.value &&
        (titleHref ? (
          <Link to={titleHref} prefetch="intent">
            {mediaTitleText.value}
          </Link>
        ) : (
          <p>{mediaTitleText.value}</p>
        ))}
    </section>
  );
}

const SECTION_SINGLE_MEDIA_FRAGMENT = `#graphql
  fragment SectionSingleMedia on Metaobject {
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
    mediaTitleText: field(key: "media_title_text") { value }
    mediaTitleLinkCollection: field(key: "media_title_link_collection") {
      reference {
        ... on Collection { handle }
      }
    }
    mediaTitleLinkPage: field(key: "media_title_link_page") {
      reference {
        ... on Page { handle }
      }
    }
    mediaTitleLinkProduct: field(key: "media_title_link_product") {
      reference {
        ... on Product { handle }
      }
    }
  }
`;

export { SECTION_SINGLE_MEDIA_FRAGMENT, SectionSingleMedia };

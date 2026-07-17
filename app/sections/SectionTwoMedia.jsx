import { Link } from "~/components/Link";

function renderMediaBlock({
  image,
  imageAlt,
  video,
  youtubeUrl,
  mediaTitleText,
  mediaTitleLinkCollection,
  mediaTitleLinkPage,
  mediaTitleLinkProduct,
  keyPrefix,
}) {
  const imageUrl = image?.reference?.image?.url;
  const videoSource = video?.reference?.sources?.[0];

  // Only one of these three should be filled in per side — use whichever is set
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
    <div key={keyPrefix} style={{ flex: "1 1 0", position: "relative" }}>
      {media}
      {mediaTitleText?.value &&
        (titleHref ? (
          <Link to={titleHref} prefetch="intent">
            {mediaTitleText.value}
          </Link>
        ) : (
          <p>{mediaTitleText.value}</p>
        ))}
    </div>
  );
}

function SectionTwoMedia(props) {
  const {
    image1,
    imageAlt1,
    video1,
    youtubeUrl1,
    mediaTitleText1,
    mediaTitleLink1Collection,
    mediaTitleLink1Page,
    mediaTitleLink1Product,
    image2,
    imageAlt2,
    video2,
    youtubeUrl2,
    mediaTitleText2,
    mediaTitleLink2Collection,
    mediaTitleLink2Page,
    mediaTitleLink2Product,
  } = props;

  return (
    <section style={{ display: "flex", gap: "1rem" }}>
      {renderMediaBlock({
        keyPrefix: "media-1",
        image: image1,
        imageAlt: imageAlt1,
        video: video1,
        youtubeUrl: youtubeUrl1,
        mediaTitleText: mediaTitleText1,
        mediaTitleLinkCollection: mediaTitleLink1Collection,
        mediaTitleLinkPage: mediaTitleLink1Page,
        mediaTitleLinkProduct: mediaTitleLink1Product,
      })}
      {renderMediaBlock({
        keyPrefix: "media-2",
        image: image2,
        imageAlt: imageAlt2,
        video: video2,
        youtubeUrl: youtubeUrl2,
        mediaTitleText: mediaTitleText2,
        mediaTitleLinkCollection: mediaTitleLink2Collection,
        mediaTitleLinkPage: mediaTitleLink2Page,
        mediaTitleLinkProduct: mediaTitleLink2Product,
      })}
    </section>
  );
}

const SECTION_TWO_MEDIA_FRAGMENT = `#graphql
  fragment SectionTwoMedia on Metaobject {
    image1: field(key: "image_1") {
      reference {
        ... on MediaImage {
          image { url altText }
        }
      }
    }
    imageAlt1: field(key: "image_alt_1") { value }
    video1: field(key: "video_1") {
      reference {
        ... on Video {
          sources { url mimeType }
        }
      }
    }
    youtubeUrl1: field(key: "youtube_url_1") { value }
    mediaTitleText1: field(key: "media_title_text_1") { value }
    mediaTitleLink1Collection: field(key: "media_title_link_1_collection") {
      reference {
        ... on Collection { handle }
      }
    }
    mediaTitleLink1Page: field(key: "media_title_link_1_page") {
      reference {
        ... on Page { handle }
      }
    }
    mediaTitleLink1Product: field(key: "media_title_link_1_product") {
      reference {
        ... on Product { handle }
      }
    }
    image2: field(key: "image_2") {
      reference {
        ... on MediaImage {
          image { url altText }
        }
      }
    }
    imageAlt2: field(key: "image_alt_2") { value }
    video2: field(key: "video_2") {
      reference {
        ... on Video {
          sources { url mimeType }
        }
      }
    }
    youtubeUrl2: field(key: "youtube_url_2") { value }
    mediaTitleText2: field(key: "media_title_text_2") { value }
    mediaTitleLink2Collection: field(key: "media_title_link_2_collection") {
      reference {
        ... on Collection { handle }
      }
    }
    mediaTitleLink2Page: field(key: "media_title_link_2_page") {
      reference {
        ... on Page { handle }
      }
    }
    mediaTitleLink2Product: field(key: "media_title_link_2_product") {
      reference {
        ... on Product { handle }
      }
    }
  }
`;

export { SECTION_TWO_MEDIA_FRAGMENT, SectionTwoMedia };

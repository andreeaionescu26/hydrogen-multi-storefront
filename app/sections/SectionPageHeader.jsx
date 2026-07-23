import {Link} from '~/components/Link';
import {RichText} from '@shopify/hydrogen';

function SectionPageHeader(props) {
  const {
    subheader,
    header,
    richText,
    buttonLabel,
    buttonCollectionLink,
    buttonPageLink,
    buttonProductLink,
    image,
    imageAlt,
    video,
    youtubeUrl,
    badgeImage,
    badgeText,
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
  const badgeImageUrl = badgeImage?.reference?.image?.url;

  // Handles both native Shopify `Video` uploads (which return a `sources` array,
  // often with multiple formats/resolutions) and legacy `GenericFile` references.
  // Prefer an mp4 source if one exists, since a plain <video> tag can't play
  // HLS (.m3u8) streams without extra JS.
  const videoSources = video?.reference?.sources;
  const genericVideoUrl = video?.reference?.url;

  let videoSource = null;
  if (videoSources?.length) {
    videoSource =
      videoSources.find((s) => s.mimeType === 'video/mp4') ?? videoSources[0];
  } else if (genericVideoUrl) {
    videoSource = {url: genericVideoUrl, mimeType: video?.reference?.mimeType};
  }

  return (
    <section className="page-header">
      <div className="page-header__inner">
        <div className="page-header__copy">
          {subheader?.value && (
            <p className="page-header__eyebrow">{subheader.value}</p>
          )}
          {header?.value && <h1>{header.value}</h1>}
          {richText?.value && (
            <div className="page-header__richtext">
              <RichText data={richText.value} />
            </div>
          )}
          {buttonLabel?.value && buttonHref && (
            <Link
              to={buttonHref}
              prefetch="intent"
              className="page-header__cta"
            >
              {buttonLabel.value}
            </Link>
          )}
        </div>

        <div className="page-header__media">
          {badgeImageUrl && (
            <div className="page-header__badge">
              <img src={badgeImageUrl} alt="" />
              {badgeText?.value && <span>{badgeText.value}</span>}
            </div>
          )}

          {videoSource ? (
            <video autoPlay muted loop playsInline>
              <source src={videoSource.url} type={videoSource.mimeType} />
            </video>
          ) : youtubeUrl?.value ? (
            <iframe
              src={youtubeUrl.value}
              title={header?.value ?? 'Video'}
              allowFullScreen
            />
          ) : imageUrl ? (
            <img src={imageUrl} alt={imageAlt?.value ?? ''} />
          ) : null}
        </div>
      </div>
    </section>
  );
}

const SECTION_PAGE_HEADER_FRAGMENT = `#graphql
  fragment SectionPageHeader on Metaobject {
    subheader: field(key: "subheader") { value }
    header: field(key: "header") { value }
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
          image {
            url
            altText
          }
        }
      }
    }
    imageAlt: field(key: "image_alt") { value }
    video: field(key: "video") {
      reference {
        ... on Video {
          sources {
            url
            mimeType
          }
        }
        ... on GenericFile { url, mimeType }
      }
    }
    youtubeUrl: field(key: "youtube_url") { value }
    badgeImage: field(key: "badge_image") {
      reference {
        ... on MediaImage {
          image {
            url
            altText
          }
        }
      }
    }
    badgeText: field(key: "badge_text") { value }
  }
`;

export {SECTION_PAGE_HEADER_FRAGMENT, SectionPageHeader};

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
  const videoUrl = video?.reference?.url;
  const badgeImageUrl = badgeImage?.reference?.image?.url;

  return (
    <section style={{position: 'relative'}}>
      {badgeImageUrl && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: 1,
          }}
        >
          <img src={badgeImageUrl} alt="" style={{width: 32, height: 32}} />
          {badgeText?.value && <span>{badgeText.value}</span>}
        </div>
      )}

      {videoUrl ? (
        <video autoPlay muted loop playsInline style={{width: '100%'}}>
          <source src={videoUrl} type={video?.reference?.mimeType} />
        </video>
      ) : youtubeUrl?.value ? (
        <iframe
          src={youtubeUrl.value}
          title={header?.value ?? 'Video'}
          style={{width: '100%', aspectRatio: '16/9', border: 0}}
          allowFullScreen
        />
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt={imageAlt?.value ?? ''}
          style={{width: '100%'}}
        />
      ) : null}

      <div>
        {subheader?.value && <p>{subheader.value}</p>}
        {header?.value && <h1>{header.value}</h1>}
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
        ... on GenericFile { url, mimeType }
      }
    }
    youtubeUrl: field(key: "youtube_url") { value }
    badgeImage: field(key: "badge_image") {
      reference {
        ... on GenericFile { url }
      }
    }
    badgeText: field(key: "badge_text") { value }
  }
`;

export {SECTION_PAGE_HEADER_FRAGMENT, SectionPageHeader};

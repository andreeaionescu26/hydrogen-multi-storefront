import {Link} from '~/components/Link';

function SectionHomeHero(props) {
  const {
    eyebrow,
    heading,
    subheading,
    image,
    imageAlt,
    video,
    youtubeUrl,
    primaryButtonLabel,
    primaryButtonCollectionLink,
    primaryButtonPageLink,
    primaryButtonProductLink,
    secondaryButtonLabel,
    secondaryButtonCollectionLink,
    secondaryButtonPageLink,
    secondaryButtonProductLink,
    facts,
  } = props;

  const resolveHref = (collectionLink, pageLink, productLink) =>
    collectionLink?.reference?.handle
      ? `/collections/${collectionLink.reference.handle}`
      : pageLink?.reference?.handle
        ? `/pages/${pageLink.reference.handle}`
        : productLink?.reference?.handle
          ? `/products/${productLink.reference.handle}`
          : null;

  const primaryHref = resolveHref(
    primaryButtonCollectionLink,
    primaryButtonPageLink,
    primaryButtonProductLink,
  );
  const secondaryHref = resolveHref(
    secondaryButtonCollectionLink,
    secondaryButtonPageLink,
    secondaryButtonProductLink,
  );

  const imageUrl = image?.reference?.image?.url;

  // Handles both native Shopify `Video` uploads (which return a `sources` array,
  // often with multiple formats/resolutions) and `GenericFile` references.
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

  const factNodes = facts?.references?.nodes ?? [];

  return (
    <section className="home-hero">
      <div className="home-hero__media">
        {videoSource ? (
          <video autoPlay muted loop playsInline>
            <source src={videoSource.url} type={videoSource.mimeType} />
          </video>
        ) : youtubeUrl?.value ? (
          <iframe
            src={youtubeUrl.value}
            title={heading?.value ?? 'Video'}
            allowFullScreen
          />
        ) : imageUrl ? (
          <img src={imageUrl} alt={imageAlt?.value ?? ''} />
        ) : null}
        <div className="home-hero__overlay" />
      </div>

      <div className="home-hero__inner">
        <div className="home-hero__copy">
          {eyebrow?.value && (
            <p className="home-hero__eyebrow">{eyebrow.value}</p>
          )}
          {heading?.value && <h1>{heading.value}</h1>}
          {subheading?.value && (
            <p className="home-hero__subheading">{subheading.value}</p>
          )}

          <div className="home-hero__ctas">
            {primaryButtonLabel?.value && primaryHref && (
              <Link
                to={primaryHref}
                prefetch="intent"
                className="home-hero__cta-solid"
              >
                {primaryButtonLabel.value}
              </Link>
            )}
            {secondaryButtonLabel?.value && secondaryHref && (
              <Link
                to={secondaryHref}
                prefetch="intent"
                className="home-hero__cta-glass"
              >
                {secondaryButtonLabel.value}
              </Link>
            )}
          </div>
        </div>

        {factNodes.length > 0 && (
          <div className="home-hero__fact-card">
            {factNodes.map((fact) => {
              const label = fact.label?.value;
              const value = fact.value?.value;
              if (!label || !value) return null;
              return (
                <div className="home-hero__fact-row" key={fact.id}>
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

const SECTION_HOME_HERO_FRAGMENT = `#graphql
  fragment SectionHomeHero on Metaobject {
    eyebrow: field(key: "eyebrow") { value }
    heading: field(key: "heading") { value }
    subheading: field(key: "subheading") { value }
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
          sources {
            url
            mimeType
          }
        }
        ... on GenericFile {
          url
          mimeType
        }
      }
    }
    youtubeUrl: field(key: "youtube_url") { value }
    primaryButtonLabel: field(key: "primary_button_label") { value }
    primaryButtonCollectionLink: field(key: "primary_button_collection_link") {
      reference { ... on Collection { handle } }
    }
    primaryButtonPageLink: field(key: "primary_button_page_link") {
      reference { ... on Page { handle } }
    }
    primaryButtonProductLink: field(key: "primary_button_product_link") {
      reference { ... on Product { handle } }
    }
    secondaryButtonLabel: field(key: "secondary_button_label") { value }
    secondaryButtonCollectionLink: field(key: "secondary_button_collection_link") {
      reference { ... on Collection { handle } }
    }
    secondaryButtonPageLink: field(key: "secondary_button_page_link") {
      reference { ... on Page { handle } }
    }
    secondaryButtonProductLink: field(key: "secondary_button_product_link") {
      reference { ... on Product { handle } }
    }
    facts: field(key: "facts") {
      references(first: 5) {
        nodes {
          ... on Metaobject {
            id
            label: field(key: "label") { value }
            value: field(key: "value") { value }
          }
        }
      }
    }
  }
`;

export {SECTION_HOME_HERO_FRAGMENT, SectionHomeHero};

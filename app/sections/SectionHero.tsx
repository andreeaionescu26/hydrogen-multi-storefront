import {Image} from '@shopify/hydrogen';
import type {SectionHeroFragment} from 'storefrontapi.generated';

export function SectionHero(props: SectionHeroFragment) {
  const {heading, subheading, image} = props;

  const imgData = image?.reference?.__typename === 'MediaImage'
    ? image.reference.image
    : null;

  return (
    <section
      className="section-hero"
      style={{
        backgroundImage: imgData?.url ? `url("${imgData.url}")` : undefined,
        minHeight: '500px',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: '2rem',
          position: 'absolute',
          inset: 0,
        }}
      >
        {heading?.value && <h1 style={{marginBottom: 0}}>{heading.value}</h1>}
        {subheading?.value && <p>{subheading.value}</p>}
      </div>
    </section>
  );
}

const MEDIA_IMAGE_FRAGMENT = `#graphql
  fragment MediaImage on MediaImage {
    image {
      altText
      url
      width
      height
    }
  }
`;

export const SECTION_HERO_FRAGMENT = `#graphql
  fragment SectionHero on Metaobject {
    heading: field(key: "heading") {
      value
    }
    subheading: field(key: "subheading") {
      value
    }
    image: field(key: "image") {
      reference {
        __typename
        ... on MediaImage {
          ...MediaImage
        }
      }
    }
  }
  ${MEDIA_IMAGE_FRAGMENT}
`;

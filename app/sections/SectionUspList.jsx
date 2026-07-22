import {RichText} from '@shopify/hydrogen';
import {UspIcon} from '~/components/UspIcon';

function SectionUspList({items}) {
  const nodes = items?.references?.nodes ?? [];
  if (!nodes.length) return null;

  return (
    <section className="usp-list">
      <div className="usp-list__grid">
        {nodes.map((item) => (
          <div className="usp-item" key={item.id}>
            <div className="usp-item__header">
              {item.icon?.value && (
                <div className="usp-item__icon">
                  <UspIcon name={item.icon.value} size={30} weight="bold" />
                </div>
              )}
              {item.title?.value && <h3>{item.title.value}</h3>}
            </div>
            {item.richText?.value && (
              <div className="usp-item__text">
                <RichText data={item.richText.value} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

const SECTION_USP_LIST_FRAGMENT = `#graphql
  fragment UspItem on Metaobject {
    title: field(key: "title") { value }
    richText: field(key: "rich_text") { value }
    icon: field(key: "icon") { value }
  }

  fragment SectionUspList on Metaobject {
    items: field(key: "items") {
      references(first: 9) {
        nodes {
          ... on Metaobject {
            id
            ...UspItem
          }
        }
      }
    }
  }
`;

export {SECTION_USP_LIST_FRAGMENT, SectionUspList};

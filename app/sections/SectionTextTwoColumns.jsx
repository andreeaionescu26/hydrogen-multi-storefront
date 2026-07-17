import { RichText } from "@shopify/hydrogen";

function SectionTextTwoColumns(props) {
  const { columnLeftTitle, columnLeftText, columnRightTitle, columnRightText } = props;

  return (
    <section style={{ display: "flex", gap: "2rem" }}>
      <div style={{ flex: "1 1 0" }}>
        {columnLeftTitle?.value && <h3>{columnLeftTitle.value}</h3>}
        {columnLeftText?.value && <RichText data={columnLeftText.value} />}
      </div>
      <div style={{ flex: "1 1 0" }}>
        {columnRightTitle?.value && <h3>{columnRightTitle.value}</h3>}
        {columnRightText?.value && <RichText data={columnRightText.value} />}
      </div>
    </section>
  );
}

const SECTION_TEXT_TWO_COLUMNS_FRAGMENT = `#graphql
  fragment SectionTextTwoColumns on Metaobject {
    columnLeftTitle: field(key: "column_left_title") { value }
    columnLeftText: field(key: "column_left_text") { value }
    columnRightTitle: field(key: "column_right_title") { value }
    columnRightText: field(key: "column_right_text") { value }
  }
`;

export { SECTION_TEXT_TWO_COLUMNS_FRAGMENT, SectionTextTwoColumns };

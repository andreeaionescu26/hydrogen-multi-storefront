import { getSchema } from "@shopify/hydrogen-codegen";
const graphqlConfig = {
  projects: {
    default: {
      schema: getSchema("storefront"),
      documents: [
        "./*.{ts,tsx,js,jsx}",
        "./app/**/*.{ts,tsx,js,jsx}",
        "!./app/graphql/**/*.{ts,tsx,js,jsx}"
      ]
    },
    customer: {
      schema: getSchema("customer-account"),
      documents: ["./app/graphql/customer-account/*.{ts,tsx,js,jsx}"]
    }
    // Add your own GraphQL projects here for CMS, Shopify Admin API, etc.
  }
};
var stdin_default = graphqlConfig;
export {
  stdin_default as default
};

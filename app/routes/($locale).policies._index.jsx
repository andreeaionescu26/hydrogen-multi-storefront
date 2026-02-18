import { useLoaderData } from "react-router";
import { Link } from "~/components/Link";
async function loader({ context }) {
  const data = await context.storefront.query(POLICIES_QUERY);
  const shopPolicies = data.shop;
  const policies = [
    shopPolicies?.privacyPolicy,
    shopPolicies?.shippingPolicy,
    shopPolicies?.termsOfService,
    shopPolicies?.refundPolicy,
    shopPolicies?.subscriptionPolicy
  ].filter((policy) => policy != null);
  if (!policies.length) {
    throw new Response("No policies found", { status: 404 });
  }
  return { policies };
}
function Policies() {
  const { policies } = useLoaderData();
  return <div className="policies">
      <h1>Policies</h1>
      <div>
        {policies.map((policy) => <fieldset key={policy.id}>
            <Link to={`/policies/${policy.handle}`}>{policy.title}</Link>
          </fieldset>)}
      </div>
    </div>;
}
const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }
  query Policies ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        ...PolicyItem
      }
      shippingPolicy {
        ...PolicyItem
      }
      termsOfService {
        ...PolicyItem
      }
      refundPolicy {
        ...PolicyItem
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
`;
export {
  Policies as default,
  loader
};

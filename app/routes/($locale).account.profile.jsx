import { CUSTOMER_UPDATE_MUTATION } from "~/graphql/customer-account/CustomerUpdateMutation";
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext
} from "react-router";
const meta = () => {
  return [{ title: "Profile" }];
};
async function loader({ context }) {
  context.customerAccount.handleAuthStatus();
  return {};
}
async function action({ request, context }) {
  const { customerAccount } = context;
  if (request.method !== "PUT") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }
  const form = await request.formData();
  try {
    const customer = {};
    const validInputKeys = ["firstName", "lastName"];
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key)) {
        continue;
      }
      if (typeof value === "string" && value.length) {
        customer[key] = value;
      }
    }
    const { data: data2, errors } = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
          language: customerAccount.i18n.language
        }
      }
    );
    if (errors?.length) {
      throw new Error(errors[0].message);
    }
    if (!data2?.customerUpdate?.customer) {
      throw new Error("Customer profile update failed.");
    }
    return {
      error: null,
      customer: data2?.customerUpdate?.customer
    };
  } catch (error) {
    return data(
      { error: error.message, customer: null },
      {
        status: 400
      }
    );
  }
}
function AccountProfile() {
  const account = useOutletContext();
  const { state } = useNavigation();
  const action2 = useActionData();
  const customer = action2?.customer ?? account?.customer;
  return <div className="account-profile">
      <h2>My profile</h2>
      <br />
      <Form method="PUT">
        <legend>Personal information</legend>
        <fieldset>
          <label htmlFor="firstName">First name</label>
          <input
    id="firstName"
    name="firstName"
    type="text"
    autoComplete="given-name"
    placeholder="First name"
    aria-label="First name"
    defaultValue={customer.firstName ?? ""}
    minLength={2}
  />
          <label htmlFor="lastName">Last name</label>
          <input
    id="lastName"
    name="lastName"
    type="text"
    autoComplete="family-name"
    placeholder="Last name"
    aria-label="Last name"
    defaultValue={customer.lastName ?? ""}
    minLength={2}
  />
        </fieldset>
        {action2?.error ? <p>
            <mark>
              <small>{action2.error}</small>
            </mark>
          </p> : <br />}
        <button type="submit" disabled={state !== "idle"}>
          {state !== "idle" ? "Updating" : "Update"}
        </button>
      </Form>
    </div>;
}
export {
  action,
  AccountProfile as default,
  loader,
  meta
};

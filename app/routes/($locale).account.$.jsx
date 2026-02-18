import { redirect } from "react-router";
async function loader({ context }) {
  context.customerAccount.handleAuthStatus();
  return redirect("/account");
}
export {
  loader
};

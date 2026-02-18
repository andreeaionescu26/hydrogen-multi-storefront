import { redirect } from "react-router";
async function loader() {
  return redirect("/");
}
async function action({ context }) {
  return context.customerAccount.logout();
}
export {
  action,
  loader
};

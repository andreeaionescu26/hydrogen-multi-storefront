import { redirect } from "react-router";
async function loader() {
  return redirect("/account/orders");
}
export {
  loader
};

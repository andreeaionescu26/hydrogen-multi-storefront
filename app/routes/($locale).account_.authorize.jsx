async function loader({ context }) {
  return context.customerAccount.authorize();
}
export {
  loader
};

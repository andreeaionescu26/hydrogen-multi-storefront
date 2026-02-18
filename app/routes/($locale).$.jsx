async function loader({ request }) {
  throw new Response(`${new URL(request.url).pathname} not found`, {
    status: 404
  });
}
function CatchAllPage() {
  return null;
}
export {
  CatchAllPage as default,
  loader
};

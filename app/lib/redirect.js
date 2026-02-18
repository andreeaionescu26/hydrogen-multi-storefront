import { redirect } from "react-router";
function redirectIfHandleIsLocalized(request, ...localizedResources) {
  const url = new URL(request.url);
  let shouldRedirect = false;
  localizedResources.forEach(({ handle, data }) => {
    if (handle !== data.handle) {
      url.pathname = url.pathname.replace(handle, data.handle);
      shouldRedirect = true;
    }
  });
  if (shouldRedirect) {
    throw redirect(url.toString());
  }
}
export {
  redirectIfHandleIsLocalized
};

function getEmptyPredictiveSearchResult() {
  return {
    total: 0,
    items: {
      articles: [],
      collections: [],
      products: [],
      pages: [],
      queries: []
    }
  };
}
function urlWithTrackingParams({
  baseUrl,
  trackingParams,
  params: extraParams,
  term
}) {
  let search = new URLSearchParams({
    ...extraParams,
    q: encodeURIComponent(term)
  }).toString();
  if (trackingParams) {
    search = `${search}&${trackingParams}`;
  }
  return `${baseUrl}?${search}`;
}
export {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams
};

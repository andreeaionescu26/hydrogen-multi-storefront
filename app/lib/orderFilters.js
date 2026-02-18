const ORDER_FILTER_FIELDS = {
  NAME: "name",
  CONFIRMATION_NUMBER: "confirmation_number"
};
function sanitizeFilterValue(value) {
  return value.replace(/[^a-zA-Z0-9_\-]/g, "");
}
function buildOrderSearchQuery(filters) {
  const queryParts = [];
  if (filters.name) {
    const cleanName = filters.name.replace(/^#/, "").trim();
    const sanitizedName = sanitizeFilterValue(cleanName);
    if (sanitizedName) {
      queryParts.push(`name:${sanitizedName}`);
    }
  }
  if (filters.confirmationNumber) {
    const cleanConfirmation = filters.confirmationNumber.trim();
    const sanitizedConfirmation = sanitizeFilterValue(cleanConfirmation);
    if (sanitizedConfirmation) {
      queryParts.push(`confirmation_number:${sanitizedConfirmation}`);
    }
  }
  return queryParts.length > 0 ? queryParts.join(" AND ") : void 0;
}
function parseOrderFilters(searchParams) {
  const filters = {};
  const name = searchParams.get(ORDER_FILTER_FIELDS.NAME);
  if (name) {
    filters.name = name;
  }
  const confirmationNumber = searchParams.get(
    ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER
  );
  if (confirmationNumber) {
    filters.confirmationNumber = confirmationNumber;
  }
  return filters;
}
export {
  ORDER_FILTER_FIELDS,
  buildOrderSearchQuery,
  parseOrderFilters
};

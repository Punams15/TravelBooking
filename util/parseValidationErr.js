// util/parseValidationErr.js
export function parseValidationErr(err) {
  if (!err || !err.errors) return ["Unknown validation error"];

  return Object.values(err.errors).map((e) => e.message || "Validation error");
}

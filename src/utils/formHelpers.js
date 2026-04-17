export const createFormChangeHandler = (setState) => (field, value) => {
  setState((prev) => ({
    ...prev,
    [field]: value,
  }));
};

export const clearFormErrors = (setErrors) => {
  setErrors({});
};

export const hasFormErrors = (errors = {}) => {
  return Object.keys(errors).length > 0;
};

export const getTrimmedFormValues = (values = {}) => {
  const trimmed = {};

  Object.keys(values).forEach((key) => {
    const value = values[key];
    trimmed[key] = typeof value === "string" ? value.trim() : value;
  });

  return trimmed;
};

export default {
  createFormChangeHandler,
  clearFormErrors,
  hasFormErrors,
  getTrimmedFormValues,
};

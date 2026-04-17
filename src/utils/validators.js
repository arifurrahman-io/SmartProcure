export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
};

export const isValidEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
};

export const isValidPhone = (phone) => {
  if (!phone) return false;
  return /^[0-9+\-\s()]{7,20}$/.test(String(phone).trim());
};

export const isPositiveNumber = (value) => {
  const number = Number(value);
  return !Number.isNaN(number) && number > 0;
};

export const minLength = (value, length = 1) => {
  return String(value || "").trim().length >= length;
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!isRequired(email)) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!isRequired(password)) {
    errors.password = "Password is required";
  } else if (!minLength(password, 6)) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

export const validateRequestForm = (values = {}) => {
  const errors = {};

  if (!isRequired(values.title)) errors.title = "Request title is required";
  if (!isRequired(values.itemName)) errors.itemName = "Item name is required";
  if (!isRequired(values.category)) errors.category = "Category is required";
  if (!isRequired(values.campus)) errors.campus = "Campus is required";
  if (!isRequired(values.shift)) errors.shift = "Shift is required";
  if (!isRequired(values.quantity)) errors.quantity = "Quantity is required";
  if (!isPositiveNumber(values.quantity))
    errors.quantity = "Quantity must be a positive number";
  if (!isRequired(values.budget)) errors.budget = "Budget is required";
  if (!isPositiveNumber(values.budget))
    errors.budget = "Budget must be a positive number";
  if (!isRequired(values.reason)) errors.reason = "Reason is required";
  if (!isRequired(values.neededBy))
    errors.neededBy = "Needed by date is required";

  return errors;
};

export const validateQuotationForm = (values = {}) => {
  const errors = {};

  if (!isRequired(values.vendorName))
    errors.vendorName = "Vendor name is required";
  if (!isRequired(values.vendorContact))
    errors.vendorContact = "Vendor contact is required";
  if (!isRequired(values.amount)) errors.amount = "Quoted amount is required";
  if (!isPositiveNumber(values.amount))
    errors.amount = "Amount must be a positive number";
  if (!isRequired(values.specification))
    errors.specification = "Specification is required";
  if (!isRequired(values.deliveryTime))
    errors.deliveryTime = "Delivery time is required";

  return errors;
};

export default {
  isRequired,
  isValidEmail,
  isValidPhone,
  isPositiveNumber,
  minLength,
  validateLoginForm,
  validateRequestForm,
  validateQuotationForm,
};

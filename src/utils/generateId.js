export const generateId = (prefix = "ID") => {
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  const timePart = Date.now().toString().slice(-6);

  return `${prefix}-${timePart}-${randomPart}`;
};

export default generateId;

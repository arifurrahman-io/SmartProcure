export const getFileNameFromUri = (uri = "") => {
  if (!uri) return "file";
  const parts = uri.split("/");
  return parts[parts.length - 1] || "file";
};

export const getFileExtension = (fileName = "") => {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
};

export const isImageFile = (fileName = "") => {
  const ext = getFileExtension(fileName);
  return ["jpg", "jpeg", "png", "webp", "gif"].includes(ext);
};

export const isPdfFile = (fileName = "") => {
  return getFileExtension(fileName) === "pdf";
};

export const formatFileSize = (bytes = 0) => {
  const num = Number(bytes);
  if (Number.isNaN(num) || num <= 0) return "0 B";

  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  if (num < 1024 * 1024 * 1024) return `${(num / (1024 * 1024)).toFixed(1)} MB`;

  return `${(num / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export default {
  getFileNameFromUri,
  getFileExtension,
  isImageFile,
  isPdfFile,
  formatFileSize,
};

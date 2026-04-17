export const normalizeRole = (role) =>
  String(role || "")
    .trim()
    .toLowerCase();

export const isAdminRole = (role) => normalizeRole(role) === "admin";

export const isMemberRole = (role) => normalizeRole(role) === "member";

export const getRoleLabel = (role) => {
  const normalized = normalizeRole(role);

  if (normalized === "admin") return "Admin";
  if (normalized === "member") return "Member";

  return "Unknown";
};

export default {
  normalizeRole,
  isAdminRole,
  isMemberRole,
  getRoleLabel,
};

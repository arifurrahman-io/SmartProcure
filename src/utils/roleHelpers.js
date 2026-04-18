export const normalizeRole = (role) =>
  String(role || "")
    .trim()
    .toLowerCase();

export const isAdminRole = (role) => normalizeRole(role) === "admin";

export const isMemberRole = (role) =>
  ["member", "staff", "committee", "purchase_committee"].includes(
    normalizeRole(role),
  );

export const getRoleLabel = (role) => {
  const normalized = normalizeRole(role);

  if (normalized === "admin") return "Admin";
  if (normalized === "member") return "Member";
  if (normalized === "staff") return "Staff";
  if (normalized === "committee") return "Committee";
  if (normalized === "purchase_committee") return "Purchase Committee";

  return "Unknown";
};

export default {
  normalizeRole,
  isAdminRole,
  isMemberRole,
  getRoleLabel,
};

export const canCreateRequest = (role) => {
  const normalizedRole = String(role || "").toLowerCase();
  return normalizedRole === "admin" || normalizedRole === "member";
};

export const canSubmitQuotation = (role) => {
  const normalizedRole = String(role || "").toLowerCase();
  return normalizedRole === "admin" || normalizedRole === "member";
};

export const canApproveQuotation = (role) => {
  return String(role || "").toLowerCase() === "admin";
};

export const canManageUsers = (role) => {
  return String(role || "").toLowerCase() === "admin";
};

export const canViewAdminDashboard = (role) => {
  return String(role || "").toLowerCase() === "admin";
};

export default {
  canCreateRequest,
  canSubmitQuotation,
  canApproveQuotation,
  canManageUsers,
  canViewAdminDashboard,
};

import { useMemo } from "react";
import useAuthStore from "../store/useAuthStore";
import { isAdminRole, isMemberRole, normalizeRole } from "../utils/roleHelpers";

export default function useUserRole() {
  const profile = useAuthStore((state) => state.profile);

  const role = profile?.role || null;

  const permissions = useMemo(() => {
    const normalizedRole = normalizeRole(role);
    const isAdmin = isAdminRole(normalizedRole);
    const isMember = isMemberRole(normalizedRole);

    return {
      role,
      normalizedRole,
      isAdmin,
      isMember,
      canApproveQuotation: isAdmin,
      canManageUsers: isAdmin,
      canCreateRequest: isAdmin || isMember,
      canSubmitQuotation: isAdmin || isMember,
    };
  }, [role]);

  return permissions;
}

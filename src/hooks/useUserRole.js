import { useMemo } from "react";
import useAuthStore from "../store/useAuthStore";

export default function useUserRole() {
  const profile = useAuthStore((state) => state.profile);

  const role = profile?.role || null;

  const permissions = useMemo(() => {
    const normalizedRole = String(role || "").toLowerCase();

    return {
      role,
      isAdmin: normalizedRole === "admin",
      isMember: normalizedRole === "member",
      canApproveQuotation: normalizedRole === "admin",
      canManageUsers: normalizedRole === "admin",
      canCreateRequest:
        normalizedRole === "admin" || normalizedRole === "member",
      canSubmitQuotation:
        normalizedRole === "admin" || normalizedRole === "member",
    };
  }, [role]);

  return permissions;
}

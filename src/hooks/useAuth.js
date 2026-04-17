import { logoutUser } from "../services/auth/authService";
import useAuthStore from "../store/useAuthStore";

export default function useAuth() {
  const { user, profile, isAuthenticated, isLoading, clearAuth } =
    useAuthStore();

  const handleLogout = async () => {
    await logoutUser();
    clearAuth();
  };

  return {
    user,
    profile,
    isAuthenticated,
    isLoading,
    logout: handleLogout,
  };
}

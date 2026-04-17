import useAuthStore from "../store/useAuthStore";

export default function useAuth() {
  const {
    user,
    profile,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    resetPassword,
    initializeAuth,
  } = useAuthStore();

  return {
    user,
    profile,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    resetPassword,
    initializeAuth,
  };
}

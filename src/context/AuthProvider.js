import { useEffect } from "react";

import useAuthStore from "../store/useAuthStore";

export default function AuthProvider({ children }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const disposeAuth = useAuthStore((state) => state.disposeAuth);

  useEffect(() => {
    initializeAuth();
    return disposeAuth;
  }, [initializeAuth, disposeAuth]);

  return children;
}

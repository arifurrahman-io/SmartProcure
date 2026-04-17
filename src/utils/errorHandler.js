export const getErrorMessage = (error, fallback = "Something went wrong") => {
  if (!error) return fallback;

  if (typeof error === "string") return error;

  if (error.message) return error.message;

  return fallback;
};

export const getFirebaseFriendlyError = (error) => {
  const code = error?.code || "";

  switch (code) {
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/user-not-found":
      return "No user found with this email";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/invalid-credential":
      return "Invalid login credentials";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later";
    case "permission-denied":
      return "Permission denied. Please check your access";
    case "unavailable":
      return "Service is temporarily unavailable";
    default:
      return error?.message || "Something went wrong";
  }
};

export const withErrorBoundary = async (fn, onError) => {
  try {
    return await fn();
  } catch (error) {
    if (onError) {
      onError(error);
    }
    throw error;
  }
};

export default {
  getErrorMessage,
  getFirebaseFriendlyError,
  withErrorBoundary,
};

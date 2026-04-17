const FIREBASE_ERROR_MESSAGES = {
  "auth/invalid-email": "Invalid email address",
  "auth/user-not-found": "No user found with this email",
  "auth/wrong-password": "Incorrect password",
  "auth/invalid-credential": "Invalid login credentials",
  "auth/too-many-requests": "Too many attempts. Try again later",
  "permission-denied": "Permission denied. Please check your access",
  unavailable: "Service is temporarily unavailable",
  "failed-precondition":
    "Firestore needs an index for this query. Deploy firestore.indexes.json.",
};

export const getErrorMessage = (error, fallback = "Something went wrong") => {
  if (!error) return fallback;
  if (typeof error === "string") return error;

  const codeMessage = FIREBASE_ERROR_MESSAGES[error.code];
  if (codeMessage) return codeMessage;

  return error.message || fallback;
};

export const withErrorBoundary = async (fn, onError) => {
  try {
    return await fn();
  } catch (error) {
    onError?.(error);
    throw error;
  }
};

export default {
  getErrorMessage,
  withErrorBoundary,
};

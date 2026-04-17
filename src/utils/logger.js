const isDev = __DEV__;

export const logInfo = (...args) => {
  if (isDev) {
    console.log("[INFO]:", ...args);
  }
};

export const logWarn = (...args) => {
  if (isDev) {
    console.warn("[WARN]:", ...args);
  }
};

export const logError = (...args) => {
  if (isDev) {
    console.error("[ERROR]:", ...args);
  }
};

export default {
  logInfo,
  logWarn,
  logError,
};

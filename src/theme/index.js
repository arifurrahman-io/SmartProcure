import lightTheme from "./lightTheme";
import darkTheme from "./darkTheme";

export { lightTheme, darkTheme };

export const getTheme = (mode = "light") => {
  return mode === "dark" ? darkTheme : lightTheme;
};

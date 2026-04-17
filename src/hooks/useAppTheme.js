import { useColorScheme } from "react-native";
import { getTheme } from "../theme";

export default function useAppTheme() {
  const systemScheme = useColorScheme();
  const mode = systemScheme === "dark" ? "dark" : "light";

  const theme = getTheme(mode);

  return {
    theme,
    isDark: mode === "dark",
    isLight: mode === "light",
  };
}

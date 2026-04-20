import { useColorScheme } from "react-native";
import { getTheme } from "../theme";
import useUiStore from "../store/useUiStore";

export default function useAppTheme() {
  const systemScheme = useColorScheme();
  const themeMode = useUiStore((state) => state.themeMode);
  const mode =
    themeMode === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : themeMode === "dark"
        ? "dark"
        : "light";

  const theme = getTheme(mode);

  return {
    theme,
    mode,
    themeMode,
    isDark: mode === "dark",
    isLight: mode === "light",
  };
}

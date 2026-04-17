import { Colors } from "../constants/colors";
import Typography from "./typography";
import Shadows from "./shadows";
import BorderRadius from "./borderRadius";

const lightTheme = {
  mode: "light",

  colors: {
    background: Colors.background,
    card: Colors.card,
    text: Colors.text,
    textSecondary: Colors.textSecondary,
    border: Colors.border,
    primary: Colors.primary,
    danger: Colors.danger,
    success: Colors.success,
    warning: Colors.warning,
    overlay: Colors.overlay,
  },

  typography: Typography,
  shadows: Shadows,
  borderRadius: BorderRadius,
};

export default lightTheme;

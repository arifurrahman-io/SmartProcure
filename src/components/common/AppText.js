import { Text } from "react-native";
import { Colors } from "../../constants/colors";

export default function AppText({ children, style }) {
  return <Text style={[{ color: Colors.text }, style]}>{children}</Text>;
}

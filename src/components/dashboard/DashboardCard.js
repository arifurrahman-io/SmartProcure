import { Platform, View, StyleSheet } from "react-native";

export default function DashboardCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 13,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: "#DCE4EE",
    ...Platform.select({
      web: {
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.045)",
      },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.035,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      },
    }),
  },
});

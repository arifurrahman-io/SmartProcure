import { View, Text, StyleSheet } from "react-native";

export default function UrgencyBadge({ level = "Medium" }) {
  const urgency = String(level).toLowerCase();

  const bgColor =
    urgency === "high" || urgency === "emergency"
      ? "#FEF2F2"
      : urgency === "medium"
        ? "#FFF7ED"
        : "#ECFDF5";

  const textColor =
    urgency === "high" || urgency === "emergency"
      ? "#DC2626"
      : urgency === "medium"
        ? "#EA580C"
        : "#059669";

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
});

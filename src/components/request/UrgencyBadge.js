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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "800",
  },
});

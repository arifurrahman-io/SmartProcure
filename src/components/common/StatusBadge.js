import { View, Text, StyleSheet } from "react-native";

export default function StatusBadge({ status = "Pending" }) {
  const value = String(status).toLowerCase();

  let bgColor = "#FFF7ED";
  let textColor = "#EA580C";

  if (value === "approved") {
    bgColor = "#ECFDF5";
    textColor = "#059669";
  } else if (value === "purchase in progress") {
    bgColor = "#EEF4FF";
    textColor = "#2563EB";
  } else if (value === "delivered") {
    bgColor = "#F5F3FF";
    textColor = "#7C3AED";
  } else if (value === "completed") {
    bgColor = "#EEF2FF";
    textColor = "#4338CA";
  } else if (value === "rejected" || value === "cancelled") {
    bgColor = "#FEF2F2";
    textColor = "#DC2626";
  }

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{status}</Text>
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

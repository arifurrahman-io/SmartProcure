import { View, Text, StyleSheet } from "react-native";

export default function PriceHighlight({ amount }) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>Quoted Price</Text>
      <Text style={styles.amount}>{amount || "-"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#EEF4FF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "flex-end",
    minWidth: 110,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  amount: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "800",
    color: "#1D4ED8",
  },
});

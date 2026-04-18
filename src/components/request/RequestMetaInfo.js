import { Platform, View, Text, StyleSheet } from "react-native";

export default function RequestMetaInfo({
  requester,
  quantity,
  budget,
  neededBy,
  reason,
  createdAt,
}) {
  return (
    <View style={styles.card}>
      <Info label="Requested By" value={requester} />
      <Info label="Quantity" value={quantity} />
      <Info label="Estimated Budget" value={budget} />
      <Info label="Needed By" value={neededBy} />
      <Info label="Created At" value={createdAt} />
      <Info label="Reason" value={reason} isLast />
    </View>
  );
}

function Info({ label, value, isLast = false }) {
  return (
    <View style={[styles.row, isLast && styles.lastRow]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
    ...Platform.select({
      web: {
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
      },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      },
    }),
  },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  lastRow: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    lineHeight: 20,
    color: "#0F172A",
  },
});

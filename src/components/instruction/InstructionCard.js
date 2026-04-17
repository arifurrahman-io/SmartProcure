import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "../common/StatusBadge";

export default function InstructionCard({
  itemName,
  vendorName,
  amount,
  campus,
  shift,
  approvedBy,
  approvedAt,
  status,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.itemName} numberOfLines={1}>
            {itemName}
          </Text>
          <Text style={styles.vendorName} numberOfLines={1}>
            Vendor: {vendorName || "-"}
          </Text>
        </View>

        <StatusBadge status={status || "Approved"} />
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={14} color="#64748B" />
        <Text style={styles.infoText}>
          {campus} • {shift}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="cash-outline" size={14} color="#64748B" />
        <Text style={styles.amountText}>{amount || "-"}</Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.metaText}>Approved by {approvedBy || "-"}</Text>
        <Text style={styles.metaText}>{approvedAt || "-"}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  titleWrap: {
    flex: 1,
    paddingRight: 6,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  vendorName: {
    marginTop: 5,
    fontSize: 13,
    color: "#64748B",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#64748B",
  },
  amountText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "700",
    color: "#1D4ED8",
  },
  bottomRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: 12,
    color: "#94A3B8",
  },
});

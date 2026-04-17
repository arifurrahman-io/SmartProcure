import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PriceHighlight from "./PriceHighlight";

export default function QuotationCard({
  vendorName,
  amount,
  deliveryTime,
  warranty,
  notes,
  submittedBy,
  submittedAt,
  isApproved = false,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <View style={styles.vendorWrap}>
          <Text style={styles.vendorName}>{vendorName}</Text>
          {isApproved ? (
            <View style={styles.approvedBadge}>
              <Text style={styles.approvedText}>Approved</Text>
            </View>
          ) : null}
        </View>

        <PriceHighlight amount={amount} />
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={14} color="#64748B" />
        <Text style={styles.infoText}>Delivery: {deliveryTime || "-"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="shield-checkmark-outline" size={14} color="#64748B" />
        <Text style={styles.infoText}>Warranty: {warranty || "-"}</Text>
      </View>

      {notes ? (
        <Text style={styles.notes} numberOfLines={2}>
          {notes}
        </Text>
      ) : null}

      <View style={styles.bottomRow}>
        <Text style={styles.metaText}>By {submittedBy || "Unknown"}</Text>
        <Text style={styles.metaText}>{submittedAt || "-"}</Text>
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
    gap: 12,
  },
  vendorWrap: {
    flex: 1,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  approvedBadge: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  approvedText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
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
  notes: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
    color: "#475569",
  },
  bottomRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: 12,
    color: "#94A3B8",
  },
});

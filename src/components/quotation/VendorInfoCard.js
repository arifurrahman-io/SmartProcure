import { Platform, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function VendorInfoCard({
  vendorName,
  vendorContact,
  specification,
  amount,
  deliveryTime,
  address,
  isSelected = false,
  isApproved = false,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.headingRow}>
        <Text style={styles.heading}>Vendor Information</Text>
        {isApproved ? (
          <Text style={styles.approvedText}>Approved</Text>
        ) : isSelected ? (
          <Text style={styles.selectedText}>Selected</Text>
        ) : null}
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="business-outline" size={16} color="#64748B" />
        <Text style={styles.infoText}>{vendorName || "-"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="cash-outline" size={16} color="#64748B" />
        <Text style={styles.amountText}>{amount || "-"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={16} color="#64748B" />
        <Text style={styles.infoText}>{deliveryTime || "-"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={16} color="#64748B" />
        <Text style={styles.infoText}>{vendorContact || "-"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="cube-outline" size={16} color="#64748B" />
        <Text style={styles.infoText}>{specification || "-"}</Text>
      </View>

      {address ? (
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#64748B" />
          <Text style={styles.infoText}>{address}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
  selectedCard: {
    borderColor: "#2563EB",
    backgroundColor: "#F8FBFF",
  },
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  heading: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  selectedText: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "800",
  },
  approvedText: {
    color: "#059669",
    fontSize: 12,
    fontWeight: "800",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: "#475569",
  },
  amountText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#1D4ED8",
    fontWeight: "800",
  },
});

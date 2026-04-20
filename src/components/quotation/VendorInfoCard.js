import { Platform, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const hasDisplayValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

export default function VendorInfoCard({
  vendorName,
  vendorContact,
  specification,
  amount,
  deliveryTime,
  notes,
  submittedBy,
  createdAt,
  isSelected = false,
  isApproved = false,
  onPress,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
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

      {hasDisplayValue(submittedBy) ? (
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color="#64748B" />
          <Text style={styles.infoText}>Created by {submittedBy}</Text>
        </View>
      ) : null}

      {hasDisplayValue(createdAt) ? (
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#64748B" />
          <Text style={styles.infoText}>Created {createdAt}</Text>
        </View>
      ) : null}

      {hasDisplayValue(amount) ? (
        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={16} color="#64748B" />
          <Text style={styles.amountText}>{amount}</Text>
        </View>
      ) : null}

      {hasDisplayValue(deliveryTime) ? (
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color="#64748B" />
          <Text style={styles.infoText}>{deliveryTime}</Text>
        </View>
      ) : null}

      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={16} color="#64748B" />
        <Text style={styles.infoText}>{vendorContact || "-"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="cube-outline" size={16} color="#64748B" />
        <Text style={styles.infoText}>{specification || "-"}</Text>
      </View>

      {hasDisplayValue(notes) ? (
        <View style={styles.infoRow}>
          <Ionicons name="reader-outline" size={16} color="#64748B" />
          <Text style={styles.infoText}>{notes}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
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
  selectedCard: {
    borderColor: "#2563EB",
    backgroundColor: "#F8FBFF",
  },
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
    marginBottom: 9,
  },
  heading: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  selectedText: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "800",
  },
  approvedText: {
    color: "#059669",
    fontSize: 11,
    fontWeight: "800",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: "#475569",
  },
  amountText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: "#1D4ED8",
    fontWeight: "800",
  },
});

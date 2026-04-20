import {
  Platform,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

function DetailItem({ icon, label, value }) {
  return (
    <View style={styles.detailItem}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={15} color="#2563EB" />
      </View>
      <View style={styles.detailTextWrap}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue} numberOfLines={1}>
          {value || "-"}
        </Text>
      </View>
    </View>
  );
}

export default function QuotationCard({
  vendorName,
  amount,
  deliveryTime,
  warranty,
  notes,
  submittedBy,
  createdAt,
  isApproved = false,
  onPress,
}) {
  const creatorName = submittedBy || "Unknown";
  const createdTime = createdAt || "-";

  return (
    <TouchableOpacity
      style={[styles.card, isApproved && styles.approvedCard]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {isApproved ? <View style={styles.approvedAccent} /> : null}

      <View style={styles.topRow}>
        <View style={styles.vendorWrap}>
          {isApproved ? (
            <View style={styles.approvedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#047857" />
              <Text style={styles.approvedText}>Approved</Text>
            </View>
          ) : null}

          <Text style={styles.vendorName} numberOfLines={1}>
            {vendorName || "Unknown Vendor"}
          </Text>
          <Text style={styles.vendorMeta} numberOfLines={1}>
            Created by {creatorName}
          </Text>
        </View>

        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Quoted price</Text>
          <Text style={styles.priceAmount} numberOfLines={1}>
            {amount || "-"}
          </Text>
        </View>
      </View>

      <View style={styles.detailGrid}>
        <DetailItem icon="time-outline" label="Delivery" value={deliveryTime} />
        <DetailItem
          icon="shield-checkmark-outline"
          label="Warranty"
          value={warranty}
        />
      </View>

      {notes ? (
        <View style={styles.notesBox}>
          <Ionicons name="reader-outline" size={15} color="#64748B" />
          <Text style={styles.notes} numberOfLines={2}>
            {notes}
          </Text>
        </View>
      ) : null}

      <View style={styles.bottomRow}>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={14} color="#94A3B8" />
          <Text style={styles.metaText}>Created {createdTime}</Text>
        </View>
        <View style={styles.openHint}>
          <Text style={styles.openHintText}>Review</Text>
          <Ionicons name="chevron-forward" size={15} color="#2563EB" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "relative",
    overflow: "hidden",
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
  approvedCard: {
    borderColor: "#86EFAC",
    backgroundColor: "#FCFFFD",
  },
  approvedAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#10B981",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  vendorWrap: {
    flex: 1,
    minWidth: 0,
  },
  vendorName: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  vendorMeta: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
  },
  approvedBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  approvedText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#047857",
  },
  priceBox: {
    maxWidth: 150,
    minWidth: 106,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#64748B",
    textTransform: "uppercase",
  },
  priceAmount: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "800",
    color: "#1D4ED8",
  },
  detailGrid: {
    marginTop: 10,
    flexDirection: "row",
    gap: 8,
  },
  detailItem: {
    flex: 1,
    minWidth: 0,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#EEF2F7",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  detailTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  detailLabel: {
    color: "#94A3B8",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  detailValue: {
    marginTop: 2,
    color: "#334155",
    fontSize: 12,
    fontWeight: "700",
  },
  notesBox: {
    marginTop: 9,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#EEF2F7",
    padding: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  notes: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: "#475569",
  },
  bottomRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
  },
  openHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  openHintText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2563EB",
  },
});

import { Platform, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "../common/StatusBadge";
import UrgencyBadge from "./UrgencyBadge";
import CampusShiftTag from "./CampusShiftTag";

export default function RequestCard({
  itemName,
  category,
  campus,
  shift,
  requester,
  date,
  status,
  urgency,
  quotationCount = 0,
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
          {category ? <Text style={styles.category}>{category}</Text> : null}
        </View>
        <StatusBadge status={status} />
      </View>

      <View style={styles.metaRow}>
        <CampusShiftTag campus={campus} shift={shift} />
        <UrgencyBadge level={urgency} />
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="person-outline" size={14} color="#64748B" />
        <Text style={styles.infoText}>{requester}</Text>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={14} color="#64748B" />
          <Text style={styles.infoText}>{date}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="document-text-outline" size={14} color="#2563EB" />
          <Text style={styles.quoteText}>{quotationCount} quotations</Text>
        </View>
      </View>
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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleWrap: {
    flex: 1,
    paddingRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  category: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748B",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
    flexWrap: "wrap",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#64748B",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
    flexWrap: "wrap",
    gap: 8,
  },
  quoteText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },
});

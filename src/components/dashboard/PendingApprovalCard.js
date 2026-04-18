import { Platform, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

export default function PendingApprovalCard({
  itemName,
  campus,
  shift,
  quotationCount,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <Ionicons
            name="document-text-outline"
            size={20}
            color={Colors.primary}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.itemName} numberOfLines={1}>
            {itemName}
          </Text>
          <Text style={styles.meta}>
            {campus} • {shift}
          </Text>
          <Text style={styles.quoteText}>
            {quotationCount} quotation submitted
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...Platform.select({
      web: {
        boxShadow: "0 8px 22px rgba(15, 23, 42, 0.04)",
      },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 1,
      },
    }),
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748B",
  },
  quoteText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },
});

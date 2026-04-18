import { Platform, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UnreadDot from "./UnreadDot";

const getIconName = (type) => {
  switch (String(type).toLowerCase()) {
    case "request":
      return "document-text-outline";
    case "quotation":
      return "receipt-outline";
    case "approval":
      return "checkmark-done-outline";
    case "instruction":
      return "clipboard-outline";
    case "completed":
      return "checkmark-circle-outline";
    default:
      return "notifications-outline";
  }
};

const getIconBg = (type) => {
  switch (String(type).toLowerCase()) {
    case "request":
      return "#EEF4FF";
    case "quotation":
      return "#FFF7ED";
    case "approval":
      return "#ECFDF5";
    case "instruction":
      return "#F5F3FF";
    case "completed":
      return "#ECFEFF";
    default:
      return "#F1F5F9";
  }
};

const getIconColor = (type) => {
  switch (String(type).toLowerCase()) {
    case "request":
      return "#2563EB";
    case "quotation":
      return "#EA580C";
    case "approval":
      return "#059669";
    case "instruction":
      return "#7C3AED";
    case "completed":
      return "#0891B2";
    default:
      return "#475569";
  }
};

export default function NotificationCard({
  title,
  message,
  time,
  type = "general",
  isRead = false,
  onPress,
}) {
  const iconName = getIconName(type);
  const iconBg = getIconBg(type);
  const iconColor = getIconColor(type);

  return (
    <TouchableOpacity
      style={[styles.card, !isRead && styles.unreadCard]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={20} color={iconColor} />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {!isRead ? <UnreadDot /> : null}
        </View>

        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>

        <Text style={styles.time}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
  unreadCard: {
    borderColor: "#DDE7FF",
    backgroundColor: "#FCFDFF",
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  message: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color: "#64748B",
  },
  time: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
  },
});

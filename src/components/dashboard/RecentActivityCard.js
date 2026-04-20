import { Platform, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RecentActivityCard({
  title,
  subtitle,
  time,
  icon = "time-outline",
}) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={18} color="#2563EB" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {time ? <Text style={styles.time}>{time}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 9,
    borderWidth: 1,
    borderColor: "#DCE4EE",
    ...Platform.select({
      web: {
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
      },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.025,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      },
    }),
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    color: "#64748B",
  },
  time: {
    marginLeft: 10,
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
  },
});

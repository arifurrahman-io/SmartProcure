import { Platform, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

export default function SummaryStatCard({
  title,
  value,
  icon = "stats-chart-outline",
  subtitle,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={20} color={Colors.primary} />
        </View>
      </View>

      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 13,
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
  topRow: {
    marginBottom: 10,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  title: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 11,
    color: "#94A3B8",
  },
});

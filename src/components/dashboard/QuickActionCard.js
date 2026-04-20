import { Platform, TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

export default function QuickActionCard({
  title,
  icon = "add-circle-outline",
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={22} color={Colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 82,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    justifyContent: "space-between",
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
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
});

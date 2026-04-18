import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EmptyState({ text }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="file-tray-outline" size={26} color="#2563EB" />
      </View>
      <Text style={styles.text}>{text || "No data found"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 42,
    padding: 22,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  text: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});

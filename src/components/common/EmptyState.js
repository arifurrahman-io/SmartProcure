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
    marginTop: 30,
    padding: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DCE4EE",
    backgroundColor: "#FFFFFF",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  text: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
});

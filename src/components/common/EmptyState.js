import { View, Text, StyleSheet } from "react-native";

export default function EmptyState({ text }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text || "No data found"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 50,
  },
  text: {
    color: "#64748B",
  },
});

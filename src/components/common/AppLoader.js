import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

export default function AppLoader() {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.text}>Loading latest data</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    minWidth: 170,
    borderRadius: 8,
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  text: {
    marginTop: 12,
    color: "#64748B",
    fontSize: 13,
    fontWeight: "700",
  },
});

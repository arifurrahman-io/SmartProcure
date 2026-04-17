import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoText}>SP</Text>
      </View>

      <ActivityIndicator size="large" color="#4F46E5" style={styles.loader} />

      <Text style={styles.title}>SmartProcure</Text>
      <Text style={styles.subtitle}>Preparing your workspace...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  loader: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#64748B",
  },
});

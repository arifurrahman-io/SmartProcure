import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function VendorInfoCard({
  vendorName,
  vendorContact,
  specification,
  address,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Vendor Information</Text>

      <View style={styles.infoRow}>
        <Ionicons name="business-outline" size={16} color="#64748B" />
        <Text style={styles.infoText}>{vendorName || "-"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={16} color="#64748B" />
        <Text style={styles.infoText}>{vendorContact || "-"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="cube-outline" size={16} color="#64748B" />
        <Text style={styles.infoText}>{specification || "-"}</Text>
      </View>

      {address ? (
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#64748B" />
          <Text style={styles.infoText}>{address}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  heading: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: "#475569",
  },
});

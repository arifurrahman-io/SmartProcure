import { View, Text, StyleSheet } from "react-native";
import StatusBadge from "../common/StatusBadge";
import UrgencyBadge from "./UrgencyBadge";
import CampusShiftTag from "./CampusShiftTag";

export default function RequestDetailsHeader({
  itemName,
  category,
  status,
  urgency,
  campus,
  shift,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.itemName}>{itemName}</Text>
          {category ? <Text style={styles.category}>{category}</Text> : null}
        </View>
        <StatusBadge status={status} />
      </View>

      <View style={styles.metaRow}>
        <CampusShiftTag campus={campus} shift={shift} />
        <UrgencyBadge level={urgency} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    marginBottom: 14,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleWrap: {
    flex: 1,
    paddingRight: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  category: {
    marginTop: 6,
    fontSize: 13,
    color: "#64748B",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
});

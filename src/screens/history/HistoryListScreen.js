import { FlatList, StyleSheet, View, Text } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";

function HistoryItem({ item, onPress }) {
  return (
    <View style={styles.historyCard}>
      <View style={styles.row}>
        <View style={styles.content}>
          <Text style={styles.title}>{item.itemName}</Text>
          <Text style={styles.meta}>
            {item.campus} • {item.shift} • {item.date}
          </Text>
          <Text style={styles.subText}>
            Vendor: {item.vendorName} • Amount: {item.amount}
          </Text>
        </View>
        <StatusBadge status={item.status} />
      </View>
      <Text style={styles.auditLink} onPress={onPress}>
        View Audit Trail
      </Text>
    </View>
  );
}

export default function HistoryListScreen({ navigation }) {
  const history = [
    {
      id: "1",
      itemName: "Printer Toner",
      campus: "Banasree",
      shift: "Morning",
      date: "17 Apr 2026",
      vendorName: "Office Supply House",
      amount: "৳ 13,900",
      status: "Completed",
    },
    {
      id: "2",
      itemName: "Projector",
      campus: "Malibag",
      shift: "Day",
      date: "16 Apr 2026",
      vendorName: "Tech World BD",
      amount: "৳ 45,000",
      status: "Delivered",
    },
  ];

  return (
    <ScreenWrapper>
      <AppHeader title="Purchase History" onBack={() => navigation.goBack()} />

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <HistoryItem
            item={item}
            onPress={() =>
              navigation.navigate("AuditTrail", {
                historyId: item.id,
              })
            }
          />
        )}
        ListEmptyComponent={<EmptyState text="No procurement history found" />}
        contentContainerStyle={styles.contentContainer}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
  },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  meta: {
    marginTop: 6,
    fontSize: 12,
    color: "#64748B",
  },
  subText: {
    marginTop: 6,
    fontSize: 12,
    color: "#475569",
  },
  auditLink: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "700",
    color: "#4F46E5",
  },
});

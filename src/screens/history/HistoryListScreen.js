import { useMemo } from "react";
import { FlatList, Platform, StyleSheet, View, Text } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import AppLoader from "../../components/common/AppLoader";
import StatusBadge from "../../components/common/StatusBadge";

import ROUTES from "../../navigation/routes";
import useHistory from "../../hooks/useHistory";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function HistoryItem({ item, onPress }) {
  return (
    <View style={styles.historyCard}>
      <View style={styles.row}>
        <View style={styles.content}>
          <Text style={styles.title}>{item.itemName}</Text>
          <Text style={styles.meta}>
            {item.campus} - {item.shift} - {item.date}
          </Text>
          <Text style={styles.subText}>
            Vendor: {item.vendorName} - Amount: {item.amount}
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
  const { history, isLoading, error, fetchHistory } = useHistory(null, true);

  const mappedHistory = useMemo(() => {
    return (history || []).map((item) => ({
      id: item.id,
      itemName: item.itemName || item.title || "Untitled Item",
      campus: item.campus || "-",
      shift: item.shift || "-",
      date: formatDate(item.completedAt || item.createdAt),
      vendorName: item.vendorName || "Unknown Vendor",
      amount: formatCurrency(item.amount || 0),
      status: item.status || "Completed",
    }));
  }, [history]);

  if (isLoading && mappedHistory.length === 0) {
    return (
      <ScreenWrapper>
        <AppHeader
          title="Purchase History"
          onBack={() => navigation.goBack()}
        />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Purchase History" onBack={() => navigation.goBack()} />

      <FlatList
        data={mappedHistory}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchHistory}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <HistoryItem
            item={item}
            onPress={() =>
              navigation.navigate(ROUTES.AUDIT_TRAIL, {
                historyId: item.id,
              })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState text={error || "No procurement history found"} />
        }
        contentContainerStyle={styles.contentContainer}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...Platform.select({
      web: {
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
      },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      },
    }),
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

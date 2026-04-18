import { useMemo } from "react";
import { Platform, ScrollView, StyleSheet, View, Text } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import AppLoader from "../../components/common/AppLoader";
import EmptyState from "../../components/common/EmptyState";
import RequestTimeline from "../../components/request/RequestTimeline";

import useHistory from "../../hooks/useHistory";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDate";

const normalizeTimeline = (items = []) => {
  return items
    .map((item) => ({
      title: item.title || item.action || "Activity Updated",
      description: item.description || item.note || "",
      time: formatDateTime(item.time || item.createdAt || item.updatedAt),
    }))
    .filter((item) => item.title);
};

export default function AuditTrailScreen({ navigation, route }) {
  const historyId = route?.params?.historyId;
  const { historyRecord, isLoading, error } = useHistory(historyId, true);

  const auditItems = useMemo(() => {
    if (!historyRecord) return [];

    const sourceItems =
      historyRecord.timeline ||
      historyRecord.auditItems ||
      historyRecord.activities ||
      [];

    const timeline = normalizeTimeline(sourceItems);

    if (timeline.length > 0) return timeline;

    return [
      historyRecord.approvedAt
        ? {
            title: "Quotation Approved",
            description: "Final quotation approved for processing.",
            time: formatDateTime(historyRecord.approvedAt),
          }
        : null,
      historyRecord.createdAt
        ? {
            title: "History Record Created",
            description: "Procurement record added to purchase history.",
            time: formatDateTime(historyRecord.createdAt),
          }
        : null,
      historyRecord.completedAt
        ? {
            title: "Procurement Completed",
            description:
              historyRecord.completionNote ||
              "Purchase completion recorded in the system.",
            time: formatDateTime(historyRecord.completedAt),
          }
        : null,
    ].filter(Boolean);
  }, [historyRecord]);

  if (isLoading && !historyRecord) {
    return (
      <ScreenWrapper>
        <AppHeader title="Audit Trail" onBack={() => navigation.goBack()} />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  if (error || !historyRecord) {
    return (
      <ScreenWrapper>
        <AppHeader title="Audit Trail" onBack={() => navigation.goBack()} />
        <EmptyState text={error || "Audit trail not found"} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Audit Trail" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            {historyRecord.itemName || historyRecord.title || "Audit Record"}
          </Text>
          <Text style={styles.summaryText}>History ID: {historyRecord.id}</Text>
          <Text style={styles.summaryText}>
            Vendor: {historyRecord.vendorName || "Unknown Vendor"}
          </Text>
          <Text style={styles.summaryText}>
            Amount: {formatCurrency(historyRecord.amount || 0)}
          </Text>
          <Text style={styles.summaryText}>
            Status: {historyRecord.status || "Completed"}
          </Text>
        </View>

        <RequestTimeline items={auditItems} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
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
  summaryTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#64748B",
  },
});

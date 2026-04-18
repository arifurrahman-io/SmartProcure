import { useMemo } from "react";
import {
  ScrollView,
  Platform,
  View,
  Text,
  StyleSheet,
  RefreshControl,
} from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import SummaryStatCard from "../../components/dashboard/SummaryStatCard";
import EmptyState from "../../components/common/EmptyState";
import AppLoader from "../../components/common/AppLoader";

import useDashboardStats from "../../hooks/useDashboardStats";
import useRequests from "../../hooks/useRequests";
import useInstructions from "../../hooks/useInstructions";
import { formatCurrency } from "../../utils/formatCurrency";
import { REQUEST_STATUS } from "../../constants/requestStatus";

export default function ReportsScreen({ navigation }) {
  const {
    stats,
    isLoading: statsLoading,
    fetchDashboardStats,
  } = useDashboardStats(true);

  const {
    requests,
    isLoading: requestsLoading,
    refreshRequests,
  } = useRequests(true);

  const {
    instructions,
    isLoading: instructionsLoading,
    fetchInstructions,
  } = useInstructions(null, true);

  const isLoading = statsLoading || requestsLoading || instructionsLoading;

  const handleRefresh = async () => {
    await Promise.all([
      fetchDashboardStats(),
      refreshRequests(),
      fetchInstructions(),
    ]);
  };

  const report = useMemo(() => {
    const safeRequests = requests || [];
    const safeInstructions = instructions || [];

    const totalSpend = safeInstructions.reduce((sum, item) => {
      const amount = Number(item?.amount || 0);
      return sum + (Number.isNaN(amount) ? 0 : amount);
    }, 0);

    const completed = safeInstructions.filter(
      (item) =>
        String(item?.status || "").toLowerCase() ===
        String(REQUEST_STATUS.COMPLETED).toLowerCase(),
    ).length;

    const pending = safeRequests.filter(
      (item) =>
        String(item?.status || "").toLowerCase() ===
        String(REQUEST_STATUS.PENDING).toLowerCase(),
    ).length;

    const uniqueVendors = new Set(
      safeInstructions.map((item) => item?.vendorName).filter(Boolean),
    ).size;

    return {
      totalSpend,
      completed,
      pending,
      vendors: uniqueVendors,
    };
  }, [requests, instructions]);

  const campusInsights = useMemo(() => {
    const result = {};

    (instructions || []).forEach((item) => {
      const campus = item?.campus || "Unknown";
      const status = String(item?.status || "").toLowerCase();

      if (!result[campus]) {
        result[campus] = 0;
      }

      if (
        status === String(REQUEST_STATUS.COMPLETED).toLowerCase() ||
        status === String(REQUEST_STATUS.DELIVERED).toLowerCase()
      ) {
        result[campus] += 1;
      }
    });

    return Object.entries(result)
      .sort((a, b) => b[1] - a[1])
      .map(([campus, count]) => ({
        campus,
        count,
      }));
  }, [instructions]);

  const topCategories = useMemo(() => {
    const countMap = {};

    (requests || []).forEach((item) => {
      const category = item?.category || "Other";
      countMap[category] = (countMap[category] || 0) + 1;
    });

    return Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({
        category,
        count,
      }));
  }, [requests]);

  if (
    isLoading &&
    (!requests || requests.length === 0) &&
    (!instructions || instructions.length === 0)
  ) {
    return (
      <ScreenWrapper>
        <AppHeader title="Reports" onBack={() => navigation.goBack()} />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Reports" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>Monthly Summary</Text>

        <View style={styles.row}>
          <SummaryStatCard
            title="Total Spend"
            value={formatCurrency(report.totalSpend)}
            icon="cash-outline"
          />
          <View style={styles.gap} />
          <SummaryStatCard
            title="Completed"
            value={report.completed}
            icon="checkmark-circle-outline"
          />
        </View>

        <View style={styles.row}>
          <SummaryStatCard
            title="Pending"
            value={report.pending}
            icon="time-outline"
          />
          <View style={styles.gap} />
          <SummaryStatCard
            title="Vendors"
            value={report.vendors}
            icon="business-outline"
          />
        </View>

        <View style={styles.row}>
          <SummaryStatCard
            title="Requests"
            value={stats?.totalRequests ?? 0}
            icon="documents-outline"
          />
          <View style={styles.gap} />
          <SummaryStatCard
            title="Users"
            value={stats?.totalUsers ?? 0}
            icon="people-outline"
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Campus-wise Insight</Text>

          {campusInsights.length === 0 ? (
            <EmptyState text="No campus insights found" />
          ) : (
            campusInsights.map((item, index) => (
              <Text key={item.campus} style={styles.infoText}>
                {index + 1}. {item.campus}: {item.count} completed procurements
              </Text>
            ))
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Top Requested Categories</Text>

          {topCategories.length === 0 ? (
            <EmptyState text="No category data found" />
          ) : (
            topCategories.map((item, index) => (
              <Text key={item.category} style={styles.infoText}>
                {index + 1}. {item.category} ({item.count})
              </Text>
            ))
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 14,
  },
  gap: {
    width: 12,
  },
  infoCard: {
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
  infoTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 21,
    color: "#475569",
  },
});

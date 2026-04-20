import { useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
} from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import SummaryStatCard from "../../components/dashboard/SummaryStatCard";
import QuickActionCard from "../../components/dashboard/QuickActionCard";
import PendingApprovalCard from "../../components/dashboard/PendingApprovalCard";
import EmptyState from "../../components/common/EmptyState";
import AppLoader from "../../components/common/AppLoader";

import ROUTES from "../../navigation/routes";
import useDashboardStats from "../../hooks/useDashboardStats";
import useRequests from "../../hooks/useRequests";
import useUserRole from "../../hooks/useUserRole";
import { isPendingApprovalStatus } from "../../constants/requestStatus";
import { formatDateTime } from "../../utils/formatDate";
import { getRequestAuthor } from "../../utils/requestHelpers";

export default function AdminDashboardScreen({ navigation }) {
  const { isAdmin } = useUserRole();
  const handleBack = navigation.canGoBack() ? () => navigation.goBack() : null;

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

  const isLoading = statsLoading || requestsLoading;

  const pendingItems = useMemo(() => {
    return (requests || [])
      .filter((item) => isPendingApprovalStatus(item.status))
      .slice(0, 5)
      .map((item) => {
        const author = getRequestAuthor(item) || {};

        return {
          id: item.id,
          itemName: item.itemName || item.title || "Untitled Request",
          campus: item.campus || "-",
          shift: item.shift || "-",
          requester: author.name || "Unknown",
          createdAt: formatDateTime(item.createdAt),
          quotationCount: item.quotationCount || 0,
        };
      });
  }, [requests]);

  const handleRefresh = async () => {
    await Promise.all([fetchDashboardStats(), refreshRequests()]);
  };

  if (!isAdmin) {
    return (
      <ScreenWrapper>
        <AppHeader title="Admin Dashboard" onBack={handleBack} />
        <EmptyState text="Access denied. Admin permission is required." />
      </ScreenWrapper>
    );
  }

  if (isLoading && (!requests || requests.length === 0)) {
    return (
      <ScreenWrapper>
        <AppHeader title="Admin Dashboard" onBack={handleBack} />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Admin Dashboard" onBack={handleBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>System Overview</Text>

        <View style={styles.row}>
          <SummaryStatCard
            title="Users"
            value={stats?.totalUsers ?? 0}
            icon="people-outline"
          />
          <View style={styles.gap} />
          <SummaryStatCard
            title="Pending"
            value={stats?.pendingApprovals ?? 0}
            icon="time-outline"
          />
        </View>

        <View style={styles.row}>
          <SummaryStatCard
            title="Instructions"
            value={
              stats?.activeInstructions ?? stats?.completedInstructions ?? 0
            }
            icon="clipboard-outline"
          />
          <View style={styles.gap} />
          <SummaryStatCard
            title="Completed"
            value={stats?.completedInstructions ?? 0}
            icon="checkmark-circle-outline"
          />
        </View>

        <Text style={styles.sectionTitle}>Admin Actions</Text>

        <View style={styles.row}>
          <QuickActionCard
            title="Pending Approvals"
            icon="checkmark-done-outline"
            onPress={() => navigation.navigate(ROUTES.PENDING_APPROVALS)}
          />
          <View style={styles.gap} />
          <QuickActionCard
            title="User Management"
            icon="people-outline"
            onPress={() => navigation.navigate(ROUTES.USER_MANAGEMENT)}
          />
        </View>

        <View style={styles.row}>
          <QuickActionCard
            title="Reports"
            icon="bar-chart-outline"
            onPress={() => navigation.navigate(ROUTES.REPORTS)}
          />
          <View style={styles.gap} />
          <QuickActionCard
            title="Instructions"
            icon="clipboard-outline"
            onPress={() => navigation.navigate(ROUTES.INSTRUCTION_LIST)}
          />
        </View>

        <Text style={styles.sectionTitle}>Urgent Pending Approvals</Text>

        {pendingItems.length === 0 ? (
          <EmptyState text="No pending approvals found" />
        ) : (
          pendingItems.map((item) => (
            <PendingApprovalCard
              key={item.id}
              itemName={item.itemName}
              campus={item.campus}
              shift={item.shift}
              requester={item.requester}
              createdAt={item.createdAt}
              quotationCount={item.quotationCount}
              onPress={() =>
                navigation.navigate(ROUTES.REQUESTS, {
                  screen: ROUTES.REQUEST_DETAILS,
                  params: { requestId: item.id },
                })
              }
            />
          ))
        )}
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
});

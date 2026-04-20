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
import RecentActivityCard from "../../components/dashboard/RecentActivityCard";
import EmptyState from "../../components/common/EmptyState";
import AppLoader from "../../components/common/AppLoader";

import ROUTES from "../../navigation/routes";
import useDashboardStats from "../../hooks/useDashboardStats";
import useRequests from "../../hooks/useRequests";
import { isPendingApprovalStatus } from "../../constants/requestStatus";
import { formatDateTime } from "../../utils/formatDate";
import { getRequestAuthor } from "../../utils/requestHelpers";

export default function DashboardScreen({ navigation }) {
  const {
    stats,
    isLoading: statsLoading,
    fetchDashboardStats,
  } = useDashboardStats(true);

  const {
    requests,
    loading: requestsLoading,
    refreshRequests,
  } = useRequests(true);

  const isLoading = Boolean(statsLoading || requestsLoading);

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

  const recentActivities = useMemo(() => {
    return (requests || []).slice(0, 5).map((item) => ({
      id: item.id,
      title:
        String(item.status || "").toLowerCase() === "approved"
          ? "Request approved"
          : "New request submitted",
      subtitle: `${item.itemName || item.title || "Untitled Request"} - ${
        item.campus || "-"
      } campus`,
      time: formatDateTime(item.updatedAt || item.createdAt),
      icon:
        String(item.status || "").toLowerCase() === "approved"
          ? "checkmark-done-outline"
          : "document-text-outline",
    }));
  }, [requests]);

  const handleRefresh = async () => {
    await Promise.all([fetchDashboardStats(), refreshRequests()]);
  };

  if (isLoading && (!requests || requests.length === 0)) {
    return (
      <ScreenWrapper>
        <AppHeader title="Dashboard" />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Dashboard" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>Overview</Text>

        <View style={styles.statsRow}>
          <SummaryStatCard
            title="Total Requests"
            value={stats?.totalRequests ?? 0}
            icon="documents-outline"
          />
          <View style={styles.gap} />
          <SummaryStatCard
            title="Pending"
            value={stats?.pendingApprovals ?? 0}
            icon="time-outline"
          />
        </View>

        <SummaryStatCard
          title="Completed Purchases"
          value={stats?.completedInstructions ?? 0}
          icon="checkmark-circle-outline"
        />

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionsRow}>
          <QuickActionCard
            title="New Request"
            icon="add-circle-outline"
            onPress={() =>
              navigation.navigate(ROUTES.REQUESTS, {
                screen: ROUTES.CREATE_REQUEST,
              })
            }
          />
          <View style={styles.gap} />
          <QuickActionCard
            title="View Requests"
            icon="list-outline"
            onPress={() =>
              navigation.navigate(ROUTES.REQUESTS, {
                screen: ROUTES.REQUEST_LIST,
              })
            }
          />
        </View>

        <View style={styles.actionsRow}>
          <QuickActionCard
            title="My Requests"
            icon="folder-open-outline"
            onPress={() =>
              navigation.navigate(ROUTES.REQUESTS, {
                screen: ROUTES.MY_REQUESTS,
              })
            }
          />
          <View style={styles.gap} />
          <QuickActionCard
            title="Notifications"
            icon="notifications-outline"
            onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}
          />
        </View>

        <Text style={styles.sectionTitle}>Pending Approvals</Text>

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

        <Text style={styles.sectionTitle}>Recent Activity</Text>

        {recentActivities.length === 0 ? (
          <EmptyState text="No recent activity found" />
        ) : (
          recentActivities.map((item) => (
            <RecentActivityCard
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              time={item.time}
              icon={item.icon}
            />
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  actionsRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  gap: {
    width: 12,
  },
});

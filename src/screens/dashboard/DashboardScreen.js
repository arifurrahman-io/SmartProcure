import { ScrollView, View, Text, StyleSheet } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import SummaryStatCard from "../../components/dashboard/SummaryStatCard";
import QuickActionCard from "../../components/dashboard/QuickActionCard";
import PendingApprovalCard from "../../components/dashboard/PendingApprovalCard";
import RecentActivityCard from "../../components/dashboard/RecentActivityCard";

export default function DashboardScreen({ navigation }) {
  const stats = {
    totalRequests: 128,
    pendingApprovals: 12,
    completed: 74,
  };

  const pendingItems = [
    {
      id: "1",
      itemName: "Printer Toner",
      campus: "Banasree",
      shift: "Morning",
      quotationCount: 3,
    },
    {
      id: "2",
      itemName: "Projector",
      campus: "Malibag",
      shift: "Day",
      quotationCount: 2,
    },
  ];

  const recentActivities = [
    {
      id: "1",
      title: "New request submitted",
      subtitle: "Printer toner requested for Mohammadpur campus.",
      time: "10 min ago",
      icon: "document-text-outline",
    },
    {
      id: "2",
      title: "Quotation approved",
      subtitle: "Quotation approved for desktop purchase.",
      time: "1 hour ago",
      icon: "checkmark-done-outline",
    },
  ];

  return (
    <ScreenWrapper>
      <AppHeader title="Dashboard" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Overview</Text>

        <View style={styles.statsRow}>
          <SummaryStatCard
            title="Total Requests"
            value={stats.totalRequests}
            icon="documents-outline"
          />
          <View style={styles.gap} />
          <SummaryStatCard
            title="Pending"
            value={stats.pendingApprovals}
            icon="time-outline"
          />
        </View>

        <SummaryStatCard
          title="Completed Purchases"
          value={stats.completed}
          icon="checkmark-circle-outline"
        />

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <QuickActionCard
            title="New Request"
            icon="add-circle-outline"
            onPress={() => navigation.navigate("CreateRequest")}
          />
          <View style={styles.gap} />
          <QuickActionCard
            title="View Requests"
            icon="list-outline"
            onPress={() => navigation.navigate("RequestList")}
          />
        </View>

        <View style={styles.actionsRow}>
          <QuickActionCard
            title="My Requests"
            icon="folder-open-outline"
            onPress={() => navigation.navigate("MyRequests")}
          />
          <View style={styles.gap} />
          <QuickActionCard
            title="Notifications"
            icon="notifications-outline"
            onPress={() => navigation.navigate("Notifications")}
          />
        </View>

        <Text style={styles.sectionTitle}>Pending Approvals</Text>
        {pendingItems.map((item) => (
          <PendingApprovalCard
            key={item.id}
            itemName={item.itemName}
            campus={item.campus}
            shift={item.shift}
            quotationCount={item.quotationCount}
            onPress={() =>
              navigation.navigate("RequestDetails", { requestId: item.id })
            }
          />
        ))}

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentActivities.map((item) => (
          <RecentActivityCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            time={item.time}
            icon={item.icon}
          />
        ))}
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

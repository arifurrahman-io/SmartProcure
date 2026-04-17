import { ScrollView, View, Text, StyleSheet } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import SummaryStatCard from "../../components/dashboard/SummaryStatCard";
import QuickActionCard from "../../components/dashboard/QuickActionCard";
import PendingApprovalCard from "../../components/dashboard/PendingApprovalCard";

export default function AdminDashboardScreen({ navigation }) {
  const stats = {
    totalUsers: 36,
    pendingApprovals: 8,
    activeInstructions: 14,
    completedThisMonth: 29,
  };

  const pendingItems = [
    {
      id: "1",
      itemName: "Desktop Computer",
      campus: "Mohammadpur",
      shift: "Day",
      quotationCount: 4,
    },
    {
      id: "2",
      itemName: "Office Chair",
      campus: "Malibag",
      shift: "Morning",
      quotationCount: 3,
    },
  ];

  return (
    <ScreenWrapper>
      <AppHeader title="Admin Dashboard" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.sectionTitle}>System Overview</Text>

        <View style={styles.row}>
          <SummaryStatCard
            title="Users"
            value={stats.totalUsers}
            icon="people-outline"
          />
          <View style={styles.gap} />
          <SummaryStatCard
            title="Pending"
            value={stats.pendingApprovals}
            icon="time-outline"
          />
        </View>

        <View style={styles.row}>
          <SummaryStatCard
            title="Instructions"
            value={stats.activeInstructions}
            icon="clipboard-outline"
          />
          <View style={styles.gap} />
          <SummaryStatCard
            title="Completed"
            value={stats.completedThisMonth}
            icon="checkmark-circle-outline"
          />
        </View>

        <Text style={styles.sectionTitle}>Admin Actions</Text>

        <View style={styles.row}>
          <QuickActionCard
            title="Pending Approvals"
            icon="checkmark-done-outline"
            onPress={() => navigation.navigate("PendingApprovals")}
          />
          <View style={styles.gap} />
          <QuickActionCard
            title="User Management"
            icon="people-outline"
            onPress={() => navigation.navigate("UserManagement")}
          />
        </View>

        <View style={styles.row}>
          <QuickActionCard
            title="Reports"
            icon="bar-chart-outline"
            onPress={() => navigation.navigate("Reports")}
          />
          <View style={styles.gap} />
          <QuickActionCard
            title="Instructions"
            icon="clipboard-outline"
            onPress={() => navigation.navigate("InstructionList")}
          />
        </View>

        <Text style={styles.sectionTitle}>Urgent Pending Approvals</Text>
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

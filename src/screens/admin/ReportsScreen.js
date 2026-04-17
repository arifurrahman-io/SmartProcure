import { ScrollView, View, Text, StyleSheet } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import SummaryStatCard from "../../components/dashboard/SummaryStatCard";

export default function ReportsScreen({ navigation }) {
  const report = {
    totalSpend: "৳ 4,85,000",
    completed: 29,
    pending: 8,
    vendors: 17,
  };

  return (
    <ScreenWrapper>
      <AppHeader title="Reports" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.sectionTitle}>Monthly Summary</Text>

        <View style={styles.row}>
          <SummaryStatCard
            title="Total Spend"
            value={report.totalSpend}
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

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Campus-wise Insight</Text>
          <Text style={styles.infoText}>
            Banasree: 12 completed procurements
          </Text>
          <Text style={styles.infoText}>Malibag: 9 completed procurements</Text>
          <Text style={styles.infoText}>
            Mohammadpur: 8 completed procurements
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Top Requested Categories</Text>
          <Text style={styles.infoText}>1. IT Equipment</Text>
          <Text style={styles.infoText}>2. Office Supplies</Text>
          <Text style={styles.infoText}>3. Furniture</Text>
          <Text style={styles.infoText}>4. Maintenance Items</Text>
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
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
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

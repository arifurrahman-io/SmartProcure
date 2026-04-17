import { ScrollView, StyleSheet, View, Text } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import RequestTimeline from "../../components/request/RequestTimeline";

export default function AuditTrailScreen({ navigation, route }) {
  const historyId = route?.params?.historyId;

  const auditItems = [
    {
      title: "Request Created",
      description: "Purchase request submitted by committee member.",
      time: "17 Apr 2026, 9:20 AM",
    },
    {
      title: "Quotation Submitted",
      description: "Vendor quotation added by Rahim.",
      time: "17 Apr 2026, 10:05 AM",
    },
    {
      title: "Quotation Approved",
      description: "Admin approved the final quotation for processing.",
      time: "17 Apr 2026, 11:00 AM",
    },
    {
      title: "Purchase Instruction Created",
      description: "Instruction sent for procurement execution.",
      time: "17 Apr 2026, 11:15 AM",
    },
    {
      title: "Item Delivered",
      description: "Vendor completed delivery to designated campus.",
      time: "18 Apr 2026, 10:40 AM",
    },
    {
      title: "Procurement Completed",
      description: "Completion note added and history archived.",
      time: "18 Apr 2026, 12:10 PM",
    },
  ];

  return (
    <ScreenWrapper>
      <AppHeader title="Audit Trail" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Audit Record</Text>
          <Text style={styles.summaryText}>History ID: {historyId || "-"}</Text>
          <Text style={styles.summaryText}>
            Full lifecycle log for this procurement item.
          </Text>
        </View>

        <RequestTimeline items={auditItems} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
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

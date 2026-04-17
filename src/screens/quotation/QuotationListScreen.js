import { FlatList, StyleSheet } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import QuotationCard from "../../components/quotation/QuotationCard";

export default function QuotationListScreen({ navigation, route }) {
  const requestId = route?.params?.requestId;

  const quotations = [
    {
      id: "1",
      vendorName: "Tech World BD",
      amount: "৳ 14,500",
      deliveryTime: "3 days",
      warranty: "6 months",
      notes: "Original toner with delivery included.",
      submittedBy: "Rahim",
      submittedAt: "17 Apr 2026",
      isApproved: false,
    },
    {
      id: "2",
      vendorName: "Office Supply House",
      amount: "৳ 13,900",
      deliveryTime: "5 days",
      warranty: "No warranty",
      notes: "Bulk price quotation.",
      submittedBy: "Nayeem",
      submittedAt: "17 Apr 2026",
      isApproved: true,
    },
  ];

  return (
    <ScreenWrapper>
      <AppHeader title="Quotations" onBack={() => navigation.goBack()} />

      <FlatList
        data={quotations}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <QuotationCard
            {...item}
            onPress={() =>
              navigation.navigate("QuotationComparison", {
                requestId,
                selectedQuotationId: item.id,
              })
            }
          />
        )}
        ListEmptyComponent={<EmptyState text="No quotations submitted yet" />}
        contentContainerStyle={styles.content}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 20,
  },
});

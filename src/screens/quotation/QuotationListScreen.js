import { useMemo } from "react";
import { FlatList, StyleSheet } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import AppLoader from "../../components/common/AppLoader";
import QuotationCard from "../../components/quotation/QuotationCard";

import ROUTES from "../../navigation/routes";
import useQuotations from "../../hooks/useQuotations";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

export default function QuotationListScreen({ navigation, route }) {
  const requestId = route?.params?.requestId;

  const { quotations, isLoading, error, fetchQuotations } = useQuotations(
    requestId,
    true,
  );

  const mappedQuotations = useMemo(() => {
    return (quotations || []).map((item) => ({
      id: item.id,
      vendorName: item.vendorName || "Unknown Vendor",
      amount: formatCurrency(item.amount || 0),
      deliveryTime: item.deliveryTime || "-",
      warranty: item.warranty || "-",
      notes: item.notes || "",
      submittedBy: item.submittedBy || "Unknown",
      submittedAt: formatDate(item.createdAt || item.submittedAt),
      isApproved: !!item.isApproved,
    }));
  }, [quotations]);

  if (isLoading && (!quotations || quotations.length === 0)) {
    return (
      <ScreenWrapper>
        <AppHeader title="Quotations" onBack={() => navigation.goBack()} />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Quotations" onBack={() => navigation.goBack()} />

      <FlatList
        data={mappedQuotations}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchQuotations}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <QuotationCard
            {...item}
            onPress={() =>
              navigation.navigate(ROUTES.QUOTATION_COMPARISON, {
                requestId,
                selectedQuotationId: item.id,
              })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState text={error || "No quotations submitted yet"} />
        }
        contentContainerStyle={styles.content}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 20,
    flexGrow: 1,
  },
});

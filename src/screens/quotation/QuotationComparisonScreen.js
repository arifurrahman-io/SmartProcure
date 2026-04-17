import { useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import AppButton from "../../components/common/AppButton";
import VendorInfoCard from "../../components/quotation/VendorInfoCard";
import QuotationComparisonTable from "../../components/quotation/QuotationComparisonTable";
import ApproveQuotationModal from "../../components/quotation/ApproveQuotationModal";
import AppLoader from "../../components/common/AppLoader";
import EmptyState from "../../components/common/EmptyState";

import useQuotations from "../../hooks/useQuotations";
import useUserRole from "../../hooks/useUserRole";
import ROUTES from "../../navigation/routes";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  getFirebaseFriendlyError,
  getErrorMessage,
} from "../../utils/errorHandler";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

export default function QuotationComparisonScreen({ navigation, route }) {
  const requestId = route?.params?.requestId;
  const selectedQuotationId = route?.params?.selectedQuotationId;

  const { isAdmin, canApproveQuotation } = useUserRole();

  const { quotations, isLoading, fetchQuotations, approveSelectedQuotation } =
    useQuotations(requestId, true);

  const [selectedId, setSelectedId] = useState(selectedQuotationId || null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approving, setApproving] = useState(false);

  const normalizedQuotations = useMemo(() => {
    return (quotations || []).map((item) => ({
      id: item.id,
      vendorName: item.vendorName || "Unknown Vendor",
      vendorContact: item.vendorContact || "-",
      specification: item.specification || "-",
      amount: formatCurrency(item.amount || 0),
      rawAmount: item.amount || 0,
      deliveryTime: item.deliveryTime || "-",
      warranty: item.warranty || "-",
      address: item.address || "-",
      notes: item.notes || "",
      isApproved: !!item.isApproved,
    }));
  }, [quotations]);

  useEffect(() => {
    if (!selectedId && normalizedQuotations.length > 0) {
      const approvedQuotation = normalizedQuotations.find(
        (item) => item.isApproved,
      );
      setSelectedId(approvedQuotation?.id || normalizedQuotations[0].id);
    }
  }, [normalizedQuotations, selectedId]);

  const selectedQuotation = useMemo(() => {
    return normalizedQuotations.find((item) => item.id === selectedId) || null;
  }, [normalizedQuotations, selectedId]);

  const handleApprove = async () => {
    if (!selectedQuotation?.id) {
      showErrorToast("Approval Failed", "No quotation selected");
      return;
    }

    try {
      setApproving(true);

      await approveSelectedQuotation(selectedQuotation.id);

      showSuccessToast(
        "Quotation Approved",
        "The selected quotation has been approved successfully",
      );

      setShowApproveModal(false);
      await fetchQuotations();

      navigation.goBack();
    } catch (error) {
      const message =
        getFirebaseFriendlyError(error) ||
        getErrorMessage(error, "Failed to approve quotation");

      showErrorToast("Approval Failed", message);
    } finally {
      setApproving(false);
    }
  };

  if (isLoading && (!quotations || quotations.length === 0)) {
    return (
      <ScreenWrapper>
        <AppHeader
          title="Compare Quotations"
          onBack={() => navigation.goBack()}
        />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  if (!requestId) {
    return (
      <ScreenWrapper>
        <AppHeader
          title="Compare Quotations"
          onBack={() => navigation.goBack()}
        />
        <EmptyState text="Invalid request reference" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader
        title="Compare Quotations"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchQuotations} />
        }
      >
        {normalizedQuotations.length === 0 ? (
          <EmptyState text="No quotations submitted yet" />
        ) : (
          <>
            <QuotationComparisonTable
              quotations={normalizedQuotations}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />

            <View style={styles.section}>
              <VendorInfoCard
                vendorName={selectedQuotation?.vendorName}
                vendorContact={selectedQuotation?.vendorContact}
                specification={selectedQuotation?.specification}
                address={selectedQuotation?.address}
              />
            </View>

            {canApproveQuotation || isAdmin ? (
              <AppButton
                title={
                  selectedQuotation?.isApproved
                    ? "Already Approved"
                    : "Approve Selected Quotation"
                }
                onPress={() => setShowApproveModal(true)}
                style={styles.button}
                disabled={selectedQuotation?.isApproved}
              />
            ) : (
              <AppButton
                title="View Request Details"
                onPress={() =>
                  navigation.navigate(ROUTES.REQUEST_DETAILS, { requestId })
                }
                style={styles.button}
              />
            )}
          </>
        )}
      </ScrollView>

      <ApproveQuotationModal
        visible={showApproveModal}
        vendorName={selectedQuotation?.vendorName}
        amount={selectedQuotation?.amount}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApprove}
        loading={approving}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 14,
  },
  button: {
    marginTop: 6,
    marginBottom: 20,
  },
});

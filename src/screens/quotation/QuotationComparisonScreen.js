import { useMemo, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import AppButton from "../../components/common/AppButton";
import AppLoader from "../../components/common/AppLoader";
import EmptyState from "../../components/common/EmptyState";
import VendorInfoCard from "../../components/quotation/VendorInfoCard";
import QuotationComparisonTable from "../../components/quotation/QuotationComparisonTable";
import ApproveQuotationModal from "../../components/quotation/ApproveQuotationModal";
import useQuotations from "../../hooks/useQuotations";
import useUserRole from "../../hooks/useUserRole";
import ROUTES from "../../navigation/routes";
import { formatDateTime } from "../../utils/formatDate";

const normalizeAmount = (value) => {
  const raw = String(value ?? "").replace(/[^\d.]/g, "");
  const num = Number(raw);
  return Number.isFinite(num) ? num : 0;
};

export default function QuotationComparisonScreen({ navigation, route }) {
  const requestId = route?.params?.requestId;
  const initialSelectedQuotationId = route?.params?.selectedQuotationId || null;
  const { canApproveQuotation } = useUserRole();

  const {
    quotations,
    isLoading,
    isApproving,
    error,
    refreshQuotations,
    approveSelectedQuotation,
  } = useQuotations(requestId, true);

  const [selectedQuotationId, setSelectedQuotationId] = useState(
    initialSelectedQuotationId,
  );
  const [refreshing, setRefreshing] = useState(false);
  const [approveVisible, setApproveVisible] = useState(false);

  const safeQuotations = useMemo(() => {
    return Array.isArray(quotations) ? quotations : [];
  }, [quotations]);

  const selectedQuotation = useMemo(() => {
    if (!selectedQuotationId) return null;
    return (
      safeQuotations.find((item) => item.id === selectedQuotationId) || null
    );
  }, [safeQuotations, selectedQuotationId]);

  const comparisonRows = useMemo(() => {
    return safeQuotations.map((item) => ({
      id: item.id,
      vendorName: item.vendorName || "Unknown Vendor",
      amount: item.amount || 0,
      numericAmount: normalizeAmount(item.amount),
      deliveryTime: item.deliveryTime || "-",
      specification: item.specification || "-",
      warranty: item.warranty || "-",
      isApproved: !!item.isApproved,
      isSelected: item.id === selectedQuotationId,
    }));
  }, [safeQuotations, selectedQuotationId]);

  const sortedVendorCards = useMemo(() => {
    return [...safeQuotations].sort(
      (a, b) => normalizeAmount(a.amount) - normalizeAmount(b.amount),
    );
  }, [safeQuotations]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshQuotations();
    } finally {
      setRefreshing(false);
    }
  };

  const handleSelectQuotation = (quotationId) => {
    if (!canApproveQuotation) return;
    setSelectedQuotationId(quotationId);
  };

  const handleApprovePress = () => {
    if (!canApproveQuotation) {
      Alert.alert("View only", "Only admins can approve quotations.");
      return;
    }

    if (!selectedQuotationId) {
      Alert.alert("Select quotation", "Please select a quotation to approve.");
      return;
    }
    setApproveVisible(true);
  };

  const handleApproveConfirm = async () => {
    if (!selectedQuotationId) return;

    const result = await approveSelectedQuotation(selectedQuotationId);

    if (!result?.success) {
      Alert.alert(
        "Approval failed",
        result?.error || "Failed to approve quotation.",
      );
      return;
    }

    setApproveVisible(false);

    Alert.alert(
      "Quotation approved",
      "The selected quotation has been approved and a purchase instruction has been created.",
      [
        {
          text: "View request",
          onPress: () =>
            navigation.replace(ROUTES.REQUEST_DETAILS, {
              requestId,
            }),
        },
        {
          text: "OK",
          style: "cancel",
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <AppHeader
          title="Quotation Comparison"
          onBack={() => navigation.goBack()}
        />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  if (error && safeQuotations.length === 0) {
    return (
      <ScreenWrapper>
        <AppHeader
          title="Quotation Comparison"
          onBack={() => navigation.goBack()}
        />
        <EmptyState text={error || "Failed to load quotations."} />
      </ScreenWrapper>
    );
  }

  if (safeQuotations.length === 0) {
    return (
      <ScreenWrapper>
        <AppHeader
          title="Quotation Comparison"
          onBack={() => navigation.goBack()}
        />
        <EmptyState text="No quotations found for this request yet." />
        <View style={styles.footer}>
          <AppButton
            title="Submit Quotation"
            onPress={() =>
              navigation.navigate(ROUTES.SUBMIT_QUOTATION, {
                requestId,
              })
            }
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader
        title="Quotation Comparison"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.section}>
          {sortedVendorCards.map((item) => (
            <VendorInfoCard
              key={item.id}
              vendorName={item.vendorName || "Unknown Vendor"}
              vendorContact={item.vendorContact || "-"}
              specification={item.specification || "-"}
              amount={item.amount || "-"}
              deliveryTime={item.deliveryTime || "-"}
              notes={item.notes || ""}
              submittedBy={item.submittedBy || "Unknown"}
              createdAt={formatDateTime(item.createdAt)}
              isSelected={canApproveQuotation && item.id === selectedQuotationId}
              isApproved={!!item.isApproved}
              onPress={() => handleSelectQuotation(item.id)}
              disabled={!canApproveQuotation}
            />
          ))}
        </View>

        <View style={styles.section}>
          <QuotationComparisonTable
            quotations={comparisonRows}
            selectedQuotationId={selectedQuotationId}
            onSelectQuotation={handleSelectQuotation}
            canSelect={canApproveQuotation}
          />
        </View>

        <View style={styles.footer}>
          <AppButton
            title="Add Another Quotation"
            onPress={() =>
              navigation.navigate(ROUTES.SUBMIT_QUOTATION, {
                requestId,
              })
            }
            style={styles.secondaryButton}
          />

          {canApproveQuotation ? (
            <AppButton
              title={isApproving ? "Approving..." : "Approve Selected Quotation"}
              onPress={handleApprovePress}
              loading={isApproving}
              disabled={!selectedQuotationId || isApproving}
            />
          ) : null}
        </View>
      </ScrollView>

      {canApproveQuotation ? (
        <ApproveQuotationModal
          visible={approveVisible}
          onClose={() => setApproveVisible(false)}
          onConfirm={handleApproveConfirm}
          loading={isApproving}
          quotation={selectedQuotation}
        />
      ) : null}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  footer: {
    gap: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  secondaryButton: {
    marginBottom: 0,
  },
});

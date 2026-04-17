import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import AppButton from "../../components/common/AppButton";
import VendorInfoCard from "../../components/quotation/VendorInfoCard";
import QuotationComparisonTable from "../../components/quotation/QuotationComparisonTable";
import ApproveQuotationModal from "../../components/quotation/ApproveQuotationModal";

export default function QuotationComparisonScreen({ navigation, route }) {
  const requestId = route?.params?.requestId;
  const selectedQuotationId = route?.params?.selectedQuotationId;

  const quotations = [
    {
      id: "1",
      vendorName: "Tech World BD",
      vendorContact: "017XXXXXXXX",
      specification: "Original toner cartridge",
      amount: "৳ 14,500",
      deliveryTime: "3 days",
      warranty: "6 months",
      address: "Dhaka",
    },
    {
      id: "2",
      vendorName: "Office Supply House",
      vendorContact: "018XXXXXXXX",
      specification: "Compatible toner cartridge",
      amount: "৳ 13,900",
      deliveryTime: "5 days",
      warranty: "No warranty",
      address: "Motijheel, Dhaka",
    },
    {
      id: "3",
      vendorName: "Printer Point",
      vendorContact: "019XXXXXXXX",
      specification: "Original branded toner",
      amount: "৳ 15,200",
      deliveryTime: "2 days",
      warranty: "1 year",
      address: "Banasree, Dhaka",
    },
  ];

  const [selectedId, setSelectedId] = useState(selectedQuotationId || "1");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedQuotation = useMemo(
    () => quotations.find((item) => item.id === selectedId),
    [selectedId],
  );

  const handleApprove = async () => {
    try {
      setLoading(true);
      console.log("Approve quotation:", requestId, selectedQuotation);
      setShowApproveModal(false);
      navigation.goBack();
    } catch (error) {
      console.log("Approve error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <AppHeader
        title="Compare Quotations"
        onBack={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <QuotationComparisonTable
          quotations={quotations}
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

        <AppButton
          title="Approve Selected Quotation"
          onPress={() => setShowApproveModal(true)}
          style={styles.button}
        />
      </ScrollView>

      <ApproveQuotationModal
        visible={showApproveModal}
        vendorName={selectedQuotation?.vendorName}
        amount={selectedQuotation?.amount}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApprove}
        loading={loading}
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

import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AppButton from "../common/AppButton";

export default function ApproveQuotationModal({
  visible,
  vendorName,
  amount,
  quotation,
  onClose,
  onConfirm,
  loading = false,
}) {
  const safeVendorName = vendorName || quotation?.vendorName;
  const safeAmount = amount || quotation?.amount;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Approve Quotation</Text>

          <Text style={styles.message}>
            Are you sure you want to approve this quotation?
          </Text>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Vendor</Text>
            <Text style={styles.summaryValue}>{safeVendorName || "-"}</Text>

            <Text style={[styles.summaryLabel, { marginTop: 12 }]}>Amount</Text>
            <Text style={styles.summaryValue}>{safeAmount || "-"}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <View style={styles.confirmWrap}>
              <AppButton
                title="Approve Now"
                onPress={onConfirm}
                loading={loading}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  message: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: "#64748B",
  },
  summaryBox: {
    marginTop: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 14,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  summaryValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingRight: 14,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
  },
  confirmWrap: {
    flex: 1,
  },
});

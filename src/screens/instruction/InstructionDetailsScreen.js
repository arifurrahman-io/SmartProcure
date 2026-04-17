import { useState } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import AppButton from "../../components/common/AppButton";
import InstructionStatusTracker from "../../components/instruction/InstructionStatusTracker";
import CompletionNoteModal from "../../components/instruction/CompletionNoteModal";
import VendorInfoCard from "../../components/quotation/VendorInfoCard";
import StatusBadge from "../../components/common/StatusBadge";

export default function InstructionDetailsScreen({ navigation, route }) {
  const instructionId = route?.params?.instructionId;

  const instruction = {
    id: instructionId || "1",
    itemName: "Projector",
    vendorName: "Tech World BD",
    vendorContact: "017XXXXXXXX",
    specification: "Full HD projector",
    address: "Dhaka",
    amount: "৳ 45,000",
    campus: "Banasree",
    shift: "Morning",
    approvedBy: "Admin",
    approvedAt: "17 Apr 2026",
    status: "Delivered",
    note: "Vendor confirmed dispatch and delivery completed.",
  };

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleComplete = async (note) => {
    try {
      setLoading(true);
      console.log("Complete instruction:", instruction.id, note);
      setShowModal(false);
      navigation.goBack();
    } catch (error) {
      console.log("Complete error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <AppHeader
        title="Instruction Details"
        onBack={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.titleWrap}>
              <Text style={styles.itemName}>{instruction.itemName}</Text>
              <Text style={styles.meta}>
                {instruction.campus} • {instruction.shift}
              </Text>
            </View>
            <StatusBadge status={instruction.status} />
          </View>

          <Text style={styles.amount}>{instruction.amount}</Text>
          <Text style={styles.subMeta}>
            Approved by {instruction.approvedBy} on {instruction.approvedAt}
          </Text>
        </View>

        <InstructionStatusTracker currentStatus={instruction.status} />

        <VendorInfoCard
          vendorName={instruction.vendorName}
          vendorContact={instruction.vendorContact}
          specification={instruction.specification}
          address={instruction.address}
        />

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Completion / Delivery Note</Text>
          <Text style={styles.noteText}>{instruction.note}</Text>
        </View>

        <AppButton
          title="Mark as Completed"
          onPress={() => setShowModal(true)}
          style={styles.button}
        />
      </ScrollView>

      <CompletionNoteModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleComplete}
        loading={loading}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  titleWrap: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  meta: {
    marginTop: 6,
    fontSize: 13,
    color: "#64748B",
  },
  amount: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: "800",
    color: "#1D4ED8",
  },
  subMeta: {
    marginTop: 6,
    fontSize: 12,
    color: "#94A3B8",
  },
  noteCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  noteTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
  },
  noteText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#475569",
  },
  button: {
    marginBottom: 20,
  },
});

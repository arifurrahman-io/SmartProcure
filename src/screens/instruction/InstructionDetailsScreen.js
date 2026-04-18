import { useMemo, useState } from "react";
import { Platform, ScrollView, StyleSheet, View, Text } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import AppButton from "../../components/common/AppButton";
import AppLoader from "../../components/common/AppLoader";
import EmptyState from "../../components/common/EmptyState";
import InstructionStatusTracker from "../../components/instruction/InstructionStatusTracker";
import CompletionNoteModal from "../../components/instruction/CompletionNoteModal";
import VendorInfoCard from "../../components/quotation/VendorInfoCard";
import StatusBadge from "../../components/common/StatusBadge";

import useInstructions from "../../hooks/useInstructions";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

export default function InstructionDetailsScreen({ navigation, route }) {
  const instructionId = route?.params?.instructionId;
  const {
    instruction,
    isLoading,
    error,
    fetchInstructionDetails,
    completeInstruction,
  } = useInstructions(instructionId, true);

  const [showModal, setShowModal] = useState(false);
  const [completionLoading, setCompletionLoading] = useState(false);

  const mappedInstruction = useMemo(() => {
    if (!instruction) return null;

    return {
      id: instruction.id,
      itemName:
        instruction.itemName || instruction.title || "Untitled Instruction",
      vendorName: instruction.vendorName || "Unknown Vendor",
      vendorContact:
        instruction.vendorContact || instruction.vendorPhone || "-",
      specification:
        instruction.specification || instruction.description || "-",
      address: instruction.address || instruction.vendorAddress || "",
      amount: formatCurrency(instruction.amount || 0),
      campus: instruction.campus || "-",
      shift: instruction.shift || "-",
      approvedBy: instruction.approvedBy || "Admin",
      approvedAt: formatDate(instruction.approvedAt || instruction.createdAt),
      status: instruction.status || "Approved",
      note: instruction.completionNote || instruction.note || "-",
    };
  }, [instruction]);

  const isCompleted =
    String(mappedInstruction?.status || "").toLowerCase() === "completed";

  const handleComplete = async (note) => {
    try {
      setCompletionLoading(true);
      await completeInstruction(note);
      setShowModal(false);
      await fetchInstructionDetails();
    } catch (error) {
      console.log("Complete error:", error);
    } finally {
      setCompletionLoading(false);
    }
  };

  if (isLoading && !mappedInstruction) {
    return (
      <ScreenWrapper>
        <AppHeader
          title="Instruction Details"
          onBack={() => navigation.goBack()}
        />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  if (error || !mappedInstruction) {
    return (
      <ScreenWrapper>
        <AppHeader
          title="Instruction Details"
          onBack={() => navigation.goBack()}
        />
        <EmptyState text={error || "Instruction details not found"} />
      </ScreenWrapper>
    );
  }

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
              <Text style={styles.itemName}>{mappedInstruction.itemName}</Text>
              <Text style={styles.meta}>
                {mappedInstruction.campus} - {mappedInstruction.shift}
              </Text>
            </View>
            <StatusBadge status={mappedInstruction.status} />
          </View>

          <Text style={styles.amount}>{mappedInstruction.amount}</Text>
          <Text style={styles.subMeta}>
            Approved by {mappedInstruction.approvedBy} on{" "}
            {mappedInstruction.approvedAt}
          </Text>
        </View>

        <InstructionStatusTracker currentStatus={mappedInstruction.status} />

        <VendorInfoCard
          vendorName={mappedInstruction.vendorName}
          vendorContact={mappedInstruction.vendorContact}
          specification={mappedInstruction.specification}
          address={mappedInstruction.address}
        />

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Completion / Delivery Note</Text>
          <Text style={styles.noteText}>{mappedInstruction.note}</Text>
        </View>

        {!isCompleted ? (
          <AppButton
            title="Mark as Completed"
            onPress={() => setShowModal(true)}
            style={styles.button}
          />
        ) : null}
      </ScrollView>

      <CompletionNoteModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleComplete}
        loading={completionLoading}
        defaultValue={
          mappedInstruction.note === "-" ? "" : mappedInstruction.note
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...Platform.select({
      web: {
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
      },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      },
    }),
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
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
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

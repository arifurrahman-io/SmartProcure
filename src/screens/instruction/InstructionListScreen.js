import { useMemo } from "react";
import { FlatList, StyleSheet } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import AppLoader from "../../components/common/AppLoader";
import InstructionCard from "../../components/instruction/InstructionCard";

import ROUTES from "../../navigation/routes";
import useInstructions from "../../hooks/useInstructions";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

export default function InstructionListScreen({ navigation }) {
  const { instructions, isLoading, error, fetchInstructions } = useInstructions(
    null,
    true,
  );

  const mappedInstructions = useMemo(() => {
    return (instructions || []).map((item) => ({
      id: item.id,
      itemName: item.itemName || item.title || "Untitled Instruction",
      vendorName: item.vendorName || "Unknown Vendor",
      amount: formatCurrency(item.amount || 0),
      campus: item.campus || "-",
      shift: item.shift || "-",
      approvedBy: item.approvedBy || "Admin",
      approvedAt: formatDate(item.approvedAt || item.createdAt),
      status: item.status || "Approved",
    }));
  }, [instructions]);

  if (isLoading && (!instructions || instructions.length === 0)) {
    return (
      <ScreenWrapper>
        <AppHeader title="Instructions" onBack={() => navigation.goBack()} />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Instructions" onBack={() => navigation.goBack()} />

      <FlatList
        data={mappedInstructions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchInstructions}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <InstructionCard
            {...item}
            onPress={() =>
              navigation.navigate(ROUTES.INSTRUCTION_DETAILS, {
                instructionId: item.id,
              })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState text={error || "No approved instructions found"} />
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

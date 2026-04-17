import { FlatList, StyleSheet } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import InstructionCard from "../../components/instruction/InstructionCard";

export default function InstructionListScreen({ navigation }) {
  const instructions = [
    {
      id: "1",
      itemName: "Projector",
      vendorName: "Tech World BD",
      amount: "৳ 45,000",
      campus: "Banasree",
      shift: "Morning",
      approvedBy: "Admin",
      approvedAt: "17 Apr 2026",
      status: "Purchase In Progress",
    },
    {
      id: "2",
      itemName: "Printer Toner",
      vendorName: "Office Supply House",
      amount: "৳ 13,900",
      campus: "Malibag",
      shift: "Day",
      approvedBy: "Admin",
      approvedAt: "16 Apr 2026",
      status: "Delivered",
    },
  ];

  return (
    <ScreenWrapper>
      <AppHeader title="Instructions" onBack={() => navigation.goBack()} />

      <FlatList
        data={instructions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <InstructionCard
            {...item}
            onPress={() =>
              navigation.navigate("InstructionDetails", {
                instructionId: item.id,
              })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState text="No approved instructions found" />
        }
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

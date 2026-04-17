import { FlatList, StyleSheet } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import PendingApprovalCard from "../../components/dashboard/PendingApprovalCard";

export default function PendingApprovalsScreen({ navigation }) {
  const items = [
    {
      id: "1",
      itemName: "Desktop Computer",
      campus: "Mohammadpur",
      shift: "Day",
      quotationCount: 4,
    },
    {
      id: "2",
      itemName: "Office Chair",
      campus: "Malibag",
      shift: "Morning",
      quotationCount: 3,
    },
    {
      id: "3",
      itemName: "White Board Marker",
      campus: "Banasree",
      shift: "A",
      quotationCount: 2,
    },
  ];

  return (
    <ScreenWrapper>
      <AppHeader title="Pending Approvals" onBack={() => navigation.goBack()} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PendingApprovalCard
            itemName={item.itemName}
            campus={item.campus}
            shift={item.shift}
            quotationCount={item.quotationCount}
            onPress={() =>
              navigation.navigate("RequestDetails", { requestId: item.id })
            }
          />
        )}
        ListEmptyComponent={<EmptyState text="No pending approvals found" />}
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

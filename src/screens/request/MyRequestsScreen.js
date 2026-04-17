import { FlatList, StyleSheet } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import RequestCard from "../../components/request/RequestCard";

export default function MyRequestsScreen({ navigation }) {
  const myRequests = [
    {
      id: "1",
      itemName: "Printer Toner",
      category: "Office Supplies",
      campus: "Banasree",
      shift: "Morning",
      requester: "Arifur Rahman",
      date: "17 Apr 2026",
      status: "Pending",
      urgency: "High",
      quotationCount: 3,
    },
    {
      id: "2",
      itemName: "Office Chair",
      category: "Furniture",
      campus: "Banasree",
      shift: "Day",
      requester: "Arifur Rahman",
      date: "15 Apr 2026",
      status: "Approved",
      urgency: "Medium",
      quotationCount: 2,
    },
  ];

  return (
    <ScreenWrapper>
      <AppHeader title="My Requests" onBack={() => navigation.goBack()} />

      <FlatList
        data={myRequests}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <RequestCard
            {...item}
            onPress={() =>
              navigation.navigate("RequestDetails", { requestId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState text="You have not created any request yet" />
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

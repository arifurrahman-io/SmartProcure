import { useMemo, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import RequestCard from "../../components/request/RequestCard";
import AppButton from "../../components/common/AppButton";

export default function RequestListScreen({ navigation }) {
  const [search, setSearch] = useState("");

  const requests = [
    {
      id: "1",
      itemName: "Printer Toner",
      category: "Office Supplies",
      campus: "Banasree",
      shift: "Morning",
      requester: "Arif",
      date: "17 Apr 2026",
      status: "Pending",
      urgency: "High",
      quotationCount: 3,
    },
    {
      id: "2",
      itemName: "Projector",
      category: "IT Equipment",
      campus: "Malibag",
      shift: "Day",
      requester: "Nayeem",
      date: "16 Apr 2026",
      status: "Approved",
      urgency: "Medium",
      quotationCount: 2,
    },
  ];

  const filteredRequests = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return requests;

    return requests.filter(
      (item) =>
        item.itemName.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.campus.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <ScreenWrapper>
      <AppHeader title="All Requests" onBack={() => navigation.goBack()} />

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search requests..."
      />

      <View style={styles.topActions}>
        <View style={styles.buttonWrap}>
          <AppButton
            title="Create Request"
            onPress={() => navigation.navigate("CreateRequest")}
          />
        </View>
      </View>

      <FlatList
        data={filteredRequests}
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
        ListEmptyComponent={<EmptyState text="No requests found" />}
        contentContainerStyle={styles.listContent}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topActions: {
    marginBottom: 14,
  },
  buttonWrap: {
    width: 170,
  },
  listContent: {
    paddingBottom: 20,
  },
});

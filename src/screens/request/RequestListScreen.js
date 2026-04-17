import { useMemo, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import AppButton from "../../components/common/AppButton";
import AppLoader from "../../components/common/AppLoader";
import RequestCard from "../../components/request/RequestCard";

import ROUTES from "../../navigation/routes";
import useRequests from "../../hooks/useRequests";
import useDebounce from "../../hooks/useDebounce";
import { filterRequests, getRequestAuthor } from "../../utils/requestHelpers";
import { formatDate } from "../../utils/formatDate";

export default function RequestListScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { requests, isLoading, refreshRequests } = useRequests(true);

  const mappedRequests = useMemo(() => {
    return (requests || []).map((item) => {
      const author = getRequestAuthor(item);

      return {
        id: item.id,
        itemName: item.itemName || item.title || "Untitled Request",
        category: item.category || "Uncategorized",
        campus: item.campus || "-",
        shift: item.shift || "-",
        requester: author.name,
        date: formatDate(item.createdAt),
        status: item.status || "Pending",
        urgency: item.urgency || "Medium",
        quotationCount: item.quotationCount || 0,
      };
    });
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return filterRequests(mappedRequests, {
      search: debouncedSearch,
      campus: "All",
      shift: "All",
      status: "All",
    });
  }, [mappedRequests, debouncedSearch]);

  if (isLoading && (!requests || requests.length === 0)) {
    return (
      <ScreenWrapper>
        <AppHeader title="All Requests" onBack={() => navigation.goBack()} />
        <AppLoader />
      </ScreenWrapper>
    );
  }

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
            onPress={() => navigation.navigate(ROUTES.CREATE_REQUEST)}
          />
        </View>
      </View>

      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onRefresh={refreshRequests}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <RequestCard
            {...item}
            onPress={() =>
              navigation.navigate(ROUTES.REQUEST_DETAILS, {
                requestId: item.id,
              })
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
    flexGrow: 1,
  },
});

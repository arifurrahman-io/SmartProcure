import { useMemo } from "react";
import { FlatList, StyleSheet } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import AppLoader from "../../components/common/AppLoader";
import RequestCard from "../../components/request/RequestCard";

import ROUTES from "../../navigation/routes";
import useAuth from "../../hooks/useAuth";
import useRequests from "../../hooks/useRequests";
import { formatDateTime } from "../../utils/formatDate";
import { getRequestAuthor } from "../../utils/requestHelpers";

export default function MyRequestsScreen({ navigation }) {
  const { profile, isLoading: authLoading } = useAuth();
  const {
    requests,
    isLoading: requestsLoading,
    refreshRequests,
  } = useRequests(true);

  const isLoading = authLoading || requestsLoading;

  const myRequests = useMemo(() => {
    if (!profile || !requests?.length) return [];

    const currentUserId = profile?.id || profile?.uid || null;
    const currentEmail = String(profile?.email || "").toLowerCase();

    return requests
      .filter((item) => {
        const author = getRequestAuthor(item, "");
        const itemEmail = String(author.email || "").toLowerCase();

        return (
          (currentUserId && author.id === currentUserId) ||
          (currentEmail && itemEmail === currentEmail)
        );
      })
      .map((item) => {
        const author = getRequestAuthor(item, profile?.name || "Current User");

        return {
          id: item.id,
          itemName: item.itemName || item.title || "Untitled Request",
          category: item.category || "Uncategorized",
          campus: item.campus || "-",
          shift: item.shift || "-",
          requester: author.name,
          createdAt: formatDateTime(item.createdAt),
          status: item.status || "Pending",
          urgency: item.urgency || "Medium",
          quotationCount: item.quotationCount || 0,
        };
      });
  }, [profile, requests]);

  if (isLoading && (!requests || requests.length === 0)) {
    return (
      <ScreenWrapper>
        <AppHeader title="My Requests" onBack={() => navigation.goBack()} />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="My Requests" onBack={() => navigation.goBack()} />

      <FlatList
        data={myRequests}
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
    flexGrow: 1,
  },
});

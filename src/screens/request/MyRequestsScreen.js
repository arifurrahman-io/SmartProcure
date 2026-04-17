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
import { formatDate } from "../../utils/formatDate";

export default function MyRequestsScreen({ navigation }) {
  const { profile, isLoading: authLoading } = useAuth();
  const {
    requests,
    isLoading: requestsLoading,
    fetchRequests,
  } = useRequests(true);

  const isLoading = authLoading || requestsLoading;

  const myRequests = useMemo(() => {
    if (!profile || !requests?.length) return [];

    const currentUserId = profile?.id || profile?.uid || null;
    const currentEmail = String(profile?.email || "").toLowerCase();

    return requests
      .filter((item) => {
        const createdBy = item?.createdBy || item?.submittedById || null;
        const itemEmail = String(
          item?.requesterEmail || item?.email || "",
        ).toLowerCase();

        return (
          (currentUserId && createdBy === currentUserId) ||
          (currentEmail && itemEmail === currentEmail)
        );
      })
      .map((item) => ({
        id: item.id,
        itemName: item.itemName || item.title || "Untitled Request",
        category: item.category || "Uncategorized",
        campus: item.campus || "-",
        shift: item.shift || "-",
        requester:
          item.requester ||
          item.requesterName ||
          profile?.name ||
          "Current User",
        date: formatDate(item.createdAt),
        status: item.status || "Pending",
        urgency: item.urgency || "Medium",
        quotationCount: item.quotationCount || 0,
      }));
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
        onRefresh={fetchRequests}
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

import { useMemo } from "react";
import { FlatList, StyleSheet } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import AppLoader from "../../components/common/AppLoader";
import PendingApprovalCard from "../../components/dashboard/PendingApprovalCard";

import ROUTES from "../../navigation/routes";
import useRequests from "../../hooks/useRequests";
import { isPendingApprovalStatus } from "../../constants/requestStatus";
import { formatDateTime } from "../../utils/formatDate";
import { getRequestAuthor } from "../../utils/requestHelpers";

export default function PendingApprovalsScreen({ navigation }) {
  const { requests, isLoading, error, refreshRequests } = useRequests(true);

  const pendingRequests = useMemo(() => {
    return (requests || [])
      .filter((item) => isPendingApprovalStatus(item.status))
      .map((item) => {
        const author = getRequestAuthor(item) || {};

        return {
          id: item.id,
          itemName: item.itemName || item.title || "Untitled Request",
          campus: item.campus || "-",
          shift: item.shift || "-",
          requester: author.name || "Unknown",
          createdAt: formatDateTime(item.createdAt),
          quotationCount: item.quotationCount || 0,
        };
      });
  }, [requests]);

  if (isLoading && (!requests || requests.length === 0)) {
    return (
      <ScreenWrapper>
        <AppHeader
          title="Pending Approvals"
          onBack={() => navigation.goBack()}
        />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Pending Approvals" onBack={() => navigation.goBack()} />

      <FlatList
        data={pendingRequests}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onRefresh={refreshRequests}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <PendingApprovalCard
            itemName={item.itemName}
            campus={item.campus}
            shift={item.shift}
            requester={item.requester}
            createdAt={item.createdAt}
            quotationCount={item.quotationCount}
            onPress={() =>
              navigation.navigate(ROUTES.MAIN_TABS, {
                screen: ROUTES.REQUESTS,
                params: {
                  screen: ROUTES.REQUEST_DETAILS,
                  params: { requestId: item.id },
                },
              })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState text={error || "No pending approvals found"} />
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

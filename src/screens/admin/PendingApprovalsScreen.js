import { useMemo } from "react";
import { FlatList, StyleSheet } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import AppLoader from "../../components/common/AppLoader";
import PendingApprovalCard from "../../components/dashboard/PendingApprovalCard";

import ROUTES from "../../navigation/routes";
import useRequests from "../../hooks/useRequests";
import { REQUEST_STATUS } from "../../constants/requestStatus";

export default function PendingApprovalsScreen({ navigation }) {
  const { requests, isLoading, error, refreshRequests } = useRequests(true);

  const pendingRequests = useMemo(() => {
    return (requests || [])
      .filter(
        (item) =>
          String(item.status || "").toLowerCase() ===
          String(REQUEST_STATUS.PENDING).toLowerCase(),
      )
      .map((item) => ({
        id: item.id,
        itemName: item.itemName || item.title || "Untitled Request",
        campus: item.campus || "-",
        shift: item.shift || "-",
        quotationCount: item.quotationCount || 0,
      }));
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
            quotationCount={item.quotationCount}
            onPress={() =>
              navigation.navigate(ROUTES.REQUEST_DETAILS, {
                requestId: item.id,
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

import { RefreshControl, ScrollView, View, StyleSheet } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import AppButton from "../../components/common/AppButton";
import RequestDetailsHeader from "../../components/request/RequestDetailsHeader";
import RequestMetaInfo from "../../components/request/RequestMetaInfo";
import RequestTimeline from "../../components/request/RequestTimeline";
import AppLoader from "../../components/common/AppLoader";
import EmptyState from "../../components/common/EmptyState";

import ROUTES from "../../navigation/routes";
import useRequestDetails from "../../hooks/useRequestDetails";
import { formatDate, formatDateTime } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

export default function RequestDetailsScreen({ navigation, route }) {
  const requestId = route?.params?.requestId;

  const { request, isLoading, error, fetchRequestDetails } =
    useRequestDetails(requestId);

  const timelineItems = request
    ? [
        {
          title: "Request Created",
          description: "Initial purchase request submitted.",
          time: formatDateTime(request.createdAt),
        },
        request.status
          ? {
              title: `Status Updated: ${request.status}`,
              description: "Request status has been updated in the system.",
              time: formatDateTime(request.updatedAt || request.createdAt),
            }
          : null,
      ].filter(Boolean)
    : [];

  if (isLoading) {
    return (
      <ScreenWrapper>
        <AppHeader title="Request Details" onBack={() => navigation.goBack()} />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  if (error || !request) {
    return (
      <ScreenWrapper>
        <AppHeader title="Request Details" onBack={() => navigation.goBack()} />
        <EmptyState text={error || "Request details not found"} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Request Details" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchRequestDetails}
          />
        }
      >
        <RequestDetailsHeader
          itemName={request.itemName || request.title || "Untitled Request"}
          category={request.category || "Uncategorized"}
          status={request.status || "Pending"}
          urgency={request.urgency || "Medium"}
          campus={request.campus || "-"}
          shift={request.shift || "-"}
        />

        <RequestMetaInfo
          requester={
            request.requester ||
            request.requesterName ||
            request.createdByName ||
            "Unknown"
          }
          quantity={request.quantity || "-"}
          budget={formatCurrency(request.budget || 0)}
          neededBy={formatDate(request.neededBy)}
          reason={request.reason || "-"}
          createdAt={formatDate(request.createdAt)}
        />

        <RequestTimeline items={timelineItems} />

        <View style={styles.actionWrap}>
          <AppButton
            title="Submit Quotation"
            onPress={() =>
              navigation.navigate(ROUTES.SUBMIT_QUOTATION, {
                requestId: request.id,
              })
            }
          />
        </View>

        <View style={styles.actionWrap}>
          <AppButton
            title="Edit Request"
            onPress={() =>
              navigation.navigate(ROUTES.EDIT_REQUEST, {
                requestId: request.id,
              })
            }
          />
        </View>

        <View style={styles.actionWrap}>
          <AppButton
            title="View Quotations"
            onPress={() =>
              navigation.navigate(ROUTES.QUOTATION_LIST, {
                requestId: request.id,
              })
            }
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  actionWrap: {
    marginBottom: 12,
  },
});

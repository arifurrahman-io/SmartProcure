import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import AppButton from "../../components/common/AppButton";
import AppLoader from "../../components/common/AppLoader";
import EmptyState from "../../components/common/EmptyState";

import RequestDetailsHeader from "../../components/request/RequestDetailsHeader";
import RequestMetaInfo from "../../components/request/RequestMetaInfo";
import RequestTimeline from "../../components/request/RequestTimeline";

import ROUTES from "../../navigation/routes";
import useRequestDetails from "../../hooks/useRequestDetails";
import useAuthStore from "../../store/useAuthStore";

import { formatDate, formatDateTime } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { getRequestAuthor } from "../../utils/requestHelpers";
import { isQuotationOpenStatus } from "../../constants/requestStatus";

const toDateTimeValue = (value) => {
  if (!value) return null;

  if (typeof value?.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (typeof value === "object" && typeof value?.seconds === "number") {
    return new Date(value.seconds * 1000).toISOString();
  }

  return value;
};

export default function RequestDetailsScreen({ navigation, route }) {
  const requestId = route?.params?.requestId;
  const profile = useAuthStore((state) => state.profile);

  const [refreshing, setRefreshing] = useState(false);

  const { request, loading, updating, error, refreshRequest, updateRequest } =
    useRequestDetails(requestId);

  const author = getRequestAuthor(request);

  const currentUserId = profile?.id || profile?.uid || null;

  const requestAuthorId =
    request?.authorId ||
    request?.createdById ||
    request?.userId ||
    request?.requestedById ||
    null;

  const isCreator =
    requestAuthorId && currentUserId
      ? String(requestAuthorId) === String(currentUserId)
      : false;

  const timelineItems = useMemo(() => {
    if (!request) return [];

    const createdAt = toDateTimeValue(request.createdAt);
    const updatedAt = toDateTimeValue(request.updatedAt);
    const approvedAt = toDateTimeValue(request.approvedAt);
    const rejectedAt = toDateTimeValue(request.rejectedAt);
    const completedAt = toDateTimeValue(request.completedAt);
    const neededBy = toDateTimeValue(request.neededBy);
    const lastQuotationAt = toDateTimeValue(request.lastQuotationAt);

    const items = [
      {
        key: "created",
        title: "Request Created",
        description: `${author?.name || "Unknown"} submitted the purchase request.`,
        time: formatDateTime(createdAt),
        sortValue: createdAt || 0,
      },
    ];

    if (
      request?.quotationCount ||
      request?.quotations?.length ||
      lastQuotationAt
    ) {
      items.push({
        key: "quotation",
        title: "Quotation Activity",
        description: `${
          request?.quotationCount || request?.quotations?.length || 0
        } quotation(s) are linked to this request.`,
        time: formatDateTime(lastQuotationAt || updatedAt || createdAt),
        sortValue: lastQuotationAt || updatedAt || createdAt || 0,
      });
    }

    if (request?.status === "approved" || approvedAt) {
      items.push({
        key: "approved",
        title: "Quotation Approved",
        description:
          request?.approvedQuotationId || request?.selectedQuotationId
            ? "A quotation was selected and approved for this request."
            : "This request was approved in the system.",
        time: formatDateTime(approvedAt || updatedAt || createdAt),
        sortValue: approvedAt || updatedAt || createdAt || 0,
      });
    }

    if (request?.instructionId || request?.instructionStatus) {
      items.push({
        key: "instruction",
        title: "Instruction Created",
        description:
          request?.instructionStatus === "completed"
            ? "Purchase instruction has been completed."
            : "Purchase instruction has been issued for execution.",
        time: formatDateTime(updatedAt || createdAt),
        sortValue: updatedAt || createdAt || 0,
      });
    }

    if (request?.status === "completed" || completedAt) {
      items.push({
        key: "completed",
        title: "Request Completed",
        description: "The purchase workflow for this request is complete.",
        time: formatDateTime(completedAt || updatedAt || createdAt),
        sortValue: completedAt || updatedAt || createdAt || 0,
      });
    }

    if (request?.status === "rejected" || rejectedAt) {
      items.push({
        key: "rejected",
        title: "Request Rejected",
        description:
          request?.rejectionReason ||
          "This request was rejected by the authority.",
        time: formatDateTime(rejectedAt || updatedAt || createdAt),
        sortValue: rejectedAt || updatedAt || createdAt || 0,
      });
    }

    if (
      updatedAt &&
      updatedAt !== createdAt &&
      !approvedAt &&
      !rejectedAt &&
      !completedAt
    ) {
      items.push({
        key: "updated",
        title: `Status Updated: ${request?.status || "updated"}`,
        description: "Request details or status were updated in the system.",
        time: formatDateTime(updatedAt),
        sortValue: updatedAt,
      });
    }

    if (neededBy) {
      items.push({
        key: "neededBy",
        title: "Requested Need-by Date",
        description: "The requested delivery or requirement date was recorded.",
        time: formatDateTime(neededBy),
        sortValue: neededBy,
      });
    }

    return items
      .sort((a, b) => new Date(a.sortValue || 0) - new Date(b.sortValue || 0))
      .map(({ key, sortValue, ...rest }) => ({
        id: key,
        ...rest,
      }));
  }, [author?.name, request]);

  const canEditRequest = useMemo(() => {
    if (!request || !profile) return false;

    const isEditableStatus = ["pending", "draft"].includes(
      String(request.status || "").toLowerCase(),
    );

    return isCreator && isEditableStatus;
  }, [request, profile, isCreator]);

  const canSubmitQuotation = useMemo(() => {
    if (!request) return false;

    return isQuotationOpenStatus(request.status);
  }, [request]);

  const canCompleteRequest = useMemo(() => {
    if (!request) return false;

    return ["approved", "in_progress"].includes(
      String(request.status || "").toLowerCase(),
    );
  }, [request]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshRequest();
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkCompleted = async () => {
    const result = await updateRequest({
      status: "completed",
      completedAt: new Date().toISOString(),
      instructionStatus: "completed",
    });

    if (!result?.success) {
      console.log(result?.error || "Failed to complete request.");
    }
  };

  if (loading) {
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
        <EmptyState text={error || "Request not found."} />
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
            refreshing={Boolean(refreshing)}
            onRefresh={handleRefresh}
          />
        }
      >
        <RequestDetailsHeader
          itemName={request.itemName || "Untitled Request"}
          category={request.category || "General"}
          status={request.status || "pending"}
          urgency={request.urgency || request.priority || "normal"}
          campus={request.campus || "-"}
          shift={request.shift || "-"}
        />

        <RequestMetaInfo
          requester={author?.name || "-"}
          quantity={request.quantity ? String(request.quantity) : "-"}
          budget={formatCurrency(
            request.estimatedBudget || request.budget || 0,
          )}
          neededBy={formatDate(toDateTimeValue(request.neededBy))}
          reason={request.reason || request.description || "-"}
          createdAt={formatDateTime(toDateTimeValue(request.createdAt))}
        />

        <RequestTimeline items={timelineItems} />

        <View style={styles.actionWrap}>
          {canSubmitQuotation ? (
            <AppButton
              title="Submit Quotation"
              onPress={() =>
                navigation.navigate(ROUTES.SUBMIT_QUOTATION, {
                  requestId: request.id,
                })
              }
              style={styles.actionButton}
            />
          ) : null}

          <AppButton
            title="View Quotations"
            onPress={() =>
              navigation.navigate(ROUTES.QUOTATION_LIST, {
                requestId: request.id,
              })
            }
            style={styles.actionButton}
          />

          {canEditRequest ? (
            <AppButton
              title="Edit Request"
              onPress={() =>
                navigation.navigate(ROUTES.EDIT_REQUEST, {
                  requestId: request.id,
                })
              }
              style={styles.actionButton}
            />
          ) : null}

          {canCompleteRequest ? (
            <AppButton
              title={updating ? "Updating..." : "Mark as Completed"}
              onPress={handleMarkCompleted}
              loading={updating}
              style={styles.actionButton}
            />
          ) : null}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  actionWrap: {
    marginBottom: 12,
    gap: 12,
  },
  actionButton: {
    marginBottom: 0,
  },
});

import { ScrollView, View, StyleSheet } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import AppButton from "../../components/common/AppButton";
import RequestDetailsHeader from "../../components/request/RequestDetailsHeader";
import RequestMetaInfo from "../../components/request/RequestMetaInfo";
import RequestTimeline from "../../components/request/RequestTimeline";

export default function RequestDetailsScreen({ navigation, route }) {
  const requestId = route?.params?.requestId;

  const request = {
    id: requestId || "1",
    itemName: "Printer Toner",
    category: "Office Supplies",
    campus: "Banasree",
    shift: "Morning",
    status: "Pending",
    urgency: "High",
    requester: "Arifur Rahman",
    quantity: "5 pcs",
    budget: "৳ 15,000",
    neededBy: "25 Apr 2026",
    createdAt: "17 Apr 2026",
    reason: "Urgent need for exam printing and office documentation.",
  };

  const timelineItems = [
    {
      title: "Request Created",
      description: "Initial purchase request submitted.",
      time: "17 Apr 2026, 10:20 AM",
    },
    {
      title: "Quotation Window Open",
      description: "Committee members can now submit vendor quotations.",
      time: "17 Apr 2026, 10:30 AM",
    },
  ];

  return (
    <ScreenWrapper>
      <AppHeader title="Request Details" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <RequestDetailsHeader
          itemName={request.itemName}
          category={request.category}
          status={request.status}
          urgency={request.urgency}
          campus={request.campus}
          shift={request.shift}
        />

        <RequestMetaInfo
          requester={request.requester}
          quantity={request.quantity}
          budget={request.budget}
          neededBy={request.neededBy}
          reason={request.reason}
          createdAt={request.createdAt}
        />

        <RequestTimeline items={timelineItems} />

        <View style={styles.actionWrap}>
          <AppButton
            title="Submit Quotation"
            onPress={() =>
              navigation.navigate("SubmitQuotation", { requestId: request.id })
            }
          />
        </View>

        <View style={styles.actionWrap}>
          <AppButton
            title="Edit Request"
            onPress={() =>
              navigation.navigate("EditRequest", { requestId: request.id })
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

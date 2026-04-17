import { ScrollView, StyleSheet } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import NotificationGroup from "../../components/notification/NotificationGroup";

export default function NotificationsScreen({ navigation }) {
  const todayNotifications = [
    {
      id: "1",
      title: "New Purchase Request",
      message:
        "A new request for projector has been submitted for Banasree campus.",
      time: "10 min ago",
      type: "request",
      isRead: false,
    },
    {
      id: "2",
      title: "Quotation Submitted",
      message: "A vendor quotation has been added for printer toner request.",
      time: "1 hour ago",
      type: "quotation",
      isRead: true,
    },
  ];

  const earlierNotifications = [
    {
      id: "3",
      title: "Quotation Approved",
      message: "Admin approved a quotation for office chair procurement.",
      time: "Yesterday",
      type: "approval",
      isRead: true,
    },
    {
      id: "4",
      title: "Instruction Created",
      message:
        "A new purchase instruction has been created for Malibag campus.",
      time: "2 days ago",
      type: "instruction",
      isRead: true,
    },
  ];

  const hasNotifications =
    todayNotifications.length > 0 || earlierNotifications.length > 0;

  return (
    <ScreenWrapper>
      <AppHeader title="Notifications" onBack={() => navigation.goBack()} />

      {!hasNotifications ? (
        <EmptyState text="No notifications yet" />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {todayNotifications.length > 0 ? (
            <NotificationGroup
              title="Today"
              notifications={todayNotifications}
              onPressItem={(item) => console.log("Open:", item)}
            />
          ) : null}

          {earlierNotifications.length > 0 ? (
            <NotificationGroup
              title="Earlier"
              notifications={earlierNotifications}
              onPressItem={(item) => console.log("Open:", item)}
            />
          ) : null}
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 20,
  },
});

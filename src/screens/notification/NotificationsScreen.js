import { useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import AppLoader from "../../components/common/AppLoader";
import NotificationGroup from "../../components/notification/NotificationGroup";

import useNotifications from "../../hooks/useNotifications";
import { formatDateTime } from "../../utils/formatDate";

export default function NotificationsScreen({ navigation }) {
  const { notifications, isLoading, fetchNotifications, markAsRead } =
    useNotifications(true);

  const groupedNotifications = useMemo(() => {
    const today = [];
    const earlier = [];

    (notifications || []).forEach((item) => {
      const createdAt = item?.createdAt ? new Date(item.createdAt) : null;
      const now = new Date();

      const isToday =
        createdAt &&
        createdAt.getDate() === now.getDate() &&
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear();

      const mappedItem = {
        id: item.id,
        title: item.title || "Notification",
        message: item.message || item.body || "",
        time: formatDateTime(item.createdAt),
        type: item.type || "general",
        isRead: !!item.isRead,
        relatedId: item.relatedId || null,
      };

      if (isToday) {
        today.push(mappedItem);
      } else {
        earlier.push(mappedItem);
      }
    });

    return { today, earlier };
  }, [notifications]);

  const hasNotifications =
    groupedNotifications.today.length > 0 ||
    groupedNotifications.earlier.length > 0;

  const handleOpenNotification = async (item) => {
    if (!item?.isRead) {
      await markAsRead(item.id);
    }

    // পরে related type অনুযায়ী navigation করতে পারো
    // উদাহরণ:
    // if (item.type === "request" && item.relatedId) {
    //   navigation.navigate("Requests", {
    //     screen: "RequestDetails",
    //     params: { requestId: item.relatedId },
    //   });
    // }
  };

  if (isLoading && (!notifications || notifications.length === 0)) {
    return (
      <ScreenWrapper>
        <AppHeader title="Notifications" onBack={() => navigation.goBack()} />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Notifications" onBack={() => navigation.goBack()} />

      {!hasNotifications ? (
        <EmptyState text="No notifications yet" />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshing={isLoading}
          onRefresh={fetchNotifications}
        >
          {groupedNotifications.today.length > 0 ? (
            <NotificationGroup
              title="Today"
              notifications={groupedNotifications.today}
              onPressItem={handleOpenNotification}
            />
          ) : null}

          {groupedNotifications.earlier.length > 0 ? (
            <NotificationGroup
              title="Earlier"
              notifications={groupedNotifications.earlier}
              onPressItem={handleOpenNotification}
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

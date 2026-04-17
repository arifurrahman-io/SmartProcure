import { View, Text, StyleSheet } from "react-native";
import NotificationCard from "./NotificationCard";

export default function NotificationGroup({
  title,
  notifications = [],
  onPressItem,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>

      <View style={styles.listWrap}>
        {notifications.map((item) => (
          <NotificationCard
            key={item.id}
            title={item.title}
            message={item.message}
            time={item.time}
            type={item.type}
            isRead={item.isRead}
            onPress={() => onPressItem?.(item)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  heading: {
    fontSize: 13,
    fontWeight: "800",
    color: "#64748B",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  listWrap: {
    gap: 0,
  },
});

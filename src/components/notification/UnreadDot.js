import { View, StyleSheet } from "react-native";

export default function UnreadDot() {
  return <View style={styles.dot} />;
}

const styles = StyleSheet.create({
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#EF4444",
  },
});

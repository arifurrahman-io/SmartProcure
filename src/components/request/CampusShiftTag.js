import { View, Text, StyleSheet } from "react-native";

export default function CampusShiftTag({ campus, shift }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>
        {campus} • {shift}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: "#EEF4FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1D4ED8",
  },
});

import { View, Text, StyleSheet } from "react-native";

export default function CampusShiftTag({ campus, shift }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>
        {campus} - {shift}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: "#EEF4FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1D4ED8",
  },
});

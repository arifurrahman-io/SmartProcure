import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useAppTheme from "../../hooks/useAppTheme";

export default function AppHeader({ title, onBack }) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={onBack}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      )}
      <Text
        style={[styles.title, { color: theme.colors.text }]}
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
});

import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppTheme from "../../hooks/useAppTheme";

export default function ScreenWrapper({ children }) {
  const { theme } = useAppTheme();

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
});

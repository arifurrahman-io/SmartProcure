import { Platform, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useAppTheme from "../../hooks/useAppTheme";

export default function ProfileMenuItem({
  title,
  subtitle,
  icon = "settings-outline",
  onPress,
  rightText,
  danger = false,
}) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.left}>
        <View style={[styles.iconWrap, danger && styles.dangerBg]}>
          <Ionicons
            name={icon}
            size={18}
            color={danger ? "#DC2626" : "#2563EB"}
          />
        </View>

        <View style={styles.textWrap}>
          <Text
            style={[
              styles.title,
              { color: theme.colors.text },
              danger && styles.dangerText,
            ]}
          >
            {title}
          </Text>

          {subtitle ? (
            <Text
              style={[styles.subtitle, { color: theme.colors.textSecondary }]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {rightText ? (
        <Text style={[styles.rightText, { color: theme.colors.textSecondary }]}>
          {rightText}
        </Text>
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 9,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...Platform.select({
      web: {
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
      },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.025,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      },
    }),
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  dangerBg: {
    backgroundColor: "#FEF2F2",
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 3,
    fontSize: 11,
    color: "#64748B",
  },
  rightText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
  },
  dangerText: {
    color: "#DC2626",
  },
});

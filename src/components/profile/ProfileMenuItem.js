import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileMenuItem({
  title,
  subtitle,
  icon = "settings-outline",
  onPress,
  rightText,
  danger = false,
}) {
  return (
    <TouchableOpacity
      style={styles.container}
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
          <Text style={[styles.title, danger && styles.dangerText]}>
            {title}
          </Text>

          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {rightText ? (
        <Text style={styles.rightText}>{rightText}</Text>
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dangerBg: {
    backgroundColor: "#FEF2F2",
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748B",
  },
  rightText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  dangerText: {
    color: "#DC2626",
  },
});
